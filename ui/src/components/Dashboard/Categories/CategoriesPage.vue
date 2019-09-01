<template lang="pug">
  app-template
    h1.title
      span Manage Categories
      a(
        href='javascript://'
        @click='toggleFormVisibility'
        v-tooltip.bottom='addNewText'
      )
        i.fa.fa-plus
    section.content
      add-form(v-if='addFormVisible', @cancel='toggleFormVisibility')
      categories-list(
        v-if='categories && categories.length'
        :categories='categories'
      )
      zero-data-state(v-else-if='categories')
      loading-spinner(v-else=true)
</template>

<script>
import AppTemplate from 'components/AppTemplate';
import AddForm from 'components/Dashboard/Categories/CategoriesAddForm';
import CategoriesList from 'components/Dashboard/Categories/CategoriesList';

export default {
  name: 'manage-categories-page',
  components: {
    'app-template': AppTemplate,
    'add-form': AddForm,
    'categories-list': CategoriesList
  },
  data: function () {
    return {
      addFormVisible: false,
      addNewText: 'Add New Category'
    };
  },
  computed: {
    categories: function () {
      const categories = this.$store.state.categories;
      if (categories) {
        const value = categories.slice(0);
        return value.sort((a, b) => b.id - a.id);
      }
      return categories;
    }
  },
  mounted: function () {
    if (!this.categories) {
      this.$store.dispatch('fetchCategories');
    }
  },
  methods: {
    toggleFormVisibility: function () {
      this.addFormVisible = !this.addFormVisible;
    }
  }
};
</script>
