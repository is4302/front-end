import { ethers } from "ethers";
import MedicalRecords_abi from "./MedicalRecords_abi.json";

// Ethereum Goerli Testnet
const contractAddress = "0x9DB58D89d990690fA91fD0ea0659546ee46D3d14";

// Initialize the contract object
const getContract = (provider) => {
  return new ethers.Contract(contractAddress, MedicalRecords_abi, provider);
};

export const addPatient = async (patientAddress) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum!);
  await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();
  const contract = getContract(signer);
  const tx = await contract.addPatient(patientAddress);
  return tx;
};

export const addDoctor = async (doctorAddress) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum!);
  await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();
  const contract = getContract(signer);
  const tx = await contract.addDoctor(doctorAddress);
  return tx;
};

export const addPrescription = async (patientAddress, prescriptionHash) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum!);
  await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();
  const contract = getContract(signer);
  const tx = await contract.addPrescription(patientAddress, prescriptionHash);
  return tx;
};

export const approvePrescription = async (patientAddress, nonce) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum!);
  await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();
  const contract = getContract(signer);
  const tx = await contract.approvePrescription(patientAddress, nonce);
  return tx;
};

export const getPrescription = async (nonce) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum!);
  const contract = getContract(provider);
  const prescription = await contract.getPrescription(nonce);
  return prescription;
};
