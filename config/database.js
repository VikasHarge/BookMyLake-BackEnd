const mongoose = require("mongoose");



const connectDataBase = () => {
  //Connectioon promise with Database
  mongoose
    .connect(process.env.DB_URL)
    .then((data) => {
      console.log(`Mongodb connected with : ${data.connection.name}`);
    })
};
 

module.exports = connectDataBase;
