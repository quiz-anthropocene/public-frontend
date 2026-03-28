import { defineStore } from 'pinia';
import i18n from '../i18n';
import constants from '../constants';
import { useResourcesStore } from './resources';

import questionsYamlData from '../../../data/questions.yaml';

export const useQuestionsStore = defineStore('questions', {
  state: () => ({
    questions: [],
    questionsValidated: [],
    questionsDisplayed: [],
    questionsPendingValidation: [],
    questionFilters: {
      category: null,
      tag: null,
      author: null,
      difficulty: null,
      sort: constants.QUIZ_SORT_DEFAULT,
    },
  }),

  getters: {
    getQuestionById: (state) => (questionId) => state.questions.find((q) => (q.id === questionId)),
    getQuestionsByIdList: (state) => (questionIdList) => state.questions.filter((q) => questionIdList.includes(q.id)),
    getQuestionsByCategoryName: (state) => (categoryName) => state.questions.filter((q) => (q.category.name === categoryName)),
    getQuestionsByTagName: (state) => (tagName) => state.questions.filter((q) => q.tags.map((qt) => qt.name).includes(tagName)),
    getQuestionsByAuthorName: (state) => (authorName) => state.questions.filter((q) => q.author === authorName),
    getQuestionsValidatedByFilter: (state) => (filter) => state.questionsValidated
      .filter((q) => (filter.category ? (q.category.name === filter.category) : true))
      .filter((q) => (filter.tag ? q.tags.map((qt) => qt.name).includes(filter.tag) : true))
      .filter((q) => (filter.author ? (q.author.full_name === filter.author) : true))
      .filter((q) => (filter.difficulty ? (q.difficulty === parseInt(filter.difficulty, 10)) : true)),
    getCurrentQuestionIndex: (state) => (currentQuestionId) => state.questionsDisplayed.findIndex((q) => q.id === currentQuestionId),
    getNextQuestionByFilter: (state) => (currentQuestionId) => {
      const currentQuestionIndex = currentQuestionId ? state.questionsDisplayed.findIndex((q) => q.id === currentQuestionId) : 0;
      return state.questionsDisplayed[currentQuestionIndex + 1] || state.questionsDisplayed[0];
    },
  },

  actions: {
    getQuestionsFromYaml() {
      const resourcesStore = useResourcesStore();
      const questions = questionsYamlData.map((q) => {
        const questionAuthor = resourcesStore.getUserById(q.author);
        const questionCategory = resourcesStore.getCategoryById(q.category);
        const questionTags = resourcesStore.getTagsByIdList(q.tags);
        return { ...q, author: questionAuthor, category: questionCategory, tags: questionTags };
      });

      const currentLocale = i18n.global.locale;
      const questionsValidated = questions
        .filter((q) => q.language === currentLocale)
        .filter((el) => el.validation_status === constants.VALIDATION_STATUS_VALIDATED);

      this.questions = questions;
      this.questionsValidated = questionsValidated;
      this.questionsDisplayed = questionsValidated;

      // update categories & tags counts
      resourcesStore.setCategoryQuestionCount(questionsValidated);
      resourcesStore.setTagQuestionCount(questionsValidated);
    },

    getPendingValidationFromYaml() {
      const currentLocale = i18n.global.locale;
      this.questionsPendingValidation = questionsYamlData
        .filter((q) => q.language === currentLocale)
        .filter((el) => el.validation_status === constants.VALIDATION_STATUS_TO_VALIDATE);
    },

    updateFilters(filterObject) {
      const currentQuestionFilters = filterObject || this.questionFilters;
      const questionsDisplayed = this.getQuestionsValidatedByFilter(currentQuestionFilters)
        .sort(() => Math.random() - 0.5) // random order
        .sort((a, b) => a.difficulty - b.difficulty); // order by difficulty (easiest to hardest)

      this.questionFilters = currentQuestionFilters;
      this.questionsDisplayed = questionsDisplayed;
    },
  },
});
