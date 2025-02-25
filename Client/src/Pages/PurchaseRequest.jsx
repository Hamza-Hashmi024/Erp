import { useState, useEffect } from "react";
import axiosInstance from "../AxiosInstance";


const PurchaseRequest = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    date: "",
    id: "",
  });

  const [newRequest, setNewRequest] = useState({
    request_date: new Date().toISOString().split("T")[0],
    requested_by: "User",
    status: "Pending",
    remarks: "",
    items: [{ product_id: "", quantity: "" }],
  });

  const apiUrl = import.meta.env.VITE_API_URL;


  const handleStatusChange = async (requestId, newStatus) => {
    try {
      await axiosInstance.put(`${apiUrl}/purchase-requests/${requestId}`, {
        status: newStatus
      });
      fetchRequests(); // Refresh the list after update
    } catch (error) {
      console.error("Error updating status:", error.response?.data || error.message);
      // Optionally handle error state here
    }
  };


  const fetchRequests = async () => {
    try {
      const response = await axiosInstance.get(`${apiUrl}/purchase-requests`);
      setRequests(response.data?.requests || []);
      setFilteredRequests(response.data?.requests || []);
    } catch (error) {
      console.error("Error fetching purchase requests:", error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const filterRequests = () => {
    const { name, date, id } = filters;
    const filtered = requests.filter((request) => {
      const matchesName = name
        ? request.requested_by.toLowerCase().includes(name.toLowerCase())
        : true;
      const matchesDate = date ? request.request_date === date : true;
      const matchesId = id ? request.id.toString().includes(id) : true;

      return matchesName && matchesDate && matchesId;
    });
    setFilteredRequests(filtered);
  };

  useEffect(() => {
    filterRequests();
  }, [filters, requests]);

  const addItemRow = () => {
    setNewRequest({
      ...newRequest,
      items: [...newRequest.items, { product_id: "", quantity: "" }],
    });
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = newRequest.items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setNewRequest({ ...newRequest, items: updatedItems });
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    const { request_date, requested_by, status, remarks, items } = newRequest;

    if (!items || items.some((item) => !item.product_id || !item.quantity)) {
      console.error("All items must have valid product IDs and quantities.");
      return;
    }

    try {
      await axiosInstance.post(`${apiUrl}/purchase-requests`, {
        request_date,
        requested_by,
        status,
        remarks,
        items,
      });
      fetchRequests();
      setNewRequest({
        request_date: new Date().toISOString().split("T")[0],
        requested_by: "User",
        status: "Pending",
        remarks: "",
        items: [{ product_id: "", quantity: "" }],
      });
    } catch (error) {
      console.error(
        "Error creating purchase request:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="p-6 min-h-screen" style={{ backgroundColor: "#FFFFFF" , color: "#47464C" }}>
     <header className="mb-8">
          <h1 className="text-2xl font-bold mb-2" style={{ color: "#993F82" }}>Purchase Request Management</h1>
          <div className="h-1 w-20" style={{ backgroundColor: "#993F82" }}></div>
        </header>

      <form onSubmit={handleRequestSubmit} className="mb-8">
        <h2 className="text-xl font-bold mb-4">Create Purchase Request</h2>
        <div className="flex gap-4">
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Request Date</label>
            <input
              type="date"
              value={newRequest.request_date}
              onChange={(e) =>
                setNewRequest({ ...newRequest, request_date: e.target.value })
              }
              required
              className="border px-4 py-2 rounded w-full"
              style={{ backgroundColor: "#FFFFFF", color: "#47464C" }}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Requested By</label>
            <input
              type="text"
              value={newRequest.requested_by}
              onChange={(e) =>
                setNewRequest({ ...newRequest, requested_by: e.target.value })
              }
              required
              className="border px-4 py-2 rounded w-full"
              style={{ backgroundColor: "#FFFFFF", color: "#47464C" }}
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Remarks</label>
          <textarea
            value={newRequest.remarks}
            onChange={(e) =>
              setNewRequest({ ...newRequest, remarks: e.target.value })
            }
            className="border px-4 py-2 rounded w-full"
            style={{ backgroundColor: "#FFFFFF", color: "#47464C" }}
          />
        </div>

        <h3 className="text-lg font-bold mb-2">Items</h3>
        {newRequest.items.map((item, index) => (
          <div key={index} className="flex gap-4 mb-4">
            <input
              type="text"
              placeholder="Product ID"
              value={item.product_id}
              onChange={(e) =>
                handleItemChange(index, "product_id", e.target.value)
              }
              required
              className="border px-4 py-2 rounded w-1/2"
              style={{ backgroundColor: "#FFFFFF", color: "#47464C" }}
            />
            <input
              type="number"
              placeholder="Quantity"
              value={item.quantity}
              onChange={(e) =>
                handleItemChange(index, "quantity", e.target.value)
              }
              required
              className="border px-4 py-2 rounded w-1/2"
              style={{ backgroundColor: "#FFFFFF", color: "#47464C" }}
            />
          </div>
        ))}
        <div>
          <button
            type="button"
            onClick={addItemRow}
            className="px-4 py-2 rounded mb-4"
            style={{ backgroundColor: "#993F82", color: "#FFFFFF" }}
          >
            Add Item
          </button>

          <button
            type="submit"
            className="px-4 py-2 rounded"
            style={{ backgroundColor: "#993F82", color: "#FFFFFF" }}
          >
            Submit Request
          </button>
        </div>
      </form>

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Filter Requests</h2>
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Filter by Name"
            value={filters.name}
            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
            className="border px-4 py-2 rounded w-1/3"
            style={{ backgroundColor: "#FFFFFF", color: "#47464C" }}
          />
          <input
            type="date"
            placeholder="Filter by Date"
            value={filters.date}
            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
            className="border px-4 py-2 rounded w-1/3"
            style={{ backgroundColor: "#FFFFFF", color: "#47464C" }}
          />
          <input
            type="text"
            placeholder="Filter by ID"
            value={filters.id}
            onChange={(e) => setFilters({ ...filters, id: e.target.value })}
            className="border px-4 py-2 rounded w-1/3"
            style={{ backgroundColor: "#FFFFFF", color: "#47464C" }}
          />
        </div>
      </div>


      <div className="p-6 min-h-screen" style={{ backgroundColor: "#FFFFFF", color: "#47464C" }}>
      {/* ... existing form and filter components ... */}

      <h2 className="text-xl font-bold mb-4">Existing Purchase Requests</h2>
      <table className="w-full border">
        <thead style={{ backgroundColor: "#993F82", color: "#FFFFFF" }}>
          <tr>
            <th className="p-2">ID</th>
            <th className="p-2">Date</th>
            <th className="p-2">Requested By</th>
            <th className="p-2">Remarks</th>
            <th className="p-2">Status</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredRequests.map((request) => (
            <tr key={request.id}>
              <td className="p-2">{request.id}</td>
              <td className="p-2">{request.request_date}</td>
              <td className="p-2">{request.requested_by}</td>
              <td className="p-2">{request.remarks}</td>
              <td className="p-2">{request.status}</td>
              <td className="p-2">
                <select
                  value={request.status}
                  onChange={(e) => handleStatusChange(request.id, e.target.value)}
                  className="border px-2 py-1 rounded"
                  style={{ backgroundColor: "#FFFFFF", color: "#47464C" }}
                >
                  <option value="Approved">Approved</option>
                  <option value="Pending">Pending</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
};

export default PurchaseRequest;





