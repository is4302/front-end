import Layout from "@/components/layout";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FADE_DOWN_ANIMATION_VARIANTS } from "@/lib/constants";
import Link from "next/link";
import { useRouter } from "next/router";
import Cookies from 'js-cookie';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const res = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const userData = await res.json();
      if (res.ok) {
        alert("success");
        const uToken = userData.token;
        Cookies.set("userToken", uToken, { expires: 1 });
        Cookies.set("is_doctor", userData.is_doctor, { expires: 1 });
        Cookies.set("is_patient", userData.is_patient, { expires: 1 });
        router.push("/index");
      } else {
        alert(userData.error);
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
          Sign in
        </motion.h1>

        <motion.form
      className="mt-6 space-y-4"
      variants={FADE_DOWN_ANIMATION_VARIANTS}
      onSubmit={handleSubmit}
    >
      <div>
        <label htmlFor="email" className="block text-gray-600">
          Email
        </label>
        <input
          type="email"
          id="email"
          placeholder="email"
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
          placeholder="password"
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div>
        <button
          type="submit"
          className="w-full px-3 py-2 font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600"
        >
          Log in
        </button>
      </div>
    </motion.form>

        <motion.div
          className="mt-4 text-center text-gray-500"
          variants={FADE_DOWN_ANIMATION_VARIANTS}
        >
          Don't have an account?{" "}
          <Link href="/register">
            <button className="font-semibold text-blue-500 hover:text-blue-600 focus:outline-none">
              Register
            </button>
          </Link>
        </motion.div>
      </motion.div>
    </Layout>
  );
}

//export default LoginForm;
//const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {