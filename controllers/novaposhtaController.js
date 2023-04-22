const { Novaposhta } = require('../models/models');

class NovaposhtaController {
  async getAll(req, res) {
    try {
      const novaposhta = await Novaposhta.findAll();
      return res.json(novaposhta);
    } catch (error) {
      return res.status(404).json(error);
    }
  }
}
module.exports = new NovaposhtaController();
