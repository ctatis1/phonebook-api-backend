const mongoose = require('mongoose');

const URL = process.env.MONGODB_URI
console.log('Connection to', URL);

mongoose.connect(URL)
    .then(result => {
        console.log('Connected to MongoDB');
    })
    .catch(error => {
        console.log('Error connecting to MongoDB: ', error.message);
    })

const personSchema = new mongoose.Schema({
    name: String,
    number: Number, 
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
});

module.exports = mongoose.model('Person', personSchema);
