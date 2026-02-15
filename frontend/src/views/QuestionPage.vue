<template>
  <section>
    <router-view></router-view>
  </section>
</template>

<script>
import { useQuestionsStore } from '../stores/questions';

export default {
  name: 'QuestionPage',
  components: {
  },

  data() {
    return {
    };
  },

  computed: {
    questions() {
      const questionsStore = useQuestionsStore();
      return questionsStore.questionsValidated;
    },
  },

  // watch: {
  //   // eslint-disable-next-line
  //   questions (newQuestions, oldQuestions) {
  //     console.log('QuestionPage watch questions', oldQuestions, newQuestions)
  //     const questionsStore = useQuestionsStore();
  //     questionsStore.updateFilters();
  //   },
  // },

  mounted() {
    if (this.questions) {
      const questionsStore = useQuestionsStore();
      questionsStore.updateFilters();
    }
  },
};
</script>

<style scoped>
</style>
