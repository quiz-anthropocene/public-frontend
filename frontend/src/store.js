import Vue from 'vue';
import Vuex from 'vuex';

import i18n from './i18n';
import constants from './constants';

// webpack + vue-cli-plugin-yaml
import configurationYamlData from '../../data/configuration.yaml';
import statsYamlData from '../../data/stats.yaml';
import authorsYamlData from '../../data/authors.yaml';
import difficultyLevelsYamlData from '../../data/difficulty-levels.yaml';
import questionsYamlData from '../../data/questions.yaml';
import quizsYamlData from '../../data/quizs.yaml';
import quizQuestionsYamlData from '../../data/quiz-questions.yaml';
import quizRelationshipsYamlData from '../../data/quiz-relationships.yaml';
import quizStatsYamlData from '../../data/quiz-stats.yaml';
import ressourcesSoutiensYamlData from '../../data/ressources-soutiens.yaml';
import ressourcesAutresAppsYamlData from '../../data/ressources-autres-apps.yaml';

Vue.use(Vuex);

/**
 * Place to store app-wide variables
 */
const store = new Vuex.Store({
  state: {
    loading: false,
    error: null,
    configuration: {},
    locale: {},
    questions: [],
    questionsValidated: [],
    questionsDisplayed: [],
    questionFilters: {
      category: null,
      tag: null,
      author: null,
      difficulty: null,
      sort: constants.QUIZ_SORT_DEFAULT,
    },
    questionsPendingValidation: [],
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
    categories: [],
    tags: [],
    languages: [],
    authors: [],
    difficultyLevels: [],
    ressources: {
      glossaire: [],
      soutiens: [],
      autresApps: [],
    },
    stats: {},
  },
  actions: {
    START_LOADING: ({ commit }) => {
      commit('UPDATE_LOADING_STATUS', true);
    },
    STOP_LOADING: ({ commit }) => {
      commit('UPDATE_LOADING_STATUS', false);
    },
    RESET_LOADING_STATUS: ({ commit }) => {
      commit('UPDATE_LOADING_STATUS', false);
      commit('UPDATE_ERROR', null);
    },
    /**
     * Set app locale
     */
    SET_LOCALE: ({ commit }) => {
      const localeDict = constants.LANGUAGE_CHOICE_LIST.find((l) => l.code === i18n.locale);
      commit('SET_LOCALE_DICT', { dict: localeDict });
    },
    /**
     * Get app configuration
     */
    GET_CONFIGURATION_DICT_FROM_LOCAL_YAML: ({ commit }) => {
      commit('SET_CONFIGURATION_DICT', { dict: configurationYamlData[0] });
    },
    /**
     * Get questions
     * Pre-processing ?
     * - keep only validated questions
     * - enrich with categories, tags
     */
    GET_QUESTION_LIST_FROM_LOCAL_YAML: ({ commit, state, getters }) => {
      const questions = questionsYamlData;
      // questions: get author, category & tags objects
      questions.map((q) => {
        const questionAuthor = getters.getUserById(q.author);
        const questionCategory = getters.getCategoryById(q.category);
        const questionTags = getters.getTagsByIdList(q.tags);
        Object.assign(q, { author: questionAuthor, category: questionCategory }, { tags: questionTags });
        return q;
      });
      const questionsValidated = questions.filter((q) => q.language === state.locale.value).filter((el) => el.validation_status === constants.VALIDATION_STATUS_VALIDATED);
      commit('SET_QUESTION_LIST', { list: questions });
      commit('SET_QUESTION_VALIDATED_LIST', { list: questionsValidated });

      // update categories: add question_count
      commit('SET_CATEGORY_QUESTION_COUNT');

      // update tags: add question_count
      commit('SET_TAG_QUESTION_COUNT');
    },
    GET_QUESTION_PENDING_VALIDATION_LIST_FROM_LOCAL_YAML: ({ commit, state }) => {
      const questionsPendingValidation = questionsYamlData.filter((q) => q.language === state.locale.value).filter((el) => el.validation_status === constants.VALIDATION_STATUS_TO_VALIDATE);
      commit('SET_QUESTION_PENDING_VALIDATION_LIST', { list: questionsPendingValidation });
    },
    /**
     * Get quizs
     * Pre-processing ?
     * - keep only published quizs
     * - enrich with questions, tags
     */
    GET_QUIZ_LIST_FROM_LOCAL_YAML: ({ commit, state, getters }) => {
      const quizs = quizsYamlData;
      // quiz: get question and tag objects
      quizs.map((q) => {
        // get quiz questions (in the right order)
        const quizQuestionsList = quizQuestionsYamlData.filter((qq) => qq.quiz === q.id);
        quizQuestionsList.sort((a, b) => a.order - b.order);
        const quizQuestionsIdList = quizQuestionsList.map((qq) => qq.question);
        const quizQuestions = getters.getQuestionsByIdList(quizQuestionsIdList);
        quizQuestions.sort((a, b) => quizQuestionsIdList.indexOf(a.id) - quizQuestionsIdList.indexOf(b.id));
        // get quiz author & tags
        const quizAuthors = getters.getUsersByIdList(q.authors);
        const quizTags = getters.getTagsByIdList(q.tags);
        // assign
        Object.assign(q, { questions: quizQuestions }, { authors: quizAuthors }, { tags: quizTags });
        return q;
      });
      const quizsPublished = quizs.filter((q) => q.language === state.locale.value).filter((el) => el.publish === true);
      commit('SET_QUIZ_LIST', { list: quizs });
      commit('SET_QUIZ_PUBLISHED_LIST', { list: quizsPublished });
      const quizsSpotlighted = quizsPublished
        .filter((q) => q.spotlight) // only display spotlighted quizs
        .sort((a, b) => ((a.validation_date && b.validation_date) ? b.validation_date.localeCompare(a.validation_date) : false)) // order by validation_date date (latest first)
        .slice(0, state.quizsToSpotlight);
      commit('SET_QUIZ_SPOTLIGHTED_LIST', { list: quizsSpotlighted });

      // update tags: add quiz_count
      commit('SET_TAG_QUIZ_COUNT');
    },
    /**
     * Get quiz relationships
     * Pre-processing ? None
     */
    GET_QUIZ_RELATIONSHIP_LIST_FROM_LOCAL_YAML: ({ commit }) => {
      commit('SET_QUIZ_RELATIONSHIP_LIST', { list: quizRelationshipsYamlData });
    },
    /**
     * Get quiz stats
     * Pre-processing ? None
     */
    GET_QUIZ_STATS_LIST_FROM_LOCAL_YAML: ({ commit }) => {
      commit('SET_QUIZ_STATS_LIST', { list: quizStatsYamlData });
    },
    /**
     * Get languages
     * Pre-processing ? None
     */
    GET_LANGUAGE_LIST_FROM_LOCAL_YAML: ({ commit }) => {
      import('../../data/languages.yaml').then((module) => {
        const languages = module.default.filter((l) => {
          return constants.LANGUAGE_CHOICE_LIST.map((cl) => cl.value).includes(l.value);
        });
        commit('SET_LANGUAGE_LIST', { list: languages });
      });
    },
    /**
     * Get authors
     * Pre-processing ? None
     */
    GET_AUTHOR_LIST_FROM_LOCAL_YAML: ({ commit }) => {
      const authors = authorsYamlData;
      authors.map((a) => {
        const authorFullName = `${a.first_name} ${a.last_name}`;
        Object.assign(a, { full_name: authorFullName });
        return a;
      });
      commit('SET_AUTHOR_LIST', { list: authors });
    },
    /**
     * Get difficulty-levels
     * Pre-processing ? None
     */
    GET_DIFFICULTY_LEVEL_LIST_FROM_LOCAL_YAML: ({ commit }) => {
      commit('SET_DIFFICULTY_LEVEL_LIST', { list: difficultyLevelsYamlData });
    },
    /**
     * Get categories
     * Pre-processing ? None
     */
    GET_CATEGORY_LIST_FROM_LOCAL_YAML: ({ commit }) => {
      import('../../data/categories.yaml').then((module) => {
        commit('SET_CATEGORY_LIST', { list: module.default });
      });
    },
    GET_CATEGORY_LIST_FROM_API: ({ commit }) => {
      return fetch(`${process.env.VUE_APP_API_ENDPOINT}/categories/`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        // eslint-disable-next-line
        .then(data => {
          commit('SET_CATEGORY_LIST', { list: data.results });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    /**
     * Get tags
     * Pre-processing ? None
     */
    GET_TAG_LIST_FROM_LOCAL_YAML: ({ commit }) => {
      import('../../data/tags.yaml').then((module) => {
        commit('SET_TAG_LIST', { list: module.default });
      });
    },
    GET_TAG_LIST_FROM_API: ({ commit }) => {
      return fetch(`${process.env.VUE_APP_API_ENDPOINT}/tags/?limit=10000`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        // eslint-disable-next-line
        .then(data => {
          commit('SET_TAG_LIST', { list: data.results });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    /**
     * Get ressources: glossaire, soutiens, autres apps
     * Pre-processing ? for soutiens, append quiz tag or question author
     */
    GET_RESSOURCES_GLOSSAIRE_LIST_FROM_LOCAL_YAML: ({ commit }) => {
      import('../../data/ressources-glossaire.yaml').then((module) => {
        commit('SET_RESSOURCES_GLOSSAIRE_LIST', { list: module.default });
      });
    },
    GET_RESSOURCES_GLOSSAIRE_LIST_FROM_API: ({ commit }) => {
      fetch(`${process.env.VUE_APP_API_ENDPOINT}/glossary/`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        // eslint-disable-next-line
        .then(data => {
          commit('SET_RESSOURCES_GLOSSAIRE_LIST', { list: data.results });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    GET_RESSOURCES_SOUTIENS_LIST_FROM_LOCAL_YAML: ({ commit }) => {
      commit('SET_RESSOURCES_SOUTIENS_LIST', { list: ressourcesSoutiensYamlData });
    },
    GET_RESSOURCES_AUTRES_APPS_LIST_FROM_LOCAL_YAML: ({ commit }) => {
      commit('SET_RESSOURCES_AUTRES_APPS_LIST', { list: ressourcesAutresAppsYamlData });
    },
    /**
     * Get app stats
     */
    GET_STATS_DICT_FROM_LOCAL_YAML: ({ commit }) => {
      commit('SET_STATS_DICT', { dict: statsYamlData });
    },
    /**
     * Update question & quiz filters
     */
    UPDATE_QUESTION_FILTERS: ({ commit, state, getters }, filterObject) => {
      const currentQuestionFilters = filterObject || state.questionFilters;
      const questionsDisplayed = getters.getQuestionsValidatedByFilter(currentQuestionFilters)
        .sort(() => Math.random() - 0.5) // random order
        .sort((a, b) => a.difficulty - b.difficulty); // order by difficulty (easiest to hardest)
      commit('SET_QUESTION_FILTERS', { object: currentQuestionFilters });
      commit('SET_QUESTIONS_DISPLAYED_LIST', { list: questionsDisplayed });
    },
    UPDATE_QUIZ_FILTERS: ({ commit, state, getters }, filterObject) => {
      const currentQuizFilters = filterObject || state.quizFilters;
      const quizsDisplayed = getters.getQuizsPublishedByFilter(currentQuizFilters);
      commit('SET_QUESTION_FILTERS', { object: currentQuizFilters });
      // We are not using the quizFilterVairable anymore
      // commit('SET_QUIZ_FILTERS', { object: currentQuizFilters });
      commit('SET_QUIZS_DISPLAYED_LIST', { list: quizsDisplayed });
    },
  },
  mutations: {
    UPDATE_LOADING_STATUS: (state, value) => {
      state.loading = value;
    },
    UPDATE_ERROR: (state, value) => {
      state.error = value;
    },
    SET_LOCALE_DICT: (state, { dict }) => {
      state.locale = dict;
    },
    SET_CONFIGURATION_DICT: (state, { dict }) => {
      state.configuration = dict;
    },
    SET_QUESTION_LIST: (state, { list }) => {
      state.questions = list;
    },
    SET_QUESTION_VALIDATED_LIST: (state, { list }) => {
      state.questionsValidated = list;
      state.questionsDisplayed = list;
    },
    SET_QUESTION_PENDING_VALIDATION_LIST: (state, { list }) => {
      state.questionsPendingValidation = list;
    },
    SET_QUIZ_LIST: (state, { list }) => {
      state.quizs = list;
    },
    SET_QUIZ_PUBLISHED_LIST: (state, { list }) => {
      state.quizsPublished = list;
    },
    SET_QUIZ_SPOTLIGHTED_LIST: (state, { list }) => {
      state.quizsSpotlighted = list;
    },
    SET_QUIZ_RELATIONSHIP_LIST: (state, { list }) => {
      state.quizRelationships = list;
    },
    SET_QUIZ_STATS_LIST: (state, { list }) => {
      state.quizStats = list;
    },
    SET_CATEGORY_LIST: (state, { list }) => {
      state.categories = list;
    },
    SET_CATEGORY_QUESTION_COUNT: (state) => {
      if (state.categories.length && state.questionsValidated.length) {
        state.categories.forEach((c, index) => {
          const categoryQuestionCount = state.questionsValidated.filter((q) => q.category && q.category.name === c.name).length;
          // splice? to tell Vue that the categories array has been updated
          state.categories.splice(index, 1, Object.assign(c, { question_count: categoryQuestionCount }));
        });
      }
    },
    SET_TAG_LIST: (state, { list }) => {
      state.tags = list;
    },
    SET_TAG_QUESTION_COUNT: (state) => {
      if (state.tags.length && state.questionsValidated.length) {
        state.tags.forEach((t, index) => {
          const tagQuestionCount = state.questionsValidated.filter((q) => q.tags.map((qt) => qt.id).includes(t.id)).length;
          state.tags.splice(index, 1, Object.assign(t, { question_count: tagQuestionCount }));
        });
      }
    },
    SET_TAG_QUIZ_COUNT: (state) => {
      if (state.tags.length && state.quizsPublished.length) {
        state.tags.forEach((t, index) => {
          const tagQuizCount = state.quizsPublished.filter((q) => q.tags.map((qt) => qt.id).includes(t.id)).length;
          state.tags.splice(index, 1, Object.assign(t, { quiz_count: tagQuizCount }));
        });
      }
    },
    SET_LANGUAGE_LIST: (state, { list }) => {
      state.languages = list;
    },
    SET_AUTHOR_LIST: (state, { list }) => {
      state.authors = list;
    },
    SET_DIFFICULTY_LEVEL_LIST: (state, { list }) => {
      state.difficultyLevels = list;
    },
    SET_RESSOURCES_GLOSSAIRE_LIST: (state, { list }) => {
      state.ressources.glossaire = list;
    },
    SET_RESSOURCES_SOUTIENS_LIST: (state, { list }) => {
      state.ressources.soutiens = list;
    },
    SET_RESSOURCES_AUTRES_APPS_LIST: (state, { list }) => {
      state.ressources.autresApps = list;
    },
    SET_QUESTION_FILTERS: (state, { object }) => {
      state.questionFilters = object;
    },
    SET_QUIZ_FILTERS: (state, { object }) => {
      state.quizFilters = object;
    },
    SET_QUESTIONS_DISPLAYED_LIST: (state, { list }) => {
      state.questionsDisplayed = list;
    },
    SET_QUIZS_DISPLAYED_LIST: (state, { list }) => {
      state.quizsDisplayed = list;
    },
    SET_STATS_DICT: (state, { dict }) => {
      state.stats = dict;
    },
  },
  getters: {
    getUserById: (state) => (userId) => state.authors.find((u) => (u.id === ((userId && typeof userId === 'object') ? userId.id : userId))),
    getUsersByIdList: (state) => (userIdList) => state.authors.filter((u) => ((userIdList && userIdList.length && typeof userIdList[0] === 'object') ? userIdList.map((user) => user.id).includes(u.id) : userIdList.includes(u.id))),
    getCategoryById: (state) => (categoryId) => state.categories.find((c) => (c.id === ((categoryId && typeof categoryId === 'object') ? categoryId.id : categoryId))),
    getTagById: (state) => (tagId) => state.tags.find((t) => (t.id === ((tagId && typeof tagId === 'object') ? tagId.id : tagId))),
    getTagsByIdList: (state) => (tagIdList) => state.tags.filter((t) => ((tagIdList && tagIdList.length && typeof tagIdList[0] === 'object') ? tagIdList.map((tag) => tag.id).includes(t.id) : tagIdList.includes(t.id))),
    getDifficultyLevelEmojiByValue: (state) => (difficultyLevelValue) => state.difficultyLevels.find((dl) => (dl.value === parseInt(difficultyLevelValue, 10))).emoji,
    // questions
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
      const currentQuestionIndex = currentQuestionId ? state.questionsDisplayed.findIndex((q) => q.id === currentQuestionId) : state.questionsDisplayed[0];
      return state.questionsDisplayed[currentQuestionIndex + 1] ? state.questionsDisplayed[currentQuestionIndex + 1] : state.questionsDisplayed[0];
    },
    // quiz
    getQuizById: (state) => (quizId) => state.quizs.find((q) => (q.id === quizId)),
    getQuizBySlug: (state) => (quizId) => state.quizs.find((q) => (q.slug === quizId)),
    getQuizsByIdList: (state) => (quizIdList) => state.quizs.filter((q) => quizIdList.includes(q.id)),
    getQuizsPublishedByFilter: (state) => (filter) => state.quizsPublished
      .filter((q) => (filter.tag ? q.tags.map((qt) => qt.name).includes(filter.tag) : true))
      .filter((q) => (filter.author ? q.authors.map((qa) => qa.full_name).includes(filter.author) : true))
      .sort((a, b) => ((a.validation_date && b.validation_date) ? b.validation_date.localeCompare(a.validation_date) : false)), // order by validation_date date (latest first)
    getQuizRelationshipsById: (state) => (quizId) => state.quizRelationships.filter((qr) => (qr.from_quiz === quizId) || (qr.to_quiz === quizId)),
    getQuizStatsById: (state) => (quizId) => state.quizStats.find((q) => (q.quiz_id === quizId)),
  },
});

export default store;
