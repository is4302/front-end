import Layout from "@/components/layout";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FADE_DOWN_ANIMATION_VARIANTS } from "@/lib/constants";
import { useRouter } from "next/router";
import { isPatientAuthenticated } from "@/lib/patient_auth";
import Cookies from "js-cookie";
import type { RangePickerProps } from 'antd/es/date-picker';
import dayjs from 'dayjs';
import apiClient from "@/pages/utils/apiClient";
import moment from "moment";
import {
  Button,
  DatePicker,
  Form,
  Select,
} from 'antd';

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
  const [form] = Form.useForm();
  const [doctors, setDoctorsData] = useState([{id: "", name : "", hospitalName: "", doctor_wallet: ""}]);


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

  const handleSubmit = () => {
    let values = form.getFieldsValue()
    let userToken = Cookies.get("userToken");
    var momentObj = moment(values.date.format('YYYY-MM-DD') + values.time, 'YYYY-MM-DDLT');
    var dateTime = momentObj.format('YYYY-MM-DDTHH:mm:s');

    apiClient
        .get('/profile', {headers: {Authorization: `Bearer ${userToken}`}})
        .then((response) => {
          let data = response.data
          apiClient
              .post('/appointment',
                  {patient: data.data[0].wallet,
                    doctor: values.doctor, appointment_time: dateTime },
                  {headers: {Authorization: `Bearer ${userToken}`}})
              .then((response) => {
                alert("Appointment successfully set");
                router.push("/landing");
              })
        })
        .catch(err => {
          alert(err);
        })
  };

  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    return (current && current < dayjs().endOf('day')) || current > dayjs().add(14, 'days');
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
          onSubmit={handleSubmit}
        >
          <Form
              wrapperCol={{ span: 14 }}
              layout="vertical"
              style={{ width: "600px" }}
              form={form}
          >
            <Form.Item label="Select Doctor" name="doctor">
              <Select>
                {doctors.map((doctor, index) => {
                  return (<Select.Option key={index} value={doctor.doctor_wallet}>{doctor.name}</Select.Option>)
                })}
              </Select>
            </Form.Item>
            <Form.Item label="Select Date" name="date">
              <DatePicker disabledDate={disabledDate}/>
            </Form.Item>
            <Form.Item label="Select Timeslot" name="time">
              <Select>
                {timeSlots.map((timeSlot, index) => {
                  return (<Select.Option key={index} value={timeSlot}>{timeSlot}</Select.Option>)
                })}
              </Select>
            </Form.Item>
            <Form.Item>
              <Button
                  onClick={handleSubmit}
                  className="bg-blue-500 text-white font-semibold"
              >
                Create Appointment
              </Button>
            </Form.Item>
          </Form>
        </motion.div>
      </motion.div>

    </Layout>
  );
}