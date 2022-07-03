const contactRouter = require('express').Router()
const Contact = require('../models/contact')
const User = require('../models/user')
const jwt = require('jsonwebtoken');
require('express-async-errors')

/**
 * If the authorization header starts with the string 'bearer ', return the part after that. Otherwise,
 * return null
 * @returns The token
 */
const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if(authorization && authorization.toLowerCase().startsWith('bearer ')){
        return authorization.substring(7)
    }
    return null
}

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

    /* Getting the token from the request. */
    const token = getTokenFrom(req)
    /* Verifying the token. */
    //El objeto decodificado del token contiene los campos username y id,
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if(!token || !decodedToken.id) {
        return res.status(401).json({error: 'Token is missing or invalid'})
    }

    const user = await User.findById(decodedToken.id)

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