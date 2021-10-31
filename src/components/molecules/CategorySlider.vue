<template>
  <div class="categoryslider-wrapper">
    <div class="categoryslider-track">
      <category-item
        v-model="currentCategory"
        v-for="(item, i) in categories"
        :key="i"
        :category="item"
        :isSelected="checkSelected(item)"
      ></category-item>
    </div>
  </div>
</template>

<script>
import CategoryItem from "../atoms/CategoryItem.vue";
export default {
  components: { CategoryItem },
  name: "CategorySlider",
  props: {
    categories: {
      type: Array,
      default: () => [],
    },
    searching: {
      type: Boolean,
      default: false,
    },
    value:{}
  },
  data() {
    return {
      currentCategory: "",
    };
  },
  watch:{
    currentCategory(val){
       this.$emit("categorySelected", val);
    },
    value(val){
      this.currentCategory = val;
    }
  },
  methods:{
    checkSelected(item){
      return item === this.currentCategory && !this.searching;
    }
  }
};
</script>

<style scoped>
.categoryslider-wrapper {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 4rem;
  background: #d9000d;
  overflow-x: auto;
}
.categoryslider-track {
  padding-left: 1rem;
  display: flex;
  width: fit-content;
}
</style>
