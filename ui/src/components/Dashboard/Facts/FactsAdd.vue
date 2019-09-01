<template lang="pug">
  app-template
    h1.title Add New Fact
    section.content
      form(@submit='handleSubmit')
        .input-container
          label The fact:
          textarea(name='text', placeholder='Full text of the fact')
        .input-container
          label Category:
          select(name='category')
            option(
              disabled=true,
              hidden=true,
              selected=true
              value=''
            ) -- Please pick a category --
            option(
              v-for='cat in categories'
              :value='cat.id'
            ) {{ cat.name }}
        .input-container
          label Background:
          select(name='background', @change='handleBackgroundChange')
            option(
              disabled=true,
              hidden=true,
              selected=true
              value=''
            ) -- Please pick a background --
            option(
              v-for='bg in backgrounds'
              :value='bg.id'
            ) {{ bg.name }}
          .background-preview(v-if='selectedBackground')
            a(:href='this.selectedBackground.url', target='_blank')
              img(
                :src='createThumbnail(this.selectedBackground.url)'
                :alt='this.selectedBackground.name'
              )
        .input-container
          button(type='submit') Save
          button(@click='handleCancel') Cancel
</template>

<script>
import find from 'lodash.find';
import Toaster from 'lib/toaster';
import errors from 'lib/errors';
import AppTemplate from 'components/AppTemplate';

export default {
  name: 'facts-add',
  components: {
    'app-template': AppTemplate
  },
  data: function () {
    return {
      selectedBackground: null
    };
  },
  computed: {
    facts: function () {
      return this.$store.state.facts;
    },
    categories: function () {
      return this.$store.state.categories;
    },
    backgrounds: function () {
      return this.$store.state.backgrounds;
    }
  },
  mounted: function () {
    if (!this.facts) {
      this.$store.dispatch('fetchFacts');
    }
    if (!this.categories) {
      this.$store.dispatch('fetchCategories');
    }
    if (!this.backgrounds) {
      this.$store.dispatch('fetchBackgrounds');
    }
  },
  methods: {
    save: function (body) {
      fetch('/api/facts', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'same-origin',
        body: JSON.stringify(body)
      })
        .then(data => data.json())
        .then(json => {
          if (json.ok) {
            this.$store.commit('createFact', json.data);
            Toaster.create('success', 'Fact created successfully!', 'Yay!');
            this.$router.push('/dashboard/facts');
          } else if (json.errors) {
            json.errors.forEach(error => Toaster.create('danger', errors.factCreation[error.code]));
          } else {
            Toaster.create('danger', 'Something bad happened');
          }
        });
    },

    handleSubmit: function (e) {
      e.preventDefault();
      this.save({
        text: e.target.text.value,
        categoryId: e.target.category.value,
        backgroundId: e.target.background.value
      });
    },

    handleCancel: function (e) {
      e.preventDefault();
      this.$router.push('/dashboard/facts');
    },

    handleBackgroundChange: function (e) {
      const id = parseInt(e.currentTarget.value);
      this.selectedBackground = find(this.backgrounds, { id });
    },

    createThumbnail: function (url) {
      const dot = url.lastIndexOf('.');
      return `${url.substr(0, dot)}m.${url.substr(dot + 1)}`;
    }
  }
};
</script>

<style lang="scss" scoped>
  .background-preview {
    background: #efefef;
    margin-bottom: 20px;
    padding: 20px;
    text-align: center;
  }

  .input-container {
    button {
      display: inline-block;
      width: auto;
      margin-right: 20px;

      &:last-child {
        margin-right: 0;
      }
    }
  }
</style>
