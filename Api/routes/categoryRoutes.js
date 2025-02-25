const express = require('express');
const router = express.Router();
const categoryController = require('../Controllers/InventryControllers/categories');
const validateCategory = require('../MiddleWare/validateCategory');
const authMiddleware = require('../Controllers/Auth/AuthMiddleware/authMiddleware');
const authorize = require('../Controllers/Auth/AuthMiddleware/AuthorizeMiddleware');


// Get all categories
router.get('/', authMiddleware, authorize(['read_categories']), categoryController.getCategories);

// Get category by ID
router.get('/:id', authMiddleware, authorize(['read_categories']), categoryController.getCategoryById);

// Create a new category (with validation)
router.post('/',authMiddleware, authorize(['create_categories']), validateCategory, categoryController.createCategory);

// Update a category (with validation)
router.put('/:id',authMiddleware, authorize(['update_categories']), validateCategory, categoryController.updateCategory);

// Delete a category
router.delete('/:id', authMiddleware, authorize(['delete_categories']), categoryController.deleteCategory);

module.exports = router;
