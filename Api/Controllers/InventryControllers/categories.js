const db = require('../../config/db');  

// Create a new category
exports.createCategory = (req, res) => {
  const { name, description } = req.body;
  const query = 'INSERT INTO categories (name, description) VALUES (?, ?)';
  
  db.query(query, [name, description], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error creating category', error: err.message });
    }
    return res.status(201).json({ message: 'Category created successfully', categoryId: results.insertId });
  });
};

// Get all categories
exports.getCategories = (req, res) => {
  const query = 'SELECT * FROM categories';
  
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching categories', error: err.message });
    }
    return res.status(200).json(results);
  });
};

// Get category by ID
exports.getCategoryById = (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM categories WHERE id = ?';
  
  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching category', error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }
    return res.status(200).json(results[0]);
  });
};

// Update category
exports.updateCategory = (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  const query = 'UPDATE categories SET name = ?, description = ? WHERE id = ?';
  
  db.query(query, [name, description, id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error updating category', error: err.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }
    return res.status(200).json({ message: 'Category updated successfully' });
  });
};

// Delete category
exports.deleteCategory = (req, res) => {
    const { id } = req.params;
  
    // First, check if there are products associated with this category
    const checkProductsQuery = 'SELECT * FROM products WHERE category_id = ?';
  
    db.query(checkProductsQuery, [id], (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Error checking products', error: err.message });
      }
  
      if (results.length > 0) {
        // If products are associated, update their category_id to NULL
        const updateProductsQuery = 'UPDATE products SET category_id = NULL WHERE category_id = ?';
  
        db.query(updateProductsQuery, [id], (err, updateResults) => {
          if (err) {
            return res.status(500).json({ message: 'Error updating products', error: err.message });
          }
  
          // After updating products, delete the category
          const deleteCategoryQuery = 'DELETE FROM categories WHERE id = ?';
  
          db.query(deleteCategoryQuery, [id], (err, deleteResults) => {
            if (err) {
              return res.status(500).json({ message: 'Error deleting category', error: err.message });
            }
  
            if (deleteResults.affectedRows === 0) {
              return res.status(404).json({ message: 'Category not found' });
            }
  
            return res.status(200).json({
              message: 'Category deleted successfully, products updated to NULL',
              updatedProducts: updateResults.affectedRows,
            });
          });
        });
      } else {
        // If no products are associated, directly delete the category
        const deleteCategoryQuery = 'DELETE FROM categories WHERE id = ?';
  
        db.query(deleteCategoryQuery, [id], (err, results) => {
          if (err) {
            return res.status(500).json({ message: 'Error deleting category', error: err.message });
          }
  
          if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Category not found' });
          }
  
          return res.status(200).json({ message: 'Category deleted successfully' });
        });
      }
    });
  };
  
