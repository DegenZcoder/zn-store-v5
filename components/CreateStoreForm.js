"use client";

import { useState, useEffect } from "react";
import { BrowserProvider } from "ethers";
import toast from "react-hot-toast";
import { connectFactory } from "../lib/factory";
import { getUserZNBalance } from "../lib/zncheck";

const TIERS = [
  { value: 1, label: "Bronze", minZN: 10000 },
  { value: 2, label: "Silver", minZN: 50000 },
  { value: 3, label: "Gold", minZN: 100000 },
  { value: 4, label: "Platinum", minZN: 500000 },
  { value: 5, label: "Diamond", minZN: 1000000 }
];

export default function CreateStoreForm({ walletAddress }) {
  const [storeName, setStoreName] = useState("");
  const [selectedTier, setSelectedTier] = useState(1);
  const [isCreating, setIsCreating] = useState(false);
  const [znBalance, setZnBalance] = useState(0);

  const requiredZN = TIERS.find(t => t.value === selectedTier)?.minZN || 0;

  // Load ZN Balance
  useEffect(() => {
    if (!walletAddress) return;

    const loadBalance = async () => {
      const balance = await getUserZNBalance(walletAddress);
      setZnBalance(balance);
    };

    loadBalance();
  }, [walletAddress]);

  const handleCreateStore = async () => {
    if (!storeName || storeName.length < 6 || storeName.length > 35) {
      toast.error("Store name must be between 6 and 35 characters.");
      return;
    }

    if (znBalance < requiredZN) {
      toast.error(`You need at least ${requiredZN.toLocaleString()} ZN for ${TIERS.find(t => t.value === selectedTier).label} tier.`);
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

  return (
    <div className="p-6 bg-gray-900 rounded-lg space-y-4">
      <h2 className="text-2xl text-purple-400 font-bold">Create Your Store</h2>

      <p className="text-gray-300">
        Your ZN Balance: <span className="text-purple-400">{znBalance.toLocaleString()} ZN</span><br />
        Required for selected tier ({TIERS.find(t => t.value === selectedTier).label}): <span className="text-purple-400">{requiredZN.toLocaleString()} ZN</span>
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
          <option key={tier.value} value={tier.value}>{tier.label}</option>
        ))}
      </select>

      <button
        onClick={handleCreateStore}
        disabled={isCreating || znBalance < requiredZN}
        className="w-full py-3 bg-purple-600 rounded hover:bg-purple-700 text-white disabled:opacity-50"
      >
        {isCreating ? "Creating..." : znBalance < requiredZN ? `Insufficient ZN` : "Create Store"}
      </button>
    </div>
  );
}
