import { BrowserProvider, Contract } from "ethers";

// ZN Token contract
const ZN_TOKEN_ADDRESS = "0xddBf983b0cdCb7f988CA6910ad03a0a2b787C6DB";

// ABI chỉ cần function balanceOf là đủ
const ZN_TOKEN_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)"
];

// Get user's ZN balance (returned as BigInt)
export async function getUserZNBalance(address) {
  const provider = new BrowserProvider(window.ethereum);
  const contract = new Contract(ZN_TOKEN_ADDRESS, ZN_TOKEN_ABI, provider);

  const balance = await contract.balanceOf(address);
  const decimals = await contract.decimals();

  // Convert BigInt balance to readable number
  const readableBalance = Number(balance) / 10 ** decimals;

  return readableBalance;
}

