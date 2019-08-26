// imports expressjs which is a function
const express = require('express')
// assigning variable for the express function
const app = express()
// imports bcrypt for secure encryption of passwords
const bcrypt = require('bcrypt')

// during POST request, this code will allow our app will be able to receive json data
app.use(express.json())

// this is our data
// in real world example this should be stored in a database
const users = []

// method for get request to get all data from database 
app.get('/users', (req, res) => {
    res.json(users)
})


// post request method which is used to send data to our database
// we use async for our asynchronous call 
app.post('/users', async (req, res) => {

    // this method generates a unique appendix which will be appended tp our hashed password
    // we use the await for our asynchronous call
        //we are commenting this because bcrypt has another way of combining salting and hashing
    const salt = await bcrypt.genSalt()

    // this code generates a hashed password from the password in our collected post request
    // we use req.body.password to pass our password to the method
        // we add 10 to the method for salting the password
        // 10 is the default value
    const hashedPassword = await bcrypt.hash(req.body.password, 10)

    // we are creating our new data with the username and password from the collected post request
    // to be passed to our stored data in the database
    // we are now using the hashed password
    const user = { username: req.body.username, password: hashedPassword }
    users.push(user)
    res.json(users)
})


// logging in method
app.post('/users/login', async (req, res) => {
    const user = users.find(user => user.username === req.body.username)
    if(user == null) {
        return res.status(400).send('Cannot find user')
    }
    try {
        // compares collected password and the password from the database
        // first argument is our collected password
        // second argument is the hashed password which will be unsalted due to compare method
        if (await bcrypt.compare(req.body.password, user.password)) {
            res.send('Success')
        } else {
            res.send('Not Allowed')
        }
    } catch (error) {
        res.status(500).send()
    }
})

app.listen(3000)