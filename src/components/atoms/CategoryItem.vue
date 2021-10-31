<template>
  <div @click="categorySelected" class="category-item-wrapper">
    <div
     v-bind:class="[
        isSelected == true
          ? 'category-content-active'
          : 'category-content',
      ]"
    >
      {{ category }}
    </div>
  </div>
</template>

<script>
export default {
  name: "CategoryItem",
  props: {
    category: {
      type: String,
      default: "category",
    },
    isSelected:{
      type: Boolean,
      default: false,
    }
  },
  methods: {
    categorySelected() {
      this.$emit("input", this.category);
    },
  },
};
</script>

<style scoped>
.category-item-wrapper {
  cursor: pointer;
  min-width: fit-content;
  height: calc(100% - 0.6rem);
  background: #d9000d;
  padding: 0.3rem 0.3rem;
  display: flex;
  align-items: center;
  color: white;
}
.category-content {
  background: transparent;
  border-right: 2px solid palevioletred;
  padding-right: 1rem;
  font-size: 1rem;
  font-weight: 500;

}
.category-content-active {
  background: transparent;
  border-right: 2px solid palevioletred;
  padding-right: 1rem;
  font-size: 1rem;
  font-weight: 700;
  color: whitesmoke;
}
</style>
