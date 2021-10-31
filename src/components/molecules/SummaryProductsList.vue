<template>
  <div>
    <div class="summary-product-list-header"> {{$t('ProductList')}}</div>
    <form class="summary-product-list-wrapper">
      <summary-product-item
        @itemclick="handleEvent"
        v-for="(item, i) in products"
        :product="item"
        :key="i"
      >
      </summary-product-item>
    </form>
  </div>
</template>

<script>
import SummaryProductItem from "../atoms/SummaryProductItem.vue";
import { mapGetters } from "vuex";
export default {
  name: "SummaryProductsList",
  components: {
    SummaryProductItem,
  },
  computed: {
    ...mapGetters(["getProducts"]),
    products() {
      return this.getProducts;
    },
  },
  methods: {
    handleEvent(val) {
      this.$emit("product", val);
    },
  },
};
</script>

<style scoped>
.summary-product-list-wrapper {
  width: 90%;
  margin-left: 5%;
  margin-right: 5%;
  height: fit-content;
  display: flex;
  flex-wrap: wrap;
  padding-bottom: 7rem;
}
.summary-product-list-header {
  text-align: left;
  border-bottom: 1px solid black;
  font-size: 1.2rem;
  padding-bottom: 0.5rem;
  width: 90%;
  margin-left: 5%;
  margin-right: 5%;
  font-weight: bold;
}
</style>
