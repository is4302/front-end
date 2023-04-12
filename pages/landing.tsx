import Layout from "@/components/layout";
import { motion } from "framer-motion";
import { FADE_DOWN_ANIMATION_VARIANTS } from "@/lib/constants";
import Link from "next/link";
import { Card } from 'antd';
import Cookies from "js-cookie";
import {useEffect, useState} from "react";
import Balancer from "react-wrap-balancer";
import apiClient from "@/pages/utils/apiClient";
import {useRouter} from "next/router";

const gridStyle: React.CSSProperties = {
    width: '100%',
    textAlign: 'center',
};

type userProfile = {
    name: string,
    dob: string,
    height: Number,
    weight: Number,
    history: string,
    allergies: string,
    wallet: string,
    hospital: string
}

export default function Landing() {
    const [isPatient, setIsPatient] = useState(true)
    const [userData, setUserData] = useState<userProfile>()
    const router = useRouter();

    useEffect(() => {
        let userToken = Cookies.get("userToken"), is_patient = Cookies.get("is_patient") === "true"
        if (userToken == null) {
            router.push('/login')
        }
        console.log(is_patient)
        setIsPatient(is_patient)

        apiClient
            .get('/profile', {headers: {Authorization: `Bearer ${userToken}`}})
            .then((response) => {
                // console.log(response.data)
                let profileData = response.data.data[0]
                setUserData(profileData)
                localStorage.setItem("walletAddress", profileData.wallet)
            })
            .catch(err => {
                router.push('/login')
            })
    }, [])

    const greetings = () => {
        let currentTime = new Date().getHours()
        if (currentTime >= 22 || currentTime <= 4) {
            return "Night"
        } else if (currentTime < 13) {
            return "Morning"
        } else if (currentTime <= 16) {
            return "Afternoon"
        } else {
            return "Evening"
        }
    }

    function renderTabs() {
        let tabList
        if (isPatient) {
            tabList = tabs.patient
        } else {
            tabList = tabs.doctor
        }
        return (<motion.div
            className="flex items-center justify-center space-x-5"
            variants={FADE_DOWN_ANIMATION_VARIANTS}
        >
            {tabList.map((value, key) => (
                <Link key={key} href={value.href}>
                    <button className="flex max-w-fit items-center justify-center space-x-2 rounded-full border border-gray-300 bg-white px-5 py-2 text-sm text-gray-600 shadow-md transition-colors hover:border-gray-800">
                        {value.tab_name}
                    </button>
                </Link>
            ))}
        </motion.div>)

    }

    function renderDiffViews() {
        if (isPatient) {
            return (
                <div className="my-10 grid w-full max-w-screen-xl animate-[slide-down-fade_0.5s_ease-in-out] gap-5 px-5 xl:px-0">
                    <Card title={`Good ${greetings()}, Patient`} bordered={true} style={gridStyle}>
                        <Card.Grid hoverable={false} style={gridStyle}>Name: {userData?.name ?? ""}</Card.Grid>
                        <Card.Grid hoverable={false} style={gridStyle}>Date of Birth: {userData?.dob ?? ""}</Card.Grid>
                        <Card.Grid hoverable={false} style={gridStyle}>Height: {(userData?.height ?? 0).toString()}</Card.Grid>
                        <Card.Grid hoverable={false} style={gridStyle}>Weight: {(userData?.weight ?? 0).toString()}</Card.Grid>
                        <Card.Grid hoverable={false} style={gridStyle}>Allergies: {userData?.allergies ?? ""}</Card.Grid>
                        <Card.Grid hoverable={false} style={gridStyle}>Wallet Address: {userData?.wallet ?? ""}</Card.Grid>
                    </Card>
                </div>
            )
        }
        return (
            <div className="my-10 grid w-full max-w-screen-xl animate-[slide-down-fade_0.5s_ease-in-out] gap-5 px-5 xl:px-0">
                <Card title={`Good ${greetings()}, Doctor`} bordered={true} style={gridStyle}>
                    <Card.Grid hoverable={false} style={gridStyle}>Name: {userData?.name ?? ""}</Card.Grid>
                    <Card.Grid hoverable={false} style={gridStyle}>Hospital Name: {userData?.hospital ?? ""}</Card.Grid>
                    <Card.Grid hoverable={false} style={gridStyle}>Wallet Address: {userData?.wallet ?? ""}</Card.Grid>
                </Card>
            </div>
        )
    }

    return (
        <Layout>
            <motion.div
                className="max-w-xl px-5 xl:px-0"
                initial="hidden"
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
                {renderTabs()}
                <motion.h3
                    className="bg-gradient-to-br mt-4 from-black to-stone-500 bg-clip-text text-center font-display
                    text-4xl tracking-[-0.02em] text-transparent drop-shadow-sm md:text-4xl md:leading-[5rem]"
                    variants={FADE_DOWN_ANIMATION_VARIANTS}
                >
                    <Balancer>Welcome to Medical Consultant</Balancer>
                </motion.h3>
                {renderDiffViews()}
            </motion.div>
        </Layout>
    );
}

const tabs = {
    patient: [
        {tab_name: "Make an Appointment", href: "/appointment"},
        {tab_name: "View Doctor Lists", href: "/doctor_list"},
        {tab_name: "View Medical History", href: "/view_patient_history"},
    ],
    doctor: [
        {tab_name: "View Your Appointments", href: "/patient_appointment_list"},
    ]
}



