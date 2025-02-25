import { useEffect, useState } from "react";
import axiosInstance from "../AxiosInstance";

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    contact: "",
    email: "",
    address: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;

  // Fetch all suppliers
  const fetchSuppliers = async () => {
    try {
      const response = await axiosInstance.get(`${apiUrl}/suppliers`);
      setSuppliers(response.data);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        // Update supplier
        await axiosInstance.put(`${apiUrl}/suppliers/${formData.id}`, formData);
      } else {
        // Add new supplier
        await axiosInstance.post(`${apiUrl}/suppliers`, formData);
      }
      fetchSuppliers();
      resetForm();
    } catch (error) {
      console.error("Error saving supplier:", error);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      id: null,
      name: "",
      contact: "",
      email: "",
      address: "",
    });
    setIsEditing(false);
  };

  // Handle edit button
  const handleEdit = (supplier) => {
    setFormData(supplier);
    setIsEditing(true);
  };

  // Handle delete button
  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`${apiUrl}/suppliers/${id}`);
      fetchSuppliers();
    } catch (error) {
      console.error("Error deleting supplier:", error);
    }
  };

  return (
    <div className="p-6 bg-[#FFFFF] text-[#47464C]">
    <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: "#993F82" }}>Supplier Management</h1>
          <div className="h-1 w-20" style={{ backgroundColor: "#993F82" }}></div>
        </header>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-4 bg-[#FFFFF] shadow-md p-4 rounded-md">
        <h2 className="text-xl font-semibold text-[#993F82] mb-2">
          {isEditing ? "Edit Supplier" : "Add New Supplier"}
        </h2>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="border px-4 py-2 rounded w-full"
          />
          <input
            type="text"
            placeholder="Contact"
            value={formData.contact}
            onChange={(e) =>
              setFormData({ ...formData, contact: e.target.value })
            }
            required
            className="border px-4 py-2 rounded w-full"
          />
        </div>
        <div className="flex gap-4">
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
            className="border px-4 py-2 rounded w-full"
          />
          <input
            type="text"
            placeholder="Address"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            required
            className="border px-4 py-2 rounded w-full"
          />
        </div>
        <div className="flex gap-4">
          <button
            type="submit"
            className={`px-4 py-2 rounded text-white ${
              isEditing ? "bg-[#993F82]" : "bg-[#383a38]"
            }`}
          >
            {isEditing ? "Update Supplier" : "Add Supplier"}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 bg-gray-500 text-white rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Supplier List */}
      <table className="w-full text-left border border-collapse">
        <thead className="bg-[#993F82] text-white">
          <tr>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Contact</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Address</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((supplier) => (
            <tr key={supplier.id} className="border-t hover:bg-gray-100">
              <td className="p-2 border">{supplier.name}</td>
              <td className="p-2 border">{supplier.contact}</td>
              <td className="p-2 border">{supplier.email}</td>
              <td className="p-2 border">{supplier.address}</td>
              <td className="p-2 border flex gap-2">
                <button
                  onClick={() => handleEdit(supplier)}
                  className="bg-[#993F82] text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(supplier.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Suppliers;
