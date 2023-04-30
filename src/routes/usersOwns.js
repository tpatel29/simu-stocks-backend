const { models } = require('../models');

async function get(req, res) {
    user_owns = await models.user_owns.findAll();
    res.status(200).send(user_owns);
};

module.exports = {
	get,
};
