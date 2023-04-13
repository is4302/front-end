import { ethers } from "ethers";
import MedicalRecords_abi from "./MedicalRecords_abi.json";

const getWeb3Provider = () => {
  if (typeof window.ethereum !== 'undefined') {
    return new ethers.providers.Web3Provider(window.ethereum!);
  } else {
    throw new Error('Ethereum provider not found. Please install MetaMask or another compatible browser extension.');
  }
};


// Goerli testnet
const contractAddress = "0x4a7e587F8b45334b14E6F866730EC4Cf6800aC23";

export const getUser = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum!);
  await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();
  const signerAddress = await signer.getAddress();
  sessionStorage.setItem("user", signerAddress);
  return signerAddress;
};

// Initialize the contract object
const getContract = async (provider) => {
  const checksummedAddress = ethers.utils.getAddress(contractAddress);
  const contract = new ethers.Contract(checksummedAddress, MedicalRecords_abi, provider);
  console.log("successfully get contract");
  return contract;
};




export const addPatient = async (patientAddress) => {
  const provider = getWeb3Provider();
  await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();
  const contract = await getContract(signer);
  const tx = await contract.addPatient(patientAddress);
  return tx;
};

export const addDoctor = async (doctorAddress) => {
  const provider = getWeb3Provider();
  await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();
  const contract = await getContract(signer);
  const tx = await contract.addDoctor(doctorAddress);
  return tx;
};

export const addPrescription = async (patientAddress, prescriptionHash) => {
  const provider = getWeb3Provider();
  await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();
  const contract = await getContract(signer);
  const tx = await contract.addPrescription(patientAddress, prescriptionHash);
  return tx;
};

export const approvePrescription = async (patientAddress, nonce) => {
  const provider = getWeb3Provider();
  await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();
  const contract = await getContract(signer);
  const tx = await contract.approvePrescription(patientAddress, nonce);
  return tx;
};

export const getPrescription = async (nonce) => {
  const provider = getWeb3Provider();
  const contract = await getContract(provider);
  const prescription = await contract.getPrescription(nonce);
  return prescription;
};


// ... (existing imports and functions)

// Getter functions for medical records
export const getPrescriptionDoctor = async (nonce) => {
  const provider = getWeb3Provider();
  const contract = await getContract(provider);
  const doctor = await contract.getPrescriptionDoctor(nonce);
  return doctor;
};

export const getPrescriptionPatient = async (nonce) => {
  const provider = getWeb3Provider();
  const contract = await getContract(provider);
  const patient = await contract.getPrescriptionPatient(nonce);
  return patient;
};

export const getPrescriptionHash = async (nonce) => {
  const provider = getWeb3Provider();
  const contract = await getContract(provider);
  const hash = await contract.getPrescriptionHash(nonce);
  return hash;
};

export const isPrescriptionApproved = async (nonce) => {
  const provider = getWeb3Provider();
  const contract = await getContract(provider);
  const approved = await contract.isPrescriptionApproved(nonce);
  return approved;
};

// Getter functions for doctor and patient records
export const getDoctorRecord = async (doctorAddress, index) => {
  const provider = getWeb3Provider();
  const contract = await getContract(provider);
  const record = await contract.getDoctorRecord(doctorAddress, index);
  return record;
};

export const getPatientRecord = async (patientAddress, index) => {
  const provider = getWeb3Provider();
  const contract = await getContract(provider);
  const record = await contract.getPatientRecord(patientAddress, index);
  return record;
};

export const getDoctorRecordCount = async (doctorAddress) => {
  const provider = getWeb3Provider();
  const contract = await getContract(provider);
  const count = await contract.getDoctorRecordCount(doctorAddress);
  return count;
};

export const getPatientRecordCount = async (patientAddress) => {
  const provider = getWeb3Provider();
  const contract = await getContract(provider);
  const count = await contract.getPatientRecordCount(patientAddress);
  return count;
};

// Getter functions for patients and doctors arrays
export const getPatient = async (index) => {
  const provider = getWeb3Provider();
  const contract = await getContract(provider);
  const patient = await contract.getPatient(index);
  return patient;
};

export const getDoctor = async (index) => {
  const provider = getWeb3Provider();
  const contract = await getContract(provider);
  const doctor = await contract.getDoctor(index);
  return doctor;
};

export const getPatientCount = async () => {
  const provider = getWeb3Provider();
  const contract = await getContract(provider);
  const count = await contract.getPatientCount();
  return count;
};

export const getDoctorCount = async () => {
  const provider = getWeb3Provider();
  const contract = await getContract(provider);
  const count = await contract.getDoctorCount();
  return count;
};

