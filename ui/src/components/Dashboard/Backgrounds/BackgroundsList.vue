<template lang="pug">
  .backgrounds-list
    background-item(
      v-for='background in backgrounds'
      :background='background'
      :key='background.id'
      :q='q'
    )
</template>

<script>
import BackgroundItem from 'components/Dashboard/Backgrounds/BackgroundItem';

export default {
  name: 'background-list',
  components: {
    'background-item': BackgroundItem
  },
  props: {
    backgrounds: { type: Array, required: true },
    q: { type: String }
  }
};
</script>
