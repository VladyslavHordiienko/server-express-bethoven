const mariadb = require('mariadb');
const builder = require('xmlbuilder');
const fs = require('fs');

const date = new Date();

const pool = mariadb.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'food_shop',
});

const categoriesQuery = 'SELECT slug FROM categories';
const productsQuery = 'SELECT slug FROM products';

async function getUrls(query) {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(query);
    return rows.map((row) => row.slug);
  } catch (err) {
    throw err;
  } finally {
    if (conn) {
      conn.end();
    }
  }
}
async function createMap() {
  const categories = await getUrls(categoriesQuery);
  const products = await getUrls(productsQuery);

  const categoriesRoot = builder.create('urlset', {
    xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9',
  });
  categories.forEach((category) => {
    const url = categoriesRoot.ele('url');
    url.ele('loc', {}, `https://example.com/${category}`);
    url.ele(
      'lastmod',
      {},
      `${date.getFullYear()}-${
        date.getMonth().length > 9 ? date.getMonth() : '0' + date.getMonth()
      }-${date.getDate()}`,
    );
    url.ele('changefreq', {}, `daily`);
    url.ele('priority', {}, `1.0`);
  });

  const productsRoot = builder.create('urlset', {
    xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9',
  });
  products.forEach((product) => {
    const url = productsRoot.ele('url');
    url.ele('loc', {}, `https://example.com/${product}`);
    url.ele(
      'lastmod',
      {},
      `${date.getFullYear()}-${
        date.getMonth().length > 9 ? date.getMonth() : '0' + date.getMonth()
      }-${date.getDate()}`,
    );
    url.ele('changefreq', {}, `daily`);
    url.ele('priority', {}, `1.0`);
  });

  const categoriesXml = categoriesRoot.end({ pretty: true });
  const productsXml = productsRoot.end({ pretty: true });

  const indexRoot = builder.create('sitemapindex');

  indexRoot.att('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9');

  const categoriesSitemap = indexRoot.ele('sitemap');
  categoriesSitemap.ele('loc', {}, 'https://example.com/categories-sitemap.xml');

  const productsSitemap = indexRoot.ele('sitemap');
  productsSitemap.ele('loc', {}, 'https://example.com/products-sitemap.xml');

  const indexXml = indexRoot.end({ pretty: true });

  fs.writeFile('categories-sitemap.xml', categoriesXml, function (err) {
    if (err) throw err;
    console.log('Categories sitemap saved to categories-sitemap.xml');
  });

  fs.writeFile('products-sitemap.xml', productsXml, function (err) {
    if (err) throw err;
    console.log('Products sitemap saved to products-sitemap.xml');
  });

  fs.writeFile('sitemapindex.xml', indexXml, function (err) {
    if (err) throw err;
    console.log('Sitemap index saved to sitemapindex.xml');
  });
}
createMap();
