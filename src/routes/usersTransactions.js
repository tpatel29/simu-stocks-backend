const { models } = require('../models');

async function get(req, res) {
    transactions = await models.transactions.findAll();
    res.status(200).send(transactions);
};

module.exports = {
	get,
};
