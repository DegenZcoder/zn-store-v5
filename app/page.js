"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { connectFactory } from "../lib/factory";
import { useRouter } from "next/navigation";
import WalletConnect from "../components/Wallet";
import CreateStoreForm from "../components/CreateStoreForm";

export default function HomePage() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [storeAddress, setStoreAddress] = useState(null);
  const router = useRouter();

  const handleConnect = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask");
      return;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    setWalletAddress(address);
  };

  const handleDisconnect = () => {
    setWalletAddress(null);
    setStoreAddress(null);
  };

  useEffect(() => {
    if (!walletAddress) return;

    const fetchStore = async () => {
      const factory = connectFactory();
      const userStore = await factory.userStores(walletAddress);

      if (userStore !== "0x0000000000000000000000000000000000000000") {
        setStoreAddress(userStore);
        router.push("/store"); // Nếu có store → vào dashboard
      }
    };

    fetchStore();
  }, [walletAddress]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-10 bg-black text-white space-y-6">
      <h1 className="text-5xl font-bold text-purple-500">ZN STORE</h1>
      <p>Decentralized Store on Blockchain. Connect wallet to continue.</p>

      <WalletConnect
        walletAddress={walletAddress}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
      />

      {walletAddress && !storeAddress && (
        <div className="mt-8 w-full max-w-lg">
          <p className="text-gray-400 mb-4 text-center">No store found yet. Please create your store below.</p>
          <CreateStoreForm walletAddress={walletAddress} />
        </div>
      )}
    </main>
  );
}
