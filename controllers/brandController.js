const { Brand } = require('../models/models');

class BrandController {
  async create(req, res) {
    const { name } = req.body;
    const brans = await Brand.create({ name });
    return res.json(brans);
  }
  async getAll(req, res) {
    const brands = await Brand.findAll();
    return res.json(brands);
  }
}
module.exports = new BrandController();
