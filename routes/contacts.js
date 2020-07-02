const express = require('express');
const router = express.Router();

const Contact = require('../models/Contact');

const isLoggedIn = (req, res, next) => {
    if (req.user) {
      next()
    }else {
      res.sendStatus(401);
    }
}

router.get('/contacts/add', isLoggedIn, (req, res)=>{
    const User = req.user.displayName; 
    res.render('contacts/new-contact', {user: User});
});

router.post('/contacts/new-contact', isLoggedIn, async (req,res)=>{
    const {contactName, contactLastname, contactEmail, contactBirthday} = req.body;
    let errors =[];
    if(!contactName){
        errors.push({text: 'Por favor escriba el nombre del contacto'});
    }
    if(!contactLastname){
        errors.push({text:'Por favor escriba el apellido del contacto'});
    }
    if(!contactEmail){
        errors.push({text:'Por favor escriba el correo electrónico del contacto'});
    }
    if(!contactBirthday){
        errors.push({text:'Por favor escriba la fecha de nacimiento del contacto'});
    }
    if(errors.length > 0){
        res.render('contacts/new-contact',{
            errors,
            contactName,
            contactLastname,
            contactEmail,
            contactBirthday
        });
    }else{
        const newContact = new Contact({contactName, contactLastname, contactEmail, contactBirthday}); 
        await newContact.save(); 
        res.redirect('/contacts');
    }
});

router.get('/contacts', isLoggedIn, async (req, res)=>{

    const User = req.user.displayName; 
    await Contact.find({}).sort({date: 'desc'}).then(
        documents => {
            const context = {
                contacts: documents.map(document => {
                    return { 
                        _id: document._id,
                        contactName: document.contactName,
                        contactLastname: document.contactLastname,
                        contactEmail: document.contactEmail,
                        contactBirthday: document.contactBirthday,
                        user: User,
                        date: document.date, 
                    }
                })
            }
            //console.log(documents);
            //console.log(context);
            res.render('contacts/all-contacts', {contacts: context.contacts, user: User});
        });
});

router.get('/contacts/edit/:id',async (req, res)=>{
    const User = req.user.displayName; 
    await Contact.findById(req.params.id).then(
        document => {
            const contact = {
                        _id: req.params.id,
                        contactName: document.contactName,
                        contactLastname: document.contactLastname,
                        contactEmail: document.contactEmail,
                        contactBirthday: document.contactBirthday,
                        date: document.date
                }
                //console.log(contact);
                res.render('contacts/edit-contact', {contact, user: User});
            }
        );
    
});

router.put('/contacts/edit-contact/:id', isLoggedIn,async (req, res)=>{
   const {contactName, contactLastname, contactEmail, contactBirthday} = req.body;
   let errors =[];
    if(!contactName){
        errors.push({text: 'Por favor escriba el nombre del contacto'});
    }
    if(!contactLastname){
        errors.push({text:'Por favor escriba el apellido del contacto'});
    }
    if(!contactEmail){
        errors.push({text:'Por favor escriba el correo electrónico del contacto'});
    }
    if(!contactBirthday){
        errors.push({text:'Por favor escriba la fecha de nacimiento del contacto'});
    }
    if(errors.length > 0){
        res.render('contacts/new-contact',{
            errors,
            contactName,
            contactLastname,
            contactEmail,
            contactBirthday
        });
    }else{
        await Contact.findByIdAndUpdate(req.params.id,{contactName, contactLastname, contactEmail, contactBirthday}); 
        res.redirect('/contacts');
    }
});

router.delete('/contacts/delete/:id', isLoggedIn, async (req, res)=>{
    await Contact.findByIdAndDelete(req.params.id); 
    res.redirect('/contacts');
});

module.exports = router;