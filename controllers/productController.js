const uniqid = require('uniqid');
const path = require('path');
const { Category, ProductModification } = require('../models/models');
const { Product, ProductInfo } = require('../models/models');
const ApiError = require('../error/ApiError');

const { Op } = require('sequelize');

class ProductController {
  async getAll(req, res) {
    let { limit, page, filterBy, search, category } = req.query;

    limit = parseInt(limit) || 9;
    page = parseInt(page) || 1;

    let offset = page * limit - limit;

    // ВОЗВРАЩАЮ ПРОДУКТЫ НА СТРАНИЦУ ПОИСКА
    if (search) {
      console.log(search);
      let count = await Product.count({
        limit,
        offset,
        where: {
          [Op.or]: {
            product_name_ua: { [Op.like]: '%' + search + '%' },
            product_name_ru: { [Op.like]: '%' + search + '%' },
          },
        },
      });
      let products = await Product.findAll({
        limit,
        offset,
        where: {
          [Op.or]: {
            product_name_ua: { [Op.like]: '%' + search + '%' },
            product_name_ru: { [Op.like]: '%' + search + '%' },
          },
        },
        include: [
          {
            model: ProductInfo,
            as: 'info',
          },
          {
            model: ProductModification,
            as: 'product_modification',
          },
        ],
      });
      return res.json({ count, products });
    }

    // ВОЗВРАЩАЮ ПРОДУКТЫ НА СТРАНИЦУ КАТЕГОРИИ
    if (category) {
      let allCat = await Category.findAll();
      let currentCat = await Category.findOne({
        where: { id: category },
      });

      let catIds = [];
      function collectCategoriesIds(current) {
        if (!allCat.some((category) => category.parentId === current)) return;
        let ids = allCat
          .filter((category) => current === category.parentId)
          .map((category) => category.id);
        catIds = [...catIds, ...ids];
        let flag = catIds.some((id) => allCat.find((el) => el.parentId === id));
        if (flag) {
          let nextId = catIds
            .filter((id) => allCat.find((el) => el.parentId === id))
            .filter((el) => el !== current);
          return nextId.forEach((id) => collectCategoriesIds(id));
        }
      }
      collectCategoriesIds(currentCat.id);

      function collectBreadcrumbs(currCatId, arr) {
        let cat = [];
        arr.forEach((el) => {
          if (el.id === currCatId) {
            cat = [el, ...cat];
            if (arr.filter((inner) => inner.id === el.parentId).length) {
              cat = [...collectBreadcrumbs(el.parentId, arr), ...cat];
            }
          }
        });
        return cat;
      }
      let breadcrumbs = collectBreadcrumbs(currentCat.id, allCat);

      if (catIds.length && !filterBy) {
        let count = await Product.count({
          limit,
          offset,
          where: {
            categoryId: {
              [Op.or]: catIds,
            },
          },
        });
        let products = await Product.findAll({
          limit,
          offset,
          where: {
            categoryId: {
              [Op.or]: catIds,
            },
          },
          include: [
            {
              model: ProductInfo,
              as: 'info',
            },
            {
              model: ProductModification,
              as: 'product_modification',
            },
          ],
        });
        return res.json({ count, products, breadcrumbs });
      }

      if (catIds.length && filterBy) {
        let count = await Product.count({
          limit,
          offset,
          where: {
            categoryId: {
              [Op.or]: catIds,
            },
          },
          include: [
            {
              model: ProductInfo,
              as: 'info',
              where: {
                value_back: {
                  [Op.or]: filterBy.split(','),
                },
              },
            },
            {
              model: ProductModification,
              as: 'product_modification',
            },
          ],
        });
        let products = await Product.findAll({
          limit,
          offset,
          where: {
            categoryId: {
              [Op.or]: catIds,
            },
          },
          include: [
            {
              model: ProductInfo,
              as: 'info',
              where: {
                value_back: {
                  [Op.or]: filterBy.split(','),
                },
              },
            },
            {
              model: ProductModification,
              as: 'product_modification',
            },
          ],
        });
        return res.json({ count, products, breadcrumbs });
      }

      if (!catIds.length && !filterBy) {
        let count = await Product.count({
          limit,
          offset,
          where: {
            categoryId: currentCat.id,
          },
        });
        let products = await Product.findAll({
          limit,
          offset,
          where: {
            categoryId: currentCat.id,
          },
          include: [
            {
              model: ProductInfo,
              as: 'info',
            },
            {
              model: ProductModification,
              as: 'product_modification',
            },
          ],
        });
        return res.json({ count, products, breadcrumbs });
      }
      if (!catIds.length && filterBy) {
        let count = await Product.count({
          limit,
          offset,
          where: {
            categoryId: currentCat.id,
          },
          include: [
            {
              model: ProductInfo,
              as: 'info',
              where: {
                value_back: {
                  [Op.or]: filterBy.split(','),
                },
              },
            },
            {
              model: ProductModification,
              as: 'product_modification',
            },
          ],
        });
        let products = await Product.findAll({
          limit,
          offset,
          where: {
            categoryId: currentCat.id,
          },
          include: [
            {
              model: ProductInfo,
              as: 'info',
              where: {
                value_back: {
                  [Op.or]: filterBy.split(','),
                },
              },
            },
            {
              model: ProductModification,
              as: 'product_modification',
            },
          ],
        });
        return res.json({ count, products, breadcrumbs });
      }
    }

    // ВОЗВРАЩАЮ ПРОДУКТЫ НА ГЛАВНУЮ СТРАНИЦУ
    let count = await Product.count();
    let products = await Product.findAll({
      limit,
      offset,
      include: [
        {
          model: ProductInfo,
          as: 'info',
        },
        {
          model: ProductModification,
          as: 'product_modification',
        },
      ],
    });
    return res.json({ count, products });
  }
  async getOne(req, res) {
    const { slug } = req.params;

    let allCat = await Category.findAll();

    const product = await Product.findOne({
      where: { slug },
      include: [
        {
          model: ProductInfo,
          as: 'info',
        },
        {
          model: ProductModification,
          as: 'product_modification',
        },
      ],
    });

    function collectBreadcrumbs(currCatId, arr) {
      let cat = [];
      arr.forEach((el) => {
        if (el.id === currCatId) {
          cat = [el, ...cat];
          if (arr.filter((inner) => inner.id === el.parentId).length) {
            cat = [...collectBreadcrumbs(el.parentId, arr), ...cat];
          }
        }
      });
      return cat;
    }
    let breadcrumbs = collectBreadcrumbs(product.categoryId, allCat);

    return res.json({ product, breadcrumbs });
  }
}
module.exports = new ProductController();
