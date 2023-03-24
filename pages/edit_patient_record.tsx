import { useState } from "react";
import Layout from "@/components/layout";
import { motion } from "framer-motion";
import { FADE_DOWN_ANIMATION_VARIANTS } from "@/lib/constants";
import {Form, Input} from "antd";
import { addPrescription } from "web3_api/";
import { ethers } from "ethers";

const { TextArea } = Input;

// Dummy data
const medicalRecord = {
  randomId: 1,
  date: "2022-11-05",
  diagnosis: "Common cold",
  treatment: "Rest and drink fluids",
  patientAddress:"0x9df9b7c2cc5f85a75a7e5e13d0873117c5c5f123",
  doctorAddress: "0x9de49e60f8cf768b3ae7b3d3e11c1ca48f375d24",
  notes: ""
};


// tmp address
const patientAddress = "0x9df9b7c2cc5f85a75a7e5e13d0873117c5c5f123";
const doctorAddress = "0x9de49e60f8cf768b3ae7b3d3e11c1ca48f375d24";

export default function EditPatientMedicalHistory() {
  const [notes, setNotes] = useState(medicalRecord.notes);

  const handleSave = async () => {
    medicalRecord.randomId = window.crypto.getRandomValues(new Uint32Array(1))[0];
    const medicalRecordString = JSON.stringify(medicalRecord);
    const medicalRecordEncoded = new TextEncoder().encode(medicalRecordString);
    const medicalRecordHash = ethers.utils.keccak256(medicalRecordEncoded);
    try {
      const tx = await addPrescription(patientAddress, medicalRecordHash);
      console.log("Transaction hash:", tx.hash);
    } catch (err) {
      console.error("Error adding prescription:", err);
    }
  };

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
            className="text-center font-display text-xl tracking-[-0.02em] text-black drop-shadow-sm md:text-5xl md:leading-[5rem]"
            variants={FADE_DOWN_ANIMATION_VARIANTS}
        >
          Make Prescriptions
        </motion.h1>

        <motion.div className="mt-6 space-y-4" variants={FADE_DOWN_ANIMATION_VARIANTS}>
          <div className="p-4 bg-white border border-gray-300 rounded-md">
            <p className="text-xl">Date: {medicalRecord.date}</p>
            <p className="text-gray-600">Doctor Addr: {medicalRecord.doctorAddress}</p>
            <p className="text-gray-600">Patient Addr: {medicalRecord.patientAddress}</p>
            <Form
                layout="vertical"
                style={{ maxWidth: 600 }}
                className="mt-4"
            >
              <Form.Item label="Diagnosis" requiredMark>
                <TextArea rows={3} />
              </Form.Item>
              <Form.Item label="Prescription" requiredMark>
                <TextArea rows={6} />
              </Form.Item>
              <Form.Item label="Notes" requiredMark>
                <TextArea rows={6} />
              </Form.Item>
            </Form>

            <button
              className="mt-4 px-4 py-2 text-white bg-blue-500 rounded-md"
              onClick={handleSave}
            >
              Save Changes
            </button>
          </div>
        </motion.div>
      </motion.div>
    </Layout>
  );
}