const admin = require('firebase-admin');
let db = admin.firestore();

const resolvers = {

  Query: {

    user: async (_, { userId }) => {
      // console.log('received userId', userId);
      try {
        let user = {};
        let ref = db.collection('users');
        let snapshot = await ref.where('user_id', '==', userId).get();
        snapshot.forEach(doc => {
          // console.log('doc.data()', doc.data());
          user = doc.data();
        });
        return user ? user : {};
      } catch (err) {
        console.log('err', err);
      }
    },
    
  },

  Mutation: {

    deleteUserInStore: async (_, { username }) => {
      try {
        let ref = db.collection('users').doc(username);
        await ref.delete();
        return true;
      } catch (err) {
        console.log('err', err);
      }
    },

    createUserInStore: async (_, { userId, username }) => {
      // console.log('calling createUserInStore with args: userId -', userId, 'and username -', username);
      try {
        let data = {
          username: username,
          user_id: userId,
          targets: [],
          target_categories: [],
          display_preference: 'deadline',
        };
        
        await db.collection('users').doc(username).set(data);

        let newDoc = await db.collection('users').doc(username).get();
        if (newDoc.exists) { return newDoc.data(); }
        else { console.log('newDoc does not exist'); }

      } catch (err) {
        console.log('err', err);
      }
    },

    createTarget: async (_, { username, target }) => {
      console.log('calling createTarget with args: username', username, 'target', target);
      try {
        let ref = db.collection('users').doc(username);
        // console.log('ref', ref);
        await ref.update({
          targets: admin.firestore.FieldValue.arrayUnion(target)
        });
        let newDoc = await db.collection('users').doc(username).get();
        if (newDoc.exists) { return newDoc.data(); }
        else { console.log('newDoc does not exist'); }

        // return true;
      } catch (err) {
        console.log('err', err);
      }
    },

    updateDisplayPreference: async (_, { userId, display }) => {
      try {
        let ref = db.collection('users').doc(userId);
        await ref.update({ display_preference: display });
        return ref;
      } catch (err) {
        console.log('err', err);
      }
    },

    updateCategories: async (_, { username, categories }) => {
      try {
        let ref = db.collection('users').doc(username);
        await ref.update({ target_categories: categories });
        return categories;  
      } catch (err) {
        console.log('err', err);
      }
    },

    updateTargets: async (_, { username, targets }) => {
      try {
        let ref = db.collection('users').doc(username);
        await ref.update({ targets: targets })
        let newDoc = await db.collection('users').doc(username).get();
        if (newDoc.exists) { return newDoc.data(); }
        else { console.log('newDoc does not exist'); }
      } catch (err) {
        console.log('err', err);
      }
    },

  }

};

module.exports = resolvers;





// users: async () => {
    //   try {
    //     const snapshot = await db.collection('users').get();
    //     return snapshot.docs.map(doc => doc.data());
    //   } catch (err) {
    //     console.log(err);
    //   }
    // },

    // Step: async (parent, { targetTitle }) => {
  //   try {
  //     let ref = db.collection('users').doc(parent.username);
  //     let target = await ref.get().data().targets.where(title === targetTitle);
  //     console.log('target', target);
  //     return target.steps || [];
  //   } catch (err) {
  //     console.log('err', err);
  //   }
  // },

  // userByEmail: async (_, { userEmail }) => {
    //   try {
    //     let ref = db.collection('users');
    //     let doc = await ref.where(email === userEmail).get();
    //     if (doc.exists) { return doc.data(); }
    //     else { throw new Error('no such document'); } 
    //   } catch (err) {
    //     console.log('err', err);
    //   }
    // },

    // setTargetDone: async (_, { userId, targets }) => {
    //   try {
    //     let ref = db.collection('users').doc(userId);
    //     await ref.update({ targets: targets })
    //     return ref;
    //   } catch (err) {
    //     console.log('err', err);
    //   }
    // },

    // deleteTarget: async (_, { userId, targets }) => {
    //   try {
    //     let ref = db.collection('users').doc(userId);
    //     await ref.update({ targets: targets })
    //     return ref;
    //   } catch (err) {
    //     console.log('err', err);
    //   }
    // }