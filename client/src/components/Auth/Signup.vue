<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="8" offset-sm="2" lg="6" offset-lg="3">
        <v-card class="pa-5">
          <v-container class="pa-5">
            <v-form v-model="isFormValid" lazy-validation ref="form" @submit.prevent="signupUser">
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
                  required></v-text-field>
              </v-row>
              <v-row class="ma-4 d-flex justify-end">
                <v-btn class="ml-3" type="submit">Signup</v-btn>
              </v-row>
              <v-divider></v-divider>
              <!-- <v-row class="ma-4 d-flex align-center">
                <v-col cols="4">
                  <h3>Already have an account?</h3>
                </v-col>
                <v-col cols="4"> 
                  <v-btn @click="goToSignin">Signin</v-btn>
                </v-col>
              </v-row> -->
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

export default {
  name: 'Signup',

  data() {
    return {
      isFormValid: true,
      email: '',
      username: '',
      password: '',
      passwordConfirmation: '',
      // form validation rules
      emailRules: [
        email => !!email || 'Please enter your email',
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
    // goToSignin() {
    //   this.$router.push('/enter/signin');
    // },
    signupUser() {
      if (this.$refs.form.validate()) {

        let ref = db.collection('users').doc(this.username)
        ref.get().then(doc => {
          if (doc.exists) {
            console.log('already exists');
          } else {
            firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
              .then(cred => {
                ref.set({
                  targets: [],
                  user_id: cred.user.uid,
                })
              })
              .then(() => {
                this.$router.push({ name: 'Targets' })
              })
              .catch(err => {
                console.log('err', err.message);  // Can do something with the err / err.message to display to the user
              });
          }
        })


        // let user = {
        //   username: this.username,
        //   email: this.email,
        //   password: this.password,
        // };
        // console.log('sign up user');
        // console.dir(user);
        // // SIGN IN USER WHEN AUTH SET
        // this.$refs.form.reset();
      }
    },
  },


}
</script>

<style lang="css">
  
</style>
