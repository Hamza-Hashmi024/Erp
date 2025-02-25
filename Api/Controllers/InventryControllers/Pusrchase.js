// Backend: controllers/purchaseController.js
const db = require('../../config/db');

// Create a new purchase request
exports.createPurchaseRequest = (req, res) => {
    const { request_date, requested_by, status, remarks, items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: 'Items are required and must be a non-empty array.' });
    }

    const query = 'INSERT INTO purchase_requests (request_date, requested_by, status, remarks) VALUES (?, ?, ?, ?)';
    db.query(query, [request_date, requested_by, status, remarks], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error creating purchase request', error: err.message });
        }

        const requestId = results.insertId;

        // Insert purchase items
        const itemsQuery = 'INSERT INTO purchase_items (purchase_id, product_id, quantity) VALUES ?';
        const itemsValues = items.map(item => [requestId, item.product_id, item.quantity]);

        db.query(itemsQuery, [itemsValues], (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error adding items to purchase request', error: err.message });
            }

            return res.status(201).json({ message: 'Purchase request created successfully', requestId });
        });
    });
};

// Create a new purchase order
exports.createPurchaseOrder = (req, res) => {
    const { order_date, supplier_id, status, remarks, items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: 'Items are required and must be a non-empty array.' });
    }

    const query = 'INSERT INTO purchase_orders (order_date, supplier_id, status, remarks) VALUES (?, ?, ?, ?)';
    db.query(query, [order_date, supplier_id, status, remarks], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error creating purchase order', error: err.message });
        }

        const orderId = results.insertId;

        // Insert purchase items
        const itemsQuery = 'INSERT INTO purchase_items (purchase_id, product_id, quantity, price) VALUES ?';
        const itemsValues = items.map(item => [orderId, item.product_id, item.quantity, item.price]);

        db.query(itemsQuery, [itemsValues], (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error adding items to purchase order', error: err.message });
            }

            return res.status(201).json({ message: 'Purchase order created successfully', orderId });
        });
    });
};

// Get all purchase requests
exports.getPurchaseRequests = (req, res) => {
    const query = `
      SELECT pr.*, GROUP_CONCAT(JSON_OBJECT('product_id', pi.product_id, 'quantity', pi.quantity)) AS items
      FROM purchase_requests pr
      LEFT JOIN purchase_items pi ON pr.id = pi.purchase_id
      GROUP BY pr.id
    `;

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching purchase requests', error: err.message });
        }
        results.forEach(r => {
            r.items = r.items ? JSON.parse(`[${r.items}]`) : [];
        });
        return res.status(200).json({ message: 'Purchase requests fetched successfully', requests: results });
    });
};

// Get all purchase orders
exports.getPurchaseOrders = (req, res) => {
    const query = `
      SELECT po.*, GROUP_CONCAT(JSON_OBJECT('product_id', pi.product_id, 'quantity', pi.quantity, 'price', pi.price)) AS items
      FROM purchase_orders po
      LEFT JOIN purchase_items pi ON po.id = pi.purchase_id
      GROUP BY po.id
    `;

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching purchase orders', error: err.message });
        }
        results.forEach(r => {
            r.items = r.items ? JSON.parse(`[${r.items}]`) : [];
        });
        return res.status(200).json({ message: 'Purchase orders fetched successfully', orders: results });
    });
};


// Update purchase request status
exports.updatePurchaseRequestStatus = (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
  
    const query = 'UPDATE purchase_requests SET status = ? WHERE id = ?';
    db.query(query, [status, id], (err, result) => {
      if (err) {
        return res.status(500).json({ 
          message: 'Error updating status',
          error: err.message
        });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Purchase request not found' });
      }
      return res.status(200).json({ message: 'Status updated successfully' });
    });
  };

