// lib/degenzStore.js
import { ethers } from "ethers";

export const DEGENZSTORE_ABI = [
  {"inputs":[{"internalType":"address","name":"_paymentToken","type":"address"},{"internalType":"address","name":"_treasury","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},
  {"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"name","type":"string"},{"indexed":false,"internalType":"uint256","name":"price","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"quantity","type":"uint256"}],"name":"ProductListed","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"buyer","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"totalPaid","type":"uint256"}],"name":"ProductPurchased","type":"event"},
  {"anonymous":false,"inputs":[],"name":"ProductRemoved","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"name","type":"string"},{"indexed":false,"internalType":"uint256","name":"newPrice","type":"uint256"}],"name":"ProductUpdated","type":"event"},
  {"inputs":[{"internalType":"uint256","name":"quantity","type":"uint256"}],"name":"buyProduct","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[],"name":"getProduct","outputs":[{"internalType":"string","name":"","type":"string"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"uint256","name":"price","type":"uint256"},{"internalType":"uint256","name":"quantity","type":"uint256"}],"name":"listProduct","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[],"name":"listedProduct","outputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"uint256","name":"price","type":"uint256"},{"internalType":"uint256","name":"quantity","type":"uint256"},{"internalType":"bool","name":"active","type":"bool"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"paymentToken","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"productListed","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"removeProduct","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[],"name":"treasury","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"newPrice","type":"uint256"}],"name":"updateProductPrice","outputs":[],"stateMutability":"nonpayable","type":"function"}
];

export function connectDegenZStore(address, signerOrProvider) {
  return new ethers.Contract(address, DEGENZSTORE_ABI, signerOrProvider);
}
