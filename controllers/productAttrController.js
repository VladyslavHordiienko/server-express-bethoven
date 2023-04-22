const uniqid = require('uniqid');
const path = require('path');

const { ProductAttr } = require('../models/models');
const ApiError = require('../error/ApiError');

class ProductAttrController {
  async getAll(req, res) {
    let productAttr = await ProductAttr.findAll();

    return res.json(productAttr);
  }
}
module.exports = new ProductAttrController();
