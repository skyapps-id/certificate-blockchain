"use client";

import { useState } from "react";
import { getSignerContract } from "../../lib/contract";

const SEPOLIA_CHAIN_ID = "0xaa36a7"; // hex

export default function Admin() {
  const generateCertId = () => {
    const unix = Math.floor(Date.now() / 1000);
    return `EP-${unix}`;
  };

  const [certId, setCertId] = useState<string>(generateCertId());
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [txHash, setTxHash] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const issueCertificate = async () => {
    try {
      setLoading(true);
      setTxHash(null);

      if (!(window as any).ethereum) {
        alert("MetaMask not detected");
        return;
      }

      const ethereum = (window as any).ethereum;

      await ethereum.request({ method: "eth_requestAccounts" });

      const currentChainId = await ethereum.request({
        method: "eth_chainId",
      });

      if (currentChainId !== SEPOLIA_CHAIN_ID) {
        try {
          await ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: SEPOLIA_CHAIN_ID }],
          });
        } catch (err: any) {
          if (err.code === 4902) {
            alert(
              "Sepolia network is not available in your MetaMask. Please add Sepolia Testnet manually first."
            );
            return;
          } else {
            throw err;
          }
        }
      }

      const newChainId = await ethereum.request({ method: "eth_chainId" });
      if (newChainId !== SEPOLIA_CHAIN_ID) {
        alert("Failed to switch to Sepolia. Please switch manually.");
        return;
      }

      const autoCertId = certId || generateCertId();
      setCertId(autoCertId);

      const contract = await getSignerContract();

      const tx = await contract.issueCertificate(autoCertId, name, course);
      const receipt = await tx.wait();

      console.log("Receipt:", receipt);
      setTxHash(tx.hash);

      setCertId(generateCertId());
      setName("");
      setCourse("");
    } catch (e) {
      console.error(e);
      alert("Failed to issue certificate.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-fuchsia-800 animate-gradient flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-fuchsia-500/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-violet-500/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="animate-fade-in w-full max-w-lg relative z-10">
        <div className="bg-white/15 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-2xl mb-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-fuchsia-100 to-violet-100 bg-clip-text text-transparent mb-2">
              Issue Certificate
            </h1>
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 rounded-full text-xs font-medium text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                Sepolia Testnet
              </span>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Certificate ID
              </label>
              <div className="relative">
                <input
                  value={certId}
                  readOnly
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-gray-400 font-mono text-sm cursor-not-allowed pr-24"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs px-2 py-1 bg-violet-500/30 text-violet-300 rounded-md">
                  Auto
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Student Name
              </label>
              <input
                placeholder="Enter student name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/15 border border-white/30 text-white placeholder-gray-400 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-400/50 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Course Name
              </label>
              <input
                placeholder="Enter course name"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/15 border border-white/30 text-white placeholder-gray-400 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-400/50 transition-all"
              />
            </div>

            <button
              onClick={issueCertificate}
              disabled={loading || !name || !course}
              className={`w-full py-4 rounded-xl font-semibold text-white transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg ${loading || !name || !course
                  ? "bg-white/10 cursor-not-allowed border border-white/10"
                  : "bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 shadow-violet-500/30"
                }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Processing on Sepolia...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Issue Certificate
                </span>
              )}
            </button>
          </div>

          {txHash && (
            <div className="mt-6 p-5 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-green-500/20 border border-emerald-400/30 animate-fade-in">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-emerald-400 mb-1">
                    Certificate Issued!
                  </h3>
                  <p className="text-sm text-gray-400">Transaction confirmed on blockchain</p>
                </div>
              </div>
              <a
                href={`https://sepolia.etherscan.io/tx/${txHash}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300 font-medium transition-colors group"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                View on Etherscan
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm transition-colors group"
          >
            <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Verify
          </a>
        </div>
      </div>
    </div>
  );
}
