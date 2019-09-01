<template lang="pug">
  app-template
    h1.title Manage Backgrounds
    section.content
      background-upload-container
      upload-progress
      .search-container(v-if='backgrounds && backgrounds.length')
        form(@submit='handleSubmit')
          input(
            name='q'
            type='search'
            autocomplete='off'
            placeholder='Search backgrounds by name'
            @search='handleSearch'
            @keyup='handleSearch'
          )
          i.fa.fa-search
      backgrounds-list(
        v-if='backgrounds && backgrounds.length'
        :backgrounds='filteredBackgrounds'
        :q='search.q'
      )
      zero-data-state(v-else-if='backgrounds')
      loading-spinner(v-else=true)
</template>

<script>
import AppTemplate from 'components/AppTemplate';
import UploadContainer from 'components/Dashboard/Backgrounds/UploadContainer';
import UploadProgress from 'components/helpers/UploadProgress';
import BackgroundsList from 'components/Dashboard/Backgrounds/BackgroundsList';

export default {
  name: 'dashboard-backgrounds-page',
  components: {
    'app-template': AppTemplate,
    'background-upload-container': UploadContainer,
    'upload-progress': UploadProgress,
    'backgrounds-list': BackgroundsList
  },
  data: function () {
    return {
      search: {
        q: null
      }
    };
  },
  computed: {
    backgrounds: function () {
      const backgrounds = this.$store.state.backgrounds;
      if (backgrounds) {
        const value = backgrounds.slice(0);
        return value.sort((a, b) => b.id - a.id);
      }
      return backgrounds;
    },
    filteredBackgrounds: function () {
      if (this.backgrounds) {
        if (!this.search.q) {
          return this.backgrounds;
        }

        const searchString = this.search.q.toLowerCase();
        return this.backgrounds.filter(a => a.name.toLowerCase().includes(searchString));
      } else {
        return null;
      }
    }
  },
  mounted: function () {
    if (!this.backgrounds) {
      this.$store.dispatch('fetchBackgrounds');
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
