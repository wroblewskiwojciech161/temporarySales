<template>
  <div @click="itemSelected" class="product-item-wrapper">
    <div
      v-bind:class="[
        clicked == true
          ? 'product-item-content-selected'
          : 'product-item-content',
      ]"
    >
      <div class="mask-wrapper">
        <ring-loader class="product-loader" v-if="loading"></ring-loader>
        <img
          @load="imgLoadEvent()"
          v-show="!loading"
          :src="imagePath"
          alt="product"
          class="product-image"
        />
        <div v-if="clicked" class="mask-roundbox">
          {{ index }}
        </div>
        <div v-if="clicked" class="image-mask"></div>
      </div>
      <div class="header">
        <span> {{ product.name }}</span>
      </div>
      <div class="subheader">
        <span class="capacity">
          {{ product.capacity }} {{ handleCapacityUnit }}</span
        >
        <span class="catalog-number"> {{ product.catalogNumber }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import axios from "axios";
import RingLoader from "./RingLoader.vue";
export default {
  name: "ProductItem",
  components: {
    RingLoader,
  },
  props: {
    product: {
      type: Object,
      default: () => {},
    },
    current: {
      type: Array,
      default: () => [],
    },
    index: {
      type: Number,
      default: null,
    },
    value: {},
  },
  data() {
    return {
      imagePath: `/img/icons/placeholder.svg`,
      loading: true,
    };
  },
  computed: {
    ...mapGetters([
      "getProducts",
      "getApiURL",
      "getCurrentCategory",
      "getObject",
    ]),
    clicked() {
      return this.current.includes(this.product.id.toString());
    },
    handleCapacityUnit() {
      return this.product.capacity ? "ml" : "";
    },
  },
  watch: {
    getCurrentCategory() {
      this.loading = true;
      this.checkLocalImage();
    },
    product() {
      this.loading = true;
      this.checkLocalImage();
    },
  },
  methods: {
    itemSelected() {
      const type = this.clicked ? "delete" : "product";

      let obj = this.product;
      if (type == "delete") {
        for (let el of Object.keys(this.getObject.products)) {
          if (this.product.id.toString() === el) {
            obj = this.getObject.products[this.product.id];
          }
        }
      }
      const payload = {
        type: type,
        data: obj,
      };
      this.$emit("input", payload);
    },
    async checkLocalImage() {
      let path = "";

      if (this.product.path && !this.product.image) {
        path = `/img/products/${this.product.path}`;
      } else if (!this.product.path && this.product.image) {
        path = `${this.getApiURL}${this.product.image.url}`;
      } else {
        this.imagePath = `/img/icons/placeholder.svg`;
        this.loading = false;
        return false;
      }

      try {
        const res = await axios.get(path);
        this.imagePath = path;

        return res.status === 200;
      } catch (e) {
        this.imagePath = `/img/icons/placeholder.svg`;
        this.loading = false;
        return false;
      }
    },
    imgLoadEvent() {
      setTimeout(() => {
        this.loading = false;
      }, 800);
    },
  },

  mounted() {
    this.checkLocalImage();
  },
  updated() {
    this.checkLocalImage();
  },
};
</script>

<style scoped>
.product-item-wrapper {
  cursor: pointer;
  background: transparent;
  color: white;
  flex: 0 0 calc(50% - 1rem);
  margin-left: 0.5rem;
  margin-right: 0.5rem;
  margin-top: 1rem;
}
.mask-wrapper {
  position: relative;
  height: 70%;
  width: 100%;
  background: white;
}
.image-mask {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: #64b138;
  opacity: 0.5;
}

.mask-roundbox {
  position: absolute;
  height: 2rem;
  width: 2rem;
  border-radius: 50%;
  color: white;
  background: #64b138;
  top: calc(35% + 1rem);
  left: calc(50% - 1rem);
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 700;
}

.product-item-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 270px;
  color: black;
}
.product-item-content-selected {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 270px;
  color: black;
}
.product-image {
  height: calc(100% - 1rem);
  width: calc(100%);
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  object-fit: contain;
  background: white;
}
.header {
  background: transparent;
  height: fit-content;
  min-height: 30px;
  margin-top: 0.5rem;
  width: 100%;
  font-weight: 700;
  text-align: left;
}
.subheader {
  background: transparent;
  height: 10%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.catalog-number {
  width: 50%;
  font-size: 0.8rem;
  text-align: right;
}
.capacity {
  width: 50%;
  font-size: 0.8rem;
  text-align: left;
}

@media only screen and (min-width: 768px) {
  .product-item-wrapper {
    flex: 0 0 calc(33% - 1rem);
  }
  .product-item-content,
  .product-item-content-selected {
    height: 300px;
  }
}
</style>
