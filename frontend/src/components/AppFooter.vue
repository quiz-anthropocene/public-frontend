<template>
  <footer>
    <section class="container-md">
      <!-- First row: app links -->
      <div class="row">
        <!-- <div class="col-sm">
          <router-link :to="{ name: 'question-list' }">
            ❓&nbsp;{{ $t('footer.allQuestions') }}
          </router-link>
          <br />
        </div> -->
        <!-- Left link -->
        <div class="col-sm">
          <HomeLink />
        </div>
        <!-- Center link -->
        <div class="col-sm" v-if="currentRoute !== 'about'">
          <router-link :to="{ name: 'about' }">
            ℹ️&nbsp;{{ $t('footer.about') }}
          </router-link>
        </div>
        <div class="col-sm" v-if="currentRoute === 'about'">
          <!-- <router-link :to="{ name: 'glossary' }">
            📓&nbsp;{{ $t('footer.glossary') }}
          </router-link> -->
          <router-link :to="{ name: 'ressources' }">
            📚&nbsp;{{ $t('footer.resources') }}
          </router-link>
        </div>
        <!-- Right link -->
        <div class="col-sm" v-if="currentRoute !== 'quiz-detail'">
          <router-link :to="{ name: 'contribute' }">
            ✍️&nbsp;{{ $t('footer.contribute') }}
          </router-link>
        </div>
        <div class="col-sm" v-if="currentRoute === 'quiz-detail'">
          <router-link :to="{ name: 'quiz-list' }">
            🕹&nbsp;{{ $t('messages.allQuizs') }}
          </router-link>
          <br />
        </div>
      </div>

      <!-- Second row: social, license, language -->
      <div class="row">
        <div class="col-sm" :title="$t('footer.social')">
          <a class="no-after" v-bind:href="configuration.application_linkedin_url" target="_blank" @click="logClick($event)" @contextmenu="logClick($event)">
            <img height="30px" src="/openmoji_linkedin_E046.svg" alt="Linkedin" title="Linkedin" />
          </a>
          <a class="no-after" v-bind:href="configuration.application_twitter_url" target="_blank" @click="logClick($event)" @contextmenu="logClick($event)">
            <img height="30px" src="/openmoji_twitter_E040.svg" alt="Twitter" title="Twitter" />
          </a>
          <a class="no-after" v-bind:href="configuration.application_facebook_url" target="_blank" @click="logClick($event)" @contextmenu="logClick($event)">
            <img height="30px" src="/openmoji_facebook_E042.svg" alt="Facebook" title="Facebook" />
          </a>
        </div>
        <div class="col-sm" :title="$t('footer.license')">
          <router-link :to="{ name: 'license' }">
            <img src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" alt="$t('footer.creativeCommons')" style="border-width:0" />
          </router-link>
        </div>
        <div class="col-sm" :title="$t('footer.language')">
          <select v-model="$i18n.locale">
            <option v-for="(language, i) in languages" :key="i" :value="language.code">
              {{ language.emoji }}&nbsp;{{ language.name }}
            </option>
          </select>
        </div>
      </div>

      <!-- Third row: ecoindex -->
      <div class="row" v-if="currentRoute === 'home' && configuration.application_frontend_ecoindex_url">
        <div class="col-sm">
          {{ $t('footer.score') }} <a v-bind:href="configuration.application_frontend_ecoindex_url" target="_blank">EcoIndex.fr</a> {{ $t('words.of') }}
          <span class="ecoindex-score">80.2 / 100</span><span class="ecoindex-letter">A</span>
          <br class="d-sm-none" />
          {{ $t('footer.weight') }} </div>
      </div>
    </section>
  </footer>
</template>

<script>
import { postLinkClickEvent } from '../services/StatService';
import HomeLink from './HomeLink.vue';

export default {
  name: 'AppFooter',
  components: {
    HomeLink,
  },
  props: {
  },

  computed: {
    currentRoute() {
      return this.$route.name;
    },
    configuration() {
      return this.$store.state.configuration;
    },
    languages() {
      return this.$store.state.languages
        .slice(0); // .slice makes a copy of the array, instead of mutating the orginal
    },
  },

  methods: {
    logClick(event) {
      postLinkClickEvent(event);
    },
  },
};
</script>

<style scoped>
footer {
  background-color: #e9ecef;
  margin-top: 20px;
  padding: 10px;
}

.row > .col,
.row > .col-sm {
  padding-top: 5px;
  padding-bottom: 5px;
}

.row > .col-sm > a > img {
  margin-left: 10px;
  margin-right: 10px;
}

span.ecoindex-score {
  background-color: #6E9A1D;
  color: #fff;
  border: 3px solid #6E9A1D;
  border-radius: 14px;
  white-space: nowrap;
  /* font-weight: 500; */
  /* font-size: 15px; */
  padding: 0px 6px;
}
span.ecoindex-letter {
  background-color: #349a47;
  color: #fff;
  border: 5px solid #e9ecef; /* same as footer */
  border-radius: 25px;
  white-space: nowrap;
  /* font-weight: 700; */
  /* font-size: 18px; */
  margin-left: -6px;
  padding: 2px 6px;
}
</style>
