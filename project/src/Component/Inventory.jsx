import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import html2pdf from "html2pdf.js";

const Inventory = () => {
  const [items, setItems] = useState([{ name: "", quantity: 0, unitPrice: 0 }]);
  const [inventoryData, setInventoryData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [filteredInventory, setFilteredInventory] = useState([]);

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] =
      field === "quantity" || field === "unitPrice" ? Number(value) : value;
    setItems(updated);
  };

  const addItem = () => {
    setItems([...items, { name: "", quantity: 0, unitPrice: 0 }]);
  };

  const total = items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );

  const fetchInventoryData = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/report/inventory`,
      );
      const result = await response.json();
      if (result.success) {
        setInventoryData(result.data);
      }
    } catch (error) {
      console.error("Error fetching Inventory data:", error);
    }
  };

  useEffect(() => {
    fetchInventoryData();
  }, []);

  useEffect(() => {
    if (!selectedMonth && !selectedYear) {
      setFilteredInventory(inventoryData);
    } else {
      const filtered = inventoryData.filter((order) => {
        const d = new Date(order.createdAt);
        const matchMonth = selectedMonth
          ? d.getMonth() + 1 === Number(selectedMonth)
          : true;
        const matchYear = selectedYear
          ? d.getFullYear() === Number(selectedYear)
          : true;
        return matchMonth && matchYear;
      });
      setFilteredInventory(filtered);
    }
  }, [inventoryData, selectedMonth, selectedYear]);

  const handleSubmit = async () => {
    const formData = {
      items,
      total,
    };
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/report/inventory`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );
      const result = await response.json();
      alert(result.message);
      fetchInventoryData();
      setItems([{ name: "", quantity: 0, unitPrice: 0 }]);
    } catch (err) {
      console.error("Error submitting inventory:", err);
      alert("Failed to submit inventory");
    }
  };

  const filteredTotal = filteredInventory.reduce(
    (sum, entry) => sum + entry.total,
    0,
  );

  const generatePDF = () => {
    if (!filteredInventory.length) return alert("No data to export");

    const content = `
  <div style="font-family: Arial; padding: 20px;">
    <h2 style="text-align: center;">Inventory Report</h2>
    <p><strong>Month:</strong> ${selectedMonth ? new Date(0, selectedMonth - 1).toLocaleString("default", { month: "long" }) : "All Months"}</p>
    <p><strong>Year:</strong> ${selectedYear || "All Years"}</p>
    <p><strong>Total Inventory Value:</strong> ₹${filteredTotal}</p>
    
    <table border="1" cellspacing="0" cellpadding="8" width="100%" style="border-collapse: collapse; margin-top: 20px; font-size: 12px;">
      <thead style="background: #f0f0f0;">
        <tr>
          <th>Date</th>
          <th>Item Name</th>
          <th>Qty</th>
          <th>Unit Price</th>
          <th>Subtotal</th>
          <th>Entry Total</th>
        </tr>
      </thead>
      <tbody>
        ${filteredInventory
          .map((entry) => {
            const rows = entry.items
              .map(
                (item, index) => `
            <tr>
              ${index === 0 ? `<td rowspan="${entry.items.length}">${new Date(entry.createdAt).toLocaleDateString()}</td>` : ""}
              <td>${item.name}</td>
              <td>${item.quantity}</td>
              <td>₹${item.unitPrice}</td>
              <td>₹${(item.quantity * item.unitPrice).toFixed(2)}</td>
              ${index === 0 ? `<td rowspan="${entry.items.length}" style="font-weight:bold; color: black;">₹${entry.total.toFixed(2)}</td>` : ""}
            </tr>
          `,
              )
              .join("");
            return rows;
          })
          .join("")}
      </tbody>
    </table>
  </div>
`;

    html2pdf()
      .set({
        margin: 0.5,
        filename: `Inventory_Report_${selectedMonth || "All_Months"}_${selectedYear || "All_Years"}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      })
      .from(content)
      .save();
  };

  return (
    <div>
      <div className="min-h-screen bg-gray-100 px-4 md:px-6 py-6">
        <div className="max-w-5xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Inventory Management
          </h2>

          <table className="w-full text-left mb-4">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">Item Name</th>
                <th className="p-2">Quantity</th>
                <th className="p-2">Unit Price</th>
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
                      className="w-full border p-1 rounded"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(idx, "quantity", e.target.value)
                      }
                      className="w-full border p-1 rounded"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) =>
                        handleItemChange(idx, "unitPrice", e.target.value)
                      }
                      className="w-full border p-1 rounded"
                    />
                  </td>
                  <td className="p-2">
                    ₹{(item.quantity * item.unitPrice).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            onClick={addItem}
            className="mb-4 bg-blue-100 text-blue-700 px-3 py-1 rounded"
          >
            + Add Item
          </button>

          <div className="text-right text-lg font-bold mb-6">
            Inventory Value: ₹{total.toFixed(2)}
          </div>

          <div className="flex justify-end space-x-4">
            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Save
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between p-2">
        <div className="flex flex-wrap gap-4 ">
          <select
            className="border p-2 rounded"
            value={selectedMonth || ""}
            onChange={(e) =>
              setSelectedMonth(e.target.value ? Number(e.target.value) : null)
            }
          >
            <option value="">All Months</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>

          <select
            className="border p-2 rounded"
            value={selectedYear || ""}
            onChange={(e) =>
              setSelectedYear(e.target.value ? Number(e.target.value) : null)
            }
          >
            <option value="">All Years</option>
            {Array.from({ length: 5 }, (_, i) => {
              const year = new Date().getFullYear() - i;
              return (
                <option key={year} value={year}>
                  {year}
                </option>
              );
            })}
          </select>

          <button
            onClick={generatePDF}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Download PDF
          </button>
        </div>

        <div className="text-right px-6 text-green-700 font-bold text-lg">
          Filtered Inventory Value: ₹{filteredTotal.toFixed(2)}
        </div>
      </div>
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredInventory.map((order) => (
          <div
            key={order._id}
            className="bg-white border border-gray-200 rounded-xl shadow p-4"
          >
            <h2 className="text-lg font-semibold text-indigo-600">
              Purchase Details
            </h2>
            <p className="text-sm text-gray-600 mb-2">
              Date: {new Date(order.createdAt).toLocaleDateString()}
            </p>
            <h3 className="font-semibold text-gray-800 mb-1">Items:</h3>
            <ul className="list-disc pl-5 text-sm text-gray-700 mb-2">
              {order.items.map((item) => (
                <li key={item._id}>
                  {item.name} - {item.quantity} pcs @ ₹{item.unitPrice}
                </li>
              ))}
            </ul>
            <div className="text-right font-bold text-green-700">
              Total: ₹{order.total}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Inventory;
