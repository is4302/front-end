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
import {useRouter} from "next/router";

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter()
  
  useEffect(() => {
    const checkAuthentication = async () => {
      const token = Cookies.get("userToken"); // Replace with the actual token you get from your authentication provider
      const state = await isUserAuthenticated(); // Use 'await' here to get the result of the promise
      if (state) {
        setIsAuthenticated(true);
      }
    };
    checkAuthentication();
  }, []);

  const logout = () => {
    // Remove the cookie when the user logs out
    Cookies.remove('userToken');
    setIsAuthenticated(false);
    router.push('/login')
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
            <p>HealthBlock</p>
          </Link>
          <div>
          <AnimatePresence>
              {!isAuthenticated ? (
                <Link href={"/login"}>
                <motion.button
                  className="rounded-full border border-black bg-black p-1.5 px-4 text-sm text-white transition-all hover:bg-white hover:text-black"
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
