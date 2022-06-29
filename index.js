const { response } = require('express');
const cors = require('cors');
const express = require('express');
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static('build'));

let persons = [
    {
        id: 1,
        name: "Camilo",
        number: 25632115
    },
    {
        id: 2,
        name: "Maria",
        number: 25632115
    },
    {
        id: 3,
        name: "Laura",
        number: 25632115
    },
    {
        id: 4,
        name: "Santiago",
        number: 25632115
    }
];

app.get('/', (request, response) => {
    response.end('<h1>Hola</h1>');
});

app.get('/api/persons' , (request, response) =>{
    response.json(persons);
});

app.get('/info', (req,res) => {
    const tamaño = persons.length;
    const msj = `
        <p>Phonebook has info for ${tamaño} ${tamaño > 1? 'people':'person'}</p>
        <p>${new Date()}</p>
    `;
    res.end(msj);

});

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const person = persons.find(person => person.id === id);
    
    if(person){
        res.json(person);
    }else{
        res.status(404).end();
    }
});

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    persons = persons.filter(person => person.id != id);

    res.status(204).end();
});

const generateID = () => {
    const maxId = 
    persons.length >0 ? 
        Math.max(...persons.map(person => person.id)) 
        : 
        0;
return maxId + 1;
}

app.post('/api/persons' , (req,res) => {
    const body = req.body;

    if(!body.number){
        return res.status(400).json({
            error: 'Number must not be null'
        });
    }

    if(persons.find(person => person.name === body.name)){
        return res.status(400).json({
            error: 'Name must be unique'
        });
    }
    const person = {
        id: generateID(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person);
    
    res.json(person);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`);
})