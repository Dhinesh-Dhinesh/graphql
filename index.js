const express = require('express');
const { graphqlHTTP }= require('express-graphql')
const schema = require('./schema/schema')
const mongoose = require('mongoose');

const app = express();

//Connextion for mongodb Atlas
mongoose.connect('mongodb+srv://dhi:b1iaLJhL5osi7N8V@cluster0.kkndm.mongodb.net/graph?retryWrites=true&w=majority',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB Atlas');
})

mongoose.connection.on('error', (err) => {
    console.log('Error in MongoDB Atlas: ', err);
})

//Declaration of end points

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true,
}))

app.listen(4000,()=>{
    console.log('Server is running');
})