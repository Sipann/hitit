<template>
  <v-card class="mt-5">
    <v-container>
      <v-toolbar color="indigo">
        <v-toolbar-title>Targets Display Order</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-tooltip bottom :disabled="!hasChanged">
          <template v-slot:activator="{ on }">
            <v-btn icon v-on="on">
              <v-icon @click="saveDisplayOrder" :color="hasChanged ? 'green' : 'grey'">mdi-content-save-outline</v-icon>
            </v-btn>
          </template>
          <span>Save Your Changes</span>
        </v-tooltip>
      </v-toolbar>
      <v-card-text>
        <v-form>
          <v-select label="First Display by..." 
            :value="displayPreference"
            @input="displayChoice = $event"
            :items="displayOptions"></v-select>
        </v-form>
        <transition-group name="demo" tag="ul" class="demo-list" v-if="categories.length">
          <li v-for="target in orderedTargets" :key="target.title" class="demo-target mb-3">
            <v-card :color="categoriesColors[target.category]">
              <v-card-title class="pa-2">
                {{ target.title }}
              </v-card-title>
            </v-card>
          </li>
        </transition-group>
      </v-card-text>
    </v-container>

    <v-snackbar color="alert" bottom left
       v-model="errorSnackbar"
       :timeout="5000">
       <v-icon class="mr-3">mdi-check-circle</v-icon>
       <h3>{{ errorMessage }}</h3>
       <v-btn dark text @click="errorSnackbar = false">Close</v-btn>
    </v-snackbar>

  </v-card>
</template>

<script>
import { UPDATE_DISPLAY_ORDER } from '../../queries';
import { mapGetters } from 'vuex';
// import { deepCopy } from '@/utils';

export default {
  name: 'CustomDisplayOrder', 

  data() {
    return {
      // demoTargets: [
      //   { id: 1, title: 'My urgent personal target', category: 'perso', time_limit: 1, done: null },
      //   { id: 2, title: 'My urgent pro target SQL', category: 'pro', time_limit: 1, done: null },
      //   { id: 3, title: 'My personal target further in time', category: 'perso', time_limit: 5, done: null },
      //   { id: 4, title: 'My professional target somewhat in the middle', category: 'pro', time_limit: 3, done: null },
      //   { id: 5, title: 'My urgent home target', category: 'home', time_limit: 1, done: null },
      // ],
      // categories: [
      //   {title: 'Category 1', order: 0, color: '#0000ff' },
      //   {title: 'Category 2', order: 1, color: '#00ffff' },
      //   {title: 'Category 3', order: 2, color: '#ff00ff' },
      // ],
      displayChoice: '',
      displayOptions: [],
      errorMessage: '',
      errorSnackbar: false,
    };
  },

  computed: {
    
    ...mapGetters(['categoriesColors', 'categoriesOrder', 'display_options']),

    categories() {
      return this.$store.state.user.target_categories.length ? 
      this.$store.state.user.target_categories :
      [
        {title: 'Category 1', order: 0, color: '#0000ff' },
        {title: 'Category 2', order: 1, color: '#00ffff' },
        {title: 'Category 3', order: 2, color: '#ff00ff' },
      ];
    },

    demoTargets() {
      let targets = [];
      this.categories.forEach(category => {
        let newTargets = [
          {title: `My urgent ${category.title} target`, category: category.title, time_limit: 1, done: false },
          {title: `My middly urgent ${category.title} target`, category: category.title, time_limit: 2, done: false },
          {title: `My ${category.title} target further in time`, category: category.title, time_limit: 3, done: false },
        ];
        targets.push(...newTargets);
      });
      return targets;
    },

    display() {
      return this.displayChoice ? this.displayChoice : this.displayPreference;
    },

    displayPreference() {
      // return this.$store.state.user ? this.$store.state.user.display_preference : '';
      return this.$store.state.user.display_preference;
    },

    hasChanged() {
      return this.display !== this.displayPreference;
    },

    orderedTargets() {
      let sorted = [...this.demoTargets];
      if (this.display === 'category') {
        return sorted.sort((a, b) => this.categoriesOrder[a.category] - this.categoriesOrder[b.category] || a.time_limit - b.time_limit);
      }
      return sorted.sort((a, b) => a.time_limit - b.time_limit || this.categoriesOrder[a.category] - this.categoriesOrder[b.category]);
    },

    // targetCategories() {
    //   return this.$store.state.user.target_categories;
    // },

  },

  // watch: {
  //   targetCategories: function (newValue) {
  //     this.categories = deepCopy(newValue);
  //   },
  // },

  mounted() {
    this.displayChoice = this.displayPreference;
    this.displayOptions = this.display_options;
    // this.categories = deepCopy(this.targetCategories);
  },

  methods: {
    async saveDisplayOrder() {
      if (this.hasChanged) {
        try {
          const variables = {
            userId: this.$store.state.user.username,
            display: this.displayChoice,            
          };
          await this.$apollo.mutate({
            mutation: UPDATE_DISPLAY_ORDER,
            variables,
          });
        } catch (err) {
          this.errorMessage = 'Ooops! It seems we have a problem';
          this.errorSnackbar = true;
        }
      } else {
        this.errorMessage = 'We save if You change...';
        this.errorSnackbar = true;
      }
    },
  },

}
</script>

<style lang="css" scoped>
.demo-move {
  transition: transform 1s;
}

.demo-target {
  list-style-type: none;
}
</style>