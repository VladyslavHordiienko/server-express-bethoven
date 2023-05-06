const { Category, ProductModification } = require('../models/models');
const { Product, ProductInfo } = require('../models/models');

const { Op } = require('sequelize');

class ProductController {
  async getAll(req, res) {
    try {
      let { limit, page, filterBy, search, category } = req.query;

      limit = parseInt(limit) || 9;
      page = parseInt(page) || 1;

      let offset = page * limit - limit;

      // ВОЗВРАЩАЮ ПРОДУКТЫ НА СТРАНИЦУ ПОИСКА
      if (search) {
        let products = await Product.findAll({
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
        if (!products) return res.status(404).json('Ошибка получения товаров');
        return res.json({ products });
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
          let products = await Product.findAll({
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
          let allInfo = await ProductInfo.findAll({
            where: {
              productId: {
                [Op.or]: [...products.map((el) => el.id)],
              },
            },
          });
          if (!products) return res.status(404).json('Ошибка получения товаров');
          return res.json({ products, allInfo, breadcrumbs });
        }

        if (catIds.length && filterBy) {
          let products = await Product.findAll({
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
          let allInfo = await ProductInfo.findAll({
            where: {
              productId: {
                [Op.or]: [...products.map((el) => el.id)],
              },
            },
          });

          let productsIds = products
            .map((el) => el.info)
            .reduce((acc, el) => {
              acc = [...acc, ...el];
            }, [])
            .reduce((acc, el) => {
              if (!acc.find((inner) => inner.value_back === el.value_back)) {
                acc.push(el);
              }
              return acc;
            }, []);

          products = await Product.findAll({
            where: {
              categoryId: {
                [Op.or]: catIds,
              },
              id: {
                [Op.or]: productsIds,
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

          // products = products.filter((p) => {
          //   return filterBy.split(',').every((f) => p.info.find((i) => i.value_back === f));
          // });

          if (!products) return res.status(404).json('Ошибка получения товаров');
          return res.json({ products, allInfo, breadcrumbs });
        }

        if (!catIds.length && !filterBy) {
          let products = await Product.findAll({
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
          let allInfo = await ProductInfo.findAll({
            where: {
              productId: {
                [Op.or]: [...products.map((el) => el.id)],
              },
            },
          });
          if (!products) return res.status(404).json('Ошибка получения товаров');
          return res.json({ products, allInfo, breadcrumbs });
        }
        if (!catIds.length && filterBy) {
          let products = await Product.findAll({
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
          let allInfo = await ProductInfo.findAll({
            where: {
              productId: {
                [Op.or]: [...products.map((el) => el.id)],
              },
            },
          });
          products = products.filter((p) => {
            return filterBy.split(',').every((f) => p.info.find((i) => i.value_back === f));
          });
          if (!products) return res.status(404).json('Ошибка получения товаров');
          return res.json({ products, allInfo, breadcrumbs });
        }
      }

      // ВОЗВРАЩАЮ ПРОДУКТЫ НА ГЛАВНУЮ СТРАНИЦУ
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
      if (!products) return res.status(404).json('Ошибка получения товаров');
      return res.json({ products });
    } catch (error) {
      return res.status(404).json('Ошибка получения товаров');
    }
  }
  async getOne(req, res) {
    try {
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

      if (!product) return res.status(404).json('Ошибка получения товара');

      return res.json({ product, breadcrumbs });
    } catch (error) {
      return res.status(404).json('Ошибка получения товара');
    }
  }
}
module.exports = new ProductController();
