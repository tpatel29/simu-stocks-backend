const { models } = require('../models');

async function get(req, res) {
    user = await models.user.findAll();
    res.status(200).json(user);
};

module.exports = {
	get
};
