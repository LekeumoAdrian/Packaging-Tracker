const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');
const { getDeliveries, getDeliveryById, createDelivery, updateDelivery, deleteDelivery } = require('../controllers/deliveryController');
const router = express.Router();

router.route('/')
  .get(protect, authorize('admin', 'driver'), getDeliveries)
  .post(protect, authorize('admin'), createDelivery);

router.route('/:id')
  .get(protect, authorize('admin', 'driver', 'customer'), getDeliveryById)
  .put(protect, authorize('admin', 'driver'), updateDelivery)
  .delete(protect, authorize('admin'), deleteDelivery);

module.exports = router;
