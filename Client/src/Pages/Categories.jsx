import { useEffect, useState } from "react";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import axiosInstance from '../AxiosInstance';  

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [editingCategory, setEditingCategory] = useState(null);

  const apiUrl = "http://localhost:5000/api/categories";

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get(apiUrl);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission (Add or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await axiosInstance.put(`${apiUrl}/${editingCategory.id}`, formData);
      } else {
        await axiosInstance.post(apiUrl, formData);
      }
      setFormData({ name: "", description: "" });
      setEditingCategory(null);
      setIsModalOpen(false);
      fetchCategories();
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  // Handle delete category
  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`${apiUrl}/${id}`);
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  // Open modal for editing
  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({ name: category.name, description: category.description });
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="p-6 bg-[#FFFFF] text-[#47464C]">
       <header className="mb-8">
          <h1 className="text-2xl font-bold mb-2" style={{ color: "#993F82" }}>Categories Management</h1>
          <div className="h-1 w-20" style={{ backgroundColor: "#993F82" }}></div>
        </header>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-[#993F82] text-white px-4 py-2 rounded mb-4"
      >
        Add New Category
      </button>
      <table className="w-full text-left border">
        <thead className="bg-[#993F82] text-white">
          <tr>
            <th className="p-2">Name</th>
            <th className="p-2">Description</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id} className="border-t hover:bg-[#993F82] hover:text-white">
              <td className="p-2">{category.name}</td>
              <td className="p-2">{category.description}</td>
              <td className="p-2 flex gap-2">
                <button
                  onClick={() => handleEdit(category)}
                  className="text-[#993F82] hover:text-[#FFFFF]"
                >
                  <AiFillEdit size={20} />
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="text-red-600 hover:text-[#FFFFF]"
                >
                  <AiFillDelete size={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-96">
            <h2 className="text-xl font-bold mb-4">
              {editingCategory ? "Edit Category" : "Add Category"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full border px-3 py-2 rounded"
                  required
                ></textarea>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-[#47464C] text-white rounded">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
