<template>
  <div class="home-container">
    <logo></logo>
    <div class="home-content">
      <div class="stick-bar">
        <search-bar v-model="searchValue"></search-bar>
        <category-slider
          :searching="checkIfSearchInvoked"
          :categories="categories"
          @categorySelected="handleCategorySelected"
        ></category-slider>
      </div>
      <products-list
        @product="handleProductEvent"
        :current="current"
        :products="products"
      ></products-list>
      <loader v-if="loading"></loader>
      <summary-bar
        v-if="summary"
        @summary="handleSummary"
        :currentlySelectedLength="currentlySelectedLength"
        route="Home"
      ></summary-bar>
    </div>
  </div>
</template>
<script>
import SearchBar from "@/components/atoms/SearchBar.vue";
import CategorySlider from "../components/molecules/CategorySlider.vue";
import axios from "axios";
import qs from "qs";
import Logo from "../components/atoms/Logo.vue";
import ProductsList from "../components/molecules/ProductsList.vue";
import Loader from "../components/atoms/loaders/BarLoader.vue";
import SummaryBar from "../components/atoms/SummaryBar.vue";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "Home",
  components: {
    CategorySlider,
    Logo,
    ProductsList,
    Loader,
    SearchBar,
    SummaryBar,
  },
  data() {
    return {
      language: "pl-PL",
      searchValue: "",
      categories: [],
      products: [],
      currentlySelected: [],
      currentCategory: "Wszystkie kategorie",
      scrolledBottom: false,
      currentPaginationStart: 0,
      loading: false,
      apiURL: "",
      fetchedAll: false,
      recentLength: 0,
      mobile: false,
      allCategoriesLabel: "Wszystkie kategorie",
    };
  },
  watch: {
    searchValue(val) {
      if (val.lenght > 0) this.currentCategory = this.allCategoriesLabel;
      this.currentPaginationStart = 0;
      this.fetchedAll = false;
      window.scrollTo({ top: 0, behavior: "smooth" });
      this.fetchData();
    },
    currentCategory(val) {
      this.currentPaginationStart = 0;
      this.scrolledBottom = false;
      this.fetchedAll = false;
      window.scrollTo({ top: 0, behavior: "smooth" });
      this.searchValue = "";
      this.invokeUpdateCurrentCategory(val);
    },
    scrolledBottom(val) {
      if (val !== true) return;
      if (this.currentCategory != this.allCategoriesLabel) return;
      this.currentPaginationStart += this.paginationLimit;
      this.fetchData("next");
    },
  },
  computed: {
    ...mapGetters([
      "getObject",
      "getApiURL",
      "getCurrentScreenMode",
      "getProducts",
    ]),
    summary() {
      return this.currentlySelectedLength > 0;
    },
    paginationLimit() {
      return this.mobile ? 5 : 7;
    },
    currentlySelectedLength() {
      return Object.entries(this.currentlySelected).length;
    },
    current() {
      return Object.keys(this.currentlySelected);
    },
    checkIfConfigurationSet() {
      return (
        localStorage.getItem("current_products_configuration") &&
        localStorage.getItem("current_products_configuration").length > 0
      );
    },
    storedConfiguration() {
      return JSON.parse(localStorage.getItem("current_products_configuration"));
    },
    checkIfSearchInvoked() {
      return this.searchValue.length > 0;
    },
  },
  methods: {
    ...mapActions([
      "invokeUpdateProducts",
      "invokeProductDelete",
      "invokeUpdateCurrentObject",
      "invokeUpdateCurrentCategory",
    ]),
    handleSummary() {
      this.$router.push({ name: "Products" });
    },
    handleProductEvent(val) {
      if (val.type === "product") {
        const k = Object.keys(this.getProducts).length + 1;
        this.invokeUpdateProducts({
          key: parseInt(val.data.id),
          data: {
            id: val.data.id,
            name: val.data.name,
            capacity: val.data.capacity,
            price: "",
            description: val.data.description,
            catalogNumber: val.data.catalogNumber,
            path: val.data.path,
            selected: true,
            order: k,
            category:this.currentCategory,
          },
        });
      } else {
        this.updateOrdersCount(val.data);
        this.invokeProductDelete({ id: val.data.id });
      }
      this.currentlySelected = this.getObject.products;
      localStorage.setItem(
        "current_products_configuration",
        JSON.stringify(this.getObject)
      );
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
    scroll() {
      window.onscroll = () => {
        let bottomOfWindow =
          Math.max(
            window.pageYOffset + 80,
            document.documentElement.scrollTop + 80,
            document.body.scrollTop + 80
          ) +
            window.innerHeight >
          document.documentElement.offsetHeight - 260;
        if (bottomOfWindow) {
          this.scrolledBottom = true;
        }
      };
    },
    handleCategorySelected(val) {
      this.currentPaginationStart = 0;
      this.currentCategory = val;
      window.scrollTo({ top: 0, behavior: "smooth" });
      this.fetchData();
    },

    async fetchCategories() {
      const queryStandard = qs.stringify({ _locale: this.language });
      const res = await axios.get(`${this.apiURL}/categories?${queryStandard}`);
      for (let element of res.data) {
        if (!this.categories.includes(element.name)) {
          this.categories.push(element.name);
        }
      }

      this.categories.unshift(this.allCategoriesLabel);
    },
    async fetchData(type = "fetch") {
      if (this.fetchedAll) return;
      this.loading = true;
      const queryStandard = qs.stringify({
        _locale: this.language,
        _limit: this.paginationLimit,
        _start: this.currentPaginationStart,
        _name_contains: this.searchValue,
      });
      const query = qs.stringify({
        _locale: this.language,
        _start: this.currentPaginationStart,
        _where: {
          _or: [{ category_contains: this.currentCategory }],
        },
      });

      let res;
      if (
        this.currentCategory != this.allCategoriesLabel &&
        !this.searchValue.length > 0
      ) {
        res = await axios.get(`${this.apiURL}/products?${query}`);
      } else {
        this.fetchedAll = false;
        res = await axios.get(`${this.apiURL}/products?${queryStandard}`);
      }
      if (type === "fetch") this.products = [];

      for (let element of res.data) {
        if (element.catalogNumber != null)
          element.path = element.catalogNumber.split("/").join("_") + ".png";
        else element.path = null;

        element.selected = Object.entries(this.currentlySelected).includes(
          element.id
        );
        if (element.capacity)
          element.capacity = element.capacity.slice(0, -2).trim();

        this.products.push(element);
      }
      if (this.products.length === this.recentLength && type === "next")
        this.fetchedAll = true;

      if (this.checkIfConfigurationSet) {
        this.invokeUpdateCurrentObject(this.storedConfiguration);
      }
      if (type === "next") this.scrolledBottom = false;
      this.loading = false;
      this.currentlySelected = this.getObject.products;
      this.recentLength = this.products.length;
    },
  },
  mounted() {
    this.apiURL = this.getApiURL;
    this.mobile = this.getCurrentScreenMode;
    this.scroll();
    this.fetchCategories();
    window.scrollTo({ top: 0, behavior: "smooth" });
    this.fetchData();
  },
};
</script>
<style scoped>
.home-container {
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
.home-content {
  max-width: 1000px;
  height: fit-content;
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
}
.stick-bar {
  z-index: 1;
  position: sticky;
  top: 0;
}
</style>
