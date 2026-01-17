import { ethers } from "ethers";
import ABI from "./abi.json";

export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x66f60471db7dA1f16d60C7e30c37A6fB7dD193fc";

export async function getSignerContract() {
  if (!(window as any).ethereum) {
    throw new Error("MetaMask not found");
  }

  const provider = new ethers.BrowserProvider((window as any).ethereum);
  const signer = await provider.getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
}

export const certTxMap: Record<string, string> = {
  "EP-1768571028":
    "0x440caff4fec650ad385eea25a99e861e912fd9d437312d241e0b5087df249621",
  "EP-1768578943":
    "0x57c9cf07e261de9ba15c92308663d626c48100a5cfa6890bdd8cb468d2982cf1",
};
