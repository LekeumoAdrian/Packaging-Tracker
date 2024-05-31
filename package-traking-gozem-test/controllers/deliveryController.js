const Delivery = require('../models/Delivery');

exports.getDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find();
    res.status(200).json(deliveries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.getDeliveryById = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id).populate('package_id');
    if (!delivery) {
      return res.status(404).json({ success: false, message: 'Delivery not found' });
    }
    res.status(200).json(delivery);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.createDelivery = async (req, res) => {
  try {
    const newDelivery = await Delivery.create(req.body);
    res.status(201).json(newDelivery);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.updateDelivery = async (req, res) => {
  try {
    const updatedDelivery = await Delivery.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedDelivery) {
      return res.status(404).json({ success: false, message: 'Delivery not found' });
    }
    const io = req.app.get('io');
    io.emit('delivery_updated', updatedDelivery);
    res.status(200).json(updatedDelivery);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.updateLocation = async (data) => {
    const { event, deliveryId, location } = data;
    try {
      const delivery = await Delivery.findById(deliveryId);
      if (delivery) {
        delivery.location = location;
        await delivery.save();
        const io = require('../app').get('io');
        io.emit('location_changed', delivery);
      }
    } catch (err) {
      console.error(err);
    }
  };

  exports.updateStatus = async (data) => {
    const { event, deliveryId, status } = data;
    try {
      const delivery = await Delivery.findById(deliveryId);
      if (delivery) {
        delivery.status = status;
        await delivery.save();
        const io = require('../app').get('io');
        io.emit('status_changed', delivery);
      }
    } catch (err) {
      console.error(err);
    }
  };

exports.deleteDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.findByIdAndDelete(req.params.id);
    if (!delivery) {
      return res.status(404).json({ success: false, message: 'Delivery not found' });
    }
    res.status(200).json({ success: true, message: 'Delivery deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
