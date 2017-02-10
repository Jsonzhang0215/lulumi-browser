import Vue from 'vue';
import Electron from 'vue-electron';
import Resource from 'vue-resource';
import Router from 'vue-router';
import { Autocomplete } from 'element-ui';

import App from './App';
import routes from './routes';

Vue.use(Electron);
Vue.use(Resource);
Vue.use(Router);
Vue.config.debug = true;

// Customize Autocomplete component to match out needs
const CustomAutocomplete = Vue.extend(Autocomplete);
const GoodCustomAutocomplete = CustomAutocomplete.extend({
  computed: {
    suggestionVisible() {
      const suggestions = this.suggestions;
      const isValidData = Array.isArray(suggestions) && suggestions.length > 0;
      // Don't show suggestions if we have no input there
      return (isValidData || this.loading) && this.isFocus && this.value;
    },
  },
  methods: {
    getData(queryString) {
      this.loading = true;
      this.fetchSuggestions(queryString, (suggestions) => {
        this.loading = false;
        if (Array.isArray(suggestions)) {
          this.suggestions = suggestions;
          this.highlightedIndex = 0;
        } else {
          console.error('autocomplete suggestions must be an array');
        }
      });
    },
    handleChange(value) {
      this.$emit('input', value);
      if (!this.triggerOnFocus && !value) {
        this.suggestions = [];
        return;
      }
      this.getData(value);
    },
    handleFocus(event) {
      event.target.select();
      this.isFocus = true;
      if (this.triggerOnFocus) {
        this.getData(this.value);
      }
    },
    handleKeyEnter(event) {
      if (this.suggestionVisible
            && this.highlightedIndex >= 0
            && this.highlightedIndex < this.suggestions.length) {
        this.select(this.suggestions[this.highlightedIndex]);
      } else {
        this.$parent.$parent.onEnterLocation(event.target.value);
        this.select({ value: event.target.value });
      }
    },
  },
});
Vue.component('good-custom-autocomplete', GoodCustomAutocomplete);

const router = new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes,
});

/* eslint-disable no-new */
new Vue({
  router,
  ...App,
}).$mount('#app');
