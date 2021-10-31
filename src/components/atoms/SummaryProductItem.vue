<template>
  <div class="summary-product-item-wrapper">
    <div class="section-close">
      <img
        @click="itemSelected"
        class="close-icon"
        alt="close"
        src="../../assets/close.svg"
        rel="preload"
      />
    </div>
    <div class="section-left">
      <div class="section-left-up">{{ product.name }}</div>
      <div class="section-left-bottom">
        <div class="section-left-bottom-capacity">{{ product.capacity }}ml</div>
        <div class="section-left-bottom-serialnumber">
          {{ product.catalogNumber }}
        </div>
      </div>
    </div>
    <div class="section-right">
      <quantity-input v-model="state.price" type="price"></quantity-input>
      <quantity-input v-model="state.capacity" type="capacity"></quantity-input>
    </div>
  </div>
</template>

<script>
import QuantityInput from "./QuantityInput.vue";
export default {
  components: { QuantityInput },
  name: "SummaryProductItem",
  props: {
    product: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      state: {
        price: this.product.price,
        capacity: this.product.capacity,
      },
    };
  },
  watch: {
    "state.price": function (val) {
      const type = "update";
      let temp = this.product;
      temp[val.type] = val.value;
      const payload = {
        type: type,
        data: temp,
      };
      this.$emit("itemclick", payload);
    },
    "state.capacity": function (val) {
      const type = "update";
      let temp = this.product;
      temp[val.type] = val.value;
      const payload = {
        type: type,
        data: temp,
      };
      this.$emit("itemclick", payload);
    },
  },
  methods: {
    itemSelected() {
      const type = "delete";
      const payload = {
        type: type,
        data: this.product,
      };
      this.$emit("itemclick", payload);
    },
  },
  mounted() {
    this.capacity = this.product.capacity;
    this.price = this.product.price;
  },
};
</script>

<style scoped>
.close-icon {
  width: 30%;
  height: auto;
  max-width: 1.2rem;
  cursor: pointer;
}
.summary-product-item-wrapper {
  width: 100%;
  height: fit-content;
  display: flex;
  align-items: column;
  font-size: 1rem;
  border-bottom: 1px solid #0e1e35;
}
.section-close {
  width: 10%;
  min-height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.section-left {
  padding-bottom: 10px;
  padding-top: 10px;
  width: 35%;
  margin-right: 10%;
}
.section-right {
  padding-bottom: 10px;
  padding-top: 10px;
  width: 45%;
  display: flex;
}
.section-left-up {
  padding-bottom: 5px;
  padding-top: 5px;
  font-size: 0.9rem;
  height: fit-content;
  width: 95%;
  margin-right: 5%;
  display: flex;
  align-items: center;
  justify-content: left;
  font-weight: bold;
  text-align: left;
}
.section-left-bottom {
  padding-bottom: 5px;
  padding-top: 5px;
  height: fit-content;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: left;
}
.section-left-bottom-capacity {
  padding-bottom: 5px;
  padding-top: 5px;

  width: 50%;
  display: flex;
  justify-content: left;
  font-size: 0.8rem;
}
.section-left-bottom-serialnumber {
  padding-bottom: 5px;
  padding-top: 5px;

  width: 50%;
  display: flex;
  justify-content: right;
  font-size: 0.8rem;
}

.section-right-price {
  width: 50%;
  display: flex;
  align-items: center;
}
.section-right-capacity {
  width: 50%;
  display: flex;
  align-items: center;
}
.section-right-box {
  padding-left: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.8rem;
  height: 60%;
  width: 70%;
  border: 2px solid black;
  background: transparent;
}
.section-right-box-active {
  padding-left: 5px;
  height: 60%;
  width: 70%;
  border: 2px solid #64b138;
  background: transparent;
}
.section-right-text {
  width: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.8rem;
  font-weight: bold;
}
.section-right-text-active {
  color: #64b138;
  width: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.8rem;
  font-weight: bold;
}
@media only screen and (min-width: 768px) {
  .section-left {
    padding-bottom: 10px;
    padding-top: 10px;
    width:150px;
    margin-right: calc(45% - 200px);
  }
}
</style>
