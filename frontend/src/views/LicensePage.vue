<template>
  <section class="text-align-left">
    <h2>{{ $t('license.title') }}</h2>

    <h3>{{ $t('license.nonCommercialUse') }}</h3>
    <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank">
      <img src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" alt="Licence Creative Commons" style="border-width:0" />
    </a>
    <p>
      {{ $t('license.terms') }} <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank">Creative Commons BY-NC-SA 4.0</a>.
      <ul>
        <li>{{ $t('license.termsBY') }}</li>
        <li>{{ $t('license.termsNC') }}</li>
        <li>{{ $t('license.termsSA') }}</li>
      </ul>
    </p>

    <br />
    <h3>{{ $t('license.commercialUse') }}</h3>
      <p v-html="$t('license.commercialUseContact')"></p>

      

    <br />
  </section>
</template>

<script>
import { metaTagsGenerator } from '../utils';

export default {
  name: 'LicensePage',
  metaInfo() {
    const title = 'Licence';
    const description = 'Utilisation et réutilisation du contenu de l\'application';
    return {
      title,
      meta: metaTagsGenerator(title, description),
    };
  },
  components: {
  },

  computed: {
  },
};
</script>
