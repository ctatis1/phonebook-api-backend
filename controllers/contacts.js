const contactRouter = require('express').Router()
const Contact = require('../models/contact')
const User = require('../models/user')
require('express-async-errors')

contactRouter.get('/' , async (request, response) =>{
    const contacts = await Contact.find({})
    response.json(contacts)
});

contactRouter.get('/:id', async(req, res, next) => {
    const contact = await Contact.findById(req.params.id)
    if(contact){
        res.json(contact)
    }else{
        res.status(404).end()
    }

    
});

contactRouter.delete('/:id', async (req, res, next) => {
    const contact = await Contact.findByIdAndRemove(req.params.id)
    res.json(204).end()
});


contactRouter.post('/' , async (req,res) => {
    const body = req.body
    const user = await User.findById(body.userId)

    if (body.name === undefined) {
        return res.status(400).json({ error: 'content missing' })
    }

    const contact = new Contact({
        name: body.name,
        number: body.number,
        user: user._id
    })

    const savedContact = await contact.save()
    user.contacts = user.contacts.concat(savedContact._id);
    await user.save();
    res.json(savedContact)
});

contactRouter.put('/:id', async (req,res, next) => {
    const body = req.body

    const newContact = {
        name: body.name,
        number: body.number
    }

    const updatedContact = await Contact.findByIdAndUpdate(req.params.id, newContact, { new: true })
    res.json(updatedContact)
});

module.exports = contactRouter