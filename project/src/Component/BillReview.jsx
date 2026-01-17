import React from "react";

const BillReview = ({ bill, onClose, onConfirm }) => {
  if (
    !bill?.billNumber ||
    !bill?.billType ||
    !bill?.customer ||
    !bill?.date ||
    !bill?.status ||
    !bill?.items ||
    !bill?.total ||
    !bill?.advancePayment
  ){
    alert("Please fill in all the required fields.");
    return null;
  }

  console.log(bill);

  const remainingBalance =
    Number(bill.total) - Number(bill.advancePayment || 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white w-full max-w-md rounded-xl p-5 shadow-lg">
        {/* Header */}
        <div className="mb-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-blue-600">
              {bill.billNumber}
            </h2>
            <span className="text-sm font-medium text-gray-600">
              {bill.billType}
            </span>
          </div>

          <p className="text-sm text-gray-600">Customer: {bill.customer}</p>
          <p className="text-sm text-gray-600">
            Date: {new Date(bill.date).toLocaleDateString("en-GB")}
          </p>

          <p
            className={`text-sm font-medium ${
              bill.status === "Cash" ? "text-red-500" : "text-green-600"
            }`}
          >
            Status: {bill.status}
          </p>
        </div>

        {/* Items */}
        <div className="mb-4">
          <h3 className="font-semibold text-gray-800 mb-1">Items</h3>
          <ul className="list-disc pl-5 space-y-1">
            {bill?.items?.map((item) => (
              <li key={item._id} className="text-sm text-gray-700">
                {item.name} — {item.qty.toLocaleString()} × ₹
                {item.price.toLocaleString()} = ₹
                {(item.qty * item.price).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </li>
            ))}
          </ul>
        </div>

        {/* Amount Summary */}
        <div className="space-y-3 border-t pt-3">
          <div className="flex justify-between text-sm">
            <span>Total Amount</span>
            <span className="font-semibold">
              ₹
              {bill.total.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span>Advance Paid</span>
            <span className="font-semibold">
              <span className="text-red-500 font-bold text-xl"> - </span>₹
              {Number(bill?.advancePayment || 0).toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>

          <div className="flex justify-between text-base font-bold">
            <span>Remaining Balance</span>
            <span>
              ₹
              {remainingBalance.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-green-500 text-white"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillReview;
