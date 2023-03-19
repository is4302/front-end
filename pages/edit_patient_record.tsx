import { useState } from "react";
import Layout from "@/components/layout";
import { motion } from "framer-motion";
import { FADE_DOWN_ANIMATION_VARIANTS } from "@/lib/constants";

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
          className="text-center font-display text-4xl font-bold tracking-[-0.02em] text-black drop-shadow-sm md:text-7xl md:leading-[5rem]"
          variants={FADE_DOWN_ANIMATION_VARIANTS}
        >
          Edit Patient Medical History
        </motion.h1>

        <motion.div className="mt-6 space-y-4" variants={FADE_DOWN_ANIMATION_VARIANTS}>
          <div className="p-4 bg-white border border-gray-300 rounded-md">
            <h2 className="text-xl font-bold">Date: {medicalRecord.date}</h2>
            <p className="text-gray-600">Diagnosis: {medicalRecord.diagnosis}</p>
            <p className="text-gray-600">Treatment: {medicalRecord.treatment}</p>

            <div className="mt-4">
              <label htmlFor="notes" className="block text-gray-700">
                Notes / Comments
              </label>
              <textarea
                id="notes"
                className="block w-full h-32 mt-1 p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

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
