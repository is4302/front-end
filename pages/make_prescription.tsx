import {useEffect, useState} from "react";
import Layout from "@/components/layout";
import { motion } from "framer-motion";
import { FADE_DOWN_ANIMATION_VARIANTS } from "@/lib/constants";
import {Form, Input} from "antd";
import { addPrescription } from "web3_api/";
import { ethers } from "ethers";
import apiClient from "@/pages/utils/apiClient";
import Cookies, {set} from "js-cookie";
import { isDoctorAuthenticated } from "@/lib/doc_auth";
import {useRouter} from "next/router";

const { TextArea } = Input;

// Dummy data
const medicalRecord = {
  randomId: 1,
  date: "2022-11-05",
  diagnosis: "Common cold",
  treatment: "Rest and drink fluids",
  patientAddress:"0x6CB4F20F1Cf62c314Cb66De8242b5c0F0eA22DD7",
  doctorAddress: "0x6CB4F20F1Cf62c314Cb66De8242b5c0F0eA22DD7",
  notes: ""
};

const patientAddress = "0x6CB4F20F1Cf62c314Cb66De8242b5c0F0eA22DD7";
const doctorAddress = "0x6CB4F20F1Cf62c314Cb66De8242b5c0F0eA22DD7";


export default function MakePrescription() {
  const [form] = Form.useForm()
  const [userToken, setUserTokens] = useState();
  const router = useRouter();


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

  const handleSave = async () => {
    let medicalRecord = form.getFieldsValue(),
      date = new Date().toISOString().split("T")[0];
    const medicalData = {
      ...medicalRecord,
      date,
      patient: patientAddress,
      doctor: doctorAddress,
    };
    const medicalDataEncoded = new TextEncoder().encode(JSON.stringify(medicalData));
    const medicalDataBuffer = Buffer.from(medicalDataEncoded);
    const medicalRecordHash = ethers.utils.keccak256(medicalDataBuffer);
    try {
      const tx = await addPrescription(patientAddress, medicalRecordHash);
  
      // Post the medical data to /prescription only if the transaction is made
      apiClient
        .post(
          "/prescription",
          {
            ...medicalRecord,
            date,
            patient: patientAddress,
            doctor: doctorAddress,
          },
          { headers: { Authorization: `Bearer ${userToken}` } }
        )
        .then((response) => {
          alert("Prescription Added");
          router.push("/patient_appointment_list");
        })
        .catch((err) => {
          alert(err);
        });
    } catch (err) {
      console.error("Error adding prescription:", err);
      alert(err);
    }
  };
  


  return (
    <Layout>
      <motion.div
        className="max-w-xl px-5 xl:px-0"
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
            className="text-center font-display text-xl tracking-[-0.02em] text-black
            drop-shadow-sm md:text-5xl md:leading-[5rem]"
            variants={FADE_DOWN_ANIMATION_VARIANTS}
        >
          Make Prescriptions
        </motion.h1>

        <motion.div className="mt-6 space-y-4" variants={FADE_DOWN_ANIMATION_VARIANTS}>
          <div className="p-4 bg-white border border-gray-300 rounded-md">
            <p className="text-xl">Date: {medicalRecord.date}</p>
            <p className="text-gray-600">Doctor Addr: {doctorAddress}</p>
            <p className="text-gray-600">Patient Addr: {patientAddress}</p>
            <Form
                form={form}
                layout="vertical"
                style={{ maxWidth: 600 }}
                className="mt-4"
            >
              <Form.Item name="diagnosis" label="Diagnosis" requiredMark>
                <TextArea rows={3} />
              </Form.Item>
              <Form.Item name="treatment" label="Prescription" requiredMark>
                <TextArea rows={6} />
              </Form.Item>
              <Form.Item name="notes" label="Notes" requiredMark>
                <TextArea rows={6} />
              </Form.Item>
            </Form>

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