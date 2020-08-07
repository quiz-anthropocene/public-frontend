import Vue from 'vue';

/**
 * Common Filters
 * https://gist.github.com/belsrc/672b75d1f89a9a5c192c
 */

Vue.filter('round', (value = 0, decimals = 0) => Math.round(value * (10 ** decimals)) / (10 ** decimals));
