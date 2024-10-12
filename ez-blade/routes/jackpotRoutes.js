const express = require('express');
const router = express.Router();
const jackpotController = require('../controllers/jackpotController');

// Route to join the jackpot
router.post('/join', jackpotController.joinJackpot);

// Route to get the current jackpot status
router.get('/status', jackpotController.getJackpotStatus);
router.get('/history', jackpotController.getJackpotHistory);
router.post('/save-trade-url', jackpotController.saveTradeUrl);



module.exports = router;
