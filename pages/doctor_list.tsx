import Layout from "@/components/layout";
import { motion } from "framer-motion";
import { FADE_DOWN_ANIMATION_VARIANTS } from "@/lib/constants";

const doctors = [
  {
    id: 1,
    name: "Dr. John Smith",
    specialty: "Cardiologist",
    imageUrl: "https://via.placeholder.com/150",
  },
  {
    id: 2,
    name: "Dr. Jane Doe",
    specialty: "Dermatologist",
    imageUrl: "https://via.placeholder.com/150",
  },
  {
    id: 3,
    name: "Dr. Alice Johnson",
    specialty: "Neurologist",
    imageUrl: "https://via.placeholder.com/150",
  },
  {
    id: 4,
    name: "Dr. Bob Brown",
    specialty: "Orthopedic Surgeon",
    imageUrl: "https://via.placeholder.com/150",
  },
];

export default function Doctors() {
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
          List of Doctors
        </motion.h1>

        <motion.div
          className="mt-6 space-y-4"
          variants={FADE_DOWN_ANIMATION_VARIANTS}
        >
          {doctors.map((doctor) => (
            <div
              key={doctor.id}
              className="flex items-center space-x-4 p-4 bg-white border border-gray-300 rounded-md"
            >
              <img
                src={doctor.imageUrl}
                alt={doctor.name}
                className="w-16 h-16 rounded-full"
              />
              <div>
                <h2 className="text-xl font-bold">{doctor.name}</h2>
                <p className="text-gray-600">{doctor.specialty}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </Layout>
  );
}
