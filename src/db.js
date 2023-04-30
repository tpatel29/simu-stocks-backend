const sequelize = require("./models");
const request = require("request");
const cheerio = require("cheerio");

async function scraperWeb(symbol) {
	const stockPrice = await new Promise((resolve, reject) => {
		request(
			`https://finance.yahoo.com/quote/${symbol}/`,
			(error, response, html) => {
				if (!error && response.statusCode == 200) {
					const $ = cheerio.load(html);
					var price = $("#quote-header-info")
						.find('fin-streamer[class="Fw(b) Fz(36px) Mb(-4px) D(ib)"]')
						.text();
					console.log(price);
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
	return await stockPrice;
}

async function reset() {
	console.log(
		"Will rewrite the SQLite example database, adding some dummy data."
	);

	await sequelize.sync({ force: true });

	await sequelize.models.user.bulkCreate([
		// { firstName: 'luffy', lastName: "monkey",email: "luffym@gmail.com", password: "password", balance: 500 },
		// { firstName: 'fire-fist', lastName: "ace",email: "firefistace@gmail.com", password: "pass", balance: 2000 },
		{
			firstName: "Tej",
			lastName: "Patel",
			email: "test@gmail.com",
			password: "$2b$10$bP7Rh.W6.t/ht7eRm1I0I.knWGl99zsdIt5IogDIQUOJzej9EtyxG",
			balance: 2000,
		},
	]);
	await sequelize.models.stock.bulkCreate([
		{ symbol: "AAPL", name: "Apple" },
		{ symbol: "MSFT", name: "Microsoft" },
		{ symbol: "AMZN", name: "amazon" },
		{ symbol: "TSLA", name: "Tesla" },
		{ symbol: "GOOG", name: "Alphabet Class C" },
		{ symbol: "GOOGL", name: "Alphabet Class A" },
		{ symbol: "META", name: "Meta" },
		{ symbol: "NVDA", name: "NVIDIA" },
		{ symbol: "PEP", name: "PepsiCo" },
		{ symbol: "COST", name: "Costco" },
		{ symbol: "AVGO", name: "Broadcom" },
		{ symbol: "CSCO", name: "Cisco Systems" },
		{ symbol: "TMUS", name: "T-mobile" },
		{ symbol: "ADBE", name: "Adobe" },
		{ symbol: "CMCSA", name: "Comcast" },
		{ symbol: "TXN", name: "Texas Instruments" },
		{ symbol: "QCOM", name: "QUALCOMM" },
		{ symbol: "AMD", name: "AMD" },
		{ symbol: "INTU", name: "Intuit" },
		{ symbol: "HON", name: "Honeywell International" },
		{ symbol: "AMGN", name: "Amgen" },
		{ symbol: "INTC", name: "Intel" },
		{ symbol: "PYPL", name: "Paypal" },
		{ symbol: "SBUX", name: "Starbucks" },
		{ symbol: "NFLX", name: "Netflix" },
		{ symbol: "ADP", name: "Automatic Data Processing" },
		{ symbol: "MDLZ", name: "Mondelez International" },
		{ symbol: "GILD", name: "Gilead Sciences" },
		{ symbol: "BKNG", name: "Booking Holdings" },
		{ symbol: "AMAT", name: "Applied Materials" },
		{ symbol: "ADI", name: "Analog Devices" },
		{ symbol: "ISRG", name: "Intuitive Surgical" },
		{ symbol: "REGN", name: "Regeneron Pharmaceutials" },
		{ symbol: "VRTX", name: "Vertex Pharmaceutials" },
		{ symbol: "FISV", name: "Fiserv" },
		{ symbol: "CSX", name: "CSX" },
		{ symbol: "CHTR", name: "Charter Communications" },
		{ symbol: "ATVI", name: "Activision Blizzard" },
		{ symbol: "MU", name: "Micron Technology" },
		{ symbol: "LRCX", name: "Lam Research" },
		{ symbol: "MRNA", name: "Moderna" },
		{ symbol: "PANW", name: "Palo Alto Networks" },
		{ symbol: "KDP", name: "Keuig Dr Pepper" },
		{ symbol: "MAR", name: "Marriott International" },
		{ symbol: "AEP", name: "American Electric Power" },
		{ symbol: "KLAC", name: "KLA" },
		{ symbol: "SNPS", name: "Synopsys" },
		{ symbol: "ABNB", name: "Airbnb" },
		{ symbol: "MELI", name: "MercadoLibre" },
		{ symbol: "MNST", name: "Monster" },
		{ symbol: "CDNS", name: "Cadence Design Systems" },
		{ symbol: "ADSK", name: "Autodesk" },
		{ symbol: "ORLY", name: "O'Reilly Automotive" },
		{ symbol: "PAYX", name: "Paychex" },
		{ symbol: "EXC", name: "Exelon" },
		{ symbol: "KHC", name: "Kraft Foods" },
		{ symbol: "LULU", name: "Lululemon" },
		{ symbol: "NXPI", name: "NXP Semiconductors" },
		{ symbol: "FTNT", name: "Fortinet" },
		{ symbol: "CTAS", name: "Cintas" },
		{ symbol: "MRVL", name: "Marvell Technology" },
		{ symbol: "XEL", name: "Xcel Energy" },
		{ symbol: "ASML", name: "ASML Holding NV" },
		{ symbol: "CRWD", name: "Crowdstrike Holdings" },
		{ symbol: "TEAM", name: "Atlassian" },
		{ symbol: "MCHP", name: "Microchip Technology" },
		{ symbol: "DXCM", name: "Dexcom" },
		{ symbol: "EA", name: "Electronic Arts" },
		{ symbol: "AZN", name: "AstraZeneca PLC ADR" },
		{ symbol: "CTSH", name: "Congnizant" },
		{ symbol: "WDAY", name: "Workday" },
		{ symbol: "ROST", name: "Ross" },
		{ symbol: "DLTR", name: "Dollar TTree" },
		{ symbol: "PDD", name: "Pinduoduo" },
		{ symbol: "ILMN", name: "Illumina" },
		{ symbol: "PCAR", name: "PACCAR" },
		{ symbol: "WBA", name: "Walgreens" },
		{ symbol: "BIIB", name: "Biogen" },
		{ symbol: "IDXX", name: "IDEXX Laboratories" },
		{ symbol: "ODFL", name: "Old Dominion Fright Line" },
		{ symbol: "VRSK", name: "Verisk Analytics" },
		{ symbol: "JD", name: "JD.com" },
		{ symbol: "CEG", name: "Consellation Engery" },
		{ symbol: "BIDU", name: "Baidu" },
		{ symbol: "LCID", name: "Lucid Group" },
		{ symbol: "FAST", name: "Fastenal" },
		{ symbol: "DDOG", name: "Datadog" },
		{ symbol: "SGEN", name: "Seagen" },
		{ symbol: "CPRT", name: "Copart" },
		{ symbol: "ZS", name: "Zscaler" },
		{ symbol: "EBAY", name: "eBay" },
		{ symbol: "SIRI", name: "Sirius XM" },
		{ symbol: "ANSS", name: "ANSYS" },
		{ symbol: "ZM", name: "Zoom" },
		{ symbol: "VRSN", name: "VeriSign" },
		{ symbol: "ALGN", name: "Align Technology" },
		{ symbol: "MTCH", name: "Match" },
		{ symbol: "SWKS", name: "Skyworks" },
		{ symbol: "SPLK", name: "Splunk" },
		{ symbol: "NTES", name: "NetEase" },
	]);
	await sequelize.models.transactions.bulkCreate([
		{
			email: "test@gmail.com",
			symbol: "AAPL",
			price: 12.5,
			amount: 2,
			action: "Buy",
		},
		{
			email: "firefistace@gmail.com",
			symbol: "IBM",
			price: 5.5,
			amount: 5,
			action: "Buy",
		},
		{
			email: "luffym@gmail.com",
			symbol: "IBM",
			price: 5.5,
			amount: 3,
			action: "Buy",
		},
	]);

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
				console.log(obj);
				(async (res, req) => {
					var symbol = value;
					var stockPrice = await scraperWeb(value).then(function (price) {
						price = parseFloat(price);

						results.push({ symbol, price });
						counter++;
						console.log("$Symbol:" + symbol + " Price:" + price + "$");
						if (counter == jsonFile.length) {
							(async () => {
								console.log(results);
								await sequelize.models.stock_data.bulkCreate(results);
							})();
						}
						console.log(counter);
					});
					// results.push({ symbol, price });
					console.log("-------------------");
				})();
			});
		});
	})();

	console.log("Done!");
}

reset();
