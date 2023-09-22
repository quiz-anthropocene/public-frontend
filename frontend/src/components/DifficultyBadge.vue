<template>
  <span v-bind:title="difficultyTitle">{{ currentDifficultyLevelEmoji }}</span>
</template>

<script>
export default {
  name: 'DifficultyBadge',
  props: {
    difficulty: [Number, String],
  },

  computed: {
    difficultyTitle() {
      // Calculate the translated difficulty title based on this.difficulty
      return `${this.$t('messages.difficulty')} ${this.difficulty}/4`;
    },
    currentDifficultyLevelEmoji() {
      return this.$store.getters.getDifficultyLevelEmojiByValue(parseInt(this.difficulty, 10));
    },
  },
};
</script>
