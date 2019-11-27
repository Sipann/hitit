<template>
<v-card>
    <v-card-title v-if="target">
      {{ title }}
      <v-spacer></v-spacer>
      <v-icon @click="deleteTarget">mdi-delete</v-icon>
    </v-card-title>

    <v-card-title v-else>
      Your New Target!
    </v-card-title>

    <v-card-text>
      
      <v-form ref="form" lazy-validation v-model="isFormValid" @submit.prevent="addTarget">
        <v-text-field v-if="!target" 
          :rules="titleRules" 
          :value="title" 
          validate-on-blur
          label="Title (required)" required></v-text-field>

        <v-row>
          <v-col :cols="6">
            <v-select v-model="category" 
              :items="categoriesOptions" 
              :disabled="!categoriesOptions.length"
              label="Category"></v-select>
          </v-col>
          <v-col>
            <v-text-field type="text" v-model="newCategory" label="Add New Category" :rules="categoryRules" append-icon="mdi-plus" @click:append="addCategoryOption"></v-text-field>
          </v-col>
        </v-row>

        <v-switch v-model="recurring" label="Recurring"></v-switch>

        <v-row v-show="recurring" class="align-baseline">
          <v-col>
            <v-text-field type="number" min="1" :rules="durationRules" v-model="duration" label="Duration (e.g. 1)"></v-text-field>
          </v-col>
          <v-col>
            <v-select v-model="timeUnit" :items="timeUnits" :rules="timeUnitRules" label="Time Unit"></v-select>
          </v-col>
          <v-col :cols="1">
            <p>per</p>
          </v-col>
          <v-col>
            <v-select v-model="frequency" :items="frequencies" :rules="frequencyRules" label="Frequency"></v-select>
          </v-col>
        </v-row>

        <v-menu v-if="!recurring"
          v-model="endMenu"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="290px">
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="end"
              label="End Date"
              clearable
              readonly
              v-on="on"></v-text-field>
          </template>
          <v-date-picker v-model="end" @input="endMenu = false"></v-date-picker>
        </v-menu>

        <v-divider></v-divider>

        <v-row>
          <v-col :cols="4" class="d-flex justify-space-between ">
            <h3 class="d-inline-block">Split into Steps?</h3>
            <v-tooltip right>
              <template v-slot:activator="{ on }">
                <v-icon v-on="on" @click="anotherStep = true">mdi-plus</v-icon>
              </template>
              <span>Add Step</span>
            </v-tooltip>
          </v-col>
        </v-row>
        
        <v-checkbox v-for="step in steps" :key="step.title" 
          v-model="step.done" 
          :label="step.title"
          :value="step.title"></v-checkbox>
        <v-text-field v-if="anotherStep" v-model="stepTitle" label="Add a Step" clearable append-outer-icon="mdi-plus" @click:append-outer="addStep" :rules="stepRules"></v-text-field>
        


        <v-row class="mt-2 d-flex justify-end">
          <v-btn type="submit" :disabled="!isFormValid || loading">{{ command }}</v-btn>
          <v-btn @click="clear">Cancel</v-btn>
        </v-row>
          
      </v-form>
    </v-card-text>
  </v-card>
  
</template>

<script>
import { CREATE_TARGET, UPDATE_CATEGORIES, UPDATE_TARGETS } from '../queries'
import { mapGetters } from 'vuex';
import moment from 'moment';
import { deepCopy } from '@/utils';

