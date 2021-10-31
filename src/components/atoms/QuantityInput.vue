<template>
  <div class="section-input">
    <input
      v-model="currentValue"
      v-bind:class="[
        valueCheck == true ? 'section-input-box' : 'section-input-box-active',
      ]"
    />
    <div
      v-bind:class="[
        valueCheck == true ? 'section-input-text' : 'section-input-text-active',
      ]"
    >
      {{ handleUnit }}
    </div>
  </div>
</template>

<script>
export default {
  name: "QuantityInput",
  props: {
    value: {},
    type: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      currentValue: "",
    };
  },
  computed: {
    valueCheck() {
      return this.currentValue && this.currentValue.length > 0;
    },
    handleUnit() {
      return this.type == "price" ? "zł" : "ml";
    },
  },
  watch: {
    currentValue(val) {
      if (this.validate(val)) {
        const payload = {
          type: this.type,
          value: val,
        };
        this.$emit("input", payload);
      }
    },
  },
  methods: {
    validate(val) {
      return val?.length > 0 && Number(val) > 0;
    },
  },
  mounted() {
    this.currentValue = this.value;
  },
};
</script>

<style scoped>
.section-input-box,
.section-input-box-active:focus {
  outline: none;
}
.section-input {
  width: 50%;
  display: flex;
  align-items: center;
}
.section-input-box {
  border-radius: 0;
  padding-left: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.8rem;
  height: 2.5rem;
  width: 70%;
  max-width: 4rem;
  border: 2px solid black;
  background: transparent;
  text-align: center;
}

.section-input-box-active {
  border-radius: 0;
  padding-left: 5px;
  height: 2.5rem;
  width: 70%;
  max-width: 4rem;
  border: 2px solid #64b138;
  background: transparent;
}
.section-input-text {
  width: 30%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 0.8rem;
  font-weight: bold;
  margin-left: 5px;
}
.section-input-text-active {
  color: #64b138;
  width: 30%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 0.8rem;
  font-weight: bold;
  margin-left: 5px;
}
</style>
