"use client";

import { useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, ABI, certTxMap } from "../lib/contract";

type VerifyResult = {
  exists: boolean;
  name: string;
  course: string;
  issuedAt: string;
};

export default function Verify() {
  const [certId, setCertId] = useState("EP-1768571028");
  const [data, setData] = useState<VerifyResult | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const verifyCertificate = async () => {
    try {
      setLoading(true);
      setData(null);
      setTxHash(null);

      const provider = new ethers.JsonRpcProvider(
        `https://rpc.ankr.com/eth_sepolia/${process.env.NEXT_PUBLIC_TOKEN_SEPOLIA_RPC}`
      );

      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

      const result = await contract.verifyCertificate(certId);

      setData({
        exists: result[0],
        name: result[1],
        course: result[2],
        issuedAt: new Date(Number(result[3]) * 1000).toLocaleString(),
      });

      // ambil tx hash dari map kalau ada
      const hash = certTxMap[certId];
      if (hash) {
        setTxHash(hash);
      }
    } catch (e) {
      console.error(e);
      alert("Verification failed. Make sure Certificate ID is correct.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 animate-gradient flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="animate-fade-in w-full max-w-lg relative z-10">
        <div className="bg-white/15 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-purple-100 to-indigo-100 bg-clip-text text-transparent mb-2">
              Verify Certificate
            </h1>
            <p className="text-gray-300 text-sm">Check certificate authenticity on blockchain</p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Certificate ID
              </label>
              <div className="relative">
                <input
                  placeholder="EP-xxxx"
                  value={certId}
                  onChange={(e) => setCertId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/15 border border-white/30 text-white placeholder-gray-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 transition-all"
                />
                {certId && (
                  <button
                    onClick={() => setCertId("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            <button
              onClick={verifyCertificate}
              disabled={loading || !certId}
              className={`w-full py-4 rounded-xl font-semibold text-white transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg ${
                loading || !certId
                  ? "bg-white/10 cursor-not-allowed border border-white/10"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-indigo-500/30"
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
                  Verifying...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Verify Certificate
                </span>
              )}
            </button>
          </div>

          {data && (
            <div
              className={`mt-6 p-6 rounded-2xl border-2 animate-fade-in ${
                data.exists
                  ? "bg-gradient-to-br from-emerald-500/20 to-green-500/20 border-emerald-400/30"
                  : "bg-gradient-to-br from-red-500/20 to-rose-500/20 border-red-400/30"
              }`}
            >
              {data.exists ? (
                <>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <h2 className="text-xl font-bold text-emerald-400">
                      Valid Certificate
                    </h2>
                  </div>

                  <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                    <div className="flex justify-between items-center py-3 border-b border-white/10">
                      <span className="text-sm font-medium text-gray-400">
                        Student Name
                      </span>
                      <span className="font-semibold text-white">
                        {data.name}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-white/10">
                      <span className="text-sm font-medium text-gray-400">
                        Course
                      </span>
                      <span className="font-semibold text-white">
                        {data.course}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span className="text-sm font-medium text-gray-400">
                        Issued At
                      </span>
                      <span className="font-semibold text-white text-sm">
                        {data.issuedAt}
                      </span>
                    </div>
                  </div>

                  {txHash && (
                    <a
                      href={`https://sepolia.etherscan.io/tx/${txHash}`}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 font-medium transition-colors group"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      View on Etherscan
                      <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  )}
                </>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-red-500 flex items-center justify-center shadow-lg shadow-red-500/30 flex-shrink-0">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-red-400 mb-1">
                      Invalid Certificate
                    </h2>
                    <p className="text-sm text-gray-400">This certificate ID does not exist</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <a 
            href="/owner" 
            className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm transition-colors group"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Owner Panel
            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
