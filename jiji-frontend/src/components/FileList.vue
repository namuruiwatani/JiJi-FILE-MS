<template>
  <div class="file-list">
    <div class="file-list__header">
      <h1 class="file-list__title">File List</h1>
      <div class="search-container">
        <i class="fas fa-search search-icon"></i>
        <input v-model="searchQuery" @input="updateQuery" type="text" placeholder="Search" class="search-input" />
        <i v-if="searchQuery" @click="clearSearch" class="fas fa-times clear-icon"></i>
      </div>
      <router-link to="/create" class="add-file-link">
        <i class="fas fa-plus"></i>
      </router-link>
    </div>

    <div class="file-info">
      <p>
        Total files: <span>{{ totalFiles }}</span> | Showing: <span>{{ displayedFilesCount }}</span> files
      </p>
    </div>

    <div v-if="loading" class="loading">Loading...</div>

    <div v-else>
      <div class="file-list__cards">
        <div v-for="file in paginatedFiles" :key="file.id" class="file-card">
          <div class="file-card__header">
            <h3 class="file-card__title">{{ file.name }}</h3>
          </div>
          <div class="file-card__content">
            <div v-if="file.path && isImage(file.extension)" class="file-card__image">
              <img :src="getFilePath(file.path)" alt="Preview" />
            </div>
            <div v-else class="file-card__icon">
              <i :class="getFileIcon(file.extension)"></i>
            </div>
          </div>
          <div class="file-card__info">
            <span class="file-card__size">{{ (file.size / (1024 * 1024)).toFixed(2) }} MB</span>
            <span class="file-card__extension">{{ file.extension }}</span>
          </div>
          <div class="file-card__actions">
            <span @click="editFile(file.id)"><i class="fas fa-edit"></i></span>
            <span @click="openDeleteModal(file.id)"><i class="fas fa-trash"></i></span>
            <span @click="handleDownloadFile(file.id)">
              <i class="fas fa-download"></i>
            </span>
          </div>
        </div>
      </div>

      <div v-if="isModalVisible" class="modal-overlay">
        <div class="modal">
          <h3>{{ modalMessage }}</h3>
          <div class="modal-actions">
            <button @click="confirmDeleteFile" class="modal-btn confirm-btn">Confirm</button>
            <button @click="closeModal" class="modal-btn cancel-btn">Cancel</button>
          </div>
        </div>
      </div>

      <div class="pagination">
        <button class="pagination__button" @click="changePage(currentPage - 1)" :disabled="currentPage === 1">
          «
        </button>

        <div class="pagination__pages">
          <span v-for="page in totalPages" :key="page" :class="['pagination__page', { active: page === currentPage }]"
            @click="changePage(page)">
            {{ page }}
          </span>
        </div>

        <button class="pagination__button" @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">
          »
        </button>
      </div>
    </div>
  </div>
</template>


<script>
import { mapState, mapActions } from 'vuex';
import { watch } from 'vue';

export default {
  data() {
    return {
      searchQuery: this.$route.query.search || '',
      currentPage: 1,
      limit: 3,
      isModalVisible: false,
      modalMessage: '',
      fileToDelete: null,
    };
  },
  computed: {
    ...mapState(['files', 'loading']),
    filteredFiles() {
      if (!this.searchQuery) return this.files;
      return this.files.filter(file =>
        file.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    paginatedFiles() {
      const start = (this.currentPage - 1) * this.limit;
      return this.filteredFiles.slice(start, start + this.limit);
    },
    totalFiles() {
      return this.filteredFiles.length;
    },
    totalPages() {
      return Math.ceil(this.totalFiles / this.limit);
    },
    displayedFilesCount() {
      return this.paginatedFiles.length;
    }
  },
  methods: {
    ...mapActions(['fetchFiles', 'deleteFile', 'downloadFile']),
    openDeleteModal(id) {
      this.fileToDelete = id;
      this.modalMessage = 'Are you sure you want to delete this file?';
      this.isModalVisible = true;
    },

    closeModal() {
      this.isModalVisible = false;
      this.fileToDelete = null;
    },

    async confirmDeleteFile() {
      if (this.fileToDelete) {
        try {
          await this.deleteFile(this.fileToDelete);
          this.fileToDelete = null;
          this.closeModal();
        } catch (error) {
          console.error('Delete file error:', error);
        }
      }
    },

    // BUG
    async handleDownloadFile(fileId) {

      if (typeof fileId !== 'number') {
        return;
      }

      try {
        const response = await this.downloadFile(fileId);

        const contentDisposition = response.headers['content-disposition'];

        const fileName = contentDisposition
          ? contentDisposition.split('filename=')[1]?.trim().replace(/"/g, '')
          : `file_${fileId}`;

        const blob = new Blob([response.data], { type: response.headers['content-type'] });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('Download file error:', error);
      }
    },
    updateQuery() {
      if (this.searchQuery) {
        this.$router.push({ query: { search: this.searchQuery } });
      } else {
        this.$router.push({ path: '/' });
      }
    },
    clearSearch() {
      this.searchQuery = '';
      this.updateQuery();
    },
    changePage(page) {
      if (page < 1 || page > this.totalPages) return;
      this.currentPage = page;
    },
    getFilePath(path) {
      const baseURL = 'http://localhost:8000';
      return path ? `${baseURL}/storage/${path}` : '';
    },
    isImage(extension) {
      const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'];
      return imageExtensions.includes(extension.toLowerCase());
    },
    getFileIcon(extension) {
      const ext = extension.toLowerCase();
      switch (ext) {
        case 'js':
        case 'html':
        case 'css':
          return 'fas fa-file-code';
        case 'mp4':
        case 'mov':
        case 'avi':
          return 'fas fa-file-video';
        case 'mp3':
        case 'wav':
        case 'ogg':
          return 'fas fa-file-audio';
        case 'zip':
        case 'rar':
        case 'tar':
          return 'fas fa-file-archive';
        case 'ppt':
        case 'pptx':
          return 'fas fa-file-powerpoint';
        case 'xls':
        case 'xlsx':
          return 'fas fa-file-excel';
        case 'doc':
        case 'docx':
          return 'fas fa-file-word';
        case 'pdf':
          return 'fas fa-file-pdf';
        case 'txt':
          return 'fas fa-file-alt';
        default:
          return 'fas fa-file';
      }
    },
    editFile(fileId) {
      this.$router.push(`/edit/${fileId}`);
    },
  },
  mounted() {
    this.fetchFiles();

    watch(
      () => this.$route.query.search,
      (newQuery) => {
        this.searchQuery = newQuery || '';
      }
    );
  }
};
</script>


<style lang="scss">
@use '@/assets/styles/variables' as var;
@use '@/assets/styles/mixins' as mix;
@use '@/assets/styles/file-list' as fileList;
</style>