// In purchaseController.js
// Add new endpoint to get approved requests
exports.getApprovedRequests = (req, res) => {
    const query = `
      SELECT pr.*, GROUP_CONCAT(JSON_OBJECT('product_id', pi.product_id, 'quantity', pi.quantity)) AS items
      FROM purchase_requests pr
      LEFT JOIN purchase_items pi ON pr.id = pi.purchase_id
      WHERE pr.status = 'Approved'
      GROUP BY pr.id
    `;
  
    db.query(query, (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Error fetching approved requests', error: err.message });
      }
      results.forEach(r => {
        r.items = r.items ? JSON.parse(`[${r.items}]`) : [];
      });
      return res.status(200).json({ requests: results });
    });
  };
  
  // Update createPurchaseOrder to handle request linkage
  exports.createPurchaseOrder = (req, res) => {
    const { order_date, supplier_id, status, remarks, items, purchase_request_id } = req.body;
  
    const query = `
      INSERT INTO purchase_orders 
      (order_date, supplier_id, status, remarks, purchase_request_id) 
      VALUES (?, ?, ?, ?, ?)
    `;
  
    db.query(query, 
      [order_date, supplier_id, status, remarks, purchase_request_id],
      (err, results) => {
        // ... rest of the existing implementation ...
      }
    );
  };


 

  exports.createGRN = (req, res) => {
    const { order_id, received_date, received_by, condition, notes } = req.body;

    if (!order_id || !received_date || !received_by || !condition) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    // Start transaction
    db.beginTransaction((beginErr) => {
        if (beginErr) {
            return res.status(500).json({ 
                message: 'Transaction start failed', 
                error: beginErr.message 
            });
        }

        // 1. Update order status
        db.query(
            'UPDATE purchase_orders SET status = "Received" WHERE id = ?',
            [order_id],
            (updateErr) => {
                if (updateErr) {
                    return db.rollback(() => {
                        res.status(500).json({ 
                            message: 'Order status update failed', 
                            error: updateErr.message 
                        });
                    });
                }

                // 2. Insert GRN record - FIXED COLUMN NAME
                db.query(
                    `INSERT INTO goods_received_notes 
                    (order_id, received_date, received_by, item_condition, notes)
                    VALUES (?, ?, ?, ?, ?)`, // Changed 'condition' to 'item_condition'
                    [order_id, received_date, received_by, condition, notes],
                    (insertErr, results) => {
                        if (insertErr) {
                            return db.rollback(() => {
                                res.status(500).json({ 
                                    message: 'GRN creation failed', 
                                    error: insertErr.message 
                                });
                            });
                        }

                        // Commit transaction
                        db.commit((commitErr) => {
                            if (commitErr) {
                                return db.rollback(() => {
                                    res.status(500).json({ 
                                        message: 'Transaction commit failed', 
                                        error: commitErr.message 
                                    });
                                });
                            }

                            res.status(201).json({ 
                                message: 'GRN created successfully', 
                                grnId: results.insertId 
                            });
                        });
                    }
                );
            }
        );
    }); 
};
  

// Get GRNs for an order - FIXED VERSION
exports.getGRNs = (req, res) => {
  const { orderId } = req.params;

  const query = `
    SELECT * FROM goods_received_notes 
    WHERE order_id = ?
    ORDER BY received_date DESC
  `;

  db.query(query, [orderId], (err, results) => {
    if (err) {
      return res.status(500).json({ 
        message: 'Error fetching GRNs', 
        error: err.message 
      });
    }
    
    // Send response with 'grns' array
    res.status(200).json({ 
      grns: results // <-- Make sure this is 'grns' (plural)
    });
  });
};



exports.updatePurchaseOrderStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const query = 'UPDATE purchase_orders SET status = ? WHERE id = ?';
  db.query(query, [status, id], (err, result) => {
      if (err) {
          return res.status(500).json({ message: 'Error updating order status', error: err.message });
      }
      if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'Purchase order not found' });
      }
      return res.status(200).json({ message: 'Order status updated successfully' });
  });
};
 
// filter data by date  recived by condition and order id 
exports.getFilteredGRNs = async (req, res) => {
  const { 
    startDate, 
    endDate, 
    receivedBy, 
    condition, 
    orderId,
    sortBy,
    sortOrder
  } = req.query;

  let query = 'SELECT * FROM goods_received_notes WHERE 1=1';
  const params = [];

  if (startDate) {
    query += ' AND received_date >= ?';
    params.push(startDate);
  }
  if (endDate) {
    query += ' AND received_date <= ?';
    params.push(endDate);
  }
  if (receivedBy) {
    query += ' AND received_by LIKE ?';
    params.push(`%${receivedBy}%`);
  }
  if (condition) {
    query += ' AND item_condition = ?';
    params.push(condition);
  }
  if (orderId) {
    query += ' AND order_id = ?';
    params.push(orderId);
  }

  if (sortBy) {
    const validSortColumns = ['received_date', 'received_by', 'item_condition', 'order_id'];
    const validSortOrder = ['asc', 'desc'];
    
    if (validSortColumns.includes(sortBy) && validSortOrder.includes(sortOrder?.toLowerCase())) {
      query += ` ORDER BY ${sortBy} ${sortOrder}`;
    }
  }

  try {
    const [results] = await db.promise().query(query, params);
    res.status(200).json({ grns: results });
  } catch (err) {
    res.status(500).json({ 
      message: 'Error fetching filtered GRNs',
      error: err.message 
    });
  }
};

