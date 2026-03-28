<template>
  <section>
    <QuestionAnswerCards v-if="question && questionsDisplayedCount"
      v-bind:question="question"
      v-bind:context="{ question_number: (questionIndex+1) + ' / ' + questionsDisplayedCount, source: 'question' }"
      @answer-submitted="onAnswerSubmitted" />

    <div v-if="question" class="small" :key="question.id"> <!-- INFO: :key is to force reload, avoid button staying blur -->
      <!-- <br /> -->
      <router-link v-if="questionSameFilterNextId" :to="{ name: 'question-detail', params: { questionId: questionSameFilterNextId } }">
        <button id="question-next-btn" class="btn" :class="emphasisNextButton ? 'btn-primary' : 'btn-outline-primary'">⏩&nbsp;{{ $t('messages.nextQuestion') }}</button>
      </router-link>
    </div>
  </section>
</template>

<script>
import { metaTagsGenerator } from '../utils';
import QuestionAnswerCards from '../components/QuestionAnswerCards.vue';
import { useQuestionsStore } from '../stores/questions';

export default {
  name: 'QuestionDetailPage',
  metaInfo() {
    const title = this.question ? `Question #${this.$route.params.questionId} - ${this.question.category.name}` : null;
    const description = this.question && this.question.text ? this.question.text : null;
    return {
      title,
      meta: metaTagsGenerator(title, description),
    };
  },
  components: {
    QuestionAnswerCards,
  },

  data() {
    return {
      emphasisNextButton: false,
      questionSameFilterNextId: null,
    };
  },

  computed: {
    question() {
      const questionsStore = useQuestionsStore();
      return questionsStore.getQuestionById(parseInt(this.$route.params.questionId, 10));
    },
    questionIndex() {
      const questionsStore = useQuestionsStore();
      return questionsStore.getCurrentQuestionIndex(parseInt(this.$route.params.questionId, 10));
    },
    questionFilters() {
      const questionsStore = useQuestionsStore();
      return questionsStore.questionFilters;
    },
    questionsDisplayedCount() {
      const questionsStore = useQuestionsStore();
      return questionsStore.questionsDisplayed.length;
    },
  },

  watch: {
    question: {
      immediate: true,
      // eslint-disable-next-line
      handler(newQuestion, oldQuestion) {
        if (newQuestion) {
          const questionsStore = useQuestionsStore();
          this.emphasisNextButton = false;
          this.questionSameFilterNextId = questionsStore.getNextQuestionByFilter(newQuestion.id).id;
        }
      },
    },
    // eslint-disable-next-line
    // questionFilters (newQuestionFilters, oldQuestionFilters) {
    //   if (newQuestionFilters) {
    //     const questionsStore = useQuestionsStore();
    //     const nextQuestion = questionsStore.getNextQuestionByFilter();
    //     if (nextQuestion) {
    //       this.$router.push({ name: 'question-detail', params: { questionId: nextQuestion.id } });
    //     } else {
    //       this.$router.push({ name: 'question-list' });
    //     }
    //   }
    // },
  },

  mounted() {
  },

  methods: {
    // eslint-disable-next-line
    onAnswerSubmitted(data) {
      this.emphasisNextButton = true; // !this.emphasisNextButton;
    },
  },
};
</script>

<style scoped>
</style>
