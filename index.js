const cors = require('cors');
const { response } = require('express');
const express = require('express');
require('dotenv').config();
const app = express();
const Person = require('./models/person');

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}
  

app.use(express.json());
app.use(requestLogger);
app.use(cors());
app.use(express.static('build'));


app.get('/', (request, response) => {
    response.end('<h1>Hola</h1>');
});

app.get('/api/persons' , (request, response) =>{
    Person.find({})
        .then(people => {
            response.json(people);
        })
    
});

app.get('/info', (req,res) => {
    const tamaño = persons.length;
    const msj = `
        <p>Phonebook has info for ${tamaño} ${tamaño > 1? 'people':'person'}</p>
        <p>${new Date()}</p>
    `;
    res.end(msj);

});

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
        .then(person => {
            res.json(person)
        })
        .catch(error => next(error))
});

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end();
        })
        .catch(error => {
            next(error)
        })
});


app.post('/api/persons' , (req,res) => {
    const body = req.body

    if (body.name === undefined) {
        return res.status(400).json({ error: 'content missing' })
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        res.json(savedPerson)
    })
});

app.put('/api/persons/:id', (req,res, next) => {
    const body = req.body

    const newPerson = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(req.params.id, newPerson, { new: true })
        .then(updatedPerson => {
            res.json(updatedPerson)
        })
        .catch(error => next(error))
});

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001;
app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`);
})