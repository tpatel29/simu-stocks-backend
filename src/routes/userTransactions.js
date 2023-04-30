const { models } = require('../models');

async function get(req, res) {
    let email = req.body.email;
    let transactions = await models.transactions.findAll({where :{email}});

    const symbol = req.query.symbol;
    if(symbol){
        let transactions =await models.transactions.findAll({where :{email, symbol}});
        res.status(200).json(transactions);
    }
    else if(transactions){
        res.status(200).json(transactions);
    } else {
        res.status(400).send('400 - Bad Request');
    }

};
async function getByFilter(req, res) {
    let email = req.body.email;
    const symbol = req.query.symbol;
    var transactions = await models.transactions.findAll({where :{email, symbol}});
    if (transactions) {
        res.status(200).json(transactions);
    } else {
        res.status(400).send('400 - Bad Request');
    }
};


async function create(req, res) {
    var transactions;
	let email = req.body.email;
    let symbol = req.body.symbol;

    if(email && symbol){
        transactions = await models.transactions.findAll({where :{email , symbol}});
        res.status(200).send(transactions);
    }
    else if(email){
        transactions = await models.transactions.findAll({where :{email}});
        res.status(200).send(transactions);
    }
    else if(symbol){
        transactions = await models.transactions.findAll({where :{symbol}});
        res.status(200).send(transactions);
    }
    else{
        res.status(400).send('400 - Bad Request');
    }

};

async function update(req, res) {
	const id = req.body.id;
    await models.transactions.update(req.body, {
        where: {
            "id": id
        }
    });
    res.status(200).end();

};

async function remove(req, res) {
    const id = req.body.id	;
    await models.transactions.destroy({
		where: {
            "id": id
		}
	});
	res.status(200).end();
};

module.exports = {
	get,
	getByFilter,
	create,
	update,
	remove,
};
