const express = require("express");
const request = require("request");
const sequelize = require("./models");
const cheerio = require("cheerio");

const app = express();
const PORT = process.env.PORT || 8080;
const fetch = require("node-fetch");
const bodyParser = require("body-parser");
// const router = express.Router();
// const path = require("path");
// const HTMLParser = require('node-html-parser');

const cron = require("node-cron");
const cookieParser = require("cookie-parser");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const secret = "my_secret";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const cors = require("cors");
app.use(
	cors({
		origin: "*",
	})
);
app.use(
	cors({
		methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
	})
);

app.get("/health-check", (req, res) => {
	console.log("Healthy");
	res.status(200).json({ msg: "The server is healthy." });
});

//
// cron.schedule('* * * * *', () => {
//   console.log('running a task every min : ' + NOW());
// });

app.post("/login", async (req, res) => {
	const email = req.body.email,
		password = req.body.password;
	const user = await sequelize.models.user.findByPk(email);

	if (user) {
		bcrypt.compare(password, user.password, (_, result) => {
			if (result) {
				const expiresIn = 1800; // in seconds
				let token = jwt.sign({ email }, secret, { expiresIn }); // 1800 seconds - 30 min
				res.status(200).json({ token, expiresIn });
			} else {
				res.status(400).json({ msg: "Wrong Password" });
			}
		});
	} else {
		res.status(400).json({ msg: "Wrong Email" });
	}
});

app.post("/register", async (req, res) => {
	const email = req.body.email,
		password = req.body.password,
		firstName = req.body.firstName,
		lastName = req.body.lastName,
		balance = 500;

	const user = await sequelize.models.user.findByPk(email);
	if (user) {
		res.status(400).json({ msg: "Account With Email Already Exist" });
	}

	bcrypt.hash(password, saltRounds, async (_, hash) => {
		const json = { firstName, lastName, email, password: hash, balance };
		await sequelize.models.user.create(json);
		res.status(200).json({ msg: "Account Created" });
	});
});

app.post("/buy", async (req, res) => {
	const decode = jwt.verify(req.headers.authorization.split(" ")[1], secret);
	const email = decode.email,
		symbol = req.body.symbol,
		amount = req.body.amount;

	const stock_data = await sequelize.models.stock_data.findAll({
		where: { symbol },
	});

	const user = await sequelize.models.user.findByPk(email);
	const cost = stock_data[0].price * amount;
	if (user.balance >= cost) {
		let json = {
			email,
			symbol,
			amount,
			price: stock_data[0].price,
			action: "Buy",
		};
		const temp = await sequelize.models.transactions.create(json);
		res.status(200).json({ msg: "Stock Purchased" });
		let balance = user.balance - cost;
		balance = parseFloat("" + balance + "").toFixed(2);
		await sequelize.models.user.update({ balance }, { where: { email } });
		const owned_stocks = await sequelize.models.user_owns.findAll({
			where: { symbol, email },
		});
		if (owned_stocks != 0) {
			let averPrice =
				(parseFloat(owned_stocks[0].averPrice) *
					parseFloat(owned_stocks[0].amount) +
					parseFloat(cost)) /
				(parseFloat(owned_stocks[0].amount) + parseFloat(amount));
			console.log(averPrice);
			averPrice = parseFloat("" + averPrice + "").toFixed(2);
			const results = await sequelize.models.user_owns.update(
				{
					amount: parseFloat(owned_stocks[0].amount) + parseFloat(amount),
					averPrice: averPrice,
				},
				{ where: { email, symbol } }
			);
		} else {
			json = { email, symbol, amount, averPrice: stock_data[0].price };
			const temp = await sequelize.models.user_owns.create(json);
		}
	} else {
		res.status(400).json({ msg: "Insufficient Balance" });
	}
});
app.post("/sell", async (req, res) => {
	const decode = jwt.verify(req.headers.authorization.split(" ")[1], secret);
	const email = decode.email,
		symbol = req.body.symbol,
		amount = req.body.amount;

	let stock_data = await sequelize.models.stock_data.findAll({
		where: { symbol },
	});
	const price = parseFloat(stock_data[0].price);

	const owned_stocks = await sequelize.models.user_owns.findAll({
		where: { symbol, email },
	});

	if (owned_stocks != 0) {
		if (owned_stocks[0].amount) {
			const temp = await sequelize.models.transactions.create({
				email,
				symbol,
				amount,
				price,
				action: "Sell",
			});
			const user_data = await sequelize.models.user.findAll({
				where: { email },
			});
			var balance =
				parseFloat(user_data[0].balance) + parseFloat(price * amount);

			await sequelize.models.user.update({ balance }, { where: { email } });
			if (owned_stocks[0].amount - amount <= 0) {
				await sequelize.models.user_owns.destroy({ where: { email, symbol } });
			} else {
				await sequelize.models.user_owns.update(
					{ amount: owned_stocks[0].amount - amount },
					{ where: { email, symbol } }
				);
			}
			res.status(200).json({ msg: "Stock Sold" });
		} else {
			res.status(400).json({ msg: "Not enough shares to sell" });
		}
	} else {
		res.status(400).json({ msg: "Not Don't Own this Stock" });
	}
});

const routes = {
	user: require("./routes/user"),
	users: require("./routes/users"),
	userTransactions: require("./routes/userTransactions"),
	usersTransactions: require("./routes/usersTransactions"),
	userOwns: require("./routes/userOwns"),
	usersOwns: require("./routes/usersOwns"),
	stockData: require("./routes/stockData"),
	stock: require("./routes/stock"),

	// Add more routes here...
	// items: require('./routes/items'),
};

