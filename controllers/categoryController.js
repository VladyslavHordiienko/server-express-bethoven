const { Category } = require('../models/models');
const { Op } = require('sequelize');

class CategoryController {
  async getAll(req, res) {
    try {
      const categories = await Category.findAll();
      if (!categories) return res.status(404).json('Ошибка получения категорий');

      return res.json(categories);
    } catch (error) {
      return res.status(404).json('Ошибка получения категорий');
    }
  }
  async getOne(req, res) {
    try {
      const { slug } = req.params;

      const category = await Category.findOne({
        where: { [Op.or]: [{ slug }, { id: slug }] },
      });
      if (!category) return res.status(404).json('Ошибка получения отдельной категории');

      return res.json(category);
    } catch (error) {
      return res.status(404).json('Ошибка получения отдельной категории');
    }
  }
}
module.exports = new CategoryController();
