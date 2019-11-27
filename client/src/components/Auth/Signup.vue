<template>
  <v-container>
    <v-btn @click="signupTest">TEST</v-btn>
    <v-row>
      <v-col cols="12" sm="8" offset-sm="2" lg="6" offset-lg="3">
        <v-card class="pa-5">
          <v-container class="pa-5">
            <v-form v-model="isFormValid" lazy-validation ref="form" @submit.prevent="signupUser">
              <h3 v-if="errorMessage">{{ errorMessage }}</h3>
              <v-row>
                <v-text-field v-model="username"
                  prepend-icon="mdi-face" 
                  label="Username" 
                  type="text"
                  :rules="usernameRules"
                  required></v-text-field>
              </v-row>
              <v-row>
                <v-text-field v-model="email"
                  prepend-icon="mdi-email" 
                  label="Email" 
                  type="email"
                  :rules="emailRules"
                  validate-on-blur
                  required></v-text-field>
              </v-row>
              <v-row>
                <v-text-field v-model="password"
                  prepend-icon="mdi-textbox-password"
                  label="Password"
                  type="password"
                  :rules="passwordRules"
                  required></v-text-field>
              </v-row>
              <v-row>
                <v-text-field v-model="passwordConfirmation"
                  prepend-icon="mdi-textbox-password"
                  label="Confirm Password"
                  type="password"
                  :rules="passwordRules"
                  validate-on-blur
                  required></v-text-field>
              </v-row>
              <v-row class="ma-4 d-flex justify-end">
                <v-btn class="ml-3" type="submit">Signup</v-btn>
              </v-row>
              <v-divider></v-divider>
              <v-row class="ma-4 d-flex align-center">
                <v-col cols="4">
                  <h3>Already have an account?</h3>
                </v-col>
                <v-col cols="4"> 
                  <v-btn @click="goToSignin">Signin</v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card>
      </v-col>
    </v-row>     
  </v-container>
</template>

<script>

import db from '@/firebase/init';
import firebase from 'firebase';
import { CREATE_USER, UPDATE_CATEGORIES } from '@/queries';
// import { GET_USER_DATA } from '@/queries';

export default {
  name: 'Signup',

  data() {
    return {
      email: '',
      errorMessage: '',
      isFormValid: true,
      password: '',
      passwordConfirmation: '',
      username: '',
      // form validation rules
      emailRules: [
        email => !!email || 'Please enter your email',
        email => {
          let regex = (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email));
          return !!regex || 'This is not a valid email address';
        },
      ],
      usernameRules: [
        username => !!username || 'Please enter your username',
      ],
      passwordRules: [
        password => !!password || 'Please enter your password',
        confirmation => confirmation === this.password || 'Passwords must match',
      ],
    };
  },

  methods: {

    goToSignin() {
      this.$router.push('/enter/signin');
    },

    async signupTest() {
      console.log('test...');
      try {
        const variables = {
          username: this.$store.state.user.username,
          categories: [ { title: 'cat1', order: 0, color: '#555555'} ],
        };
        await this.$apollo.mutate({
          mutation: UPDATE_CATEGORIES,
          variables,
        }); 
      } catch (err) {
        console.log('err', err);
      }
    },

    async signupUser() {
      if (this.$refs.form.validate()) {
        this.errorMessage = '';

        try {
          let ref = db.collection('users').doc(this.username);
          let doc = await ref.get();
          if (doc.exists) {
            let docExistsError = new Error();
            docExistsError.name = 'docExists';
            docExistsError.message = 'This username is already in use';
            throw docExistsError;

          } else {

            let cred = await firebase.auth().createUserWithEmailAndPassword(this.email, this.password);
            // console.log('cred', cred); 

            const variables = { userId: cred.user.uid, username: this.username };
            console.log('calling CREATE_USER with variables', variables);
            let data = await this.$apollo.mutate({
              mutation: CREATE_USER,
              variables,
            });
            console.log('data', data);
            let userData = data.data.createUserInStore;
            
            this.$store.commit('setUser', userData);

            this.$refs.form.reset();
            this.$router.push({ name: 'Targets' });
          }
        } catch (err) {
          if (err.name === 'docExists') {
            this.errorMessage = err.message;
          } else if (err.code === 'auth/email-already-in-use') {
            this.errorMessage = 'This email address is already in use by another account';
          } else {
            this.errorMessage = 'Ooops! We have a problem.';
            console.log('err', err.message);
          }
        }
      }
    },
  },

}
</script>

<style lang="css">
  
</style>
