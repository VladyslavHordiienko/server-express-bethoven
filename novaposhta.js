const fetch = require('node-fetch');
const mariadb = require('mariadb');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'food_shop',
  };

// Замените API_KEY на ваш API-ключ, полученный на сайте Новой почты
const API_KEY = '610b752b1c771dc6ed4feace12e3c587';

// Функция для отправки запросов к API Новой почты
async function sendRequest(method, url, data) {
  const response = await fetch(url, {
    method: method,
    body: data ? JSON.stringify(data) : null,
  });
  return await response.json();
}

// Функция для получения списка отделений
async function getBranches() {
  const url = "https://api.novaposhta.ua/v2.0/json/";
  const data = {
    "apiKey": API_KEY,
    "modelName": "Address",
    "calledMethod": "getWarehouses",
    "methodProperties": {}
  };
  const response = await sendRequest("POST", url, data);
  return response.data;
}

async function insertBranch () {
    const conn = await mariadb.createConnection(dbConfig);
    const data = await getBranches()
    const a = data
    .map(item => {
        const SiteKey = item.SiteKey
        const branch_ua = item.Description
        const branch_ru = item.DescriptionRu
        const city_ua = item.CityDescription
        const city_ru = item.CityDescriptionRu
        const area = item.SettlementAreaDescription
        const createdAt = '2023-04-02 14:05:01'
        const updatedAt = '2023-04-02 14:05:01'
        return {SiteKey, area, city_ua, city_ru, branch_ua, branch_ru,createdAt,updatedAt}
    })
    const b = a.map(item => {
        const key = Object.keys(item)
        const values = Object.values(item)
         return `INSERT INTO novaposhta VALUES (${values.map(i => isNaN(i) || i === '' ? `'${i.replace(/'/gi,'\\\'')}'` : i)});`
    })


    for (let i of b) {
        await conn.query(i);
      }
      conn.end();
}

insertBranch ()