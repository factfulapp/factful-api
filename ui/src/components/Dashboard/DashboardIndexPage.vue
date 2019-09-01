<template lang="pug">
  app-template
    h1.title Factful App Dashboard
    p Hi, {{ name }}! What would you like to do today?
    .dashboard-actions
      router-link(to='/dashboard/facts/new') Add a new fact
      router-link(to='/dashboard/facts') Manage existing facts
      router-link(to='/dashboard/categories') Manage categories
      router-link(to='/dashboard/backgrounds') Manage backgrounds
</template>

<script>
import AppTemplate from 'components/AppTemplate';

export default {
  name: 'dashboard-index-page',
  components: {
    'app-template': AppTemplate
  },
  computed: {
    name: function () {
      return this.$store.state.user.name;
    }
  }
};
</script>

<style lang="scss" scoped>
  @import 'src/styles/colors';

  .dashboard-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;

    a {
      display: block;
      box-sizing: border-box;
      width: calc(50% - 10px);
      padding: 10px 25px;
      margin-bottom: 10px;
      background: $blue;
      color: #fff;
      margin-right: 10px;
      transition: 200ms background ease-in-out;
      border-radius: 3px;

      &:nth-child(2n) {
        margin-right: 0;
      }

      &:hover {
        background: $blue-lighter;
      }
    }

    @media only screen and ( max-width: 660px ) {
      display: block;

      a {
        width: auto;
        margin-right: 0;
      }
    }
  }
</style>
