<template>
  <div class="logo-wrapper">
    <img class="logo" alt="logo" src="../../assets/logo.svg" />
  </div>
</template>

<script>
export default {
  name: "Logo",
  props: {
    category: {
      type: String,
      default: "category",
    },
  },
};
</script>

<style scoped>
.logo-wrapper {
  height: 15%;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background: #f8f5ef;
}
.logo {
  margin-top: 2rem;
  margin-bottom: 2rem;
  width: auto;
}
</style>
