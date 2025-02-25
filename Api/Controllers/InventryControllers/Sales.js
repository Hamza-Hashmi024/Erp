const db = require('../../config/db');  

// Fetch all sales records
exports.getAllSales = (req, res) => {
  const query = 'SELECT * FROM sales';

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching sales records', error: err.message });
    }
    return res.status(200).json(results);
  });
};
// Record a new sale
exports.createSale = (req, res) => {
  const { sale_date, customer_name, total_amount, sale_items } = req.body;

  // Validate sale_items
  if (!sale_items || !Array.isArray(sale_items) || sale_items.length === 0) {
    return res.status(400).json({ message: "Sale items are required and cannot be empty." });
  }

  // Validate each sale item
  const invalidItems = sale_items.filter(
    (item) => !item.product_id || item.quantity <= 0 || item.price <= 0
  );

  if (invalidItems.length > 0) {
    return res.status(400).json({
      message: "Some sale items have invalid data.",
      invalidItems,
    });
  }

  // Proceed to validate products
  const productIds = sale_items.map((item) => item.product_id);
  const validateProductsQuery = "SELECT id FROM products WHERE id IN (?)";

  db.query(validateProductsQuery, [productIds], (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error validating products", error: err.message });
    }

    const validProductIds = results.map((product) => product.id);
    const invalidProductIds = productIds.filter(
      (id) => !validProductIds.includes(id)
    );

    if (invalidProductIds.length > 0) {
      return res.status(400).json({
        message: "Invalid product IDs",
        invalidProductIds,
      });
    }

    // Insert sale and sale items
    const query = "INSERT INTO sales (sale_date, customer_name, total_amount) VALUES (?, ?, ?)";
    db.query(query, [sale_date, customer_name, total_amount], (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Error recording sale", error: err.message });
      }

      const saleId = results.insertId;

      const saleItemsQuery = "INSERT INTO sale_items (sale_id, product_id, quantity, price) VALUES ?";
      const saleItemsValues = sale_items.map((item) => [
        saleId,
        item.product_id,
        item.quantity,
        item.price,
      ]);

      db.query(saleItemsQuery, [saleItemsValues], (err) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Error recording sale items", error: err.message });
        }

        // Update stock
        sale_items.forEach((item) => {
          const updateStockQuery =
            "UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?";
          db.query(updateStockQuery, [item.quantity, item.product_id], (err) => {
            if (err) {
              console.error(
                "Error updating stock for product ID " + item.product_id,
                err.message
              );
            }
          });
        });

        return res
          .status(201)
          .json({ message: "Sale recorded successfully", saleId });
      });
    });
  });
};

// Fetch all items in a sale
exports.getSaleItems = (req, res) => {
  const { sale_id } = req.params;

  const query = `
    SELECT si.id, si.product_id, p.name AS product_name, si.quantity, si.price
    FROM sale_items si
    JOIN products p ON si.product_id = p.id
    WHERE si.sale_id = ?
  `;

  db.query(query, [sale_id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching sale items', error: err.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No items found for this sale ID' });
    }

    return res.status(200).json({ message: 'Sale items fetched successfully', items: results });
  });
};
// Fetch all items in a sale, including purchase order (PO) and purchase return (PR) details
exports.getSaleItems = (req, res) => {
  const { sale_id } = req.params;

  const query = `
    SELECT 
      si.id AS sale_item_id, 
      si.product_id, 
      p.name AS product_name, 
      si.quantity, 
      si.price, 
      po.id AS purchase_order_id,
      po.order_date AS purchase_order_date,
      pr.id AS purchase_return_id,
      pr.return_date AS purchase_return_date
    FROM sale_items si
    LEFT JOIN products p ON si.product_id = p.id
    LEFT JOIN purchase_orders po ON si.product_id = po.product_id
    LEFT JOIN purchase_returns pr ON si.product_id = pr.product_id
    WHERE si.sale_id = ?
  `;

  db.query(query, [sale_id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching sale items with PR/PO details', error: err.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No items found for this sale ID' });
    }

    return res.status(200).json({ message: 'Sale items fetched successfully', items: results });
  });
};

// Fetch full details of a specific sale
exports.getSaleDetails = (req, res) => {
  const { sale_id } = req.params;

  const query = `
    SELECT 
      s.id AS sale_id,
      s.customer_name,
      s.sale_date,
      s.total_amount,
      si.product_id, 
      p.name AS product_name, 
      si.quantity, 
      si.price
    FROM sales s
    JOIN sale_items si ON s.id = si.sale_id
    JOIN products p ON si.product_id = p.id
    WHERE s.id = ?
  `;

  db.query(query, [sale_id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching sale details', error: err.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Sale not found' });
    }

    const saleDetails = {
      sale_id: results[0].sale_id,
      customer_name: results[0].customer_name,
      sale_date: results[0].sale_date,
      total_amount: results[0].total_amount,
      items: results.map(item => ({
        product_name: item.product_name,
        quantity: item.quantity,
        price: item.price,
        total: item.quantity * item.price
      }))
    };

    return res.status(200).json({ sale: saleDetails });
  });
};


exports.getsSalesByDate = (req, res) => {
  const { from, to } = req.query;
  let query = 'SELECT * FROM sales';

  if (from && to) {
    query += ` WHERE sale_date BETWEEN '${from}' AND '${to}'`;
  }

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching sales records', error: err.message });
    }
    return res.status(200).json(results);
  });
};
