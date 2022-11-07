const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    bookCount: Int
    savedBooks: [Books]
  }

  type Query {
    me(userId: ID!): User
  }

  type Mutation {
    login
  }
`;

module.exports = typeDefs;