// const {
//     MongoClient,
//     ObjectID
// } = require('mongodb')
// const chalk = require('chalk');

// const log = console.log;

// const id = new ObjectID('5d8191eb138a290ec8fc8cef')

// const connectionUrl = 'mongodb://127.0.0.1:27017'
// const dbName = 'taskManager';

// MongoClient.connect(connectionUrl, {
//     useUnifiedTopology: true,
//     useNewUrlParser: true
// }, (error, client) => {
//     if (error) {
//         return log(chalk.redBright.bold.inverse("!!!!! Unable to connect to Mongo !!!!!"))
//     }

//     const db = client.db(dbName);

//     log(chalk.green.bold.inverse("<<<<< You are connected to Mongo >>>>>"))

// })