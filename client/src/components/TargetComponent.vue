<template>
  <v-card>
    <v-card-title>
      Your Target
      <h3 v-if="isUpdating">Status</h3>
    </v-card-title>
    <v-card-text>
      
      <v-form ref="form" lazy-validation v-model="isFormValid" @submit.prevent="addTarget">
        <v-text-field :rules="titleRules" v-model="title" label="Title (required)" required></v-text-field>

        <v-row>
          <v-col :cols="6">
            <v-select v-model="category" 
              :items="categories" 
              label="Category"></v-select>
          </v-col>
          <v-col>
            <v-text-field type="text" v-model="newCatLabel" label="Add New Category" :rules="categoryRules" append-icon="mdi-plus" @click:append="addCategory"></v-text-field>
          </v-col>
        </v-row>

        <v-switch v-model="recurring" label="Recurring"></v-switch>

        <v-row v-show="recurring" class="align-baseline">
          <v-col>
            <v-text-field type="number" min="1" :rules="durationRules" v-model="duration" label="Duration (e.g. 1)"></v-text-field>
          </v-col>
          <v-col>
            <v-select v-model="timeUnit" :items="durations" :rules="timeUnitRules" label="Time Unit"></v-select>
          </v-col>
          <v-col :cols="1">
            <p>per</p>
          </v-col>
          <v-col>
            <v-select v-model="frequency" :items="frequencies" :rules="frequencyRules" label="Frequency"></v-select>
          </v-col>
        </v-row>

        <v-menu
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
          <v-btn type="submit" :disabled="!isFormValid || loading">Add Target</v-btn>
          <v-btn @click="clear">Cancel</v-btn>
        </v-row>
          
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'TargetComponent',

  data() {
    return {
      anotherStep: null,
      category: '',
      categories: ['perso', 'pro'],
      end: '',
      endMenu: false,
      duration: null,
      durations: ['minute(s)', 'hour(s)', 'day(s)'],
      frequency: null,
      frequencies: ['day', 'week', 'month', 'quarter', 'year'],
      isFormValid: true,
      isUpdating: false,
      loading: false,
      newCat: false,
      newCatLabel: '',
      recurring: false,
      steps: [{ title: 'step 1: first required', done: null }], // UI test only
      // steps: [],
      stepTitle: '',
      title: '',
      timeUnit: null, 

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

  computed: {
    
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
    timeUnitRules() {
      if (this.recurring) {
        return [
          timeUnit => !!timeUnit || 'Time Unit required for recurring targets',
        ]
      } else return [];
    }
  },

  methods: {

    addCategory() {
      // UPDATE this.categories
      this.newCatLabel = '';      
    },
    
    addStep () {
      if (this.stepTitle.length < 30) {
        this.steps.push({
          title: this.stepTitle,
          done: null,
        });
        this.anotherStep = null;
        this.stepTitle = '';
      }
    },

    addTarget() {
      if (this.$refs.form.validate()) {
        const target = {
          category: this.category,
          duration: this.duration,
          end: this.end,
          frequency: this.frequency,
          timeUnit: this.timeUnit,
          title: this.title,
          recurring: this.recurring,
          steps: this.steps,
        };
        console.dir(target);
        // SAVE TARGET
        this.clear();
      }
    },

    clear() {
      this.$refs.form.reset();
      this.$emit('clearTarget');
    },

},

}
</script>