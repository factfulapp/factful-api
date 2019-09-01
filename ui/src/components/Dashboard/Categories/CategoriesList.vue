<template lang="pug">
  .categories-list
    category-block(
      v-for='category in categories'
      :category='category'
      :key='category.id'
    )
</template>

<script>
import CategoryBlock from 'components/Dashboard/Categories/CategoryBlock';

export default {
  name: 'category-list',
  components: {
    'category-block': CategoryBlock
  },
  props: {
    categories: { type: Array, required: true }
  }
};
</script>
