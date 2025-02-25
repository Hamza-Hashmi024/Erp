import { useState, useEffect, useCallback } from "react";
import axiosInstance from "../AxiosInstance";

const PurchaseOrder = () => {
  const [orders, setOrders] = useState([]);
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [grns, setGRNs] = useState([]);
  const [newOrder, setNewOrder] = useState({
    order_date: new Date().toISOString().split("T")[0],
    supplier_id: "",
    status: "Pending",
    remarks: "",
    purchase_request_id: "",
    items: []
  });
  const [newGRN, setNewGRN] = useState({
    received_date: new Date().toISOString().split("T")[0],
    received_by: "",
    condition: "Good",
    notes: ""
  });


  const apiUrl = import.meta.env.VITE_API_URL;

  const fetchData = useCallback(async () => {
    try {
      const [ordersRes, requestsRes] = await Promise.all([
        axiosInstance.get(`${apiUrl}/purchase-orders`),
        axiosInstance.get(`${apiUrl}/purchase-requests/approved`)
      ]);
      
      setOrders(ordersRes.data?.orders || []);
      setApprovedRequests(requestsRes.data?.requests || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRequestSelect = (requestId) => {
    const selected = approvedRequests.find(r => r.id === requestId);
    if (selected) {
      setSelectedRequest(selected);
      setNewOrder(prev => ({
        ...prev,
        purchase_request_id: requestId,
        items: selected.items.map(item => ({
          product_id: item.product_id ?? "",
          quantity: item.quantity ?? "",
          price: ""
        }))
      }));
    }
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = newOrder.items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setNewOrder({ ...newOrder, items: updatedItems });
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    const { order_date, supplier_id, status, remarks, items, purchase_request_id } = newOrder;

    const validatedItems = items.map(item => ({
      ...item,
      product_id: Number(item.product_id),
      quantity: Number(item.quantity),
      price: Number(item.price)
    }));

    if (
      !supplier_id ||
      !purchase_request_id ||
      validatedItems.some(item => 
        isNaN(item.product_id) || 
        isNaN(item.quantity) || 
        isNaN(item.price) ||
        item.product_id <= 0 ||
        item.quantity <= 0 ||
        item.price <= 0
      )
    ) {
      console.error("All fields must contain valid positive numbers");
      return;
    }

    try {
      await axiosInstance.post(`${apiUrl}/purchase-orders`, {
        order_date,
        supplier_id,
        status,
        remarks,
        items: validatedItems,
        purchase_request_id
      });
      
      await fetchData();
      setNewOrder({
        order_date: new Date().toISOString().split("T")[0],
        supplier_id: "",
        status: "Pending",
        remarks: "",
        purchase_request_id: "",
        items: []
      });
      setSelectedRequest(null);
    } catch (error) {
      console.error("Error creating order:", error.response?.data || error.message);
    }
  };

  const fetchGRNs = async (orderId) => {
    try {
      const response = await axiosInstance.get(`${apiUrl}/purchase-orders/${orderId}/grns`);
      setGRNs(response.data.grns || []); // <-- Change 'grn' to 'grns'
    } catch (error) {
      console.error("Error fetching GRNs:", error);
      setGRNs([]); // <-- Reset to empty array on error
    }
  };
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axiosInstance.put(`${apiUrl}/purchase-orders/${orderId}`, { status: newStatus });
      fetchData();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleCreateGRN = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post(`${apiUrl}/grns`, {
        ...newGRN,
        order_id: selectedOrder.id
      });
      await fetchData();
      setNewGRN({
        received_date: new Date().toISOString().split("T")[0],
        received_by: "",
        condition: "Good",
        notes: ""
      });
      setSelectedOrder(null);
    } catch (error) {
      console.error("Error creating GRN:", error);
    }
  };

  return (
<>
<div className="p-6 " style={{ backgroundColor: "#FFFFFF", color: "#47464C" }}>
      <div className="">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: "#993F82" }}>Purchase Order Management</h1>
          <div className="h-1 w-20" style={{ backgroundColor: "#993F82" }}></div>
        </header>

        {/* Create Order Section */}
        <section className="bg-white rounded-lg  p-6 mb-8 ">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="material-icons" style={{ color: "#993F82" }}>add_circle</span>
            Create New Purchase Order
          </h2>
          
          <form onSubmit={handleOrderSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium">Approved Request</label>
                <select
                  value={newOrder.purchase_request_id}
                  onChange={(e) => handleRequestSelect(Number(e.target.value))}
                  className="w-full p-2 rounded border focus:ring-2 focus:ring-purple-500"
                  style={{ borderColor: "#993F82" }}
                >
                  <option value="">Select an approved request</option>
                  {approvedRequests.map(request => (
                    <option key={request.id} value={request.id}>
                      Request #{request.id} - {request.requested_by} ({request.request_date})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {selectedRequest && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Order Date</label>
                  <input
                    type="date"
                    value={newOrder.order_date}
                    onChange={(e) => setNewOrder({ ...newOrder, order_date: e.target.value })}
                    required
                    className="w-full p-2 rounded border focus:ring-2 focus:ring-purple-500"
                    style={{ borderColor: "#993F82" }}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Supplier ID</label>
                  <input
                    type="text"
                    value={newOrder.supplier_id}
                    onChange={(e) => setNewOrder({ ...newOrder, supplier_id: e.target.value })}
                    required
                    className="w-full p-2 rounded border focus:ring-2 focus:ring-purple-500"
                    style={{ borderColor: "#993F82" }}
                  />
                </div>
              </div>
            )}

            {/* Items Grid */}
            {newOrder.items.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Order Items</h3>
                <div className="grid grid-cols-3 gap-4 font-medium text-sm">
                  <span>Product ID</span>
                  <span>Quantity</span>
                  <span>Unit Price</span>
                </div>
                {newOrder.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-3 gap-4">
                    <input
                      type="number"
                      value={item.product_id}
                      readOnly
                      className="p-2 rounded bg-gray-50"
                    />
                    <input
                      type="number"
                      value={item.quantity}
                      readOnly
                      className="p-2 rounded bg-gray-50"
                    />
                    <input
                      type="number"
                      placeholder="Enter price"
                      value={item.price}
                      onChange={(e) => handleItemChange(index, "price", e.target.value)}
                      required
                      min="0.01"
                      step="0.01"
                      className="p-2 rounded border focus:ring-2 focus:ring-purple-500"
                      style={{ borderColor: "#993F82" }}
                    />
                  </div>
                ))}
              </div>
            )}

            <button
              type="submit"
              className="w-full md:w-auto px-6 py-2 rounded font-medium hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "#993F82", color: "#FFFFFF" }}
            >
              Submit Purchase Order
            </button>
          </form>
        </section>

        {/* Existing Orders Section */}
        <section className="bg-white rounded-lg shadow-lg p-6 border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <span className="material-icons" style={{ color: "#993F82" }}>list_alt</span>
              Purchase Order History
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr style={{ backgroundColor: "#993F82", color: "#FFFFFF" }}>
                  {['Order ID', 'Date', 'Supplier', 'Status', 'Total', 'Actions'].map((header) => (
                    <th key={header} className="p-3 text-left text-sm font-semibold">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50 border-b">
                    <td className="p-3">{order.id}</td>
                    <td className="p-3">{new Date(order.order_date).toLocaleDateString()}</td>
                    <td className="p-3">{order.supplier_id}</td>
                    <td className="p-3">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="px-2 py-1 rounded focus:ring-2 focus:ring-purple-500"
                        style={{ 
                          backgroundColor: order.status === 'Pending' ? '#F3E8FF' : 
                                          order.status === 'Received' ? '#DCFCE7' : 
                                          order.status === 'Completed' ? '#D1FAE5' : '#FEF3C7',
                          color: "#47464C"
                        }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Open">Open</option>
                        <option value="Received">Received</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                    <td className="p-3 font-medium">
                      ${order.items?.reduce((sum, item) => sum + (item.quantity * (item.price || 0)), 0).toFixed(2)}
                    </td>
                    <td className="p-3">
                      {order.status === 'Open' && (
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            fetchGRNs(order.id);
                          }}
                          className="hover:text-purple-700 transition-colors"
                          style={{ color: "#993F82" }}
                        >
                          Create GRN
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* GRN Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
              <div className="p-6 border-b flex justify-between items-center">
                <h3 className="text-xl font-semibold">Goods Received Note</h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
              
              <form onSubmit={handleCreateGRN} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Received Date</label>
                    <input
                      type="date"
                      value={newGRN.received_date}
                      onChange={(e) => setNewGRN({...newGRN, received_date: e.target.value})}
                      className="w-full p-2 rounded border focus:ring-2 focus:ring-purple-500"
                      style={{ borderColor: "#993F82" }}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Received By</label>
                    <input
                      type="text"
                      value={newGRN.received_by}
                      onChange={(e) => setNewGRN({...newGRN, received_by: e.target.value})}
                      className="w-full p-2 rounded border focus:ring-2 focus:ring-purple-500"
                      style={{ borderColor: "#993F82" }}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Condition</label>
                    <select
                      value={newGRN.condition}
                      onChange={(e) => setNewGRN({...newGRN, condition: e.target.value})}
                      className="w-full p-2 rounded border focus:ring-2 focus:ring-purple-500"
                      style={{ borderColor: "#993F82" }}
                    >
                      <option value="Good">Good</option>
                      <option value="Damaged">Damaged</option>
                      <option value="Partial">Partial</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">Notes</label>
                  <textarea
                    value={newGRN.notes}
                    onChange={(e) => setNewGRN({...newGRN, notes: e.target.value})}
                    className="w-full p-2 rounded border focus:ring-2 focus:ring-purple-500"
                    style={{ borderColor: "#993F82" }}
                    rows="3"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setSelectedOrder(null)}
                    className="px-4 py-2 rounded border hover:bg-gray-50"
                    style={{ color: "#47464C" }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded font-medium hover:opacity-90"
                    style={{ backgroundColor: "#993F82", color: "#FFFFFF" }}
                  >
                    Generate GRN Document
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* GRN List Section */}
        {selectedOrder && grns?.length > 0 && (
          <section className="mt-8 bg-white rounded-lg shadow-lg p-6 border">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="material-icons" style={{ color: "#993F82" }}>assignment</span>
              Goods Received Notes
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr style={{ backgroundColor: "#993F82", color: "#FFFFFF" }}>
                    <th className="p-3 text-left text-sm font-semibold">GRN ID</th>
                    <th className="p-3 text-left text-sm font-semibold">Order ID</th>
                    <th className="p-3 text-left text-sm font-semibold">Received Date</th>
                    <th className="p-3 text-left text-sm font-semibold">Received By</th>
                    <th className="p-3 text-left text-sm font-semibold">Condition</th>
                    <th className="p-3 text-left text-sm font-semibold">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {grns.map(grn => (
                    <tr key={grn.id} className="hover:bg-gray-50 border-b">
                      <td className="p-3">{grn.id}</td>
                      <td className="p-3">{grn.order_id}</td>
                      <td className="p-3">{new Date(grn.received_date).toLocaleDateString()}</td>
                      <td className="p-3">{grn.received_by}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded ${
                          grn.condition === 'Good' ? 'bg-green-100 text-green-800' :
                          grn.condition === 'Damaged' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {grn.condition}
                        </span>
                      </td>
                      <td className="p-3 max-w-xs truncate">{grn.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </div>
</>
  );
};

export default PurchaseOrder;
