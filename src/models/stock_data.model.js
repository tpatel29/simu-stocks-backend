const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
	sequelize.define(
		"stock_data",
		{
			symbol: { primaryKey: true, type: DataTypes.STRING },
			price: DataTypes.DECIMAL(10, 2),
		},
		{
			timestamps: false,
			createdAt: false,
			updatedAt: false,
		}
	);
};
