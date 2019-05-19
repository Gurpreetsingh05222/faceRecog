const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

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
	db.select('email', 'hash').from('login')
	.where('email', '=' , req.body.email)
	.then(data => {
		// hashed password compariso
		const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
		if(isValid){
			return db.select('*').from('users')
				.where('email', '=' , req.body.email)
				.then(user => {
					res.json(user[0])
				})
				.catch(err => res.status(400).json('Unable to get user'))
			}else{
				res.status(400).json('wrong credentials')
			}
		})
	.catch(err => res.status(400).json('wrong credentials'))
})

//REGISTER USER

app.post('/register', (req, res) => {
	const {email, name, password} = req.body;
	//Hashing password
	const hash = bcrypt.hashSync(password);
	db.transaction(trx => {
		trx.insert({
			hash: hash,
			email: email
		})
		.into('login')
		.returning('email')
		.then(loginEmail => {
			return trx('users')
			.returning('*')
			.insert({
				email: loginEmail[0],
				name: name,
				joined: new Date()
			})
			.then(user => {
				res.json(user[0]);
			})
		})
		.then(trx.commit)
		.catch(trx.rollback)
	})
	.catch(err => res.status(400).json('Unable to register'))
})

//USER PROFILE

app.get('/profile/:id', (req, res) => {
	const {id} = req.params;
	db.select('*').from('users').where({id})
		.then(user => {
			if(user.length){
				res.json(user[0])
			}else{
				res.status(400).json('Not found')
			}
	}).catch(err => res.status(400).json('error getting user'))
})

//IMAGE SEARCH COUNT

app.put('/image', (req, res) => {
	const {id} = req.body;
	db('users').where('id', '=', id)
	.increment('entries', 1)
	.returning('entries')
	.then(entries => {
		res.json(entries[0]);
	})
	.catch(err => res.status(400).json('error getting data'))
})

//SERVER PORT LISTEN
app.listen(3000, () => {
	console.log('Server is running on port 3000');
})