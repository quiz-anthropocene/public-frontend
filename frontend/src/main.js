import { createApp } from 'vue';

import router from './router';
import store from './store';
import filters from './filters';

import App from './App.vue';
import i18n from './i18n';

/**
 * App
 */
const app = createApp(App);

app.use(store);
app.use(router);
app.use(i18n);

// Register global filters
Object.keys(filters).forEach((filterName) => {
  app.config.globalProperties.$filters = {
    ...app.config.globalProperties.$filters,
    [filterName]: filters[filterName],
  };
});

app.mount('#app');
