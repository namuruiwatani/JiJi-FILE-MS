<template>
  <div class="form-container__field">
    <label for="name">File Name</label>
    <input v-model="fileName" id="name" type="text" class="form-container__input" />
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: '',
    },
  },
  computed: {
    fileName: {
      get() {
        console.log('Значение fileName в дочернем компоненте:', this.value); // Для отладки
        return this.value;
      },
      set(newValue) {
        this.$emit('input', newValue);
      },
    },
  },
};
</script>

<style scoped lang="scss">
.form-container__field {
  margin-bottom: 20px;
}

.form-container__input {
  width: 100%;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-top: 8px;
}
</style>
