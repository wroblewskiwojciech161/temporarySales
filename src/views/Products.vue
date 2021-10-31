<template>
  <div class="products-container">
    <logo></logo>
    <div class="products-content">
      <summary-products-list @product="handleProductEvent">
      </summary-products-list>
    </div>
    <summary-bar @summary="handleSummary" route="Products"></summary-bar>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Logo from "../components/atoms/Logo.vue";
import SummaryBar from "../components/atoms/SummaryBar.vue";
import SummaryProductsList from "../components/molecules/SummaryProductsList.vue";

export default {
  name: "Products",
  components: {
    Logo,
    SummaryProductsList,
    SummaryBar,
  },
  data() {
    return {
      language: "pl-PL",
      currentlySelected: [],
      products: [],
    };
  },
  computed: {
    ...mapGetters(["getObject", "getProducts"]),
  },
  methods: {
    ...mapActions(["invokeProductDelete", "invokeUpdateProducts"]),
    handleSummary() {
      this.$router.push({ name: 'Summary'});
    },
    updateOrdersCount(deletedObj) {
      let el = {};
      for (let idx of Object.entries(this.getProducts)) {
        el = idx[1];
        if (el.order > deletedObj.order) {
          el.order = el.order - 1;
          this.invokeUpdateProducts({
            key: el.id,
            data: el,
          });
        }
      }
    },
    handleProductEvent(val) {
      if (val.type == "delete") {
        this.updateOrdersCount(val.data);
        this.invokeProductDelete({ id: val.data.id });
      } else {
        this.invokeUpdateProducts({ key: val.data.id, data: val.data });
      }

      this.currentlySelected = this.getObject.products;

      localStorage.setItem(
        "current_products_configuration",
        JSON.stringify(this.getObject)
      );
    },
  },
  mounted() {
    this.products = this.getObject.products;
  },
};
</script>
<style scoped>
.products-container {
  width: 100%;
  background: #f8f5ef;
  height: fit-content;
  margin: 0 0 0 0;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: flex-start;
  align-items: center;
}
.products-content {
  max-width: 1000px;
  height: fit-content;
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
}
</style>
