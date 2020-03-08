import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import QuestionList from './components/QuestionList.vue'
import QuestionDetail from './components/QuestionDetail.vue'

Vue.use(VueRouter)
Vue.config.productionTip = false

const routes = [
  { path: '/', name: 'home', component: QuestionList },
  { path: '/questions', name: 'question-list', component: QuestionList },
  { path: '/questions/:questionId', name: 'question-detail', component: QuestionDetail },
]

const router = new VueRouter({
  routes
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
