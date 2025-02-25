const db = require('../config/db');  

const validateCategory = (req, res, next) => {
  const { name } = req.body;
  const { id } = req.params; // For updating a category, get the category ID from params
  if (!name) {
    return res.status(400).json({ message: 'Category name is required' });
  }

  const query = id
    ? 'SELECT * FROM categories WHERE name = ? AND id != ?'  
    : 'SELECT * FROM categories WHERE name = ?';  // Check uniqueness for a new category

  db.query(query, [name, id || null], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error checking category name uniqueness', error: err.message });
    }

    if (results.length > 0) {
      return res.status(400).json({ message: 'Category name already exists' });
    }

    next();  // Proceed to the next middleware or route handler if no issues
  });
};

module.exports = validateCategory;
