<template>
  <FileForm :fileId="Number(id)" />
</template>

<script>
import FileForm from '../components/FileForm.vue';

export default {
  components: { FileForm },
  computed: {
    id() {
      return this.$route.params.id;
    },
  },
};
</script>
