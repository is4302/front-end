import Layout from "@/components/layout";
import { motion } from "framer-motion";
import { FADE_DOWN_ANIMATION_VARIANTS } from "@/lib/constants";
import {useEffect, useState} from "react";
import apiClient from "@/pages/utils/apiClient";
import {useRouter} from "next/router";
import Cookies from "js-cookie";

/*
const doctors = [
  {
    id: 1,
    name: "Dr. John Smith",
    specialty: "Cardiologist",
  },
  {
    id: 2,
    name: "Dr. Jane Doe",
    specialty: "Dermatologist",
  },
  {
    id: 3,
    name: "Dr. Alice Johnson",
    specialty: "Neurologist",
  },
  {
    id: 4,
    name: "Dr. Bob Brown",
    specialty: "Orthopedic Surgeon",
  },
];
*/

export default function Doctors() {

  const [doctors, setDoctorsData] = useState([{id: "", name : "", hospitalName: ""}]);

  const router = useRouter();

    useEffect(() => {
      let userToken = Cookies.get("userToken");
      if (userToken == null) {
          router.push('/login')
      }

      apiClient
          .get('/list/doctor', {headers: {Authorization: `Bearer ${userToken}`}})
          .then((response) => {
              console.log(response.data)
              setDoctorsData(response.data)
          })
          .catch(err => {
            alert(err);
          })
  }, [])

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
              <div>
                <h2 className="text-xl font-bold">{doctor.name}</h2>
                <p className="text-gray-600">{doctor.hospitalName}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </Layout>
  );
}
