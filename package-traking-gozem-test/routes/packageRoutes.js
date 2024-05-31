const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');
const { getPackages, getPackageById, createPackage, updatePackage, deletePackage } = require('../controllers/packageController');
const router = express.Router();

router.route('/')
  .get(protect, authorize('admin', 'customer', 'driver'), getPackages)
  .post(protect, authorize('admin'), createPackage);

router.route('/:id')
  .get(protect, authorize('admin', 'driver', 'customer'), getPackageById)
  .put(protect, authorize('admin'), updatePackage)
  .delete(protect, authorize('admin'), deletePackage);

module.exports = router;
