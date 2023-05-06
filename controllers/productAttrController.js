const { ProductAttr } = require('../models/models');

class ProductAttrController {
  async getAll(req, res) {
    try {
      let productAttr = await ProductAttr.findAll();
      if (!productAttr) return res.status(404).json('Ошибка получения атрибутов');
      return res.json(productAttr);
    } catch (error) {
      return res.status(404).json('Ошибка получения атрибутов');
    }
  }
}
module.exports = new ProductAttrController();
