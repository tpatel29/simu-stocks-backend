function applyExtraSetup(sequelize) {
	const { transactions, stock, stock_data } = sequelize.models;
	transactions.hasMany(stock);
	stock.belongsTo(transactions);

	stock_data.hasMany(stock);
	stock.belongsTo(stock_data);
}
module.exports = { applyExtraSetup };
