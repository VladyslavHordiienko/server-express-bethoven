const { Payments } = require('../models/models');

class PaymentsController {
  async getAll(req, res) {
    try {
      const payments = await Payments.findAll();
      if (!payments) return res.status(404).json('Ошибка получения информации для платежа');
      return res.json(payments);
    } catch (error) {
      return res.status(404).json('Ошибка получения информации для платежа');
    }
  }
}
module.exports = new PaymentsController();
