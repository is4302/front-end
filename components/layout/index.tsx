import { FADE_IN_ANIMATION_SETTINGS } from "@/lib/constants";
import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { ReactNode, useEffect } from "react";
import useScroll from "@/lib/hooks/use-scroll";
import Meta from "./meta";
import { useSignInModal } from "./sign-in-modal";
import UserDropdown from "./user-dropdown";
import { useState } from 'react';
import Cookies from 'js-cookie';
import { isUserAuthenticated } from "@/lib/auth";
import { router } from "next/client";

export default function Layout({
  meta,
  children,
}: {
  meta?: {
    title?: string;
    description?: string;
    image?: string;
  };
  children: ReactNode;
}) {
  //const { data: session, status } = useSession();
  const { SignInModal, setShowSignInModal } = useSignInModal();
  const scrolled = useScroll(50);
  //let isAuthenticated = isUserAuthenticated();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    const checkAuthentication = async () => {
      const token = Cookies.get("userToken"); // Replace with the actual token you get from your authentication provider
      const state = await isUserAuthenticated(); // Use 'await' here to get the result of the promise
      if (state === true) {
        setIsAuthenticated(true);
        //alert("Authenticated");
      }
    };
    checkAuthentication();
  }, []); // Add any dependencies if needed

  const logout = () => {
    // Remove the cookie when the user logs out
    Cookies.remove('userToken');
    setIsAuthenticated(false);
    window.location.reload();
  };

  return (
    <>
      <Meta {...meta} />
      <SignInModal />
      <div className="fixed h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-cyan-100" />
      <div
        className={`fixed top-0 w-full ${
          scrolled
            ? "border-b border-gray-200 bg-white/50 backdrop-blur-xl"
            : "bg-white/0"
        } z-30 transition-all`}
      >
        <div className="mx-5 flex h-16 max-w-screen-xl items-center justify-between xl:mx-auto">
          <Link href="/" className="flex items-center font-display text-2xl">
            <Image
              src="/logo.png"
              alt="Precedent logo"
              width="30"
              height="30"
              className="mr-2 rounded-sm"
            ></Image>
            <p>Our Project Name</p>
          </Link>
          <div>
          <AnimatePresence>
              {isAuthenticated == false ? (
                <Link href={"/login"}>
                <motion.button
                  className="rounded-full border border-black bg-black p-1.5 px-4 text-sm text-white transition-all hover:bg-white hover:text-black"
                  //onClick={() => setShowSignInModal(true)}
                  {...FADE_IN_ANIMATION_SETTINGS}
                >
                  Sign In / Register
                </motion.button>
                </Link>
              ) : (
                <motion.button
                  className="rounded-full border border-black bg-black p-1.5 px-4 text-sm text-white transition-all hover:bg-white hover:text-black"
                  onClick={() => logout()}
                  {...FADE_IN_ANIMATION_SETTINGS}
                >
                  Sign Out
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <main className="flex w-full flex-col items-center justify-center py-32">
        {children}
      </main>
    </>
  );
}
