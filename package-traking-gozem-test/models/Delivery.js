const mongoose = require('mongoose');

const Package = new mongoose.Schema({
  active_delivery_id: { type: String },
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


const DeliverySchema = new mongoose.Schema({
    package_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Package' },
    pickup_time: { type: Date },
    start_time: { type: Date },
    end_time: { type: Date },
    location: { type: Object },
    status: { type: String, enum: ['open', 'picked-up', 'in-transit', 'delivered', 'failed'], required: true },
});

module.exports = mongoose.model('Delivery', DeliverySchema);
