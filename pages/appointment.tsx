import Layout from "@/components/layout";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FADE_DOWN_ANIMATION_VARIANTS } from "@/lib/constants";
import { useRouter } from "next/router";
import { isPatientAuthenticated } from "@/lib/patient_auth";
import Cookies from "js-cookie";
import apiClient from "@/pages/utils/apiClient";
import moment from "moment";

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


export default function CreateAppointment() {
  const router = useRouter();

  const [doctors, setDoctorsData] = useState([{id: "", name : "", hospitalName: "", doctor_wallet: ""}]);
  const [selectedDoctor, setSelectedDoctor] = useState(""); //{id: "", name : "", hospitalName: "", doctor_wallet: ""}
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      const patient = await isPatientAuthenticated();
      if (!patient) {
        alert("You are not authorized to view this page");
        router.push("/");
      }
    };
    checkAuth();

    let userToken = Cookies.get("userToken");

    apiClient
          .get('/list/doctor', {headers: {Authorization: `Bearer ${userToken}`}})
          .then((response) => {
              setDoctorsData(response.data)
          })
          .catch(err => {
            alert(err);
          })
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedDoctor === "") {
      alert("Must select a doctor")
      return
    }
    try {
      let userToken = Cookies.get("userToken");
      var momentObj = moment(selectedDate + selectedTimeSlot, 'YYYY-MM-DDLT');
      var dateTime = momentObj.format('YYYY-MM-DDTHH:mm:s');

      const res1 = await fetch('http://127.0.0.1:8000/api/profile', {
        headers: {
            Authorization: `Bearer ${userToken}`,
        },
      });

      const data = await res1.json();

      const res = await apiClient.post('/appointment', {patient: data.data[0].wallet, doctor: selectedDoctor, appointment_time: dateTime }, {headers: {Authorization: `Bearer ${userToken}`}});

      console.log(res);

      if(res.status === 200) {
        alert("Appointment successfully set");
        router.push("/landing");
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

        <motion.form
          className="mt-6 space-y-4"
          variants={FADE_DOWN_ANIMATION_VARIANTS}
          onSubmit={handleSubmit}
        >
          <div>
            <label htmlFor="doctor" className="block text-gray-600">
              Doctor
            </label>
            <select onChange={(e) => {
              console.log(e.target.value)
              setSelectedDoctor(e.target.value)
            }}>
              <option value=""></option>
              {doctors.map((doctor) => (
                <option value={doctor.doctor_wallet}>{doctor.name}</option>
              ))}
            </select>
          </div>
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
              <select value={selectedTimeSlot} onChange={(e) => setSelectedTimeSlot(e.target.value)}>
                {timeSlots.map((timeSlot) => (
                  <option value={timeSlot}>{timeSlot}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="w-full px-3 py-2 font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600"
            >
              Create Appointment
            </button>
          </div>
        </motion.form>
      </motion.div>

    </Layout>
  );
}