// We create a wrapper to workaround async errors not being transmitted correctly.
function makeHandlerAwareOfAsyncErrors(handler) {
	return async function (req, res, next) {
		try {
			if (!req.headers.authorization) {
				res.status(403).send("403 - Forbidden").end();
			} else {
				const decode = jwt.verify(
					req.headers.authorization.split(" ")[1],
					secret
				);
				if (!decode) {
					res
						.status(401)
						.send("401 - Invalid credientials (Wrong Token)")
						.end();
				}
				req.body = decode;
				await handler(req, res);
			}
		} catch (error) {
			next(error);
		}
	};
}

// We provide a root route just as an example
app.get("/", (req, res) => {
	res.send(`
		<h2>Hello, Sequelize + Express!</h2>
		<p>Make sure you have executed <b>npm run setup-example-db</b> once to have a populated example database. Otherwise, you will get <i>'no such table'</i> errors.</p>
		<p>Try some routes, such as <a href='/user'>/users</a> or <a href='/transactions?includeStocks'>/orchestras?includeInstruments</a>!</p>
		<p>To experiment with POST/PUT/DELETE requests, use a tool for creating HTTP requests such as <a href='https://github.com/jakubroztocil/httpie#readme'>HTTPie</a>, <a href='https://www.postman.com/downloads/'>Postman</a>, or even <a href='https://en.wikipedia.org/wiki/CURL'>the curl command</a>, or write some JS code for it with <a href='https://github.com/sindresorhus/got#readme'>got</a>, <a href='https://github.com/sindresorhus/ky#readme'>ky</a> or <a href='https://github.com/axios/axios#readme'>axios</a>.</p>
	`);
});

// We define the standard REST APIs for each route (if they exist).
for (const [routeName, routeController] of Object.entries(routes)) {
	if (routeController.get) {
		app.get(
			`/${routeName}`,
			makeHandlerAwareOfAsyncErrors(routeController.get)
		);
	}
	if (routeController.create) {
		app.post(
			`/${routeName}`,
			makeHandlerAwareOfAsyncErrors(routeController.create)
		);
	}
	if (routeController.update) {
		app.put(
			`/${routeName}`,
			makeHandlerAwareOfAsyncErrors(routeController.update)
		);
	}
	if (routeController.remove) {
		app.delete(
			`/${routeName}`,
			makeHandlerAwareOfAsyncErrors(routeController.remove)
		);
	}
}

async function assertDatabaseConnectionOk() {
	console.log(`Checking database connection...`);
	try {
		await sequelize.authenticate();
		console.log("Database connection OK!");
	} catch (error) {
		console.log("Unable to connect to the database:");
		console.log(error.message);
		process.exit(1);
	}
}

async function init() {
	await assertDatabaseConnectionOk();
	console.log(`Starting Sequelize + Express example on port ${PORT}...`);

	app.listen(PORT, async () => {
		console.log(
			`Express server started on port ${PORT}. Try some routes, such as '/users'.`
		);
	});
}

app.get("/getOptions", async (req, res) => {
	let stocks_array = await sequelize.models.stock.findAll();
	var json1 = JSON.parse(JSON.stringify(stocks_array, null, 2));
	stocks_array = await sequelize.models.stock_data.findAll();
	var json2 = JSON.parse(JSON.stringify(stocks_array, null, 2));

	var finalResult = [
		...[json1, json2]
			.reduce(
				(m, a) => (
					a.forEach(
						(o) =>
							(m.has(o.symbol) && Object.assign(m.get(o.symbol), o)) ||
							m.set(o.symbol, o)
					),
					m
				),
				new Map()
			)
			.values(),
	];
	res.status(200).json(finalResult);
});

function scraperWeb(symbol) {
	return new Promise((resolve, reject) => {
		request(
			`https://finance.yahoo.com/quote/${symbol}/`,
			(error, response, html) => {
				if (!error && response.statusCode == 200) {
					const $ = cheerio.load(html);
					var price = $("#quote-header-info")
						.find('fin-streamer[class="Fw(b) Fz(36px) Mb(-4px) D(ib)"]')
						.text();
					// 					console.log(price);
					var index = price.indexOf(".");
					price =
						price.substring(0, index) +
						"." +
						price.substring(index + 1, index + 3);
					resolve(price);
				}
				reject(error);
			}
		);
	});
}

app.get("/updateStocks", async (req, res) => {
	const start = Date.now();
	console.log("Updating the Stock Data Price");

	const stocks_array = await sequelize.models.stock.findAll({
		attributes: ["symbol"],
	});
	//     console.log(stocks_array.every(stocks_array => stocks_array instanceof sequelize.models.stock)); // true
	var jsonFile = JSON.parse(JSON.stringify(stocks_array, null, 2));
	(async () => {
		var results = [];
		var counter = 0;
		jsonFile.forEach((obj) => {
			Object.entries(obj).forEach(([key, value]) => {
				(async (res, req) => {
					var symbol = value;
					var stockPrice = await scraperWeb(value)
						.then(function (price) {
							price = parseFloat(price);
							results.push({ symbol, price });
							counter++;
							if (counter == jsonFile.length) {
								(async () => {
									await sequelize.models.stock_data.bulkCreate(results, {
										updateOnDuplicate: ["symbol", "price"],
									});
									const end = Date.now();
									console.log(`Execution time: ${end - start} ms`);
								})();
							}
						})
						.catch((e) => {
							console.log(e);
						});
				})();
			});
		});
	})();

	console.log("Done!");
	res.status(200).json("HERE");
});

init();
