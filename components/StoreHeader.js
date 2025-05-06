export default function StoreHeader({ storeName, storeAddress, storeInfo }) {
  return (
    <div className="p-4 bg-gray-800 rounded-lg space-y-2">
      <h2 className="text-xl font-bold text-purple-400">{storeName}</h2>
      <p className="text-gray-400">Store Address: {storeAddress}</p>
      <p className="text-gray-400">Owner: {storeInfo?.owner}</p>
      <p className="text-gray-400">ZN Balance: {storeInfo?.znBalance}</p>
      <p className="text-gray-400">Max Products: {storeInfo?.maxProducts}</p>
      <p className="text-gray-400">Fee Per Day BP: {storeInfo?.feePerDayBP}</p>
      <p className="text-gray-400">Max Listing Days: {storeInfo?.maxListingDays}</p>
    </div>
  );
}
