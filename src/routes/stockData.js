const { models } = require('../models');

async function get(req, res) {
    let stock_data = await models.stock_data.findAll();
    const symbol = req.query.symbol;
    if(symbol){
        let stock_data = await models.stock_data.findByPk(symbol);
        res.status(200).json(stock_data);
    }
    else if(stock_data){
        res.status(200).json(stock_data);
    } else {
        res.status(400).send('400 - Bad Request');
    }

};


async function create(req, res) {
    let stock_data = await models.stock_data.findByPk(req.body.symbol);
    if (stock_data) {
        res.status(200).json(stock_data);
    } else {
        res.status(400).send('400 - Bad Request');
    }
};

async function update(req, res) {
    const symbol = req.body.symbol;
    await models.stock_data.update(req.body, {
        where: {
            "symbol": symbol
        }
    });
    res.status(200).end();
};

async function remove(req, res) {
    const symbol = req.body.symbol;
	await models.stock_data.destroy({
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
