"use client";

import { useState, useEffect } from "react";
import { ethers, BrowserProvider } from "ethers";
import { connectFactory } from "../lib/factory";
import { useRouter } from "next/navigation";
import WalletConnect from "../components/Wallet";
import CreateStoreForm from "../components/CreateStoreForm";
import { checkZNBalance } from "../lib/zncheck";

export default function HomePage() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [storeAddress, setStoreAddress] = useState(null);
  const [znBalance, setZnBalance] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleConnect = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask to continue.");
      return;
    }

    const provider = new BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    setWalletAddress(address);
  };

  const handleDisconnect = () => {
    setWalletAddress(null);
    setStoreAddress(null);
    setZnBalance(null);
  };

  useEffect(() => {
    const fetchStoreAndBalance = async () => {
      if (!walletAddress) return;

      setIsLoading(true);

      try {
        // Check ZN Balance
        const balance = await checkZNBalance(walletAddress);
        setZnBalance(balance);

        // Check store
        const factory = connectFactory();
        const userStore = await factory.userStores(walletAddress);

        if (userStore !== "0x0000000000000000000000000000000000000000") {
          setStoreAddress(userStore);
          router.push("/store");
        } else {
          setStoreAddress(null);
        }
      } catch (err) {
        console.error("Error fetching store or balance", err);
        setStoreAddress(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStoreAndBalance();
  }, [walletAddress, router]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-10 bg-black text-white space-y-6">
      <h1 className="text-5xl font-bold text-purple-500">ZN STORE</h1>
      <p>Decentralized Store on Blockchain. Connect your wallet to continue.</p>

      <WalletConnect
        walletAddress={walletAddress}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
      />

      {walletAddress && znBalance !== null && (
        <p className="text-green-400">
          ZN Balance: {znBalance} ZN
        </p>
      )}

      {walletAddress && isLoading && (
        <p className="text-gray-400 mt-4">Loading store information...</p>
      )}

      {walletAddress && !isLoading && (!storeAddress || storeAddress === "0x0000000000000000000000000000000000000000") && (
        <div className="mt-8 w-full max-w-lg">
          <p className="text-gray-400 mb-4 text-center">No store found. Please create your store below.</p>
          <CreateStoreForm walletAddress={walletAddress} />
        </div>
      )}
    </main>
  );
}
