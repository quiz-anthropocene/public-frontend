<template>
  <section>
    <router-view></router-view>
  </section>
</template>

<script>
import { useQuizsStore } from '../stores/quizs';

export default {
  name: 'QuizPage',
  components: {
  },

  data() {
    return {
    };
  },

  computed: {
  },

  watch: {
  },

  mounted() {
    const quizsStore = useQuizsStore();
    quizsStore.getRelationshipsFromYaml();
    quizsStore.getStatsFromYaml();
  },
};
</script>

<style scoped>
</style>
