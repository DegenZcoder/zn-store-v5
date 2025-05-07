"use client";

import { useState, useEffect } from "react";
import { BrowserProvider, Contract } from "ethers";
import toast from "react-hot-toast";
import { connectFactory } from "../lib/factory";

// ZN Token address and ABI (chỉ cần balanceOf)
const ZN_ADDRESS = "0xddBf983b0cdCb7f988CA6910ad03a0a2b787C6DB";
const ZN_ABI = [
  "function balanceOf(address owner) view returns (uint256)"
];

// Tier Requirements (ZN requirement for each tier)
const TIERS = [
  { value: 1, label: "Bronze", znRequired: 10000 },
  { value: 2, label: "Silver", znRequired: 50000 },
  { value: 3, label: "Gold", znRequired: 100000 },
  { value: 4, label: "Platinum", znRequired: 250000 },
  { value: 5, label: "Diamond", znRequired: 500000 }
];

export default function CreateStoreForm({ walletAddress }) {
  const [storeName, setStoreName] = useState("");
  const [selectedTier, setSelectedTier] = useState(1);
  const [znBalance, setZnBalance] = useState(0);
  const [isCreating, setIsCreating] = useState(false);

  // Fetch ZN balance of wallet
  const fetchZnBalance = async () => {
    try {
      const provider = new BrowserProvider(window.ethereum);
      const znContract = new Contract(ZN_ADDRESS, ZN_ABI, provider);
      const balance = await znContract.balanceOf(walletAddress);
      setZnBalance(Number(balance.toString()) / 1e18); // Convert from wei
    } catch (err) {
      console.error("Failed to fetch ZN balance", err);
    }
  };

  useEffect(() => {
    if (walletAddress) {
      fetchZnBalance();
    }
  }, [walletAddress]);

  const handleCreateStore = async () => {
    const tier = TIERS.find(t => t.value === selectedTier);

    if (!storeName || storeName.length < 6 || storeName.length > 35) {
      toast.error("Store name must be between 6 and 35 characters.");
      return;
    }

    if (znBalance < tier.znRequired) {
      toast.error(`You need at least ${tier.znRequired} ZN to create this tier store.`);
      return;
    }

    try {
      setIsCreating(true);
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const factory = connectFactory(signer);

      const tx = await factory.createStore(selectedTier, storeName);
      toast("Transaction submitted...");

      await tx.wait();
      toast.success("Store created successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create store.");
    } finally {
      setIsCreating(false);
    }
  };

  const tier = TIERS.find(t => t.value === selectedTier);

  return (
    <div className="p-6 bg-gray-900 rounded-lg space-y-4">
      <h2 className="text-2xl text-purple-400 font-bold">Create Your Store</h2>

      <p className="text-gray-400">
        Your ZN Balance: <span className="text-white">{znBalance}</span> ZN
      </p>

      <input
        type="text"
        placeholder="Enter Store Name"
        value={storeName}
        onChange={(e) => setStoreName(e.target.value)}
        className="w-full p-3 rounded bg-gray-700 text-white"
      />

      <select
        value={selectedTier}
        onChange={(e) => setSelectedTier(parseInt(e.target.value))}
        className="w-full p-3 rounded bg-gray-700 text-white"
      >
        {TIERS.map((tier) => (
          <option key={tier.value} value={tier.value}>
            {tier.label} (Requires {tier.znRequired} ZN)
          </option>
        ))}
      </select>

      <button
        onClick={handleCreateStore}
        disabled={isCreating || znBalance < tier.znRequired}
        className={`w-full py-3 rounded text-white ${
          znBalance < tier.znRequired
            ? "bg-gray-600 cursor-not-allowed"
            : "bg-purple-600 hover:bg-purple-700"
        } disabled:opacity-50`}
      >
        {isCreating ? "Creating..." : "Create Store"}
      </button>
    </div>
  );
}
