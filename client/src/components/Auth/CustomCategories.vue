<template>
  <v-card>
    <v-container>
      <v-toolbar color="indigo">
        <v-toolbar-title>Customize Your Dashboard</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-tooltip bottom :disabled="!hasChanged">
          <template v-slot:activator="{ on }">
            <v-btn icon v-on="on">
              <v-icon @click="saveCategories" :color="hasChanged ? 'green' : 'grey'">mdi-content-save-outline</v-icon>
            </v-btn>
          </template>
          <span>Save Your Changes</span>
        </v-tooltip>
      </v-toolbar>
     
      <v-card-subtitle>Drag Your Categories to Set Their Order of Appearance</v-card-subtitle>
      <v-card-text>
        <v-list-item-group> 
          <v-list-item v-for="category in categories" :key="category.title"
            :ripple="false"
            :data-pos="category.order"
            @mousedown="allowDragging = true"
            :draggable="allowDragging"
            @dragend="handleDragEnd($event)"
            @dragover="handleDragOver($event)"
            @dragstart="handleDragStart($event)">
            <v-list-item-content class="list-content">
              <v-card color="indigo lighten-5" :elevation="6">
                <v-container>
                  <v-row class="d-flex align-center">
                    <v-col :cols="6">
                      <v-text-field class="mt-0 pt-0" :value="category.title" xs6></v-text-field>
                    </v-col>
                    <v-col :cols="6" @mousedown.stop="allowDragging = false">
                      <v-color-picker class="mx-auto picker"
                        v-model="category.color"
                        @change="changeColor()"
                        :hide-canvas="true"
                        :hide-inputs="true"
                        :show-swatches="false"></v-color-picker>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-card-text>
    </v-container>

    <v-snackbar color="success" bottom left
       v-model="profileSnackbar"
       :timeout="5000">
       <v-icon class="mr-3">mdi-check-circle</v-icon>
       <h3>Don't forget to save your changes!</h3>
       <v-btn dark text @click="profileSnackbar = false">Close</v-btn>
    </v-snackbar>

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
import { UPDATE_CATEGORIES } from '../../queries';
import { compareArrays, deepCopy } from '@/utils';

export default {
  name: 'CustomCategories',
  
  data() {
    return {
      allowDragging: true,
      categories: [],
      currentDragItem: null,
      currentDragPos: null,
      draggedOverItem: null,
      draggedOverPos: null,
      errorMessage: '',
      errorSnackbar: false,
      profileSnackbar: false,
    };
  },

  computed: {

    hasChanged() {
      return !compareArrays(this.categories, this.targetCategories);
    },
    
    targetCategories() {
      return this.$store.state.user.target_categories;
    },
  },

  mounted() {
    this.categories = deepCopy(this.targetCategories);
  },

  watch: {
    hasChanged: function (newValue) {
      if (newValue) {
        this.profileSnackbar = true;
      }
    },

    targetCategories: function (newValue) {
      this.categories = deepCopy(newValue);
    },
  },

  methods: {

    changeColor() {
      this.$store.commit('updateLocalTargetCategories', this.categories);
    },
    
    clearDragData() {
      this.currentDragItem = null;
      this.currentDragPos = null;
      this.draggedOverItem = null;
      this.draggedOverPos = null;
    },

    handleDragEnd() {
      if ( this.currentDragItem !== this.draggedOverItem) {
        this.sort();
        this.clearDragData();
      }      
    },
    
    handleDragStart(e) {
      if (this.allowDragging) {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.$el.outerHTML);
        this.currentDragItem = e.target;
        this.currentDragPos = e.target.dataset.pos;
      }
    },
    
    handleDragOver(e) {
      this.draggedOverItem = e.currentTarget;
      this.draggedOverPos = e.currentTarget.dataset.pos;
    },
    
    sort() {
      let currentDrag = parseInt(this.currentDragPos);
      let draggedOver = parseInt(this.draggedOverPos);
      this.allowSort = false;
      let arr1, arr2, arr3, arr4;
      let arrReturned = [];
      let array = [...this.categories];
      if (currentDrag < draggedOver) {
        arr1 = [...array.slice(0, currentDrag)]
        arr2 = [...array.slice(currentDrag + 1, draggedOver + 1)]
        arr3 = [array[currentDrag]];
        arr4 = [...array.slice(draggedOver + 1)]    
        // array = [...arr1, ...arr2, ...arr3, ...arr4]    
        arrReturned = [...arr1, ...arr2, ...arr3, ...arr4]    

      } 
      else if (currentDrag > draggedOver) {
        arr1 = [...array.slice(0, draggedOver)]
        arr2 = [array[currentDrag]];
        arr3 = [...array.slice(draggedOver, currentDrag)];
        arr4 = [...array.slice(currentDrag + 1)]
        // array = [...arr1, ...arr2, ...arr3, ...arr4]
        arrReturned = [...arr1, ...arr2, ...arr3, ...arr4]
      }
      arrReturned.map((cat, index) => {
        cat.order = index;
      });
      
      this.categories = [...arrReturned];
      this.$store.commit('updateLocalTargetCategories', this.categories);
      this.allowSort = true;
    },

    async saveCategories() {
      if (this.hasChanged) {
        try {
          const variables = {
            userId: this.$store.state.user.username,
            categories: this.categories,
          };
          await this.$apollo.mutate({
            mutation: UPDATE_CATEGORIES,
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




