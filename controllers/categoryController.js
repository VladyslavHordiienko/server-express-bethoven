const { Category } = require('../models/models');
const ApiError = require('../error/ApiError');
const { where, Op } = require('sequelize');

class CategoryController {
  async create(req, res) {
    const { name, alias } = req.body;
    const category = await Category.create({ name, alias });
    return res.json(category);
  }
  async getAll(req, res) {
    const categories = await Category.findAll();
    return res.json(categories);
  }
  async getOne(req, res) {
    const { slug } = req.params;

    const category = await Category.findOne({
      where: { [Op.or]: [{ slug }, { id: slug }] },
    });
    return res.json(category);
  }
}
module.exports = new CategoryController();
