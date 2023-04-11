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

const { RangePicker } = DatePicker;
const { Option } = Select;
type RangeValue = [Dayjs | null, Dayjs | null] | null;



const appointments = [
  {
    id: 1,
    patientName: "Jane Doe",
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
  {
    id: 5,
    patientName: "Jane Doe",
    date: "2023-03-25",
    time: "11:00 AM",
  },
  {
    id: 6,
    patientName: "Jane Doe",
    date: "2023-03-25",
    time: "11:00 AM",
  },
];

export default function PatientAppointments() {
  useEffect(() => {
    const checkAuth = async () => {
      const doc = await isDoctorAuthenticated();
      if (!doc) {
        alert("You are not authorized to view this page");
        router.push("/");
      }
    };
    checkAuth();
  }, []);


  const [form] = Form.useForm();
  const [dates, setDates] = useState<RangeValue>(null);
  const [value, setValue] = useState<RangeValue>(null);
  const disabledDate = (current: Dayjs) => {
    if (!dates) {
      return false;
    }
    const tooLate = dates[0] && current.diff(dates[0], 'days') > 7;
    const tooEarly = dates[1] && dates[1].diff(current, 'days') > 7;
    return !!tooEarly || !!tooLate;
  };

  const onOpenChange = (open: boolean) => {
    if (open) {
      setDates([null, null]);
    } else {
      setDates(null);
    }
  };

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
            <Form.Item label="Select dates">
              <RangePicker
                  value={dates || value}
                  disabledDate={disabledDate}
                  onCalendarChange={(val) => setDates(val)}
                  onChange={(val) => setValue(val)}
                  onOpenChange={onOpenChange}
              />
            </Form.Item>
            <Form.Item label="Order">
              <Select
                  placeholder="Order"
                  allowClear
                  style={{"width": "8rem"}}
              >
                <Option value="ascending">ascending</Option>
                <Option value="descending">descending</Option>
              </Select>
            </Form.Item>
          </Form>

          <motion.div
              className="flex flex-row flex-wrap justify-start"
              variants={FADE_DOWN_ANIMATION_VARIANTS}
          >
            {appointments.map((appointment) => (
                <div
                    key={appointment.id}
                    className="p-4 bg-white border border-gray-300 rounded-md mt-4 ml-5 mr-5"
                >
                  <div className="text-xl font-bold">{appointment.patientName}</div>

                  <p className="text-gray-600">
                    {appointment.date} at {appointment.time}
                  </p>
                  <Link href="/view_patient_history">
                    <button
                      className="mt-2 mr-2 px-4 py-2 text-white bg-blue-500 rounded-md">
                      View past records
                  </button>
                  </Link>
                  <Link href="/make_prescription">
                    <button
                        className="mt-2 px-4 py-2 text-white bg-green-500 rounded-md"
                    >
                      Make a prescription
                    </button>
                  </Link>
                </div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </Layout>
  );
}

