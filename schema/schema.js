const graphql = require('graphql');
const _ = require('lodash');

const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLSchema, GraphQLList , GraphQLInt} = graphql

//*Mongoose Schema
const Book = require('../mongo/schema/Book');
const Author = require('../mongo/schema/Author');




//sample Data
// const books = [
//     {name: 'Name of the Wind', genre: 'Fantasy', id: '1' , authorId: '1'},
//     {name: 'The Final Empire', genre: 'Fantasy', id: '2',authorId: '1'},
//     {name: 'The Final', genre: 'Fantasy', id: '3',authorId: '2'},
//     {name: 'The Long Earth', genre: 'Sci-Fi', id: '4',authorId: '3'},
//     {name: 'The Long ', genre: 'Sci-Fi', id: '5',authorId: '2'},
// ]
// const authors = [
//     {name: 'Patrick Rothfuss', age: 44, id: '1'},
//     {name: 'Brandon Sanderson', age: 42, id: '2'},
//     {name: 'Terry Pratchett', age: 66, id: '3'}
// ]



const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id : {type: GraphQLID},
        name: {type: GraphQLString},
        genre: {type: GraphQLString},
        author: {
            type: AuthorType,
            resolve(parent, args) {
                return _.find(authors, {id: parent.authorId})
            }
        }
    })
});

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                return _.filter(books, {authorId: parent.id})
            }
        }
    })
});
//! ROOT Query
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        book: {
            type: BookType,
            args: {id: {type: GraphQLID} },
            resolve(parent, args) {
                //logic for get data from db
                return _.find(books, {id: args.id});
            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                return books;
            }
        },
        author: {
            type: AuthorType,
            args: {id: {type: GraphQLID} },
            resolve(parent, args) {
                //logic for get data from db
                return _.find(authors, {id: args.id});
            }
        },
        authors:{
            type: new GraphQLList(AuthorType),
            resolve(parent, args) {
                return authors;
            }
        }
    }
})

//!Mutation
const Mutation = new GraphQLObjectType({
    name:"Mutation",
    fields: {
        addAuthor: {
            type: AuthorType,
            args:{
                name: {type: GraphQLString},
                age: {type: GraphQLInt}
            },  
            resolve(parent, args) {
                let author = new Author({
                    name: args.name,
                    age: args.age
                })
                return author.save()
            }
        }
    }
});


module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation  
})