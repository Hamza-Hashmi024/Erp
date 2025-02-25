import { useEffect, useState } from "react";
import axios from "axios";
import axiosInstance from "../AxiosInstance";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterSupplier, setFilterSupplier] = useState("");
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    description: "",
    selling_price: "",
    purchase_price: "",
    stock_quantity: "",
    reorder_level: "",
    expiry_date: "",
    category_id: "",
    supplier_id: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;

  // Fetch products, categories, and suppliers
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, categoryRes, supplierRes] = await Promise.all([
          axiosInstance.get(`${apiUrl}/products`),
          axiosInstance.get(`${apiUrl}/categories`),
          axiosInstance.get(`${apiUrl}/suppliers`),
        ]);
        setProducts(productRes.data);
        setCategories(categoryRes.data);
        setSuppliers(supplierRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [apiUrl]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle product form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axiosInstance.put(`${apiUrl}/products/${formData.id}`, formData);
      } else {
        await axiosInstance.post(`${apiUrl}/products`, formData);
      }
      setProducts((prev) =>
        isEditing
          ? prev.map((prod) => (prod.id === formData.id ? formData : prod))
          : [...prev, formData]
      );
      resetForm();
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  // Reset the form
  const resetForm = () => {
    setFormData({
      id: null,
      name: "",
      description: "",
      selling_price: "",
      purchase_price: "",
      stock: "",
      reorder_level: "",
      expiry_date: "",
      category: "",
      supplier: "",
    });
    setIsEditing(false);
  };

  // Handle edit
  const handleEdit = (product) => {
    setFormData(product);
    setIsEditing(true);
  };

  // Filtered products
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.id.toString().includes(searchTerm);
    const matchesCategory = filterCategory
      ? product.category_id.toString() === filterCategory
      : true;
    const matchesSupplier = filterSupplier
      ? product.supplier_id.toString() === filterSupplier
      : true;

    return matchesSearch && matchesCategory && matchesSupplier;
  });

  return (
    <div className="p-6" style={{ backgroundColor: "#FFFF", color: "#47464C" }}>
       <header className="mb-8">
          <h1 className="text-2xl font-bold mb-2" style={{ color: "#993F82" }}>Product Managment</h1>
          <div className="h-1 w-20" style={{ backgroundColor: "#993F82" }}></div>
        </header>

      {/* Product Form */}
      <form onSubmit={handleFormSubmit} className="mb-6">
      <div className="grid grid-cols-3 gap-4">
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleInputChange}
          required
          className="border px-4 py-2 rounded"
        />
        <textarea
          name="description"
          placeholder="Product Description"
          value={formData.description}
          onChange={handleInputChange}
          className="border px-4 py-2 rounded"
        />
        <input
          type="number"
          name="selling_price"
          placeholder="Selling Price"
          value={formData.selling_price}
          onChange={handleInputChange}
          required
          className="border px-4 py-2 rounded"
        />
        <input
          type="number"
          name="purchase_price"
          placeholder="Purchase Price"
          value={formData.purchase_price}
          onChange={handleInputChange}
          required
          className="border px-4 py-2 rounded"
        />
        <input
          type="number"
          name="stock_quantity"
          placeholder="Stock Quantity"
          value={formData.stock_quantity}
          onChange={handleInputChange}
          required
          className="border px-4 py-2 rounded"
        />
        <input
          type="number"
          name="reorder_level"
          placeholder="Reorder Level"
          value={formData.reorder_level}
          onChange={handleInputChange}
          required
          className="border px-4 py-2 rounded"
        />
        <input
          type="date"
          name="expiry_date"
          value={formData.expiry_date}
          onChange={handleInputChange}
          className="border px-4 py-2 rounded"
        />
        <select
          name="category_id"
          value={formData.category_id}
          onChange={handleInputChange}
          required
          className="border px-4 py-2 rounded"
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <select
          name="supplier_id"
          value={formData.supplier_id}
          onChange={handleInputChange}
          required
          className="border px-4 py-2 rounded"
        >
          <option value="">Select Supplier</option>
          {suppliers.map((supplier) => (
            <option key={supplier.id} value={supplier.id}>
              {supplier.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-4">
        <button
          type="submit"
          className="px-4 py-2 rounded mr-2"
          style={{ backgroundColor: "#993F82", color: "#FFFF" }}
        >
          {isEditing ? "Update Product" : "Add Product"}
        </button>
        {isEditing && (
          <button
            type="button"
            onClick={resetForm}
            className="px-4 py-2 rounded"
            style={{ backgroundColor: "#47464C", color: "#FFFF" }}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
      {/* Search and Filters */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by Name or ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-4 py-2 rounded w-full"
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="border px-4 py-2 rounded"
        >
          <option value="">Filter by Category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <select
          value={filterSupplier}
          onChange={(e) => setFilterSupplier(e.target.value)}
          className="border px-4 py-2 rounded"
        >
          <option value="">Filter by Supplier</option>
          {suppliers.map((supplier) => (
            <option key={supplier.id} value={supplier.id}>
              {supplier.name}
            </option>
          ))}
        </select>
      </div>

      {/* Product Table */}
      <table className="w-full text-left border">
        <thead style={{ backgroundColor: "#993F82", color: "#FFFF" }}>
          <tr>
          <th className="p-2">Product_Id</th>
            <th className="p-2">Name</th>
            <th className="p-2">Description</th>
            <th className="p-2">Category</th>
            <th className="p-2">Selling Price</th>
            <th className="p-2">Purchase Price</th>
            <th className="p-2">Supplier</th>
            <th className="p-2">Stock</th>
            <th className="p-2">Reorder Level</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product.id} className="border-t">
               <td className="p-2">{product.id}</td>
              <td className="p-2">{product.name}</td>
              <td className="p-2">{product.description}</td>
              <td className="p-2">{product.category_id}</td>
              <td className="p-2">{product.selling_price}</td>
              <td className="p-2">{product.purchase_price}</td>
              <td className="p-2">{product.supplier_id}</td>
              <td className="p-2">{product.stock_quantity}</td>
              <td className="p-2">{product.reorder_level}</td>
              <td className="p-2">
                <button
                  onClick={() => handleEdit(product)}
                  className="px-3 py-1 rounded"
                  style={{ backgroundColor: "#993F82", color: "#FFFF" }}
                >
                  Edit
                </button>
                <button
                  onClick={async () => {
                    try {
                      await axios.delete(`${apiUrl}/products/${product.id}`);
                      setProducts((prev) =>
                        prev.filter((prod) => prod.id !== product.id)
                      );
                    } catch (error) {
                      console.error("Error deleting product:", error);
                    }
                  }}
                  className="px-3 py-1 rounded"
                  style={{ backgroundColor: "#47464C", color: "#FFFF" }}
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

export default ProductManagement;
