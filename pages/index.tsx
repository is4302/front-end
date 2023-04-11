import Card from "@/components/home/card";
import Layout from "@/components/layout";
import { motion } from "framer-motion";
import { FADE_DOWN_ANIMATION_VARIANTS } from "@/lib/constants";
import Link from "next/link";

export default function Home() {
  

  return (
    <Layout>
      <motion.div
        className="max-w-xl px-5 xl:px-0"
        initial="hidden"
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
          className="text-center font-display text-4xl font-bold tracking-[-0.02em] text-gray-800 drop-shadow-sm md:text-7xl md:leading-[5rem]"
        >
          Medical Consultation Platform
        </motion.h1>

        <motion.h1
          className="text-center font-display text-2xl font-bold tracking-[-0.02em] text-gray-800 drop-shadow-sm md:text-2xl md:leading-[5rem]"
        >
          Sign Up Today to Get Started!
        </motion.h1>

        <motion.div
          className="mx-auto mt-6 flex items-center justify-center space-x-5"
          variants={FADE_DOWN_ANIMATION_VARIANTS}
        >
          <Link href="/appointment">
            <button className="flex max-w-fit items-center justify-center space-x-2 rounded-full border border-gray-300 bg-white px-5 py-2 text-sm text-gray-600 shadow-md transition-colors hover:border-gray-800">
              Make an Appointment
            </button>
          </Link>

          <Link href="/doctor_list">
            <button className="flex max-w-fit items-center justify-center space-x-2 rounded-full border border-gray-300 bg-white px-5 py-2 text-sm text-gray-600 shadow-md transition-colors hover:border-gray-800">
              View Doctor Lists
            </button>
          </Link>

          <Link href="/patient_appointment_list">
            <button className="flex max-w-fit items-center justify-center space-x-2 rounded-full border border-gray-300 bg-white px-5 py-2 text-sm text-gray-600 shadow-md transition-colors hover:border-gray-800">
              View List of Patient Appointments
            </button>
          </Link>

          <Link href="/view_patient_history">
            <button className="flex max-w-fit items-center justify-center space-x-2 rounded-full border border-gray-300 bg-white px-5 py-2 text-sm text-gray-600 shadow-md transition-colors hover:border-gray-800">
              View Patient Medical History
            </button>
          </Link>

          <Link href="/edit_patient_record">
            <button className="flex max-w-fit items-center justify-center space-x-2 rounded-full border border-gray-300 bg-white px-5 py-2 text-sm text-gray-600 shadow-md transition-colors hover:border-gray-800">
              Edit Medical Record of Patient
            </button>
          </Link>
        </motion.div>
      </motion.div>
    </Layout>
  );
}
