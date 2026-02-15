<template>
  <span v-bind:title="difficultyTitle">{{ currentDifficultyLevelEmoji }}</span>
</template>

<script>
import { useResourcesStore } from '../stores/resources';

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
      const resourcesStore = useResourcesStore();
      return resourcesStore.getDifficultyLevelEmojiByValue(parseInt(this.difficulty, 10));
    },
  },
};
</script>
