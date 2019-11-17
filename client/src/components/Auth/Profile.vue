<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-container>
            <v-card-title>
              <h3>Your Personal Information</h3>
            </v-card-title>
            <v-card-text>
              <!-- User info -->
              <v-form v-model="isFormValid" ref="form" lazy-validation>
                <v-text-field :disabled="!isUpdating"
                  label="Username"
                  v-model="user.username"></v-text-field>
                <v-text-field :disabled="!isUpdating"
                  label="Email"
                  v-model="user.email"></v-text-field>

                <v-btn :type="isUpdating ? 'submit' : 'button'"
                  @click="handleUserUpdate">{{ isUpdating ? 'Save' : 'Update' }}</v-btn>

                <v-divider></v-divider>

                <v-btn type="button" @click="updateUserPassword">Change Password</v-btn>

               <!-- User unsubscribe -->
                <v-btn type="button" @click="unregisterUser">Unregister</v-btn>

              </v-form>
            </v-card-text>
          </v-container>
        </v-card>
      </v-col>
    </v-row>

    <!-- User Customization -->
    <v-row>
      <v-col>
        <v-card>
          <v-container>
            <v-card-title>
              <h3>Customize Your Dashboard</h3>
            </v-card-title>
            <v-card-subtitle>Customize Your Categories</v-card-subtitle>
            <v-card-text>
              <!-- Categories Titles && Colors -->
              <v-list-item-group> 
                <v-list-item v-for="category in categories" :key="category.title"
                :ripple="false"
                draggable>
                  <v-list-item-content>
                    <v-row>
                      <v-col :cols="6">
                        <v-text-field v-model="category.title" xs6></v-text-field>
                      </v-col>
                      <v-col :cols="6">
                        <v-color-picker
                        v-model="category.color"
                        :hide-canvas="true"
                        :hide-inputs="true"
                        :show-swatches="false"
                        class="mx-auto"></v-color-picker>
                      </v-col>
                    </v-row>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-card-text>
          </v-container>
        </v-card>


            <!-- Display Priority -->
        <v-card class="mt-5">
          <v-container>
            <v-card-title>Targets Display Order</v-card-title>
            <v-card-text>
              <v-form>
                <v-select label="First Display by..." 
                v-model="filter1"
                  :items="['deadline', 'category']"></v-select>
              </v-form>
              <transition-group name="demo" tag="ul" class="demo-list">
                <li v-for="target in orderedTargets" :key="target.id" class="demo-target mb-3">
                  <v-card :color="categoriesColors[target.category]">
                    <v-card-title class="pa-2">
                      {{ target.title }}
                    </v-card-title>
                  </v-card>
                </li>
              </transition-group>
            </v-card-text>
          </v-container>
        </v-card>
      </v-col>
    </v-row>

  </v-container>
</template>

<script>
export default {
  name: 'Profile',
  data() {
    return {
      categories: [
        { title: 'perso', color: '#0000ff' },
        { title: 'home', color: '#ffff00' },
        { title: 'pro', color: '#00ff00' }
      ], // TBU when state set up
      categoriesColors: {
        perso: '#0000ff',
        pro: '#00ff00',
        home: '#ffff00',
      }, // TBU when state set up
      categoriesOrder: {
        perso: 3,
        pro: 1,
        home: 2,
      }, // TBU when state set up
      filter1: '',
      displayOrder: [
        { title: 'categories', order: 1 },
        { title: 'targetsType', order: 2 }
      ],
      targetsType: [
        { title: 'recurring'},
        { title: 'one-shot' }
      ], // TBU when state set up
      isFormValid: true,
      isUpdating: false,
      user: {             // TBU when Auth set up
        username: 'Lola',
        email: 'lola@gmail.com'
      },
      
      targetsDisplayOrder: ['displayTypes', 'categories', 'desc'], // TBU when state set up

    };
  },

  computed: {
    orderFirst() {
      return this[this.displayOrder[0].title]
    },
    orderSecond() {
      return this[this.displayOrder[1].title]
    },
    demoTargets() {
      return [
        { id: 1, title: 'My urgent personal target', category: 'perso', timeLimit: 1, done: null },
        { id: 2, title: 'My urgent pro target SQL', category: 'pro', timeLimit: 1, done: null },
        { id: 3, title: 'My personal target further in time', category: 'perso', timeLimit: 5, done: null },
        { id: 4, title: 'My professional target somewhat in the middle', category: 'pro', timeLimit: 3, done: null },
        { id: 5, title: 'My urgent home target', category: 'home', timeLimit: 1, done: null },
      ];
    },
    orderedTargets() {
      let sorted = [...this.demoTargets];
      if (this.filter1 === 'category') {
        return sorted.sort((a, b) => this.categoriesOrder[a.category] - this.categoriesOrder[b.category] || a.timeLimit - b.timeLimit);
      }
      return sorted.sort((a, b) => a.timeLimit - b.timeLimit || this.categoriesOrder[a.category] - this.categoriesOrder[b.category]);
    }
  },

  

  methods: {

    handleUserUpdate(e) {
      e.preventDefault();
      if (this.isUpdating) {
        this.isUpdating = false;
        if (this.$refs.form.validate()) {
          let user = {
            username: this.user.username,
            email: this.user.email,
          };
          // TBU When Auth is set
          console.log('saving new info for user');
          console.dir(user);
        }
      }
      else {
        this.isUpdating = true;
      }
    },

    updateUserPassword() {
      console.log('update password');
    },

    unregisterUser() {
      console.log('unregister user');
    },
   
  },
}
</script>

<style lang="css">

.demo-move {
  transition: transform 1s;
}

.demo-target {
  list-style-type: none;
}
</style>