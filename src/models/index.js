
const { Sequelize, Model, DataTypes,Deferrable  } = require('sequelize');
const { applyExtraSetup } = require('./extra');
//
// const sequelize = new Sequelize({
//   dialect: 'sqlite',
//   storage: './backend/models/database.sqlite'
// });
//
// sequelize.authenticate().then(() => {
//    console.log('Connection has been established successfully.');
// }).catch((error) => {
//    console.error('Unable to connect to the database: ', error);
// });
//
// const Users = sequelize.define("Users", {
//     id: {type: DataTypes.UUID,defaultValue: DataTypes.UUIDV4,primaryKey: true},
//     firstName:DataTypes.STRING,
//     lastName: DataTypes.STRING,
//     email:  DataTypes.STRING,
//     password: DataTypes.STRING,
//     balance: { type: DataTypes.DECIMAL(10,2), defaultValue: 1000 }
//     });
// const Stocks = sequelize.define("Stocks", {
//     symbol: DataTypes.STRING,
//     price: DataTypes.DECIMAL(10,2),
//     });
// const User_Stocks = sequelize.define("User_Stocks", {
//     id: { type: DataTypes.INTEGER, primaryKey: true ,references: { model: Users, key: 'id' }},
//     symbol: { type: DataTypes.STRING, primaryKey: true,references: { model: Stocks, key: 'symbol'}},
//     price: DataTypes.DECIMAL(10,2),
//     amount: DataTypes.DECIMAL(10,2),
//     });

//
//
//  (async () => {
//    await sequelize.sync({ force: true });
//     const jane = await User.create({ firstName: "Tej", lastName: "Patel", email: "te@gmail.com", password:"words" , balance:100  });
//     console.log(jane.firstName); // "Jane"
//     console.log(jane.lastName); // "green"
//  })();



const sequelize = new Sequelize('') // Example for postgres


const modelDefiners = [
	require('./user.model'),
	require('./stock.model'),
	require('./stock_data.model'),
    require('./transactions.model'),
    require('./user_owns.model'),

	// Add more models here...
	// require('./models/item'),
];

// We define all models according to their files.
for (const modelDefiner of modelDefiners) {
	modelDefiner(sequelize);
}

// We execute any extra setup after the models are defined, such as adding associations.
// applyExtraSetup(sequelize);

// We export the sequelize connection instance to be used around our app.
module.exports = sequelize;
