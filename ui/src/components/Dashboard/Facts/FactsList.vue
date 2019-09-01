<template lang="pug">
  .facts-list
    fact-block(
      v-for='fact in facts'
      :fact='fact'
      :key='fact.id'
      :q='q'
    )
</template>

<script>
import FactBlock from 'components/Dashboard/Facts/FactBlock';

export default {
  name: 'facts-list',
  components: {
    'fact-block': FactBlock
  },
  props: {
    facts: { type: Array, required: true },
    q: { type: String }
  }
};
</script>
