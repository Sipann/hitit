const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Target {
    id: ID
    title: String
  }

  type User {
    username: String
    email: String
    user_id: ID
    targets: [Target]
  }

  type Query {
    users: [User]
    user(userId: ID): User
  }

  type Mutation {
    addTarget(
      userId: ID, 
      targetTitle: String
      ) : Target
  }
`;

module.exports = typeDefs;