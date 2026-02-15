import { defineStore } from 'pinia';
import i18n from '../i18n';
import { useResourcesStore } from './resources';
import { useQuestionsStore } from './questions';

import quizsYamlData from '../../../data/quizs.yaml';
import quizQuestionsYamlData from '../../../data/quiz-questions.yaml';
import quizRelationshipsYamlData from '../../../data/quiz-relationships.yaml';
import quizStatsYamlData from '../../../data/quiz-stats.yaml';

export const useQuizsStore = defineStore('quizs', {
  state: () => ({
    quizs: [],
    quizsPublished: [],
    quizsDisplayed: [],
    quizsToSpotlight: 5,
    quizsSpotlighted: [],
    quizFilters: {
      tag: null,
      author: null,
    },
    quizRelationships: [],
    quizStats: [],
  }),

  getters: {
    getQuizById: (state) => (quizId) => state.quizs.find((q) => (q.id === quizId)),
    getQuizBySlug: (state) => (quizSlug) => state.quizs.find((q) => (q.slug === quizSlug)),
    getQuizsByIdList: (state) => (quizIdList) => state.quizs.filter((q) => quizIdList.includes(q.id)),
    getQuizsPublishedByFilter: (state) => (filter) => state.quizsPublished
      .filter((q) => (filter.tag ? q.tags.map((qt) => qt.name).includes(filter.tag) : true))
      .filter((q) => (filter.author ? q.authors.map((qa) => qa.full_name).includes(filter.author) : true))
      .sort((a, b) => ((a.validation_date && b.validation_date) ? b.validation_date.localeCompare(a.validation_date) : false)),
    getQuizRelationshipsById: (state) => (quizId) => state.quizRelationships.filter((qr) => (qr.from_quiz === quizId) || (qr.to_quiz === quizId)),
    getQuizStatsById: (state) => (quizId) => state.quizStats.find((q) => (q.quiz_id === quizId)),
  },

  actions: {
    getQuizsFromYaml() {
      const resourcesStore = useResourcesStore();
      const questionsStore = useQuestionsStore();

      const quizs = quizsYamlData.map((q) => {
        // get quiz questions (in the right order)
        const quizQuestionsList = quizQuestionsYamlData.filter((qq) => qq.quiz === q.id);
        quizQuestionsList.sort((a, b) => a.order - b.order);
        const quizQuestionsIdList = quizQuestionsList.map((qq) => qq.question);
        const quizQuestions = questionsStore.getQuestionsByIdList(quizQuestionsIdList);
        quizQuestions.sort((a, b) => quizQuestionsIdList.indexOf(a.id) - quizQuestionsIdList.indexOf(b.id));

        // get quiz author & tags
        const quizAuthors = resourcesStore.getUsersByIdList(q.authors);
        const quizTags = resourcesStore.getTagsByIdList(q.tags);

        return { ...q, questions: quizQuestions, authors: quizAuthors, tags: quizTags };
      });

      const currentLocale = i18n.global.locale;
      const quizsPublished = quizs
        .filter((q) => q.language === currentLocale)
        .filter((el) => el.publish === true);

      this.quizs = quizs;
      this.quizsPublished = quizsPublished;

      const quizsSpotlighted = quizsPublished
        .filter((q) => q.spotlight)
        .sort((a, b) => ((a.validation_date && b.validation_date) ? b.validation_date.localeCompare(a.validation_date) : false))
        .slice(0, this.quizsToSpotlight);

      this.quizsSpotlighted = quizsSpotlighted;

      // update tags: add quiz_count
      resourcesStore.setTagQuizCount(quizsPublished);
    },

    getRelationshipsFromYaml() {
      this.quizRelationships = quizRelationshipsYamlData;
    },

    getStatsFromYaml() {
      this.quizStats = quizStatsYamlData;
    },

    updateFilters(filterObject) {
      const currentQuizFilters = filterObject || this.quizFilters;
      const quizsDisplayed = this.getQuizsPublishedByFilter(currentQuizFilters);

      this.quizFilters = currentQuizFilters;
      this.quizsDisplayed = quizsDisplayed;
    },
  },
});
