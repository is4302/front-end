import Layout from "@/components/layout";
import { motion } from "framer-motion";
import { FADE_DOWN_ANIMATION_VARIANTS } from "@/lib/constants";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import apiClient from "@/pages/utils/apiClient";
import { addPatient, addDoctor } from "web3_api/";

import type { MenuProps } from 'antd';
import { Menu } from 'antd';

const items: MenuProps['items'] = [
  {
    label: 'Patient Registration',
    key: 'patient',
  },
  {
    label: 'Doctor Registration',
    key: 'doctor',
  }
];

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [name, setName] = useState("");
  const [dob, setDOB] = useState("");
  const [height, setHeight] = useState<Number>();
  const [weight, setWeight] = useState<Number>();
  const [history, setHistory] = useState("");
  const [allergies, setAllergies] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [userType, setUserType] = useState("patient");

  function passwordsMatch(password: string, confirmedPassword: string): boolean {
    return password === confirmedPassword;
  }

  const handleReg = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (!passwordsMatch(password, confirmedPassword)) {
        alert("Passwords do not match");
        return;
      }

      if (userType === "patient") {
        try {
          const tx = await addPatient(walletAddress);
        } catch(err) {
          console.log(err);
        }
        
        console.log("Transaction hash:", tx.hash);
        apiClient
          .post("/signup/patient", {
            name,
            email,
            password,
            wallet_address: walletAddress,
            profile: {
              dob,
              height,
              weight,
              history,
              allergies,
              name,
              patient_wallet: walletAddress,
            },
          })
          .then((response) => {
            alert("Registration successful, please login");
            router.push("/login");
          })
          .catch((err) => {
            alert(err);
          });
      } else if (userType === "doctor") {
        try {
          const tx = await addDoctor(walletAddress);
        } catch (err) {
          console.log(err);
        }
        
        console.log("Transaction hash:", tx.hash);
        apiClient
          .post("/signup/doctor", {
            name,
            email,
            password,
            wallet_address: walletAddress,
            profile: {
              hospital_name: hospitalName,
              name,
              doctor_wallet: walletAddress,
            },
          })
          .then((response) => {
            alert("Registration successful, please login");
            router.push("/login");
          })
          .catch((err) => {
            alert(err);
          });
      }
    } catch (err) {
      alert(err);
      console.error("Error adding prescription:", err);
    }
  };

  const onClick: MenuProps['onClick'] = (e) => {
    setUserType(e.key);
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
          Register
        </motion.h1>

        <motion.form
          className="mt-6 space-y-4"
          variants={FADE_DOWN_ANIMATION_VARIANTS}
         onSubmit={handleReg}
        >
          <Menu onClick={onClick} mode="horizontal" items={items} />

          <div className="flex space-x-4 center">
            <div className="w-1/2">
              <label htmlFor="name" className="block text-gray-600">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="w-1/2">
              <label htmlFor="dob" className="block text-gray-600">
                Date of Birth
              </label>
              <input
                type="date"
                id="dob"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                onChange={(e) => setDOB(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="flex space-x-4 center">
            <div className="w-1/2">
              <label htmlFor="height" className="block text-gray-600">
                Height (cm)
              </label>
              <input
                type="number"
                id="height"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                onChange={(e) => setHeight(parseInt(e.target.value))}
                required
              />
            </div>
            <div className="w-1/2">
              <label htmlFor="dob" className="block text-gray-600">
                Weight (kg)
              </label>
              <input
                type="number"
                id="weight"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                onChange={(e) => setWeight(parseInt(e.target.value))}
                required
              />
            </div>
          </div>
          <div>
              <label htmlFor="email" className="block text-gray-600">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          <div>
            <label htmlFor="password" className="block text-gray-600">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="confirm-password" className="block text-gray-600">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirm-password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              onChange={(e) => setConfirmedPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="text" className="block text-gray-600">
              Wallet Address
            </label>
            <input
              type="text"
              id="wallet-address"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              onChange={(e) => setWalletAddress(e.target.value)}
              required
            />
          </div>
          {userType === "doctor" && (
            <div>
              <label htmlFor="hospitalName" className="block text-gray-600">
                Hospital Name
              </label>
              <input
                type="text"
                id="hospitalName"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                onChange={(e) => setHospitalName(e.target.value)}
                required
              />
            </div>
          )}
           {userType === "patient" && (
            <>
              <div>
                <label htmlFor="text" className="block text-gray-600">
                  Medical History
                </label>
                <textarea
                  id="history"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  onChange={(e) => setHistory(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="text" className="block text-gray-600">
                  Allergies
                </label>
                <textarea
                  id="allergies"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  onChange={(e) => setAllergies(e.target.value)}
                  required
                />
              </div>
            </>
          )}
          <div>
            <button
              type="submit"
              className="w-full px-3 py-2 font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600"
            >
              Register
            </button>
          </div>
          
        </motion.form>
        <motion.div
          className="mt-4 text-center text-gray-500"
          variants={FADE_DOWN_ANIMATION_VARIANTS}
        >
          Already have an account?{" "}
          <Link href="/login">
            <button className="font-semibold text-blue-500 hover:text-blue-600">
              Log in
            </button>
          </Link>
        </motion.div>
      </motion.div>
    </Layout>
  );
}
