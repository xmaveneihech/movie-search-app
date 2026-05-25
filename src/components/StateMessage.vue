<script setup>
defineProps({
  icon:    { type: String,  default: '○' },
  message: { type: String,  required: true },
  sub:     { type: String,  default: '' },
  isError: { type: Boolean, default: false },
})
</script>

<template>
  <div :class="['state-msg', { 'state-msg--error': isError }]">
    <span class="state-msg__icon">{{ icon }}</span>
    <p class="state-msg__text">{{ message }}</p>
    <p v-if="sub" class="state-msg__sub">{{ sub }}</p>
  </div>
</template>

<style scoped>
.state-msg {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 5rem 2rem;
  gap: 0.6rem;
  animation: fadeUp 0.4s var(--ease);
}

.state-msg__icon {
  font-size: 2.4rem;
  color: var(--text-3);
  margin-bottom: 0.4rem;
  line-height: 1;
}

.state-msg__text {
  font-size: 1rem;
  color: var(--text-2);
}

.state-msg--error .state-msg__text { color: #f87171; }

.state-msg__sub {
  font-size: 0.83rem;
  color: var(--text-3);
  max-width: 360px;
}
</style>