const { Novaposhta } = require('../models/models');

class NovaposhtaController {
  async getAll(req, res) {
    try {
      const novaposhta = await Novaposhta.findAll();
      if (!novaposhta) res.status(404).json('Ошибка получения информации Новой Почты');
      return res.json(novaposhta);
    } catch (error) {
      return res.status(404).json('Ошибка получения информации Новой Почты');
    }
  }
}
module.exports = new NovaposhtaController();
