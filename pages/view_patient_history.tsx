import { useEffect, useState } from "react";
import Layout from "@/components/layout";
import { motion } from "framer-motion";
import { FADE_DOWN_ANIMATION_VARIANTS } from "@/lib/constants";
import { Badge, Card, Space } from 'antd';
import Cookies from "js-cookie";
import { isUserAuthenticated } from "@/lib/auth";
import { useRouter } from "next/router";

// Dummy data
const medicalHistory = [
  {
    id: 1,
    date: "2022-11-05",
    doctor_id: 0,
    diagnosis: "Common cold",
    treatment: "Rest and drink fluids",
    status: "verified",
  },
  {
    id: 2,
    date: "2022-12-15",
    doctor_id: 1,
    diagnosis: "Flu",
    treatment: "Antiviral medication",
    status: "pending",
  },
  {
    id: 3,
    date: "2023-01-30",
    doctor_id: 2,
    diagnosis: "Sprained ankle",
    treatment: "Rest, ice, compression, elevation",
    status: "pending",
  },
  {
    id: 2,
    date: "2023-01-30",
    doctor_id: 2,
    diagnosis: "Sprained ankle",
    treatment: "Rest, ice, compression, elevation",
    status: "unverified",
  },
  {
    id: 4,
    date: "2023-01-30",
    doctor_id: 2,
    diagnosis: "Sprained ankle",
    treatment: "Rest, ice, compression, elevation",
    status: "verified",
  },
];

const UserRole = {
  PATIENT: "patient",
  DOCTOR: "doctor",
};

// Replace this with the role of the currently logged-in user
const loggedInUser = {
  role: UserRole.DOCTOR,
  id: 1
};
let patient = 'Mr. Test'

export default function PatientMedicalHistory() {
  const router = useRouter();
  useEffect(() => {
    const checkAuthentication = async () => {
      const token = Cookies.get("userToken"); // Replace with the actual token you get from your authentication provider
      const state = await isUserAuthenticated(); // Use 'await' here to get the result of the promise
      if (state === false) {
        alert("You ae not authenticated, please login first.");
        router.push("/login");
      }
    };
    checkAuthentication();
  }, []);
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
          {patient}&apos;s Medical Record
        </motion.h1>
        <motion.div className="mt-6 space-y-4" variants={FADE_DOWN_ANIMATION_VARIANTS}>
          {medicalHistory.map(( record) => (
              renderMedicalRecord(record)
          ))}
        </motion.div>
      </motion.div>
    </Layout>
  );
}

function renderMedicalRecord(medicalRecord) {
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
            <p className="text-gray-600">Doctor: {medicalRecord.doctor_id}</p>
            <p className="text-gray-600">Treatment: {medicalRecord.treatment}</p>
            <button className="mt-1.5 mr-1 px-3 py-1.5 text-white bg-blue-500 rounded-md"
                    onClick={() => console.log("Edit record", medicalRecord.id)}>
              {loggedInUser.role === UserRole.DOCTOR && loggedInUser.id == medicalRecord.doctor_id?
                  "Edit Record" : "View Details"
              }
            </button>
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
