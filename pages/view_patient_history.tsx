import { useState } from "react";
import Layout from "@/components/layout";
import { motion } from "framer-motion";
import { FADE_DOWN_ANIMATION_VARIANTS } from "@/lib/constants";

// Dummy data
const medicalHistory = [
  {
    id: 1,
    date: "2022-11-05",
    diagnosis: "Common cold",
    treatment: "Rest and drink fluids",
  },
  {
    id: 2,
    date: "2022-12-15",
    diagnosis: "Flu",
    treatment: "Antiviral medication",
  },
  {
    id: 3,
    date: "2023-01-30",
    diagnosis: "Sprained ankle",
    treatment: "Rest, ice, compression, elevation",
  },
];

const UserRole = {
  PATIENT: "patient",
  DOCTOR: "doctor",
};

// Replace this with the role of the currently logged-in user
const loggedInUserRole = UserRole.PATIENT;

export default function PatientMedicalHistory() {
  return (
    <Layout>
      <motion.div
        className="max-w-xl mx-auto px-5 xl:px-0"
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
          className="text-center font-display text-4xl font-bold tracking-[-0.02em] text-black drop-shadow-sm md:text-7xl md:leading-[5rem]"
          variants={FADE_DOWN_ANIMATION_VARIANTS}
        >
          {loggedInUserRole === UserRole.PATIENT
            ? "My Medical History"
            : "Patient Medical History"}
        </motion.h1>

        <motion.div
          className="mt-6 space-y-4"
          variants={FADE_DOWN_ANIMATION_VARIANTS}
        >
          {medicalHistory.map((record) => (
            <div
              key={record.id}
              className="p-4 bg-white border border-gray-300 rounded-md"
            >
              <h2 className="text-xl font-bold">Date: {record.date}</h2>
              <p className="text-gray-600">Diagnosis: {record.diagnosis}</p>
              <p className="text-gray-600">Treatment: {record.treatment}</p>
              {loggedInUserRole === UserRole.DOCTOR && (
                <button
                  className="mt-2 px-4 py-2 text-white bg-blue-500 rounded-md"
                  onClick={() => console.log("Edit record", record.id)}
                >
                  Edit Record
                </button>
              )}
            </div>
          ))}
        </motion.div>
      </motion.div>
    </Layout>
  );
}
