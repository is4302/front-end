import { useEffect, useState } from "react";
import Layout from "@/components/layout";
import { motion } from "framer-motion";
import { FADE_DOWN_ANIMATION_VARIANTS } from "@/lib/constants";
import { Badge, Card, Space } from 'antd';
import Cookies from "js-cookie";
import { isUserAuthenticated } from "@/lib/auth";
import { useRouter } from "next/router";


import{getPrescriptionHash, isPrescriptionApproved, getDoctorRecordCount, getPatientRecord} from "web3_api/";
import apiClient from "@/pages/utils/apiClient";
import {mockSession} from "next-auth/client/__tests__/helpers/mocks";
import user = mockSession.user;
import Link from "next/link";
// Dummy data
// const medicalHistory = [
//   {
//     id: 1,
//     date: "2022-11-05",
//     doctor_id: 0,
//     diagnosis: "Common cold",
//     treatment: "Rest and drink fluids",
//     status: "verified",
//   }
// ];

const UserRole = {
  PATIENT: "patient",
  DOCTOR: "doctor",
};

// Replace this with the role of the currently logged-in user
const loggedInUser = {
  role: UserRole.DOCTOR,
  id: 1
};

export default function PatientMedicalHistory() {
  const router = useRouter();
  const [userToken, setUserToken] = useState<string>()
  const [medicalRecords, setMedicalRecords] = useState([])

  useEffect(() => {
    const token = Cookies.get("userToken") as string; // Replace with the actual token you get from your authentication provider
    setUserToken(token)
    const checkAuthentication = async () => {
      const isDoctor = Cookies.get("is_doctor") === "true"
      if (isDoctor) {
        loggedInUser.role = UserRole.DOCTOR
      } else {
        loggedInUser.role = UserRole.PATIENT
      }

      const state = await isUserAuthenticated(); // Use 'await' here to get the result of the promise
      if (!state) {
        alert("You ae not authenticated, please login first.");
        router.push("/login");
      }
    };
    checkAuthentication();
  }, []);

    useEffect(() => {
        if(!router.isReady) return;
        const patientAddress = router.query.patient_wallet as string;
        const token = Cookies.get("userToken") as string;
        fetchPastMedicalRecords(token, patientAddress)
    }, [router.isReady]);


  function fetchPastMedicalRecords(userToken: any, patient: string) {
    if (loggedInUser.role == UserRole.PATIENT) {
      apiClient
          .get('/prescription', { headers: { Authorization: `Bearer ${userToken}` }})
          .then((response) => {
            setMedicalRecords(response.data)
            localStorage.setItem("prescriptions", JSON.stringify(response.data))
          })
          .catch((err) => {
            alert(err)
          })
    } else {
      apiClient
          .get(`/prescription?patient_wallet=${patient}`, { headers: { Authorization: `Bearer ${userToken}` }})
          .then(response => {
            setMedicalRecords(response.data)
            localStorage.setItem("prescriptions", JSON.stringify(response.data))
          })
          .catch((err) => {
            alert(err)
          })
    }
  }

  return (
    <Layout>
      <motion.div
        className="mx-auto px-5 xl:px-0"
        initial="hidden"
        whileInView="show"
        animate="show"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          show: {
            transition: {
              staggerChildren: 0.15,
            },
          },
        }}
      >
        <motion.h1
            className="text-center font-display text-xl tracking-[-0.02em] text-black drop-shadow-sm md:text-5xl md:leading-[5rem]"
            variants={FADE_DOWN_ANIMATION_VARIANTS}
        >
          Patient Medical Record
        </motion.h1>
        <motion.div className="mt-6 space-y-4 text-center font-bold" variants={FADE_DOWN_ANIMATION_VARIANTS}>
          {medicalRecords.length > 0?
              medicalRecords.map((record, index) => (
              renderMedicalRecord(record, index)))
              : "No Record Found"
          }
        </motion.div>
      </motion.div>
    </Layout>
  );
}

function renderMedicalRecord(medicalRecord: any, index: number) {

  let text, color;
  if (medicalRecord.status === "verified") {
    text = "Verified";
    color = "green"
  } else if (medicalRecord.status === "pending") {
    text = "Pending";
    color = "yellow"
  } else {
    text = "Unverified";
    color = "red"
  }

  return (
      <motion.div className="m-3">
        <Badge.Ribbon text={text} color={color}>
          <Card title={`Date: ${medicalRecord.date}`} size="small">
            <p className="text-gray-600">Diagnosis: {medicalRecord.diagnosis}</p>
            <p className="text-gray-600">Doctor: {medicalRecord.doctor}</p>
            <p className="text-gray-600">Treatment: {medicalRecord.treatment}</p>
            <Link href={`/prescription_details?new=false&index=${index}`}>
            <button className="mt-1.5 mr-1 px-3 py-1.5 text-white bg-blue-500 rounded-md">
               View Details
            </button>
          </Link>
            {
              medicalRecord.status === "pending" && loggedInUser.role === UserRole.PATIENT &&
                <button className="mt-1.5 px-3 py-1.5 text-white bg-blue-500 rounded-md"
                        onClick={() => console.log("Verify record", medicalRecord.id)}>
                  Verify Record
                </button>
            }
          </Card>
        </Badge.Ribbon>
      </motion.div>
  )
}