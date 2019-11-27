import { gql } from 'apollo-boost';

// Query

export const GET_USER_DATA = gql`
  query ($userId: ID!) {
    user (userId: $userId) {
      user_id
      username
      display_preference
      targets {
        title
        category
        done
        duration 
        end_date
        period
        recurring
        steps {
          title
          done
        }
        time_limit
        time_start
        time_unit
      }
      target_categories {
        title
        color
        order
      }
    }
  }
`;


// Mutation

export const CREATE_USER = gql`
  mutation ($userId: String, $username: String) {
    createUserInStore (userId: $userId, username: $username) 
    {
      username
      user_id
      display_preference
      targets {
        title
      }
      target_categories {
        title
      }
    }
  }
`;

export const DELETE_USER_IN_STORE = gql`
  mutation ($username: String) {
    deleteUserInStore (username: $username) 
  }
`;

// export const CREATE_TARGET = gql`
//   mutation ($username: String, $target: TargetInput) {
//     createTarget ( username: $username, target: $target) {
//       category 
//       done
//       duration
//       end_date
//       period
//       recurring
//       steps {
//         title
//         done
//       }
//       time_limit
//       time_start
//       time_unit
//       title
//     }
//   }
// `;

export const CREATE_TARGET = gql`
  mutation ($username: String, $target: TargetInput) {
    createTarget ( username: $username, target: $target) {
      username
      user_id
      display_preference
      targets {
        title
      }
      target_categories {
        title
      }
    }
  }
`;

export const UPDATE_DISPLAY_ORDER = gql`
  mutation ($userId: ID, $display: String) {
    updateDisplayPreference (userId: $userId, display: $display) {
      display_preference
    }
  }
`;

export const UPDATE_CATEGORIES = gql`
  mutation ($username: String, $categories: [CategoryInput]) {
    updateCategories (username: $username, categories: $categories) {
      title 
      color
      order
    }
  }
`;

export const UPDATE_TARGETS = gql`
  mutation ($username: String, $targets: [TargetInput]) {
    updateTargets (username: $username, targets: $targets) {
      user_id
      username
      targets {
        title
        category
      }
      target_categories {
        title
        color
        order
      }
    }
  }
`;



// export const SET_TARGET_DONE = gql`
//   mutation ($userId: ID, $targets: [TargetInput]) {
//     setTargetDone (userId: $userId, targets: $targets) {
//       user_id
//       username
//       targets {
//         title
//         category
//       }
//       target_categories {
//         title
//         color
//         order
//       }
//     }
//   }
// `;

// export const DELETE_TARGET = gql`
//   mutation ($userId: ID, $targets: [TargetInput]) {
//     deleteTarget(userId: $userId, targets: $targets) {
//       user_id
//       username
//     }
//   }
// `;