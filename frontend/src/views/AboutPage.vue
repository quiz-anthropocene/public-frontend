<template>
  <section class="text-align-left">
    <h2>{{ $t('about.about') }}</h2>

    <!-- <section class="alert alert-primary" role="alert">
      Vous êtes un des premiers utilisateurs, merci d'être là !
      Ce site a été lancé en Mars 2020.
      Il est développé par quelques passionés, et a pour but d'évoluer en fonctions des retours utilisateurs :)
    </section> -->

    <h3>{{ $t('about.why') }}</h3>
    <div v-html="configuration.application_about"></div>

    <br />
    <h3>{{ $t('about.contribute') }}</h3>
    <p>
      {{ $t('about.gladToTakeFeedback') }} </p>
    <p>
      {{ $t('about.pageContribute') }} <router-link :to="{ name: 'contribute' }">✍️&nbsp;{{ $t('about.contributeLink') }}</router-link>
      {{ $t('about.contributeLinkDescription') }} </p>

    <br />
    <h3>{{ $t('about.license') }}</h3>
    <div>
      {{ $t('about.openSourceCode') }} <a v-bind:href="configuration.application_open_source_code_url" target="_blank" :title="$t('about.linktoCode')">{{ $t('about.pageToCode') }}</a>.
      <div v-html="$t('about.openSourceCreateIssues')"></div>
    </div>
    <p>
      {{ $t('about.licenseMoreInfo') }} <router-link :to="{ name: 'license' }">{{ $t('about.licenseDedicatedPage') }}</router-link>.
    </p>

    <br />
    <h3>{{ $t('about.someNumbersTitle') }}</h3>
    <p>
      {{ $t('about.pageStats') }} <router-link :to="{ name: 'stats' }">{{ $t('about.statsLink') }}</router-link> {{ $t('about.statsLinkInfo') }}
    </p>

    <br />
    <h3>{{ $t('about.aboutUs') }}</h3>
    <p v-html="$t('about.aboutUsInfo')"></p>
    <p v-html="$t('about.aboutUsContact')"></p>

    <br />
    <h3>{{ $t('about.goFurther') }}</h3>
    <p>
      {{ $t('about.goFurtherPage') }} <router-link :to="{ name: 'ressources' }">{{ $t('about.goFurtherResourcesLink') }}</router-link> {{ $t('about.goFurtherInfo') }} </p>

    <br />
  </section>
</template>

<script>
import { metaTagsGenerator } from '../utils';

export default {
  name: 'AboutPage',
  metaInfo() {
    const title = 'A Propos';
    const description = 'Des informations sur cette application';
    return {
      title,
      meta: metaTagsGenerator(title, description),
    };
  },
  components: {
  },

  computed: {
    configuration() {
      return this.$store.state.configuration;
    },
  },
};
</script>
