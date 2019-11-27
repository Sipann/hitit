<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="8" offset-sm="2" lg="6" offset-lg="3">
        <v-card class="pa-5">
          <v-container class="pa-5">
            <v-form v-model="isFormValid" lazy-validation ref="form" @submit.prevent="signinUser">
              <h3 v-if="errorMessage">{{ errorMessage }}</h3>
              <v-row>
                <v-text-field v-model="email"
                  prepend-icon="mdi-mail" 
                  label="Email" 
                  type="text"
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
              <v-row class="ma-4 d-flex justify-end">
                <v-btn class="ml-3" type="submit">Signin</v-btn>
              </v-row>
              <v-divider></v-divider>
              <v-row class="ma-4 d-flex align-center">
                <v-col cols="4">
                  <h3>Don't have an account?</h3>
                </v-col>
                <v-col cols="4"> 
                  <v-btn @click="goToSignup">Signup</v-btn>
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
import firebase from 'firebase';

export default {
  name: 'Signin',
  data() {
    return {
      email: '',
      errorMessage: '',
      isFormValid: true,
      password: '',

      // form validation rules
      emailRules: [
        email => !!email || 'Please enter your email',
        email => {
          let regex = (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email));
          return !!regex || 'This is not a valid email address';
        },
      ],
      passwordRules: [
        password => !!password || 'Please enter your password',
      ],
    };
  },

  methods: {
    goToSignup() {
      this.$router.push('/enter/signup');
    },

    async signinUser() {
      if (this.$refs.form.validate()) {
        this.errorMessage = '';
        try {
          await firebase.auth().signInWithEmailAndPassword(this.email, this.password);
          this.$refs.form.reset();
          this.$router.push({ name: 'Targets' });
        } catch (err) {
          console.log('err', err);
          this.errorMessage = 'We could not find an account with these credentials';
        }
      }
    },

  },
}
</script>

