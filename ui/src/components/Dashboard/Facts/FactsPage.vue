<template lang="pug">
  app-template
    h1.title
      span Manage Facts
      router-link(
        to='/dashboard/facts/new'
        v-tooltip.bottom='addNewText'
      )
        i.fa.fa-plus
    section.content
      .search-container(v-if='facts && facts.length')
        form(@submit='handleSubmit')
          input(
            name='q'
            type='search'
            autocomplete='off'
            placeholder='Search facts by content'
            @search='handleSearch'
            @keyup='handleSearch'
          )
          i.fa.fa-search
      facts-list(
        v-if='facts && facts.length'
        :facts='filteredFacts'
        :q='search.q'
      )
      zero-data-state(v-else-if='facts')
      loading-spinner(v-else=true)
</template>

<script>
import AppTemplate from 'components/AppTemplate';
import FactsList from 'components/Dashboard/Facts/FactsList';

export default {
  name: 'manage-facts-page',
  components: {
    'app-template': AppTemplate,
    'facts-list': FactsList
  },
  data: function () {
    return {
      addNewText: 'Add New Fact',
      search: {
        q: null
      }
    };
  },
  computed: {
    facts: function () {
      const facts = this.$store.state.facts;
      if (facts) {
        const value = facts.slice(0);
        return value.sort((a, b) => b.id - a.id);
      }
      return facts;
    },
    filteredFacts: function () {
      if (this.facts) {
        if (!this.search.q) {
          return this.facts;
        }

        const searchString = this.search.q.toLowerCase();
        return this.facts.filter(a => a.text.toLowerCase().includes(searchString));
      } else {
        return null;
      }
    }
  },
  mounted: function () {
    if (!this.facts) {
      this.$store.dispatch('fetchFacts');
    }
  },
  methods: {
    handleSearch: function (e) {
      if (this.search.q !== e.target.value) {
        const q = e.target.value ? e.target.value : null;
        this.search = { q };
      }
    },
    handleSubmit: function (e) {
      e.preventDefault();
      return false;
    }
  }
};
</script>
