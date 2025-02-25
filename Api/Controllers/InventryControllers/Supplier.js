const db = require('../../config/db');  


// Get all suppliers
exports.getAllSuppliers = (req, res) => {
  const query = 'SELECT * FROM suppliers';

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching suppliers', error: err.message });
    }
    return res.status(200).json(results);
  });
};

// Create a new supplier
exports.createSupplier = (req, res) => {
  const { name, contact, email, address } = req.body;

  const query = 'INSERT INTO suppliers (name, contact, email, address) VALUES (?, ?, ?, ?)';

  db.query(query, [name, contact, email, address], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error adding supplier', error: err.message });
    }
    return res.status(201).json({ message: 'Supplier added successfully', supplierId: results.insertId });
  });
};

// Update a supplier
exports.updateSupplier = (req, res) => {
  const { id } = req.params;
  const { name, contact, email, address } = req.body;

  const query = 'UPDATE suppliers SET name = ?, contact = ?, email = ?, address = ? WHERE id = ?';

  db.query(query, [name, contact, email, address, id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error updating supplier', error: err.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    return res.status(200).json({ message: 'Supplier updated successfully' });
  });
};

// Delete a supplier
exports.deleteSupplier = (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM suppliers WHERE id = ?';

  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error deleting supplier', error: err.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    return res.status(200).json({ message: 'Supplier deleted successfully' });
  });
};

// Get supplier by ID or name
exports.getSupplierByFilter = (req, res) => {
  const { id, name } = req.query;

  let query = "SELECT * FROM suppliers";
  const queryParams = [];

  if (id) {
    query += " WHERE id = ?";
    queryParams.push(id);
  } else if (name) {
    query += " WHERE name LIKE ?";
    queryParams.push(`%${name}%`);
  }

  db.query(query, queryParams, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error fetching supplier", error: err.message });
    }
    return res.status(200).json(results);
  });
};
