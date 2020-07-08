const express = require('express');
const router = express.Router();

const Contact = require('../models/Contact');
const cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: 'dmkawtayh',
    api_key: '217793574668577',
    api_secret: 'PDLibJjWk4TQSBlxls62dRhNDok'
});

const fs = require('fs-extra');

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
    if(!req.file){
        errors.push({text: 'La imagen del contacto es necesaria'});
    } 
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
        const {path} = req.file;
        const {public_id, secure_url} = await cloudinary.v2.uploader.upload(path);

        const newContact = new Contact({contactName, contactLastname, contactEmail, contactBirthday, imageUrl:secure_url,public_id}); 
        await newContact.save();
        await fs.unlink(path);
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
                        imageUrl: document.imageUrl,
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
    const {public_id} = await Contact.findByIdAndDelete(req.params.id);
    await cloudinary.v2.uploader.destroy(public_id);
    res.redirect('/contacts');
});

module.exports = router;