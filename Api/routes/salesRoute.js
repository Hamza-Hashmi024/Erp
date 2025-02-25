const express = require('express');
const router = express.Router();
const salesController = require('../Controllers/InventryControllers/Sales');
const authMiddleware = require('../Controllers/Auth/AuthMiddleware/authMiddleware');
const authorize = require('../Controllers/Auth/AuthMiddleware/AuthorizeMiddleware');


// Fetch all sales records
router.get('/sales', authMiddleware, authorize(['read_sales']), salesController.getAllSales);

// Record a new sale
router.post('/sales',authMiddleware, authorize(['create_sales']), salesController.createSale);

// Fetch all items in a sale
router.get('/sales/:sale_id/items', authMiddleware, authorize(['read_sales']), salesController.getSaleItems);

router.get('/sales/:sale_id/details', authMiddleware, authorize(['read_sales']), salesController.getSaleDetails);

module.exports = router;
