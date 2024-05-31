const mongoose = require('mongoose');

const Delivery = new mongoose.Schema({
  package_id: { type: String },
  pickup_time: { type: Date },
  start_time: { type: Date },
  end_time: { type: Date },
  location: { type: Object },
  status: { type: String, enum: ['open', 'picked-up', 'in-transit', 'delivered', 'failed'], required: true },
});

const PackageSchema = new mongoose.Schema({
  active_delivery_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Delivery' },
  description: { type: String, required: true },
  weight: { type: Number, required: true },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  depth: { type: Number, required: true },
  from_name: { type: String, required: true },
  from_address: { type: String, required: true },
  from_location: { type: Object, required: false },
  to_name: { type: String, required: true },
  to_address: { type: String, required: true },
  to_location: { type: Object, required: false },
});

module.exports = mongoose.model('Package', PackageSchema);
