<template>
  <div id="app">
    <header class="header">
      <div class="container">
        <h1 class="header__title">JiJi FILE MS</h1>
      </div>
    </header>
    <main class="main">
      <router-view />
    </main>
    <footer class="footer">
      <p>&copy; Namuru Iwatani</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style lang="scss">
@use '@/assets/styles/variables' as var;
@use '@/assets/styles/mixins' as mix;
@use '@/assets/styles/base' as base;
@use '@/assets/styles/header' as header;
@use '@/assets/styles/footer' as footer;

.container {
  @include mix.container;
}

.main {
  padding: var.$padding-base;
}
</style>
