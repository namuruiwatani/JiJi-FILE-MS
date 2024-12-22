<template>
  <div class="form-container__field">
    <label for="file">Upload File</label>
    <div class="form-container__drag-drop-area" :class="{ 'dragging': isDragging }" @drop.prevent="handleDrop"
      @dragover.prevent="handleDragOver" @dragleave="handleDragLeave" @click="triggerFileInput">
      <span v-if="!file">Drag & Drop your file here or click to select</span>
      <span v-else>{{ file.name }}</span>
    </div>

    <div v-if="fileSizeError" class="file-size-error">
      <p>File exceeds the 8 MB size limit. Please upload a smaller file.</p>
    </div>

    <input type="file" id="file" @change="handleFile" class="form-container__input" ref="fileInput"
      style="display: none" />

    <div class="fullscreen-dropzone" v-if="isDragging">
      <div class="corner corner-tl">
        <svg xmlns="http://www.w3.org/2000/svg" width="86" height="86" viewBox="0 0 86 86" fill="none">
          <path d="M79 7H37C20.4315 7 7 20.4315 7 37V79" stroke="white" stroke-width="13" stroke-linecap="round" />
        </svg>
      </div>
      <div class="corner corner-tr">
        <svg xmlns="http://www.w3.org/2000/svg" width="86" height="86" viewBox="0 0 86 86" fill="none">
          <path d="M79 7H37C20.4315 7 7 20.4315 7 37V79" stroke="white" stroke-width="13" stroke-linecap="round" />
        </svg>
      </div>
      <div class="corner corner-bl">
        <svg xmlns="http://www.w3.org/2000/svg" width="86" height="86" viewBox="0 0 86 86" fill="none">
          <path d="M79 7H37C20.4315 7 7 20.4315 7 37V79" stroke="white" stroke-width="13" stroke-linecap="round" />
        </svg>
      </div>
      <div class="corner corner-br">
        <svg xmlns="http://www.w3.org/2000/svg" width="86" height="86" viewBox="0 0 86 86" fill="none">
          <path d="M79 7H37C20.4315 7 7 20.4315 7 37V79" stroke="white" stroke-width="13" stroke-linecap="round" />
        </svg>
      </div>
      <h1>Drag your file anywhere on the screen</h1>
    </div>

    <div v-if="progress > 0" class="form-container__progress">
      <div class="form-container__progress-bar" :style="{ width: progress + '%' }"></div>
    </div>
  </div>
</template>


<script>
export default {
  props: {
    file: {
      type: File,
      default: null,
    },
  },
  data() {
    return {
      isDragging: false,
      progress: 0,
      uploading: false,
      fileSizeError: false,
    };
  },
  methods: {
    handleFile(event) {
      const file = event.target.files[0];
      if (file.size > 8 * 1024 * 1024) {
        this.fileSizeError = true;
        return;
      }
      this.fileSizeError = false;
      this.$emit('update:file', file);
      this.uploadFile(file);
    },
    handleDragOver() {
      this.isDragging = true;
    },
    handleDragLeave() {
      this.isDragging = false;
    },
    handleDrop(event) {
      this.isDragging = false;
      const file = event.dataTransfer.files[0];
      if (file.size > 8 * 1024 * 1024) {
        this.fileSizeError = true;
        return;
      }
      this.fileSizeError = false;
      this.$emit('update:file', file);
      this.uploadFile(file);
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },

    async uploadFile(file) {
      this.uploading = true;
      this.progress = 0;

      const formData = new FormData();
      formData.append('file', file);

      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/upload', true);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          this.progress = (event.loaded / event.total) * 100;
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          this.uploading = false;
          this.$emit('update:file', file);
        } else {
          console.error('Upload failed');
        }
      };

      xhr.send(formData);
    },
  },
};
</script>

<style scoped lang="scss">
.form-container__field {
  margin-bottom: 20px;
}

.form-container__drag-drop-area {
  width: 100%;
  padding: 20px;
  border: 2px dashed #ccc;
  border-radius: 4px;
  text-align: center;
  background-color: #fafafa;
  cursor: pointer;
  transition: background-color 0.3s ease, border-color 0.3s ease;

  &:hover {
    background-color: #f0f0f0;
  }

  &.dragging {
    background-color: #e0e0e0;
    border-color: #333;
  }

  span {
    display: block;
    font-size: 16px;
    color: #777;
  }
}

.form-container__progress {
  width: 100%;
  height: 6px;
  background-color: #333;
  border-radius: 3px;
  margin-top: 12px;
}

.form-container__progress-bar {
  height: 100%;
  background-color: #fff;
  border-radius: 3px;
  transition: width 0.4s ease;
}


.fullscreen-dropzone {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: white;
  font-size: 2rem;
  text-align: center;
  pointer-events: none;

  .corner {
    position: absolute;
    width: 100px;
    height: 100px;
    z-index: 2;
    pointer-events: none;

    svg {
      transform: rotate(45deg);
    }
  }

  .corner-tl {
    top: 50px;
    left: 50px;
    transform: rotate(-45deg);
  }

  .corner-tr {
    top: 50px;
    right: 50px;
    transform: rotate(45deg);
  }

  .corner-bl {
    bottom: 50px;
    left: 50px;
    transform: rotate(-135deg);
  }

  .corner-br {
    bottom: 50px;
    right: 50px;
    transform: rotate(135deg);
  }

  h1 {
    font-size: 1.5rem;
    margin-top: 20px;
  }
}

.file-size-error {
  margin-top: 10px;
  padding: 10px;
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 5px;
  font-size: 14px;
  text-align: center;
}
</style>
