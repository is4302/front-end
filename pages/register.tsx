import Layout from "@/components/layout";
import { motion } from "framer-motion";
import { FADE_DOWN_ANIMATION_VARIANTS } from "@/lib/constants";
import Link from "next/link";
import React,{ useState } from "react";
import { useRouter } from "next/router";

export default function Register() {

  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  function passwordsMatch(password: string, confirmedPassword: string): boolean {
    return password === confirmedPassword;
  }
  const handleReg = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!passwordsMatch(password, confirmedPassword)) {
      alert("Passwords do not match");
      return;
    }
    try {
      const res = await fetch("	http://127.0.0.1:8000/api/signup/patient", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, walletAddress }),
      });
      if (res.ok){
        alert("Registration successful, please login");
        router.push("/login");
        //redirect to landing page
      } else{
        alert(res.status);
      }
      //onSubmit(email, password);
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
          Register
        </motion.h1>

        <motion.form
          className="mt-6 space-y-4"
          variants={FADE_DOWN_ANIMATION_VARIANTS}
         onSubmit={handleReg}
        >
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
