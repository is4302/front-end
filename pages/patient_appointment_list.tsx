import React, { useEffect, useState } from "react";
import Layout from "@/components/layout";
import { motion } from "framer-motion";
import { FADE_DOWN_ANIMATION_VARIANTS } from "@/lib/constants";
import { DatePicker } from 'antd';
import { Form, Select } from 'antd';
import type { Dayjs } from 'dayjs';
import Cookies from "js-cookie";
import router, { useRouter } from "next/router";
import Link from "next/link";
import { isDoctorAuthenticated } from "@/lib/doc_auth";
import apiClient from "@/pages/utils/apiClient";
import {response} from "express";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;
const { Option } = Select;
type RangeValue = [Dayjs | null, Dayjs | null] | null;


// const appointments = [
//   {
//     id: 1,
//     patientName: "Jane Doe",
//     date: "2023-03-25",
//     time: "10:00 AM",
//   }
// ];
type Appointment = {
  appointment_time: string,
  patient: string
}

export default function PatientAppointments() {
  const [appointments, setAppointments] = useState<Array<Appointment>>([])
  const [displayAppointments, setDisplayAppointments] = useState<Array<Appointment>>([]);
  const [form] = Form.useForm();
  const [dates, setDates] = useState<RangeValue>(null);


  useEffect(() => {
    const checkAuth = async () => {
      const doc = await isDoctorAuthenticated();
      if (!doc) {
        alert("You are not authorized to view this page");
        router.push("/");
      }
    };
    checkAuth();
    let userToken = Cookies.get("userToken");
    apiClient.get('/appointment', { headers: { Authorization: `Bearer ${userToken}` }})
        .then((response) => {
          setAppointments(response.data)
          setDisplayAppointments(response.data)
        })
  }, []);

  const disabledDate = (current: Dayjs) => {
    if (!dates) {
      return false;
    }
    const tooLate = dates[0] && current.diff(dates[0], 'days') > 7;
    const tooEarly = dates[1] && dates[1].diff(current, 'days') > 7;
    return !!tooEarly || !!tooLate;
  };

  function getDate(datetimeString: string) {
    const datetime = new Date(datetimeString);
    const year = datetime.getUTCFullYear();
    const month = String(datetime.getUTCMonth() + 1).padStart(2, '0');
    const day = String(datetime.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function getTime(datetimeString: string) {
    const datetime = new Date(datetimeString);

    const hours = String(datetime.getUTCHours()).padStart(2, '0');
    const minutes = String(datetime.getUTCMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  function filterAppointTime() {
    const dateRange = form.getFieldValue("date")
    if (dateRange == null) {
      setDisplayAppointments(appointments);
      return;
    }

    const appointmentRange = appointments.filter((appintment) => {
      let timeObject = dayjs(appintment.appointment_time);
      return timeObject.isAfter(dateRange[0]) && timeObject.isBefore(dateRange[1])
    })
    setDisplayAppointments(appointmentRange)
  }

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
          Appointments
        </motion.h1>
        <motion.div className={"container mx-auto"}>
          <Form
              form={form}
              layout="inline"
              className={"ml-5"}
          >
            <Form.Item label="Select dates" name="date">
              <RangePicker
                  disabledDate={disabledDate}
                  onChange={filterAppointTime}
              />
            </Form.Item>
          </Form>

          <motion.div
              className="flex flex-row flex-wrap justify-start"
              variants={FADE_DOWN_ANIMATION_VARIANTS}
          >
            {
              displayAppointments.length > 0?
                  displayAppointments.map((appointment, index) => (
                      <div key={index} className="p-4 bg-white border border-gray-300 rounded-md mt-4 ml-5 mr-5">
                        <div className="text-xl font-bold">Patient: {appointment.patient}</div>
                        <p className="text-gray-600">
                          {getDate(appointment.appointment_time)} at {getTime(appointment.appointment_time)}
                        </p>
                        <Link href={`/view_patient_history`}>
                          <button className="mt-2 mr-2 px-4 py-2 text-white bg-blue-500 rounded-md">
                            View past records
                          </button>
                        </Link>
                        <Link href={`/prescription_details?new=true&patient=${appointment.patient}`}>
                          <button className="mt-2 px-4 py-2 text-white bg-green-500 rounded-md">
                            Make a prescription
                          </button>
                        </Link>
                      </div>
                  )) : "No appointments found within the selected range"
            }
          </motion.div>
        </motion.div>
      </motion.div>
    </Layout>
  );
}

