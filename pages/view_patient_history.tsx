import { useEffect, useState } from "react";
import Layout from "@/components/layout";
import { motion } from "framer-motion";
import { FADE_DOWN_ANIMATION_VARIANTS } from "@/lib/constants";
import { Badge, Card, Space } from 'antd';
import Cookies from "js-cookie";
import { isUserAuthenticated } from "@/lib/auth";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import{getPatientRecordCount, getPrescriptionHash, isPrescriptionApproved, getDoctorRecordCount, getPatientRecord, getNonceByHash, approvePrescription} from "web3_api/";
import apiClient from "@/pages/utils/apiClient";
import {mockSession} from "next-auth/client/__tests__/helpers/mocks";
import user = mockSession.user;
import Link from "next/link";

const json = require('json-keys-sort');

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

async function getMedicalRecordStatus(medicalRecord) {
  // Calculate the medicalRecordHash using the medicalRecord
  try{
    medicalRecord = json.sort(medicalRecord, true)
    console.log("medicalRecord when verifying:", JSON.stringify(medicalRecord));  
    const medicalDataEncoded = new TextEncoder().encode(JSON.stringify(medicalRecord));
    const medicalDataBuffer = Buffer.from(medicalDataEncoded);
    const medicalRecordHash = ethers.utils.keccak256(medicalDataBuffer);
    console.log("patient address:", medicalRecord.patient);
    console.log("hash: ", medicalRecordHash);
    //const patientRecordCount = await getPatientRecordCount(medicalRecord.patientAddress);
    var recordNonce = 0;
    recordNonce = await getNonceByHash(medicalRecordHash);
    const prescriptionHash = await getPrescriptionHash(recordNonce);
    console.log("hash onchain: ", prescriptionHash);

    if (recordNonce == 0) {
      return "unverified";
    } else {
      const isApproved = await isPrescriptionApproved(recordNonce);
      if (isApproved==1) {
        return "verified";
      } else {
        return "pending";
      }
    }
  } catch(err) {
    console.log(err);
    return "unverified";
  }
    
}


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

  async function fetchPastMedicalRecords(userToken: any, patientAddress: string) {
    const response = loggedInUser.role === UserRole.PATIENT
      ? await apiClient.get('/prescription', { headers: { Authorization: `Bearer ${userToken}` }})
      : await apiClient.get(`/prescription?patient_wallet=${patientAddress}`, { headers: { Authorization: `Bearer ${userToken}` }});
  
    const fetchedMedicalRecords = response.data;
    localStorage.setItem("prescriptions", JSON.stringify(fetchedMedicalRecords));
  
    const updatedMedicalRecords = await Promise.all(
      fetchedMedicalRecords.map(async (record) => {
        delete record.randomId
        const status = await getMedicalRecordStatus(record);
        return { ...record, status };
      })
    );
  
    setMedicalRecords(updatedMedicalRecords);
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

  const handleVerify = async()=> {
    
    let recordTemp = medicalRecord;
    delete recordTemp.status;
    delete recordTemp.randomId;
    recordTemp = json.sort(recordTemp, true);
    console.log("medicalRecord when verifying:", JSON.stringify(recordTemp));  
    const medicalDataEncoded = new TextEncoder().encode(JSON.stringify(recordTemp));
    const medicalDataBuffer = Buffer.from(medicalDataEncoded);
    const medicalRecordHash = ethers.utils.keccak256(medicalDataBuffer);
    console.log("patient address:", medicalRecord.patient);
    console.log("hash: ", medicalRecordHash);
    //const patientRecordCount = await getPatientRecordCount(medicalRecord.patientAddress);
    var recordNonce = 0;
    recordNonce = await getNonceByHash(medicalRecordHash); 
    try {
      const tx = await approvePrescription(medicalRecord.patient, recordNonce);
      console.log(tx);
    } catch (err) {
      alert(err);
    }
    
  };

  return (
      <motion.div className="m-3" key={index}>
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
                        onClick={handleVerify}>
                  Verify Record
                </button>
            }
          </Card>
        </Badge.Ribbon>
      </motion.div>
  )
}