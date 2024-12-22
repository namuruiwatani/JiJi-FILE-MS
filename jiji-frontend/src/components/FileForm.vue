<template>
  <div class="form-container">
    <h1>{{ isEdit ? 'Edit File' : 'Add File' }}</h1>
    <form @submit.prevent="submitForm">
      <FileNameField v-model="file.name" />
      <FileUploadField :file="file.file" @update:file="handleFile" />
      <div v-if="errorMessage" class="error-notification">
        {{ errorMessage }}
      </div>
      <button type="submit" class="form-container__submit-btn">
        {{ isEdit ? 'Update File' : 'Save File' }}
      </button>
    </form>
  </div>

  <div v-if="isModalVisible" class="modal-overlay">
    <div class="modal">
      <h3>{{ modalMessage }}</h3>
      <div class="modal-actions">
        <button @click="confirmAction" class="modal-btn confirm-btn">Confirm</button>
        <button @click="closeModal" class="modal-btn cancel-btn">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import FileNameField from './components/FileNameField.vue';
import FileUploadField from './components/FileUploadField.vue';

export default {
  components: {
    FileNameField,
    FileUploadField,
  },
  props: {
    fileId: {
      type: [Number, null],
      default: null,
    },
  },
  data() {
    return {
      file: {
        name: '',
        file: null,
      },
      isEdit: !!this.fileId,
      isModalVisible: false,
      modalMessage: '',
      modalAction: null,
      errorMessage: '',
    };
  },
  methods: {
    ...mapActions(['createFile', 'updateFile', 'fetchFileById']),

    handleFile(file) {
      this.file.file = file;
    },

    // TODO
    async loadFile() {
      if (this.isEdit) {
        try {
          const file = await this.fetchFileById(this.fileId);
          this.file = {
            name: file.name,
            file: null,
          };
        } catch (error) {
          console.error('Error loading file:', error);
        }
      }
    },



    async submitForm() {
      if (!this.file.file) {
        this.errorMessage = 'Please provide both a file.';
        return;
      }

      this.errorMessage = '';

      if (this.isEdit) {
        this.openModal('update');
      } else {
        this.openModal('save');
      }
    },

    openModal(action) {
      if (action === 'save') {
        this.modalMessage = 'Are you sure you want to save the file?';
      } else if (action === 'update') {
        this.modalMessage = 'Are you sure you want to update the file?';
      }
      this.modalAction = action;
      this.isModalVisible = true;
    },

    closeModal() {
      this.isModalVisible = false;
    },

    async confirmAction() {
      if (this.modalAction === 'save') {
        const formData = new FormData();
        formData.append('file', this.file.file);
        formData.append('name', this.file.name);

        await this.createFile(formData);
      } else if (this.modalAction === 'update') {
        await this.updateFile({ id: this.fileId, fileData: this.file });
      }
      this.closeModal();
      this.$router.push('/');
    },
  },
  mounted() {
    if (this.isEdit) this.loadFile();
  },
};
</script>

<style lang="scss">
@use '@/assets/styles/variables' as var;
@use '@/assets/styles/mixins' as mix;
@use '@/assets/styles/form' as form;
</style>
