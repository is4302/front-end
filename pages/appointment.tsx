import Layout from "@/components/layout";
import { useState } from "react";
import { motion } from "framer-motion";
import { FADE_DOWN_ANIMATION_VARIANTS } from "@/lib/constants";
import Link from "next/link";
import { useRouter } from "next/router";
import { isPatientAuthenticated } from "@/lib/patient_auth";
import Cookies from "js-cookie";

const timeSlots = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
];

export const getServerSideProps = async () => {
  const router = useRouter();
  const patient = await isPatientAuthenticated();
  if (!patient) {
    alert("You are not authorized to view this page");
    router.push("/login");
  }
}

export default function CreateAppointment() {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");

  const handleTimeSlotClick = (time) => { setSelectedTimeSlot(time);};

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const res = await fetch("/api/create-appointment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ selectedDate, selectedTimeSlot }),
      });
      if (res.ok){
        alert("success");
        //redirect to landing page
      } else{
        alert(res.status);
      }
    } catch (error) {
      console.error(error);
      alert(error);
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
          className="text-center font-display text-4xl font-bold tracking-[-0.02em] text-black drop-shadow-sm md:text-7xl md:leading-[5rem]"
          variants={FADE_DOWN_ANIMATION_VARIANTS}
        >
          Create Appointment
        </motion.h1>

        <motion.div
          className="mt-6 space-y-4"
          variants={FADE_DOWN_ANIMATION_VARIANTS}
        >
          <div>
            <label htmlFor="date" className="block text-gray-600">
              Date
            </label>
            <input
              type="date"
              id="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="time" className="block text-gray-600">
              Time
            </label>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
              {timeSlots.map((time, index) => (
                <button
                  key={index}
                  className={`w-full px-3 py-2 text-center border ${
                    selectedTimeSlot === time
                      ? "border-blue-500 bg-blue-500 text-white"
                      : "border-gray-300"
                  } rounded-md`}
                  onClick={() => handleTimeSlotClick(time)}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="w-full px-3 py-2 font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600"
              onSubmit={() => handleSubmit}
            >
              Create Appointment
            </button>
          </div>
        </motion.div>
      </motion.div>
    </Layout>
  );
}
/**further steps to do: dropdown list of doctors with whom patients want to book an appointment with? also need to connect to db to get doctors schedule
 * cannot display timings where doctor is not available.
 **/