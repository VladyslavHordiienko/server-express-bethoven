const { Deliveries } = require('../models/models');

class DeliveryController {
  async getAll(req, res) {
    try {
      const deliveries = await Deliveries.findAll();
      if (!deliveries) return res.status(404).json('Ошибка получения информации о доставке');
      return res.json(deliveries);
    } catch (error) {
      return res.status(404).json('Ошибка получения информации о доставке');
    }
  }
}
module.exports = new DeliveryController();
