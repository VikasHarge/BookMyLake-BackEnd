const mongoose = require("mongoose");



const connectDataBase = () => {
  //Connectioon promise with Database
  mongoose
    .connect('mongodb+srv://Vikas_Harge:VikasHarge25111997@cluster0.rv6pve3.mongodb.net/Pawna-Lake?retryWrites=true&w=majority')
    .then((data) => {
      console.log(`Mongodb connected with : ${data.connection.name}`);
    })
};
 

module.exports = connectDataBase;
