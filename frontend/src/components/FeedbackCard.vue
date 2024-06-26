<template>
  <section class="feedback-card small">
    <div class="row no-gutters margin-top-bottom-10">
      <div class="col-sm">
        <h3 class="margin-5">
          <span v-if="context.source === 'question'">{{ $t('feedback.yourOpinionQuestion') }}{{ $t('words.questionMark') }}</span>
          <span v-if="context.source === 'quiz'">{{ $t('feedback.yourOpinionQuiz') }}{{ $t('words.questionMark') }}</span>
        </h3>
      </div>

      <div class="col-sm action">
        <span v-if="!feedbackSubmitted" class="span-like">
          <button class="btn btn-sm btn-primary-light margin-left-right-10 small" :title="$t('messages.liked')" @click="submitFeedback('like')" :disabled="feedbackSubmitted">👍<span class="fake-link"></span></button>
          <button class="btn btn-sm btn-primary-light margin-left-right-10 small" :title="$t('messages.disliked')" @click="submitFeedback('dislike')" :disabled="feedbackSubmitted">👎<span class="fake-link"></span></button>
        </span>
        <span v-if="feedbackSubmitted" class="span-like margin-left-right-10">
          {{ $t('messages.thanks') }}&nbsp;💯
          <!-- <span v-if="feedbackResponse" class="margin-left-right-10">
            <strong>{{ feedbackResponse.like_count_agg }}</strong>&nbsp;👍&nbsp;&nbsp;<strong>{{ feedbackResponse.dislike_count_agg }}</strong>&nbsp;👎&nbsp;
          </span> -->
        </span>
        <button class="btn btn-sm btn-primary-light margin-left-right-10 small" :title="$t('messages.suggestion')" @click="showContributionForm = !showContributionForm">
          💬&nbsp;<span class="fake-link">{{ $t('feedback.suggestCorrection') }}</span>
          <span v-if="!showContributionForm">&nbsp;▸</span>
          <span v-if="showContributionForm">&nbsp;▾</span>
        </button>
      </div>
    </div>

    <!-- Contribution form -->
    <template v-if="showContributionForm">
      <hr />
      <form @submit.prevent="submitContribution" v-if="!contributionSubmitted">
        <h3 class="margin-bottom-0">
          <label for="contribution_text">{{ $t('feedback.yourSuggestion') }} <span class="color-red">*</span></label>
        </h3>
        <p>
          <textarea id="contribution_text" class="form-control" rows="2" v-model="contribution_text" required></textarea>
        </p>
        <p v-if="(context.source) === 'question' && (!context.item.answer_explanation || !context.item.answer_source_accessible_url || !context.item.answer_source_scientific_url || !context.item.answer_image_url)">
          🛠️&nbsp;<i><span v-html="$t('feedback.incompleteMessage')"></span>
            <span v-if="!context.item.answer_explanation">&nbsp;ℹ️&nbsp;{{ $t('feedback.explanation') }}</span>
            <span v-if="!context.item.answer_source_accessible_url">&nbsp;🔗&nbsp;{{ $t('feedback.accessibleLink') }}</span>
            <span v-if="!context.item.answer_source_scientific_url">&nbsp;🔗🧬&nbsp;{{ $t('feedback.scientificLink') }}</span>
            <span v-if="!context.item.answer_image_url">&nbsp;🖼️&nbsp;{{ $t('feedback.picture') }}</span>
            </i>
        </p>
        <p>
          🙋&nbsp;<span v-html="$t('feedback.userEmail')"></span><br />
        </p>
        <p class="help-text">
          <i>{{ $t('feedback.autoriseBySubmitting') }}</i>
        </p>
        <p>
          <button type="submit" class="btn btn-sm" :class="contribution_text ? 'btn-primary' : 'btn-outline-primary'" :disabled="!contribution_text">📩&nbsp;{{ $t('feedback.send') }}</button>
        </p>
      </form>
      <div v-if="contributionSubmitted && loading" class="loading">
        <p>{{ $t('feedback.sendingSuggestion') }}</p>
      </div>

      <div v-if="contributionSubmitted && error" class="error">
        <h3>{{ $t('messages.errorOccurred') }}&nbsp;😢</h3>
        <p>{{ error }}</p>
      </div>

      <div v-if="contributionSubmitted && contributionResponse">
        <h3>{{ $t('messages.thankYou') }}&nbsp;💯</h3>
        <p>{{ $t('feedback.suggestionSubmitted') }}</p>
      </div>
    </template>

  </section>
</template>

<script>
export default {
  name: 'FeedbackCard',
  props: {
    context: Object,
  },

  data() {
    return {
      contribution_text: '',
      showContributionForm: false,
      feedbackSubmitted: false,
      feedbackResponse: null,
      contributionSubmitted: false,
      contributionResponse: null,
      loading: false,
      error: null,
    };
  },

  methods: {
    submitFeedback(feedbackChoice) {
      this.feedbackSubmitted = feedbackChoice;
      this.error = this.feedbackResponse = null;
      fetch(`${process.env.VUE_APP_STATS_ENDPOINT}/${(this.context.source === 'question') ? 'question' : 'quiz'}-feedback-event/`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // hacky (TODO: build body before instead, in order to chose between question & quiz)
          question: (this.context.source === 'question') ? this.context.item.id : null,
          quiz: (this.context.source === 'quiz') ? this.context.item.id : (this.context.quiz ? this.context.quiz.id : null),
          choice: feedbackChoice, // 'like' or 'dislike'
          source: this.context.source, // only for 'api/questions/'
        }),
      })
        .then((response) => response.json())
        // eslint-disable-next-line
        .then(data => {
          this.feedbackResponse = data;
        })
        .catch((error) => {
          console.log(error);
          this.error = error;
        });
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
        body: JSON.stringify({
          text: this.contribution_text,
          description: (this.context.source === 'question') ? `Question #${this.context.item.id} - ${this.context.item.category.name} - ${this.context.item.text}` : `Quiz #${this.context.item.id} - ${this.context.item.name}`,
          question: (this.context.source === 'question') ? this.context.item.id : null,
          quiz: (this.context.source === 'quiz') ? this.context.item.id : null,
          type: (this.context.source === 'question') ? 'COMMENT_QUESTION' : 'COMMENT_QUIZ',
        }),
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
          this.loading = false;
          this.error = error;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.feedback-card {
  border: 1px solid var(--primary);
  border-radius: 5px;
  margin: 10px 0px;
  /* padding: 10px; */
  padding-left: 10px;
  padding-right: 10px;
  background-color: white;

  div.action {
    white-space: nowrap;
    overflow-x: hidden;
  }
}
</style>
