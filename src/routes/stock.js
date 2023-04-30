const { models } = require('../models');

async function get(req, res) {
    let stock = await models.stock.findAll();

    const symbol = req.query.symbol;
    if(symbol){
        let stock = await models.stock.findByPk(symbol);
        res.status(200).json(stock);
    }
    else if(stock){
        res.status(200).json(stock);
    } else {
        res.status(400).send('400 - Bad Request');
    }

};

async function create(req, res) {
    let stock = await models.stock.findByPk(req.body.symbol);
    if (stock) {
        res.status(200).json(stock);
    } else {
        res.status(400).send('400 - Bad Request');
    }

};

async function update(req, res) {
    const symbol = req.body.symbol;
    await models.stock.update(req.body, {
        where: {
            "symbol": symbol
        }
    });
    res.status(200).end();

};

async function remove(req, res) {
    const symbol = req.body.symbol;
	await models.stock.destroy({
		where: {
            "symbol": symbol
		}
	});
	res.status(200).end();
};

module.exports = {
	get,
	create,
	update,
	remove,
};
