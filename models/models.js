const sequelize = require('../db');

const { DataTypes } = require('sequelize');

const Product = sequelize.define('product', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  product_code: { type: DataTypes.INTEGER, allowNull: false, unique: true },
  product_status: { type: DataTypes.INTEGER, allowNull: false },
  product_name_ua: { type: DataTypes.STRING, allowNull: false },
  product_name_ru: { type: DataTypes.STRING, allowNull: false },
  slug: { type: DataTypes.STRING, unique: true, allowNull: false },
  meta_title_ua: { type: DataTypes.STRING, allowNull: false },
  meta_title_ru: { type: DataTypes.STRING, allowNull: false },
  meta_description_ua: { type: DataTypes.STRING, allowNull: false },
  meta_description_ru: { type: DataTypes.STRING, allowNull: false },
  seo_text_ua: { type: DataTypes.TEXT('long'), allowNull: false },
  seo_text_ru: { type: DataTypes.TEXT('long'), allowNull: false },
  img: { type: DataTypes.STRING, defaultValue: '', allowNull: false },
});

const Category = sequelize.define('category', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  category_name_ua: { type: DataTypes.STRING, unique: true, allowNull: false },
  category_name_ru: { type: DataTypes.STRING, unique: true, allowNull: false },
  meta_title_ua: { type: DataTypes.STRING, allowNull: false },
  meta_title_ru: { type: DataTypes.STRING, allowNull: false },
  meta_description_ua: { type: DataTypes.STRING, allowNull: false },
  meta_description_ru: { type: DataTypes.STRING, allowNull: false },
  seo_text_ua: { type: DataTypes.TEXT('long'), allowNull: false },
  seo_text_ru: { type: DataTypes.TEXT('long'), allowNull: false },
  slug: { type: DataTypes.STRING, unique: true, allowNull: false },
  parentId: { type: DataTypes.INTEGER, allowNull: true },
});

const ProductInfo = sequelize.define('product_info', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  value_ua: { type: DataTypes.STRING, allowNull: false },
  value_ru: { type: DataTypes.STRING, allowNull: false },
  value_back: { type: DataTypes.STRING, allowNull: false },
});
const ProductAttr = sequelize.define('product_attr', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title_ua: { type: DataTypes.STRING, allowNull: false },
  title_ru: { type: DataTypes.STRING, allowNull: false },
  title_back: { type: DataTypes.STRING, allowNull: false },
  isFilter: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  category_list: { type: DataTypes.JSON, allowNull: false },
});

const ProductModification = sequelize.define('product_modification', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  factory_articul: { type: DataTypes.INTEGER, allowNull: false },
  product_weight: { type: DataTypes.INTEGER, allowNull: false },
  product_price: { type: DataTypes.FLOAT, allowNull: true },
  product_discount: { type: DataTypes.FLOAT, allowNull: true },
});

const Deliveries = sequelize.define('deliveries', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  deliveries_title_ua: { type: DataTypes.STRING, allowNull: false },
  deliveries_title_ru: { type: DataTypes.STRING, allowNull: false },
  input_name: { type: DataTypes.STRING, allowNull: false },
  input_id: { type: DataTypes.STRING, unique: true, allowNull: false },
});

const Payments = sequelize.define('payments', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  payments_title_ua: { type: DataTypes.STRING, allowNull: false },
  payments_title_ru: { type: DataTypes.STRING, allowNull: false },
  input_name: { type: DataTypes.STRING, allowNull: false },
  input_id: { type: DataTypes.STRING, unique: true, allowNull: false },
});

const Novaposhta = sequelize.define('novaposhta', {
  SiteKey: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  area: { type: DataTypes.STRING, allowNull: true },
  city_ua: { type: DataTypes.STRING, allowNull: true },
  city_ru: { type: DataTypes.STRING, allowNull: true },
  branch_ua: { type: DataTypes.STRING, allowNull: true },
  branch_ru: { type: DataTypes.STRING, allowNull: true },
});

Category.hasMany(Product);
Product.belongsTo(Category);

Product.hasMany(ProductInfo, { as: 'info' });
ProductInfo.belongsTo(Product);

ProductAttr.hasMany(ProductInfo);
ProductInfo.belongsTo(ProductAttr);

Product.hasMany(ProductModification, { as: 'product_modification' });
ProductModification.belongsTo(Product);

module.exports = {
  Product,
  Category,
  ProductInfo,
  ProductAttr,
  ProductModification,
  Deliveries,
  Payments,
  Novaposhta,
};
