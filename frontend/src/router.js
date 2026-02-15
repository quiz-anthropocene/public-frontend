import { createRouter, createWebHistory } from 'vue-router';

import HomePage from './views/HomePage.vue';
import QuestionPage from './views/QuestionPage.vue';
import QuestionListPage from './views/QuestionListPage.vue';
import QuestionDetailPage from './views/QuestionDetailPage.vue';
import QuizPage from './views/QuizPage.vue';
import QuizListPage from './views/QuizListPage.vue';
import QuizDetailPage from './views/QuizDetailPage.vue';
import AboutPage from './views/AboutPage.vue';
import LicensePage from './views/LicensePage.vue';
import RessourcesPage from './views/RessourcesPage.vue';
import StatsPage from './views/StatsPage.vue';
import GlossaryPage from './views/GlossaryPage.vue';
import ContributePage from './views/ContributePage.vue';
import AtelierPage from './views/AtelierPage.vue';
import AtelierBiennale2021Page from './views/AtelierBiennale2021Page.vue';
import NotFoundPage from './views/NotFoundPage.vue';

const routes = [
  {
    path: '/', name: 'home', component: HomePage,
  },
  {
    path: '/questions',
    component: QuestionPage,
    children: [
      {
        path: '',
        name: 'question-list',
        component: QuestionListPage,
      },
      {
        path: ':questionId',
        name: 'question-detail',
        component: QuestionDetailPage,
      },
    ],
  },
  {
    path: '/quiz',
    component: QuizPage,
    children: [
      {
        path: '',
        name: 'quiz-list',
        component: QuizListPage,
      },
      {
        path: ':quizId',
        name: 'quiz-detail',
        component: QuizDetailPage,
      },
    ],
  },
  {
    path: '/a-propos',
    name: 'about',
    component: AboutPage,
  },
  {
    path: '/licence',
    name: 'license',
    component: LicensePage,
  },
  {
    path: '/ressources',
    name: 'ressources',
    component: RessourcesPage,
    meta: {
      title: 'Quiz de l\'Anthropocène - Ressources',
    },
  },
  {
    path: '/stats',
    name: 'stats',
    component: StatsPage,
  },
  {
    path: '/glossaire',
    name: 'glossary',
    component: GlossaryPage,
  },
  {
    path: '/contribuer',
    name: 'contribute',
    component: ContributePage,
  },
  {
    path: '/atelier',
    name: 'atelier',
    component: AtelierPage,
  },
  {
    path: '/atelier-biennale-2021',
    name: 'atelier-biennale-2021',
    component: AtelierBiennale2021Page,
  },
  {
    // will match everything (Vue 3 catch-all syntax)
    path: '/:pathMatch(.*)*',
    name: '404',
    component: NotFoundPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  // eslint-disable-next-line
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return { el: to.hash };
    }
    return { x: 0, y: 0 };
  },
});

export default router;
