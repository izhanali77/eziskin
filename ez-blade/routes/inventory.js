const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');


// Route to get the current jackpot status
router.get('/inventory', inventoryController.getInventoryItems);

module.exports = router;
