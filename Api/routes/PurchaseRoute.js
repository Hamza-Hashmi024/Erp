const express = require('express');
const router = express.Router();
const purchaseController = require('../Controllers/InventryControllers/Pusrchase');
const authMiddleware = require('../Controllers/Auth/AuthMiddleware/authMiddleware');
const authorize = require('../Controllers/Auth/AuthMiddleware/AuthorizeMiddleware');

// Purchase Request Routes
router.post('/purchase-requests',authMiddleware, authorize(['create_purchase_requests']), purchaseController.createPurchaseRequest);
router.get('/purchase-requests',authMiddleware, authorize(['read_purchase_requests']), purchaseController.getPurchaseRequests);
router.put('/purchase-requests/:id', authMiddleware, authorize(['update_purchase_requests']), purchaseController.updatePurchaseRequestStatus);

// Purchase Order Routes
router.post('/purchase-orders',authMiddleware, authorize(['create_purchase_orders']), purchaseController.createPurchaseOrder);
router.get('/purchase-orders', authMiddleware, authorize(['read_purchase_orders']), purchaseController.getPurchaseOrders);
router.get('/purchase-requests/approved', authMiddleware, authorize(['read_purchase_orders']),purchaseController.getApprovedRequests);
router.put('/purchase-orders/:id', authMiddleware, authorize(['update_purchase_orders']),purchaseController.updatePurchaseOrderStatus);

// update gooods  recucve is not working\
// goods recived Routes

router.get('/purchase-orders/:orderId/grns', authMiddleware, authorize(['read_grns']), purchaseController.getGRNs);
router.post('/grns',authMiddleware, authorize(['create_grns']),  purchaseController.createGRN);

//  for filter data by or order id in good recived or also by date
router.get('/grns', authMiddleware, authorize(['read_grns']), purchaseController.getFilteredGRNs);

module.exports = router;