export default {
  name: 'Target',

  props: {
    target: {
      type: Object,
      validator: function (value) {
        let isObject = typeof value === 'object' && !Array.isArray(value);
        let hasTitle = !!value.title;
        return isObject && hasTitle;
      },
    },
  },

  data() {
    return {
      // target Data
      category: '',
      done: false,
      duration: 0,
      end: null,
      frequency: null,
      recurring: false,
      timeUnit: null,  
      title: '',
      steps: [],

      // Component data
      addedCategory: '',
      anotherStep: null,
      command: 'Add Target',
      endMenu: false,
      isFormValid: true,
      isUpdating: false,
      loading: false,
      newCat: false,
      newCategory: '',
      stepTitle: '',

      // Form Validation Rules
      categoryRules: [
        newCategory => newCategory ? newCategory.length < 10 || 'Category must be less than 10 characters': true,
        newCategory => newCategory ? (!this.categories.includes(newCategory.toLowerCase()) || 'This category already exists') : true,
      ],
      stepRules: [
        step => this.stepTitle ? (step.length < 30 || 'Step must be less than 30 characters') : true,
      ],
      titleRules: [
        title => !!title || 'Title is required',
        title => (title && title.length > 3) || 'Title must be at least 3 characters',
      ],
    };
  },

  mounted() {
    if (this.target) {
      this.title = this.target.title;
      this.category = this.target.category || '';
      this.done = this.target.done || false;
      this.duration = this.target.duration || null;
      this.end = this.target.end_date || null;
      this.frequency = this.target.period || null;
      this.recurring = this.target.recurring || false;
      this.timeUnit = this.target.timeUnit || null;
      this.steps = this.target.steps || [];

      this.command = 'Save Changes';
    }
  },

  computed: {

    ...mapGetters(['categories', 'timeUnits', 'frequencies']),

    categoriesOptions() {
      if (this.addedCategory) {
        return [...this.categories, this.addedCategory.title];
      } 
      return [...this.categories];
    },
    
    durationRules() {
      if (this.recurring) {
        return [
          duration => !!duration || 'Duration is required for recurring targets',
        ];
      } 
      else return [];
    },
    frequencyRules() {
      if (this.recurring) {
        return [
          frequency => !!frequency || 'Frequency is required for recurring targets',
        ]
      } else return [];
    },

    target_categories() {
      return this.$store.state.user.target_categories.length ? this.$store.state.user.target_categories : [];
    },

    timeUnitRules() {
      if (this.recurring) {
        return [
          timeUnit => !!timeUnit || 'Time Unit required for recurring targets',
        ]
      } else return [];
    },

    timeStart() {
      const now = moment();
      if (this.end) {
        return now._d.getTime();
      } else if (this.recurring) {
        const start = now.startOf(this.period);
        return start._d.getTime();
      } else {
        return null;
      }
    },

    timeLimit() {
      if (this.end) {
        const date = moment(this.end);
        const limit = date.endOf('day');
        return limit._d.getTime();
      } else if (this.recurring) {
        const now = moment();
        const limit = now.endOf(this.period);
        return limit._d.getTime();
      } else { 
        return null; 
        }
    },

    period() {
      if (this.frequency) {
        return this.frequency.toLowerCase();
      } else { 
        return ''; 
      }
    },
  },

  methods: {

    addCategoryOption() {
      let currentLength = this.target_categories.length;
      this.addedCategory = {
        title: this.newCategory,
        color: '#555555',
        order: currentLength,
      };
      this.category = this.addedCategory.title;
      this.newCategory = '';
    },

    async addCategory() {
      try {
        // vuex store
        await this.$store.dispatch('addCategory', this.addedCategory);
        this.category = this.addedCategory.title;

        // firestore
        
        const categories = deepCopy(this.target_categories);
        const variables = {
          username: this.$store.state.user.username,
          categories: categories,
        };
        console.log('update categories with variables', variables);

        await this.$apollo.mutate({
          mutation: UPDATE_CATEGORIES,
          variables,
        });
      } catch (err) {
        console.log('err', err);
        this.$emit('targetIssue', 'Ooops, we could not add this category');
      }
        
    },
    
    addStep () {
      if (this.stepTitle.length < 30) {
        this.steps.push({
          title: this.stepTitle,
          done: false,
        });
        this.anotherStep = null;
        this.stepTitle = '';
      }
    },

    async addTarget() {
      if (this.$refs.form.validate()) {
        try {
          const steps = this.steps ? deepCopy(this.steps) : [];
          const duration = parseInt(this.duration);
          const timeLimit = ''+ this.timeLimit;
          const timeStart = ''+ this.timeStart;
          

          // Vuex Store
          if (this.category === this.addedCategory.title) {
            await this.addCategory()
          }

          // Firestore
          if (this.target) {
            console.log('updating Target');

            const updatedTarget = {
              category: this.category,
              done: this.done,
              duration: duration,
              end_date: this.end,
              period: this.frequency,
              recurring: this.recurring,
              steps: steps,
              time_limit: timeLimit, 
              time_start: timeStart,
              time_unit: this.timeUnit,
              title: this.title,
            };
            await this.$store.dispatch('updateTarget', updatedTarget);
            
            const targets = deepCopy(this.$store.state.user.targets);
            const variables = {
              username: this.$store.state.user.username,
              targets : targets,
            };
            console.log('variables', variables);
            await this.$apollo.mutate({
              mutation: UPDATE_TARGETS,
              variables,
            });

          } else {
            const variables = {
              username: this.$store.state.user.username,
              target : {
                category: this.category,
                done: this.done,
                duration: duration,
                end_date: this.end,
                period: this.frequency,
                recurring: this.recurring,
                steps: steps,
                time_limit: timeLimit, 
                time_start: timeStart,
                time_unit: this.timeUnit,
                title: this.title,
              },
            };
            console.log('variables', variables);
            await this.$store.dispatch('addTarget', variables.target);
            console.log('creating Target');
            await this.$apollo.mutate({
              mutation: CREATE_TARGET,
              variables,
            });
          }

        } catch(err) {
          console.log('err from addTarget', err);
          this.$emit('targetIssue', 'Ooops, we could not add this target');

        } finally {
          // this.clear();
          this.$emit('clearTarget');
        }
      }
    },

    clear() {
      this.$refs.form.reset();
      this.$emit('clearTarget');
    },

    async deleteTarget() {
      let confirm = window.confirm('This action cannot be undone. Are you Sure?');
      if (confirm) {
        try {
          // Vuex store
          await this.$store.dispatch('deleteTarget', this.title);
          
          // Firestore
          console.log('deleting target with variables', variables);
          const targets = deepCopy(this.$store.state.user.targets);
          const variables = {
            username: this.$store.state.user.username,
            targets : targets,
          };
          console.log('variables', variables);
          await this.$apollo.mutate({
            mutation: UPDATE_TARGETS,
            variables,
          });
          
        } catch (err) {
          console.log('err', err);
          this.$emit('targetIssue', 'Ooops, we could not delete this target');

        } finally {
          // UI
          // this.clear();
          this.$emit('clearTarget');
        }
      }
    },

},

}
</script>