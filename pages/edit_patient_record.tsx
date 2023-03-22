import { useState } from "react";
import Layout from "@/components/layout";
import { motion } from "framer-motion";
import { FADE_DOWN_ANIMATION_VARIANTS } from "@/lib/constants";
import {Form, Input} from "antd";
const { TextArea } = Input;

// Dummy data
const medicalRecord = {
  id: 1,
  date: "2022-11-05",
  diagnosis: "Common cold",
  treatment: "Rest and drink fluids",
  notes: "",
};

export default function EditPatientMedicalHistory() {
  const [notes, setNotes] = useState(medicalRecord.notes);

  const handleSave = () => {
    console.log("Save edited notes:", notes);
    // Save the edited notes to the database or API
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
            <p className="text-gray-600">Doctor Id: 54321</p>
            <p className="text-gray-600">Patient Id: 12345</p>
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
