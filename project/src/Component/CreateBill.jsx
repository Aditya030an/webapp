import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

import BillReview from "./BillReview";
import BillPdf from "../Component/pdf/BillPdf";
import { PDFDownloadLink } from "@react-pdf/renderer";

const CreateBill = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const patientDetail = location?.state?.patient?.personalDetails;
  const patient_id = location?.state?.patient?._id;
  const attendance = location?.state?.patient?.attendance;

  const [billNumber, setBillNumber] = useState("");
  const [customer, setCustomer] = useState("");
  const [date, setDate] = useState("");
  const [billType, setBillType] = useState("Home");
  const [status, setStatus] = useState("Cash");
  const [items, setItems] = useState([{ name: "", qty: 1, price: 0 }]);
  const [advancePayment, setAdvancePayment] = useState(0);

  const [billData, setBillData] = useState([]);

  const [review, setReview] = useState(false);
  const [reviewBill, setReviewBill] = useState(null);

  // Ref for the bill content to be printed
  const billContentRef = useRef();

  useEffect(() => {
    if (patientDetail && attendance) {
      const presentCount = attendance.filter(
        (item) => item?.status === "Present",
      ).length;

      setCustomer(patientDetail?.name);

      setItems([
        {
          name: "",
          qty: presentCount, // ✅ number of present days
          price: 0,
        },
      ]);
    }
  }, [patientDetail, attendance]);

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] =
      field === "qty" || field === "price" ? Number(value) : value;
    setItems(updatedItems);
  };

  const addItem = () => {
    setItems([...items, { name: "", qty: 1, price: 0 }]);
  };

  const total = items.reduce((sum, item) => sum + item.qty * item.price, 0);

  const fetchBillData = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/report/bill`,
      );
      const result = await response.json();
      // console.log("Bill data:", result);
      if (result.success && result.data.length > 0) {
        setBillData(result.data);

        // Get last bill number and increment
        const lastBill = result.data[0];
        const lastBillNumber = lastBill.billNumber;
        const match = lastBillNumber.match(/(\D+)-(\d+)-(\d+)/);
        if (match) {
          const prefix = match[1];
          const year = match[2];
          const number = parseInt(match[3]) + 1;
          const newBillNumber = `${prefix}-${year}-${number
            .toString()
            .padStart(3, "0")}`;
          setBillNumber(newBillNumber);
        } else {
          setBillNumber("MOV-2025-001");
        }
      } else {
        setBillNumber("MOV-2025-001");
      }
    } catch (error) {
      console.error("Error fetching bill data:", error);
      setBillNumber("MOV-2025-001");
    }
  };

  useEffect(() => {
    fetchBillData();
  }, []);

  const handleSubmit = async () => {
    const formData = {
      billNumber,
      billType,
      customer,
      date,
      status,
      items,
      total,
      advancePayment,
    };

    const payLoad = {
      patientId: patient_id,
      formData,
    };

    console.log("inside handleSubmit", formData);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/report/bill`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payLoad),
        },
      );

      const result = await response.json();
      console.log("Bill saved:", result);
      if (result?.success) {
        alert(result.message);
        fetchBillData(); // Refresh after saving
        setCustomer("");
        setDate("");
        setStatus("Cash");
        setBillType("Home");
        setItems([{ name: "", qty: 1, price: 0 }]);
        setAdvancePayment(0);
        navigate(`/PatientDetails/${patient_id}`);
      }
    } catch (error) {
      console.error("Error submitting bill:", error);
      alert("Failed to submit bill");
    }
  };

  return (
    <div>
      <div className="min-h-screen bg-gray-100 px-4 md:px-6 py-6">
        <div className="flex space-x-4 items-center justify-center mb-2">
          <button
            onClick={() => setBillType("Home")}
            className={`${
              billType === "Home" ? "bg-blue-500" : "bg-gray-500"
            } text-white px-4 py-2 rounded-lg`}
          >
            Home Service
          </button>
          <button
            onClick={() => setBillType("Clinic")}
            className={`${
              billType === "Clinic" ? "bg-blue-500" : "bg-gray-500"
            } text-white px-4 py-2 rounded-lg`}
          >
            Clinic Service
          </button>
        </div>

        {/* Main Content */}
        <div className=" px-6 pb-10">
          <div
            ref={billContentRef}
            className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-md"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Create Bill</h2>
              <select
                className="px-4 py-1 rounded-full text-sm bg-gray-100 border border-gray-300"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Cash">Cash</option>
                <option value="Online">Online</option>
              </select>
            </div>

            {/* Bill Info Inputs */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="text-gray-500 block">Bill Number</label>
                <input
                  type="text"
                  value={billNumber}
                  readOnly
                  onChange={(e) => setBillNumber(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded"
                  placeholder="e.g. INV-2025-001"
                />
              </div>
              <div>
                <label className="text-gray-500 block">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div>
                <label className="text-gray-500 block">Customer</label>
                <input
                  type="text"
                  value={customer}
                  readOnly={patientDetail !== undefined}
                  onChange={(e) => setCustomer(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded"
                  placeholder="e.g. John Doe"
                />
              </div>
            </div>

            {/* Items Table */}
            <table className="w-full text-left mb-6">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2">Service Name</th>
                  <th className="p-2">Number of Session</th>
                  <th className="p-2">Price</th>
                  <th className="p-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="p-2">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) =>
                          handleItemChange(idx, "name", e.target.value)
                        }
                        className="w-full border border-gray-300 p-1 rounded"
                        placeholder="Service name"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        min="1"
                        // readOnly={patientDetail !== undefined}
                        value={item.qty}
                        onChange={(e) =>
                          handleItemChange(idx, "qty", e.target.value)
                        }
                        className="w-full border border-gray-300 p-1 rounded"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        min="0"
                        value={item.price}
                        onChange={(e) =>
                          handleItemChange(idx, "price", e.target.value)
                        }
                        className="w-full border border-gray-300 p-1 rounded"
                      />
                    </td>
                    <td className="p-2 text-gray-800">
                      ₹
                      {(item.qty * item.price).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Add Item Button */}
            <button
              onClick={addItem}
              className="mb-4 bg-blue-100 text-blue-700 px-3 py-1 rounded"
            >
              + Add Item
            </button>

            {/* Total */}
            <div className="space-y-4">
              {/* Total Amount */}
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Total Amount</span>
                <span className="text-lg font-semibold text-gray-900">
                  ₹
                  {total.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>

              {/* Advance Payment */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600">
                  Advance Paid
                </label>
                <input
                  type="number"
                  min="0"
                  // max={total}
                  value={advancePayment}
                  onChange={(e) => {
                    // if (e.target.value > total) return;
                    Number(setAdvancePayment(e.target.value));
                  }}
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
                  placeholder="Enter advance amount"
                />
              </div>

              {/* Remaining Balance */}
              <div className="flex items-center justify-between border-t pt-4">
                <span className="text-base font-medium text-gray-700">
                  Remaining Balance
                </span>
                <span className="text-xl font-bold text-black">
                  ₹
                  {(total - advancePayment).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {!review && (
            <div className="flex justify-end mt-6 max-w-3xl mx-auto">
              <button
                onClick={() => {
                  setReviewBill({
                    billNumber,
                    billType,
                    customer,
                    date,
                    status,
                    items,
                    total,
                    advancePayment,
                  });
                }}
                className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
              >
                Review
              </button>
            </div>
          )}
          {review && (
            <div className="max-w-3xl mx-auto flex justify-end space-x-4 mt-6">
              <button
                onClick={handleSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                Save
              </button>

              <PDFDownloadLink
                document={
                  <BillPdf
                    bill={{
                      billNumber,
                      billType,
                      customer,
                      date,
                      status,
                      items,
                      total,
                      advancePayment,
                    }}
                    patient={patientDetail}
                  />
                }
                fileName={`Bill-${billNumber}.pdf`}
              >
                {({ loading }) => (
                  <button className="bg-purple-500 text-white px-4 py-2 rounded-lg">
                    {loading ? "Generating PDF..." : "Download PDF"}
                  </button>
                )}
              </PDFDownloadLink>
            </div>
          )}
        </div>
      </div>

      {reviewBill && (
        <BillReview
          bill={reviewBill}
          onClose={() => setReviewBill(null)}
          onConfirm={() => {
            setReview(true);
            setReviewBill(null);
          }}
        />
      )}
    </div>
  );
};

export default CreateBill;
