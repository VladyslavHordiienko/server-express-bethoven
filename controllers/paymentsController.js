const { Payments } = require('../models/models');

class PaymentsController {
  async getAll(req, res) {
    try {
      const payments = await Payments.findAll();
      return res.json(payments);
    } catch (error) {
      return res.status(404).json('Payments Error');
    }
  }
}
module.exports = new PaymentsController();
