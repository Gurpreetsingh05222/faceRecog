const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

//DATABASE CONNECTION WITH KNEX

const db = knex({
  client: 'mysql',
  connection: {
    host : '127.0.0.1', //
    user : '', // Database username
    password : '', //Database password
    database : 'faceRecog' //Database name
  }
});


const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) =>{
	res.send(database.users);
})

//SIGNIN USER

app.post('/signin', (req, res) => {
	signin.handleSignin(req, res, db, bcrypt)
})

//REGISTER USER

app.post('/register', (req, res) => {
	register.handleRegister(req, res, db, bcrypt)
})

//USER PROFILE

app.get('/profile/:id', (req, res) => {
	profile.handleProfile(req, res, db)
})

//IMAGE SEARCH COUNT

app.put('/image', (req, res) => {
	image.handleImage(req, res, db)
})

//SERVER PORT LISTEN
app.listen(3000, () => {
	console.log('Server is running on port 3000');
})