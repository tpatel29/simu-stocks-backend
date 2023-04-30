const { models } = require('../models');

async function get(req, res) {
    let email = req.body.email;
    let user_owns = await models.user_owns.findAll({where :{email}});

    const symbol = req.query.symbol;
    if(symbol){
        let user_owns =await models.user_owns.findAll({where :{email, symbol}});
        res.status(200).json(user_owns);
    }
    else if(user_owns){
        res.status(200).json(user_owns);
    } else {
        res.status(400).send('400 - Bad Request');
    }

};

async function create(req, res) {
    var user_owns;
	let email = req.body.email;
    let symbol = req.body.symbol;

    if(email && symbol){
        user_owns = await models.user_owns.findAll({where :{email , symbol}});
        res.status(200).send(user_owns);
    }
    else if(email){
        user_owns = await models.user_owns.findAll({where :{email}});
        res.status(200).send(user_owns);
    }
    else if(symbol){
        user_owns = await models.user_owns.findAll({where :{symbol}});
        res.status(200).send(user_owns);
    }
    else{
        res.status(400).send('400 - Bad Request');
    }

};

async function update(req, res) {
    const symbol = req.body.symbol;
    const email = req.body.email;
    await models.user_owns.update(req.body, {
        where: {
            "symbol": symbol , "email": email
        }
    });
    res.status(200).end();
};

async function remove(req, res) {
    const symbol = req.body.symbol;
    const email = req.body.email;
	await models.user_owns.destroy({
		where: {
            "symbol": symbol , "email": email
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
