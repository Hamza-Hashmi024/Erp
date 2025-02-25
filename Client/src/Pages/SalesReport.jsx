import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Logo from "../assets/Logo.jpeg";
import axiosInstance from "../AxiosInstance";

const SalesReport = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [searchParams] = useSearchParams();
  const [salesDetails, setSalesDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  const fromDate = searchParams.get("from");
  const toDate = searchParams.get("to");

  useEffect(() => {
    fetchSalesDetails();
  }, [fromDate, toDate]);

  const fetchSalesDetails = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`${apiUrl}/sales`, {
        params: { from: fromDate, to: toDate },
      });
      setSalesDetails(response.data || []);
    } catch (error) {
      console.error("Error fetching sales details:", error);
      setSalesDetails([]);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();

    // Add Logo
    const img = new Image();
    img.src = Logo;
    doc.addImage(img, "JPEG", 10, 10, 30, 30);

    // Title
    doc.setFontSize(18);
    doc.setTextColor("#993F82");
    doc.text("Sales Report", 50, 20);

    // Subtitle with date range
    doc.setFontSize(12);
    doc.setTextColor("#47464C");
    const dateRange = `From: ${fromDate || "N/A"} To: ${toDate || "N/A"}`;
    doc.text(dateRange, 50, 30);

    // Table Content
    const tableColumnHeaders = [
      "Sale ID",
      "Customer Name",
      "Sale Date",
      "Total Amount",
      "Products",
    ];

    const tableRows = salesDetails.map((sale) => [
      sale.id,
      sale.customer_name || "N/A",
      sale.sale_date,
      `$${parseFloat(sale.total_amount || 0).toFixed(2)}`,
      (sale.sale_items || [])
        .map(
          (item) =>
            `ID: ${item.product_id || ""}, Qty: ${item.quantity || 0}, $${parseFloat(item.price || 0).toFixed(2)}`
        )
        .join("\n"),
    ]);

    doc.autoTable({
      head: [tableColumnHeaders],
      body: tableRows,
      startY: 40,
      styles: { fontSize: 10, cellPadding: 3, textColor: "#47464C" },
      headStyles: { fillColor: "#993F82", textColor: "#FFFFFF" },
      alternateRowStyles: { fillColor: "#f8f8f8" },
      margin: { top: 50 },
    });

    doc.save("Sales_Report.pdf");
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4" style={{ color: "#993F82" }}>
        Sales Report
      </h1>
      <div className="mb-4">
        <button
          onClick={downloadPDF}
          className="text-white px-4 py-2 rounded"
          style={{ backgroundColor: "#993F82" }}
        >
          Download PDF
        </button>
      </div>
      {loading ? (
        <p>Loading sales data...</p>
      ) : salesDetails.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead>
              <tr>
                <th className="border px-4 py-2 text-[#FFFF]" style={{ backgroundColor: "#993F82" }}>
                  Sale ID
                </th>
                <th className="border px-4 py-2 text-[#FFFF]" style={{ backgroundColor: "#993F82" }}>
                  Customer Name
                </th>
                <th className="border px-4 py-2 text-[#FFFF]" style={{ backgroundColor: "#993F82" }}>
                  Sale Date
                </th>
                <th className="border px-4 py-2 text-[#FFFF]" style={{ backgroundColor: "#993F82" }}>
                  Total Amount
                </th>
                <th className="border px-4 py-2 text-[#FFFF]" style={{ backgroundColor: "#993F82" }}>
                  Products
                </th>
              </tr>
            </thead>
            <tbody>
              {salesDetails.map((sale) => (
                <tr key={sale.id}>
                  <td className="border px-4 py-2">{sale.id}</td>
                  <td className="border px-4 py-2">{sale.customer_name || "N/A"}</td>
                  <td className="border px-4 py-2">{sale.sale_date}</td>
                  <td className="border px-4 py-2">${parseFloat(sale.total_amount || 0).toFixed(2)}</td>
                  <td className="border px-4 py-2">
                    {(sale.sale_items || []).map((item) => (
                      <div key={item.product_id}>
                        ID: {item.product_id}, Qty: {item.quantity}, $ {parseFloat(item.price || 0).toFixed(2)}
                      </div>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No sales data available for the selected date range.</p>
      )}
    </div>
  );
};

export default SalesReport;

