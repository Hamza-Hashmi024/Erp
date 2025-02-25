const express = require('express');
const router = express.Router();
const supplierController = require('../Controllers/InventryControllers/Supplier');
const authMiddleware = require('../Controllers/Auth/AuthMiddleware/authMiddleware');
const authorize = require('../Controllers/Auth/AuthMiddleware/AuthorizeMiddleware');


// Fetch all suppliers
router.get('/suppliers', authMiddleware, authorize(['read_suppliers']),supplierController.getAllSuppliers);

// Add a new supplier
router.post('/suppliers',authMiddleware, authorize(['create_suppliers']), supplierController.createSupplier);

// Update a supplier
router.put('/suppliers/:id',authMiddleware, authorize(['update_suppliers']), supplierController.updateSupplier);

// Delete a supplier
router.delete('/suppliers/:id', authMiddleware, authorize(['delete_suppliers']), supplierController.deleteSupplier);

router.get("/filter", authMiddleware, authorize(['read_suppliers']), supplierController.getSupplierByFilter);

module.exports = router;