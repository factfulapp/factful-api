import Vue from 'vue';
import Vuex from 'vuex';
import _ from 'lodash';
import find from 'lodash.find';
import without from 'lodash.without';

Vue.use(Vuex);

const initialState = {
  user: null,
  facts: null,
  categories: null,
  backgrounds: null,
  uploads: []
};

const headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: initialState,

  mutations: {
    reset: state => Object.assign(state, initialState),

    setUser: function (state, user) {
      state.user = user;
    },

    setFacts: function (state, facts) {
      state.facts = facts;
    },

    setCategories: function (state, categories) {
      state.categories = categories;
    },

    setBackgrounds: function (state, backgrounds) {
      state.backgrounds = backgrounds;
    },

    createUpload: function (state, payload) {
      const upload = {
        id: payload.id,
        name: payload.name,
        error: false,
        progress: null
      };

      const newUploads = state.uploads.slice(0);
      newUploads.push(upload);
      state.uploads = newUploads;
    },

    updateUpload: function (state, upload) {
      const id = upload.id;
      const targetUpload = find(state.uploads, { id });
      if (!targetUpload) {
        throw new Error(`Failed to update upload ${id}`);
      }
      const newUpload = Object.assign({}, targetUpload, upload);
      const newUploads = without(state.uploads, targetUpload);
      newUploads.push(newUpload);
      state.uploads = newUploads;
    },

    createFact: function (state, fact) {
      const newFacts = state.facts.slice(0);
      newFacts.push(fact);
      state.facts = newFacts;
    },

    updateFact: function (state, fact) {
      const targetFact = find(state.facts, { id: fact.id });
      if (!targetFact) {
        throw new Error(`Failed to update fact ${fact.id}`);
      }
      const newFact = Object.assign({}, targetFact, fact);
      let newFacts = without(state.facts, targetFact);
      newFacts.push(newFact);
      newFacts = _.orderBy(newFacts, ['id'], ['desc']);
      state.facts = newFacts;
    },

    removeFact: function (state, fact) {
      const targetFact = find(state.facts, { id: fact.id });
      if (!targetFact) {
        throw new Error(`Failed to remove fact ${fact.id}`);
      }
      const newFacts = without(state.facts, targetFact);
      state.facts = newFacts;
    },

    createCategory: function (state, category) {
      const newCategories = state.categories.slice(0);
      newCategories.push(category);
      state.categories = newCategories;
    },

    updateCategory: function (state, category) {
      const targetCategory = find(state.categories, { id: category.id });
      if (!targetCategory) {
        throw new Error(`Failed to update category ${category.id}`);
      }
      const newCategory = Object.assign({}, targetCategory, category);
      let newCategories = without(state.category, targetCategory);
      newCategories.push(newCategory);
      newCategories = _.orderBy(newCategories, ['id'], ['desc']);
      state.category = newCategories;
    },

    createBackground: function (state, background) {
      const newBackgrounds = state.backgrounds.slice(0);
      newBackgrounds.push(background);
      state.backgrounds = newBackgrounds;
    },

    updateBackground: function (state, background) {
      const targetBackground = find(state.backgrounds, { id: background.id });
      if (!targetBackground) {
        throw new Error(`Failed to update background ${background.id}`);
      }
      const newBackground = Object.assign({}, targetBackground, background);
      let newBackgrounds = without(state.backgrounds, targetBackground);
      newBackgrounds.push(newBackground);
      newBackgrounds = _.orderBy(newBackgrounds, ['id'], ['desc']);
      state.backgrounds = newBackgrounds;
    }
  },

  actions: {
    fetchFacts: function ({ state, commit }) {
      fetch('/api/facts', { credentials: 'same-origin', headers })
        .then(data => data.json())
        .then(json => {
          if (json.ok) {
            commit('setFacts', json.records);
          }
        });
    },

    fetchCategories: function ({ state, commit }) {
      fetch('/api/categories', { credentials: 'same-origin', headers })
        .then(data => data.json())
        .then(json => {
          if (json.ok) {
            commit('setCategories', json.records);
          }
        });
    },

    fetchBackgrounds: function ({ state, commit }) {
      fetch('/api/backgrounds', { credentials: 'same-origin', headers })
        .then(data => data.json())
        .then(json => {
          if (json.ok) {
            commit('setBackgrounds', json.records);
          }
        });
    }
  }
});

export default store;
