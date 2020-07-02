const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');//para las plantillas
const methodOverride = require('method-override'); //para enviar métodos PUT DELETE 

const cors = require('cors');
const passport = require('passport');
const cookieSession = require('cookie-session');
require('./config/google-auth');

//Initiliazations
const app = express();
const db = require('./db'); 
app.use(cookieSession({
    name: 'test-session',
    keys: ['key1', 'key2']
  }));
app.use(passport.initialize());
app.use(passport.session());


//login methods and routes
app.get('/failed', (req, res, next)=>{
    res.send('Login failed');
});
app.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/contacts');
  });

app.get('/logout', (req, res) => {
  req.session = null;
  req.logout();
  res.redirect('/');
});
  

//Settings
app.set('port', process.env.PORT || 8080);
app.set('views', path.join(__dirname,'views'));
app.engine('.hbs',exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'),'layouts'),//para incluir los diseños
    partialsDir: path.join(app.get('views'),'partials'),//para incluir formularios por ejemplo
    extname: '.hbs'
}));
app.set('view engine','.hbs');

//Middlewares
app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'));
 

//Routes
app.use(require('./routes/index'));
app.use(require('./routes/contacts'));

//Static Files
app.use(express.static(path.join(__dirname,'public')));

//Server is listening
app.listen(app.get('port'),()=>{
    console.log('Server rinning on port ', app.get('port'));
});