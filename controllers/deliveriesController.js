const { Deliveries } = require('../models/models');

class DeliveryController {
  async getAll(req, res) {
    try {
      const deliveries = await Deliveries.findAll();
      return res.json(deliveries);
    } catch (error) {
      return res.status(404).json('Deliveries Error');
    }
  }
}
module.exports = new DeliveryController();
