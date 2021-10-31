<template>
  <div>
    <div class="product-list-wrapper">
      <product-item
        v-model="currentProduct"
        v-for="(item, i) in products"
        :product="item"
        :key="i"
        :current="current"
        :index="getId(item)"
      ></product-item>
    </div>
  </div>
</template>

<script>
import ProductItem from "../atoms/ProductItem.vue";
import { mapGetters } from "vuex";
export default {
  name: "ProductsList",
  components: {
    ProductItem,
  },
  props: {
    products: {
      type: Array,
      default: () => [],
    },
    current: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      currentProduct: "",
    };
  },
  watch: {
    currentProduct(val) {
      this.$emit("product", val);
    },
  },
  computed: {
    ...mapGetters(["getObject"]),
  },
  methods: {
    getId(item) {
      for (let el of Object.keys(this.getObject.products)) {
        if (item.id.toString() === el) {
          return this.getObject.products[item.id].order;
        }
      }
      return null;
    },
  },
};
</script>

<style scoped>
.product-list-wrapper {
  width: 90%;
  margin-left: 5%;
  margin-right: 5%;
  height: fit-content;
  display: flex;
  flex-wrap: wrap;
  padding-bottom: 7rem;
}
</style>
