import { defineStore } from 'pinia';
import i18n from '../i18n';
import constants from '../constants';

// webpack + vue-cli-plugin-yaml
import configurationYamlData from '../../../data/configuration.yaml';
import statsYamlData from '../../../data/stats.yaml';

export const useMainStore = defineStore('main', {
  state: () => ({
    loading: false,
    error: null,
    configuration: {},
    locale: {},
    stats: {},
  }),

  getters: {},

  actions: {
    startLoading() {
      this.loading = true;
    },

    stopLoading() {
      this.loading = false;
    },

    resetLoadingStatus() {
      this.loading = false;
      this.error = null;
    },

    setLocale() {
      const localeDict = constants.LANGUAGE_CHOICE_LIST.find((l) => l.code === i18n.global.locale);
      this.locale = localeDict;
    },

    getConfigurationFromYaml() {
      this.configuration = configurationYamlData[0];
    },

    getStatsFromYaml() {
      this.stats = statsYamlData;
    },
  },
});
