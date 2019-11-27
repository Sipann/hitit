<template>
  <v-card>
    <v-container>
      <v-card-title>
        <h3>Here Are Your Personal Information, {{ username }}</h3>
        <p></p>
      </v-card-title>
      <v-card-text>
        <!-- User info -->
        <v-form v-model="isFormValid" ref="form">
          <v-text-field :disabled="!isUpdating"
            label="Email"
            :rules="emailRules"
            v-model="userEmail"></v-text-field>
          <v-btn :type="isUpdating ? 'submit' : 'button'"
            :disabled="!isFormValid"
            @click.prevent="handleUserUpdate">{{ isUpdating ? 'Save' : 'Update' }}</v-btn>
          <v-divider></v-divider>
          <v-btn type="button" @click.prevent="updateUserPassword">Change Password</v-btn>
          <!-- User unsubscribe -->
          <v-btn type="button" @click.prevent="deleteDialog = true">Delete Account</v-btn>
        </v-form>
      </v-card-text>

      <!-- Password dialog when reauthenticating user -->
      <v-dialog v-model="dialog">
        <v-card>
          <v-container>
            <v-card-title class="headline g rey lighten-2" primary-title>Please Confirm Your Password</v-card-title>
            <v-text-field type="password" v-model="password"></v-text-field>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" text @click="confirmAction">Confirm</v-btn>
              <v-btn color="primary" text @click="clear">Cancel</v-btn>
            </v-card-actions>
          </v-container>
        </v-card>
      </v-dialog>
    </v-container>
  </v-card>
</template>

<script>

import firebase from 'firebase';
import { DELETE_USER_IN_STORE } from '@/queries';


export default {
  name: 'CustomProfile',
  data() {
    return {
      isFormValid: true,
      isUpdating: false,
      userEmail: firebase.auth().currentUser.email,
      password: '',
      deleteDialog: false,
      emailDialog: false,
      // Form Validation Rules
      emailRules: [
        email => !!email || 'Please enter your email',
        email => {
          // let regex = (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email));
          let regex = (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email));
          return !!regex || 'This is not a valid email address';
        },
      ],
    };
  },

  computed: {

    dialog() {
      return this.emailDialog || this.deleteDialog;
    },

    hasChanged() {
      return firebase.auth().currentUser.email !== this.userEmail; 
    },

    username() {
      return this.$store.state.user.username;
    },
  },

  methods: {

    async changeUserEmail() {
      console.log('changeUserEmail');
      try {
        let user = await this.reauthenticateUser();
        await user.updateEmail(this.userEmail);
      } catch (err) {
        console.log('err', err);
      }
    },

    clear() {
      this.userEmail = firebase.auth().currentUser.email;
      this.emailDialog = false;
      this.deleteDialog = false;
      this.isUpdating = false;
    },

    async confirmAction() {
      console.log('confirming');
      if (this.emailDialog && !this.deleteDialog) {
        await this.changeUserEmail();
      } else if (!this.emailDialog && this.deleteDialog) {
        await this.deleteUser();
        this.$router.push('/enter/signup');
      } 
      this.clear();
    },

    async deleteUser() {
      try {
        let user = await this.reauthenticateUser();
        let username = this.$store.state.user.username;
        console.log('username', username);
        await user.delete();
        await this.$apollo.mutate({
          mutation: DELETE_USER_IN_STORE,
          variables: { username: username }, 
        });
        this.$store.commit('setUser', {});
        this.$router.push('/enter/signup');
      } catch (err) {
          console.log('err', err);
      }
    },

    handleUserUpdate(e) {
      e.preventDefault();
      if (this.isUpdating && this.hasChanged && this.$refs.form.validate()) {
        this.emailDialog = true;
      }
      this.isUpdating = !this.isUpdating;
    },

    async reauthenticateUser() {
      console.log('calling reauthenticateUser');
      try {
        let user = firebase.auth().currentUser;
        console.log('user', user);
        let credentials = firebase.auth.EmailAuthProvider.credential(
          user.email,
          this.password
        );
        await user.reauthenticateWithCredential(credentials);
        return user;
      } catch (err) {
        console.log('err', err);
      }
    },

    // TBU To test with real email address
    async updateUserPassword() {
      console.log('update password');
      try {
        await firebase.auth.sendPasswordResetEmail(this.userEmail);
        this.clear();
      } catch (err) {
        console.log('err', err);
      }
    },

  },
}
</script>