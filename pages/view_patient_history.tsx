import { useState } from "react";
import Layout from "@/components/layout";
import { motion } from "framer-motion";
import { FADE_DOWN_ANIMATION_VARIANTS } from "@/lib/constants";

// Dummy data
const medicalHistory = [
  {
    id: 1,
    date: "2022-11-05",
    doctor_id: 0,
    diagnosis: "Common cold",
    treatment: "Rest and drink fluids",
  },
  {
    id: 2,
    date: "2022-12-15",
    doctor_id: 1,
    diagnosis: "Flu",
    treatment: "Antiviral medication",
  },
  {
    id: 3,
    date: "2023-01-30",
    doctor_id: 2,
    diagnosis: "Sprained ankle",
    treatment: "Rest, ice, compression, elevation",
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
          <motion.div
              className="flex flex-row flex-wrap justify-start"
              variants={FADE_DOWN_ANIMATION_VARIANTS}
          >
            {medicalHistory.map((record) => (
                <div
                    key={record.id}
                    className="p-2 bg-white border border-gray-300 box-border rounded-md mt-4 mr-5"
                    style={{"flexBasis": "calc(33.33% - 1.25rem)"}}
                >
                  <h2 className="text-xl font-bold">Date: {record.date}</h2>
                  <p className="text-gray-600">Diagnosis: {record.diagnosis}</p>
                  <p className="text-gray-600">Doctor: {record.doctor_id}</p>
                  <p className="text-gray-600"
                  >Treatment: {record.treatment}</p>
                  {loggedInUser.role === UserRole.DOCTOR && loggedInUser.id ==record.doctor_id
                      && (
                          <button
                              className="mt-1.5 px-3 py-1.5 text-white bg-blue-500 rounded-md"
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
