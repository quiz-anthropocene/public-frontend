import { defineStore } from 'pinia';
import constants from '../constants';

import authorsYamlData from '../../../data/authors.yaml';
import difficultyLevelsYamlData from '../../../data/difficulty-levels.yaml';
import ressourcesSoutiensYamlData from '../../../data/ressources-soutiens.yaml';
import ressourcesAutresAppsYamlData from '../../../data/ressources-autres-apps.yaml';

export const useResourcesStore = defineStore('resources', {
  state: () => ({
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
  }),

  getters: {
    getUserById: (state) => (userId) => state.authors.find((u) => (u.id === ((userId && typeof userId === 'object') ? userId.id : userId))),
    getUsersByIdList: (state) => (userIdList) => state.authors.filter((u) => ((userIdList && userIdList.length && typeof userIdList[0] === 'object') ? userIdList.map((user) => user.id).includes(u.id) : userIdList.includes(u.id))),
    getCategoryById: (state) => (categoryId) => state.categories.find((c) => (c.id === ((categoryId && typeof categoryId === 'object') ? categoryId.id : categoryId))),
    getTagById: (state) => (tagId) => state.tags.find((t) => (t.id === ((tagId && typeof tagId === 'object') ? tagId.id : tagId))),
    getTagsByIdList: (state) => (tagIdList) => state.tags.filter((t) => ((tagIdList && tagIdList.length && typeof tagIdList[0] === 'object') ? tagIdList.map((tag) => tag.id).includes(t.id) : tagIdList.includes(t.id))),
    getDifficultyLevelEmojiByValue: (state) => (difficultyLevelValue) => state.difficultyLevels.find((dl) => (dl.value === parseInt(difficultyLevelValue, 10))).emoji,
  },

  actions: {
    async getLanguagesFromYaml() {
      const module = await import('../../../data/languages.yaml');
      const languages = module.default.filter((l) => {
        return constants.LANGUAGE_CHOICE_LIST.map((cl) => cl.value).includes(l.value);
      });
      this.languages = languages;
    },

    getAuthorsFromYaml() {
      const authors = authorsYamlData.map((a) => {
        const authorFullName =`${a.first_name} ${a.last_name}`;
        return { ...a, full_name: authorFullName };
      });
      this.authors = authors;
    },

    getDifficultyLevelsFromYaml() {
      this.difficultyLevels = difficultyLevelsYamlData;
    },

    async getCategoriesFromYaml() {
      const module = await import('../../../data/categories.yaml');
      this.categories = module.default;
    },

    async getCategoriesFromApi() {
      try {
        const response = await fetch(`${process.env.VUE_APP_API_ENDPOINT}/categories/`, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        this.categories = data.results;
      } catch (error) {
        console.log(error);
      }
    },

    async getTagsFromYaml() {
      const module = await import('../../../data/tags.yaml');
      this.tags = module.default;
    },

    async getTagsFromApi() {
      try {
        const response = await fetch(`${process.env.VUE_APP_API_ENDPOINT}/tags/?limit=10000`, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        this.tags = data.results;
      } catch (error) {
        console.log(error);
      }
    },

    async getGlossaireFromYaml() {
      const module = await import('../../../data/ressources-glossaire.yaml');
      this.ressources.glossaire = module.default;
    },

    async getGlossaireFromApi() {
      try {
        const response = await fetch(`${process.env.VUE_APP_API_ENDPOINT}/glossary/`, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        this.ressources.glossaire = data.results;
      } catch (error) {
        console.log(error);
      }
    },

    getSoutiensFromYaml() {
      this.ressources.soutiens = ressourcesSoutiensYamlData;
    },

    getAutresAppsFromYaml() {
      this.ressources.autresApps = ressourcesAutresAppsYamlData;
    },

    setCategoryQuestionCount(questionsValidated) {
      if (this.categories.length && questionsValidated.length) {
        this.categories = this.categories.map((c) => {
          const categoryQuestionCount = questionsValidated.filter((q) => q.category && q.category.name === c.name).length;
          return { ...c, question_count: categoryQuestionCount };
        });
      }
    },

    setTagQuestionCount(questionsValidated) {
      if (this.tags.length && questionsValidated.length) {
        this.tags = this.tags.map((t) => {
          const tagQuestionCount = questionsValidated.filter((q) => q.tags.map((qt) => qt.id).includes(t.id)).length;
          return { ...t, question_count: tagQuestionCount };
        });
      }
    },

    setTagQuizCount(quizsPublished) {
      if (this.tags.length && quizsPublished.length) {
        this.tags = this.tags.map((t) => {
          const tagQuizCount = quizsPublished.filter((q) => q.tags.map((qt) => qt.id).includes(t.id)).length;
          return { ...t, quiz_count: tagQuizCount };
        });
      }
    },
  },
});
