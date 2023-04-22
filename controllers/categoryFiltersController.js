const uniqid = require('uniqid');
const path = require('path');
// const { CategoryFilters, FiltersValues } = require('../models/models');
const { CategoryFilters } = require('../models/models');
const ApiError = require('../error/ApiError');

class categoryFiltersController {
  async create(req, res, next) {
    // try {
    //   let { name, categoryId, filtersValues } = req.body;

    //   const categoryFilters = await CategoryFilters.create({
    //     name,
    //     categoryId,
    //   });
    //   if (filtersValues) {
    //     filtersValues = JSON.parse(filtersValues);

    //     filtersValues.forEach((f) => {
    //       FiltersValues.create({
    //         filter_value_front: f.filter_value_front,
    //         filter_value_back: f.filter_value_back,
    //         categoryFilterId: categoryFilters.id,
    //       });
    //     });
    //   }

    // return res.json(categoryFilters);
    return res.json({});
    // } catch (error) {
    //   console.log(error);
    //   next(ApiError.badRequest(error.message));
    // }
  }
  async getAll(req, res) {
    // let categoryFilters = await CategoryFilters.findAll({
    //   include: [{ model: FiltersValues, as: 'filters_values' }],
    // });

    // return res.json(categoryFilters);
    return res.json({});
  }
  async getFiltersBelongsCategory(req, res) {
    const { id } = req.params;

    const categoryFilters = await CategoryFilters.findAll({
      where: { categoryId: id },
    });

    return res.json(categoryFilters);
  }
}
module.exports = new categoryFiltersController();
