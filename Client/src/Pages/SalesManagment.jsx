import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import axiosInstance from "../AxiosInstance";

const SalesManagement = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [saleDetails, setSaleDetails] = useState({
    customer_name: "",
    sale_date: new Date().toISOString().split("T")[0],
    total_amount: 0,
    sale_items: [{ product_id: "", quantity: 0, price: 0 }],
  });
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const navigate = useNavigate();

  const handleViewDetails = () => {
    const queryParams = new URLSearchParams({
      from: fromDate || "",
      to: toDate || "",
    }).toString();

    navigate(`/sales-report?${queryParams}`);
  };

  useEffect(() => {
    fetchSales();
    fetchProducts();
  }, []);

  const fetchSales = async () => {
    try {
      const response = await axiosInstance.get(`${apiUrl}/sales`);
      setSales(response.data);
    } catch (error) {
      console.error("Error fetching sales:", error);
    }
  };

  

  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get(`${apiUrl}/products`);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const updatedItems = [...saleDetails.sale_items];
    updatedItems[index] = { ...updatedItems[index], [name]: value };
    setSaleDetails({ ...saleDetails, sale_items: updatedItems });
  };

  const handleAddItem = () => {
    setSaleDetails({
      ...saleDetails,
      sale_items: [...saleDetails.sale_items, { product_id: "", quantity: 0, price: 0 }],
    });
  };

  const handleRemoveItem = (index) => {
    const updatedItems = saleDetails.sale_items.filter((_, i) => i !== index);
    setSaleDetails({ ...saleDetails, sale_items: updatedItems });
  };

  const handleSaleSubmit = async (e) => {
    e.preventDefault();

    // Validate sale items
    const invalidItems = saleDetails.sale_items.filter(
      (item) =>
        item.product_id.trim() === "" ||
        item.quantity <= 0 ||
        item.price <= 0
    );

    if (invalidItems.length > 0) {
      return alert("Ensure all sale items have valid product IDs, quantities, and prices.");
    }

    try {
      // Prepare the payload
      const saleData = {
        ...saleDetails,
        customer_name: saleDetails.customer_name.trim(),
        total_amount: saleDetails.sale_items.reduce(
          (sum, item) => sum + item.quantity * item.price,
          0
        ),
        sale_items: saleDetails.sale_items.map((item) => ({
          product_id: parseInt(item.product_id, 10),
          quantity: parseInt(item.quantity, 10),
          price: parseFloat(item.price),
        })),
      };

      const response = await axiosInstance.post(`${apiUrl}/sales`, saleData);
      console.log("Sale submitted successfully:", response.data);

      // Reset the form and fetch updated sales
      setSaleDetails({
        customer_name: "",
        sale_date: new Date().toISOString().split("T")[0],
        total_amount: 0,
        sale_items: [{ product_id: "", quantity: 0, price: 0 }],
      });
      fetchSales();
    } catch (error) {
      console.error("Error submitting sale:", error.response ? error.response.data : error.message);
      alert(`Error submitting sale: ${error.response ? error.response.data.message : error.message}`);
    }
  };

  const handleSearch = () => {
    return sales.filter((sale) => {
      const saleDate = new Date(sale.sale_date);
      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(toDate) : null;
  
   ;
      
     
  
      return (
        (from && to ? saleDate >= from && saleDate <= to : true)  // Filter based on date range
      
      );
    });
  };
  

  return (
    <>
    <div className="p-4" style={{ backgroundColor: "#FFFF" }}>
    <header className="mb-8">
          <h1 className="text-2xl font-bold mb-2" style={{ color: "#993F82" }}>Sales Management</h1>
          <div className="h-1 w-20" style={{ backgroundColor: "#993F82" }}></div>
        </header>


      {/* New Sale Form */}
      <form onSubmit={handleSaleSubmit} className="p-4 rounded mb-4" style={{ borderColor: "#993F82" }}>
        <h2 className="text-lg font-semibold mb-2" style={{ color: "#47464C" }}>
          New Sale
        </h2>

        <div className="flex gap-4">
          <label className="block mb-2">
            Customer Name
            <input
              type="text"
              name="customer_name"
              value={saleDetails.customer_name}
              onChange={(e) => setSaleDetails({ ...saleDetails, customer_name: e.target.value })}
              className="border px-4 py-2 rounded w-full"
              style={{ borderColor: "#993F82" }}
              required
            />
          </label>

          <label className="block mb-2">
            Sale Date
            <input
              type="date"
              name="sale_date"
              value={saleDetails.sale_date}
              onChange={(e) => setSaleDetails({ ...saleDetails, sale_date: e.target.value })}
              className="border px-4 py-2 rounded w-full"
              style={{ borderColor: "#993F82" }}
              required
            />
          </label>
        </div>

        {saleDetails.sale_items.map((item, index) => (
          <div key={index} className="flex gap-4 mb-2">
            <select
              name="product_id"
              value={item.product_id}
              onChange={(e) => handleInputChange(e, index)}
              className="border px-4 py-2 rounded w-full"
              style={{ borderColor: "#993F82" }}
              required
            >
              <option value="">Select Product</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              name="quantity"
              placeholder="Quantity"
              value={item.quantity}
              onChange={(e) => handleInputChange(e, index)}
              min="1"
              required
              className="border px-4 py-2 rounded"
              style={{ borderColor: "#993F82" }}
            />

            <input
              type="number"
              name="price"
              placeholder="Price"
              value={item.price}
              onChange={(e) => handleInputChange(e, index)}
              min="0.01"
              step="0.01"
              required
              className="border px-4 py-2 rounded"
              style={{ borderColor: "#993F82" }}
            />

            <button
              type="button"
              onClick={() => handleRemoveItem(index)}
              className="text-white px-4 py-2 rounded"
              style={{ backgroundColor: "#993F82" }}
            >
              Remove
            </button>
          </div>
        ))}

        <div className="flex gap-4">
          <button
            type="button"
            onClick={handleAddItem}
            className="text-white px-4 py-2 rounded"
            style={{ backgroundColor: "#993F82" }}
          >
            Add Item
          </button>

          <button
            type="submit"
            className="text-white px-4 py-2 rounded mt-4"
            style={{ backgroundColor: "#47464C" }}
          >
            Submit Sale
          </button>
        </div>
      </form>

      {/* Sales Table */}
      <div className="p-4 rounded" style={{ borderColor: "#47464C" }}>
        <h2 className="text-lg font-semibold mb-2" style={{ color: "#47464C" }}>
          Sales Record
        </h2>

        {/* Date Range Search */}
        <div className="mb-4 flex gap-4">
          <h1>To</h1>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border px-4 py-2 rounded w-3/12"
            style={{ borderColor: "#993F82" }}
          />
          <h1>From</h1>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border px-4 py-2 rounded w-3/12"
            style={{ borderColor: "#993F82" }}
          />

<button
      type="button"
      onClick={handleViewDetails}
      className="text-white px-4 py-2 rounded"
      style={{ backgroundColor: "#993F82" }}
    >
      View Detail
    </button>

        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead>
<tr>
              <th className="border px-4 py-2     text-[#FFFF]" style={{ backgroundColor:   "#993F82" }}>Sale ID</th>
                <th className="border px-4 py-2   text-[#FFFF]" style={{ backgroundColor: "#993F82" }}>Customer Name</th>
                <th className="border px-4 py-2   text-[#FFFF]" style={{ backgroundColor: "#993F82" }}>Sale Date</th>
                <th className="border px-4 py-2   text-[#FFFF]" style={{ backgroundColor: "#993F82" }}>Total Amount</th>
                             </tr>
            </thead>
            <tbody>
              {handleSearch().map((sale) => (
                <tr key={sale.id}>
                  <td className="border px-4 py-2">{sale.id}</td>
                  <td className="border px-4 py-2">{sale.customer_name}</td>
                  <td className="border px-4 py-2">{sale.sale_date}</td>
                  <td className="border px-4 py-2">{sale.total_amount}</td>
                  
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>


   
    </div>
    </>
  );
};

export default SalesManagement;

