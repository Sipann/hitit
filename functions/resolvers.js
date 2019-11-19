const admin = require('firebase-admin');
let db = admin.firestore();

const resolvers = {
  Query: {
    
    users: async () => {
      try {
        const snapshot = await db.collection('users').get();
        return snapshot.docs.map(doc => doc.data());
      } catch (err) {
        console.log(err);
      }
    },

    user: async (_, { userId }) => {
      try {
        let ref = db.collection('users').doc(userId);
        let doc = await ref.get();
        if (doc.exists) { return doc.data(); } 
        else { throw new Error('no such document'); }
      } catch (err) {
        console.log('err', err);
      }
    }
  }
};

module.exports = resolvers;



