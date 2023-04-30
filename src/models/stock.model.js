
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
	sequelize.define('stock', {
		symbol: {primaryKey: true, type: DataTypes.STRING},
		name: DataTypes.STRING,
	},{
       timestamps: false,
       createdAt: false,
       updatedAt: false,
     });
};
