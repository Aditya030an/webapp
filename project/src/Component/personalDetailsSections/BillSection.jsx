import React from "react";
import { useNavigate } from "react-router-dom";
import { PDFDownloadLink } from "@react-pdf/renderer";
import BillPdf from "../pdf/BillPdf";

const BillSection = ({ billing, patientDetail, attendance }) => {
  const navigate = useNavigate();
  console.log("patient", patientDetail);

  const goTo = (path) => {
    navigate(path, { state: { patient: patientDetail, attendance } });
  };
  return (
    <section className="border rounded-lg p-4">
      <h2 className="font-semibold text-lg mb-3">Billing</h2>

      <button
        onClick={() => goTo("/bill")}
        className="px-3 py-1 mb-2 text-sm border rounded hover:bg-gray-100"
      >
        Generate Bill
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {billing?.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 text-lg font-medium">
            No bills found for the selected filters.
          </div>
        ) : (
          billing?.map((bill) => (
            <div
              key={bill?._id}
              className="bg-white shadow-md rounded-xl p-4 border border-gray-200"
            >
              <div className="mb-2">
                <div className="flex items-center gap-2 justify-between">
                  <h2 className="text-xl font-semibold text-blue-600">
                    {bill?.billNumber}
                  </h2>
                  <h4 className="text-md font-semibold text-gray-600">
                    {bill?.billType}
                  </h4>
                </div>
                <p className="text-sm text-gray-600">
                  Customer: {bill?.customer}
                </p>
                <p className="text-sm text-gray-600">
                  Customer ID: {patientDetail?.personalDetails?.patientId}
                </p>
                <p className="text-sm text-gray-600">
                  Date: {new Date(bill?.date).toLocaleDateString("en-GB")}
                </p>
                <p
                  className={`text-md font-medium ${
                    bill.status === "Cash" ? "text-red-500" : "text-green-500"
                  }`}
                >
                  Status: {bill.status}
                </p>
              </div>

              <div className="mb-2">
                <h3 className="font-semibold text-gray-800">Items:</h3>
                <ul className="list-disc pl-5">
                  {bill.items.map((item) => (
                    <li key={item?._id} className="text-sm text-gray-700">
                      {item?.name} - Session: {item?.qty?.toLocaleString()} × ₹
                      {item?.price.toLocaleString()} = ₹
                      {(item?.qty * item?.price).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </li>
                  ))}
                </ul>
              </div>

              {/* <div className="text-right font-bold text-green-700">
                Total: ₹{bill?.total.toFixed(2)}
              </div> */}
              <div className="">
                {/* Total Amount */}
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Total Amount</span>
                  <span className="text-lg font-semibold text-gray-900">
                    ₹
                    {bill?.total.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span> Advance Paid</span>
                  <span className="text-lg font-semibold text-gray-900">
                    <span className="text-red-600 font-semibold text-xl">
                      -{" "}
                    </span>{" "}
                    ₹
                    {bill?.advancePayment.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }) || 0}
                  </span>
                </div>

                {/* Remaining Balance */}
                <div className="flex items-center justify-between border-t pt-4 mt-4">
                  <span className="text-base font-medium text-gray-700">
                    Remaining Balance
                  </span>
                  <span className="text-right font-bold text-green-700">
                    ₹
                    {(bill?.total - (bill?.advancePayment ?? 0)).toLocaleString(
                      "en-IN",
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }
                    )}
                  </span>
                </div>
              </div>
              <PDFDownloadLink
                document={
                  <BillPdf
                    bill={bill}
                    patient={patientDetail?.personalDetails}
                  />
                }
                fileName={`Bill-${bill.billNumber}.pdf`}
              >
                {({ loading }) => (
                  <button className="mt-3 w-full bg-blue-600 text-white py-1 rounded-md text-sm hover:bg-blue-700">
                    {loading ? "Generating PDF..." : "Download PDF"}
                  </button>
                )}
              </PDFDownloadLink>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default BillSection;
