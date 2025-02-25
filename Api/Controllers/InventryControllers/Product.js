const db = require('../../config/db');  

// Create a new product
exports.createProduct = (req, res) => {
  const {
    name, description,selling_price, stock_quantity, reorder_level, expiry_date, category_id, supplier_id, purchase_price, } = req.body;

  // Validate required fields
  if (!name || !selling_price || !purchase_price || stock_quantity === undefined || !reorder_level) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // SQL query to insert product
  const query = `
    INSERT INTO products (name, description, selling_price, stock_quantity, reorder_level, expiry_date, category_id, supplier_id, purchase_price) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  // Log request body for debugging
  console.log("Product Data Received:", req.body);

  // Execute the query
  db.query(
    query,
    [name, description, selling_price, stock_quantity, reorder_level, expiry_date, category_id, supplier_id, purchase_price],
    (err, results) => {
      if (err) {
        console.error("Error executing query:", err); // Log detailed error for debugging
        return res.status(500).json({
          message: "Error creating product",
          error: err.message,
        });
      }

      // Respond with success
      return res.status(201).json({
        message: "Product created successfully",
        productId: results.insertId,
      });
    }
  );
};


// Get all products
exports.getAllProducts = (req, res) => {
  const query = 'SELECT * FROM products';

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching products', error: err.message });
    }
    return res.status(200).json(results);
  });
};

// Get product by ID
exports.getProductById = (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM products WHERE id = ?';

  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching product', error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    return res.status(200).json(results[0]);
  });
};

// Update a product
exports.updateProduct = (req, res) => {
  const { id } = req.params;
  const { name, description, selling_price, stock_quantity, reorder_level, expiry_date, category_id, supplier_id, purchase_price } = req.body;

  const query = `
    UPDATE products SET 
    name = ?, description = ?, selling_price = ?, stock_quantity = ?, reorder_level = ?, expiry_date = ?, category_id = ?, supplier_id = ?, purchase_price = ?
    WHERE id = ?`;

  db.query(query, [name, description, selling_price, stock_quantity, reorder_level, expiry_date, category_id, supplier_id, purchase_price, id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error updating product', error: err.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    return res.status(200).json({ message: 'Product updated successfully' });
  });
};

// Delete a product
exports.deleteProduct = (req, res) => {
    const { id } = req.params;
  
    // Step 1: Delete related sale items
    const deleteSaleItemsQuery = 'DELETE FROM sale_items WHERE product_id = ?';
    db.query(deleteSaleItemsQuery, [id], (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Error deleting related sale items', error: err.message });
      }
  
      // Step 2: Delete the product
      const deleteProductQuery = 'DELETE FROM products WHERE id = ?';
      db.query(deleteProductQuery, [id], (err, results) => {
        if (err) {
          return res.status(500).json({ message: 'Error deleting product', error: err.message });
        }
        if (results.affectedRows === 0) {
          return res.status(404).json({ message: 'Product not found' });
        }
        return res.status(200).json({ message: 'Product and related sale items deleted successfully' });
      });
    });
  };
