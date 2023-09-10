<template>
  <section class="text-align-left">
    <h2>{{ $t('footer.contribute') }}{{ $t('words.exclamationMark') }}</h2>

    <p>
      {{ $t('contribute.addQuestionComment') }}?<br />
      {{ $t('contribute.sendbyFillingForm') }} </p>

    <br />

    <form @submit.prevent="submitContribution" v-if="!contributionSubmitted">
      <div class="form-group">
        <h3 class="margin-bottom-0">
          <label for="contribution_type">{{ $t('contribute.myContribution') }}</label>
        </h3>
        <div class="custom-control custom-radio custom-control-inline">
          <input type="radio" id="customRadioInline1" name="customRadioInline1" class="custom-control-input" value="NEW_QUESTION" v-model="contribution.type">
          <label class="custom-control-label" for="customRadioInline1">{{ $t('contribute.newQuestion') }}</label>
        </div>
        <div class="custom-control custom-radio custom-control-inline">
          <input type="radio" id="customRadioInline2" name="customRadioInline2" class="custom-control-input" value="NEW_QUIZ" v-model="contribution.type">
          <label class="custom-control-label" for="customRadioInline2">{{ $t('contribute.quizIdea') }}</label>
        </div>
        <div class="custom-control custom-radio custom-control-inline">
          <input type="radio" id="customRadioInline3" name="customRadioInline3" class="custom-control-input" value="COMMENT_APP" v-model="contribution.type">
          <label class="custom-control-label" for="customRadioInline3">{{ $t('contribute.commentAboutApp') }}</label>
        </div>
        <!-- <div class="custom-control custom-radio custom-control-inline">
          <input type="radio" id="customRadioInline3" name="customRadioInline3" class="custom-control-input" value="nom application" v-model="contribution.type">
          <label class="custom-control-label" for="customRadioInline3">Un nom d'application alternatif</label>
        </div> -->
      </div>

      <div class="form-group" v-if="contribution.type === 'NEW_QUESTION'">
        <h3 class="margin-bottom-0">
          <label for="contribution_text">{{ $t('contribute.yourQuestion') }} <span class="color-red">*</span></label>
        </h3>
        <div class="help-text">{{ $t('contribute.1or2Sentences') }}</div>
        <input type="text" id="contribution_text" class="form-control" v-model="contribution.text" required />
      </div>
      <div class="form-group" v-if="contribution.type === 'NEW_QUESTION'">
        <h3 class="margin-bottom-0">
          <label for="text">{{ $t('contribute.additionalInfo') }}</label>
        </h3>
        <div class="help-text">{{ $t('contribute.additionalInfoQuestionExplanation') }}</div>
        <textarea id="description" class="form-control" rows="5" v-model="contribution.description"></textarea>
      </div>

      <div class="form-group" v-if="contribution.type === 'NEW_QUIZ'">
        <h3 class="margin-bottom-0">
          <label for="contribution_text">{{ $t('contribute.yourQuizIdea') }} <span class="color-red">*</span></label>
        </h3>
        <div class="help-text">{{ $t('contribute.1or2Sentences') }}</div>
        <input type="text" id="contribution_text" class="form-control" v-model="contribution.text" required />
      </div>
      <div class="form-group" v-if="contribution.type === 'NEW_QUIZ'">
        <h3 class="margin-bottom-0">
          <label for="text">{{ $t('contribute.additionalInfo') }}</label>
        </h3>
        <div class="help-text">{{ $t('contribute.additionalInfoQuizExplanation') }}</div>
        <textarea id="description" class="form-control" rows="5" v-model="contribution.description"></textarea>
      </div>

      <div class="form-group" v-if="contribution.type === 'COMMENT_APP'">
        <h3 class="margin-bottom-0">
          <label for="contribution_text">{{ $t('contribute.yourComment') }} <span class="color-red">*</span></label>
        </h3>
        <div class="help-text">{{ $t('contribute.yourCommentDescription') }}</div>
        <textarea id="contribution_text" class="form-control" rows="5" v-model="contribution.text" required></textarea>
      </div>

      <!-- <div class="form-group" v-if="contribution.type === 'nom application'">
        <h3 class="margin-bottom-0">
          <label for="contribution_text">Votre idée <span class="color-red">*</span></label>
        </h3>
        <textarea id="contribution_text" class="form-control" rows="2" v-model="contribution.text" required></textarea>
      </div> -->

      <br />

      <div>
        <div v-html="$t('contribute.addEmail')"></div>
        <br />
      </div>
      <p class="help-text">
        {{ $t('contribute.autoriseSubmitting') }} </p>

      <div class="form-group">
        <p>
          <button type="submit" class="btn" :class="contribution.text ? 'btn-primary' : 'btn-outline-primary'" :disabled="!contribution.text">📩&nbsp;{{ $t('contribute.send') }}</button>
        </p>
      </div>
    </form>

    <div v-if="contributionSubmitted && loading" class="loading">
      {{ $t('contribute.sendingYourContribution') }} </div>

    <div v-if="contributionSubmitted && error" class="error">
      <h3>{{ $t('contribute.sendingError') }}</h3>
      {{ error }}
    </div>

    <div v-if="contributionSubmitted && contributionResponse">
      <h3>{{ $t('messages.thankYou') }} 💯 </h3>
      <p>{{ $t('contribute.checkContribution') }}</p>
      <div v-if="contributionSubmitted" @click="init()">
        <a href="#">{{ $t('contribute.newContribution') }}</a>
      </div>
    </div>
  </section>
</template>

<script>
import { metaTagsGenerator } from '../utils';

export default {
  name: 'ContributePage',
  metaInfo() {
    const title = 'Contribuer';
    const description = 'Contribuer à l\'application pour la faire grandir !';
    return {
      title,
      meta: metaTagsGenerator(title, description),
    };
  },
  components: {
  },

  data() {
    return {
      contribution: {
        text: '',
        description: '',
        type: 'NEW_QUESTION',
      },
      contributionSubmitted: false,
      contributionResponse: null,
      loading: false,
      error: null,
    };
  },

  mounted() {
    if (this.$route.query.type) {
      this.init(this.$route.query.type);
    } else {
      this.init();
    }
  },

  methods: {
    init(typeFromQuery) {
      this.contribution = {
        text: '',
        description: '',
        type: typeFromQuery || 'NEW_QUESTION',
      };
      this.contributionSubmitted = false;
      this.contributionResponse = null;
      this.loading = false;
      this.error = null;
    },
    submitContribution() {
      this.contributionSubmitted = true;
      this.error = this.contributionResponse = null;
      this.loading = true;
      fetch(`${process.env.VUE_APP_API_ENDPOINT}/contributions/`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.contribution),
      })
        .then((response) => {
          this.loading = false;
          return response.json();
        })
        .then((data) => {
          this.contributionResponse = data;
        })
        .catch((error) => {
          console.log(error);
          this.error = error;
        });
    },
  },
};
</script>
