import { useState } from "react";
import Layout from "@/components/layout";
import { motion } from "framer-motion";
import { FADE_DOWN_ANIMATION_VARIANTS } from "@/lib/constants";

const appointments = [
  {
    id: 1,
    patientName: "John Smith",
    date: "2023-03-25",
    time: "10:00 AM",
  },
  {
    id: 2,
    patientName: "Jane Doe",
    date: "2023-03-25",
    time: "11:00 AM",
  },
  {
    id: 3,
    patientName: "Alice Johnson",
    date: "2023-03-26",
    time: "9:00 AM",
  },
  {
    id: 4,
    patientName: "Bob Brown",
    date: "2023-03-26",
    time: "2:00 PM",
  },
];

export default function PatientAppointments() {
  const [comments, setComments] = useState({});

  const handleCancelAppointment = (appointmentId) => {
    console.log("Cancelling appointment:", appointmentId);
    // Add logic to cancel appointment
  };

  const handleCommentChange = (event, appointmentId) => {
    setComments({ ...comments, [appointmentId]: event.target.value });
  };

  const handleSaveComment = (appointmentId) => {
    console.log("Saving comment for appointment:", appointmentId);
    // Add logic to save comment
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
          Patient Appointments
        </motion.h1>

        <motion.div
          className="mt-6 space-y-4"
          variants={FADE_DOWN_ANIMATION_VARIANTS}
        >
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="p-4 bg-white border border-gray-300 rounded-md"
            >
              <h2 className="text-xl font-bold">{appointment.patientName}</h2>
              <p className="text-gray-600">
                {appointment.date} at {appointment.time}
              </p>
              <button
                className="mt-2 px-4 py-2 text-white bg-red-500 rounded-md"
                onClick={() => handleCancelAppointment(appointment.id)}
              >
                Cancel Appointment
              </button>
              <div className="mt-4">
                <label htmlFor={`comment-${appointment.id}`} className="block">
                  Leave a comment:
                </label>
                <textarea
                  id={`comment-${appointment.id}`}
                  className="w-full mt-2 p-2 border border-gray-300 rounded-md"
                  value={comments[appointment.id] || ""}
                  onChange={(event) =>
                    handleCommentChange(event, appointment.id)
                  }
                />
                <button
                  className="mt-2 px-4 py-2

2 text-white bg-blue-500 rounded-md"
onClick={() => handleSaveComment(appointment.id)}
>
Save Comment
</button>
</div>
</div>
))}
</motion.div>
</motion.div>
</Layout>
);
}

