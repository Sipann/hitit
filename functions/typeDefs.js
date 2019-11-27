const { gql } = require('apollo-server-express');

const typeDefs = gql`

  input TargetInput {
    category: String
    done: Boolean
    duration: Int
    end_date: String
    period: Period
    recurring: Boolean
    steps: [StepInput]
    time_limit: String
    time_start: String
    time_unit: TimeUnit
    title: String
  }

  type Target {
    category: String
    done: Boolean
    duration: Int
    end_date: String
    period: Period
    recurring: Boolean
    steps: [Step]
    time_limit: String
    time_start: String
    time_unit: TimeUnit
    title: String
  }

  enum TimeUnit {
    MINUTES
    HOURS
    DAYS
  }

  enum Period {
    DAY
    WEEK
    MONTH
    QUARTER
    SEMESTER
    YEAR
  }

  type Step {
    title: String
    done: Boolean
  }

  input StepInput {
    title: String
    done: Boolean
  }
  
  type Category {
    title: String
    color: String
    order: Int
  }

  input CategoryInput {
    title: String
    color: String
    order: Int
  }

  type User {
    username: String
    email: String
    user_id: ID
    targets: [Target]
    target_categories: [Category]
    display_preference: String
  }

  # type UserInput {
  #   email: String
    
  # }

  type Query {
    user(userId: ID): User
    # users: [User]
    # userByEmail(userEmail: String): User
  }

  type Mutation {
    createUserInStore(userId: String, username: String): User
    deleteUserInStore(username: String): Boolean
    createTarget(username: String, target: TargetInput): User
    updateDisplayPreference(userId: ID, display: String): User
    updateCategories(username: String, categories: [CategoryInput]): [Category]
    updateTargets(username: String, targets: [TargetInput]): User
    # setTargetDone(userId: ID, targets: [TargetInput]): User
    # deleteTarget(userId: ID, targets: String): User
  }
`;

module.exports = typeDefs;

