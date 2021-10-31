<template>
  <div class="searchbar-wrapper">
    <input
      ref="searchbar"
      v-model="search"
      :placeholder="placeholder"
      class="searchbar-input"
    />
    <div @click="handleSearch" class="search-button">
      <img
        class="search-button-icon"
        alt="icon"
        src="../../assets/search.svg"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "SearchBar",
  props: {
    placeholder: {
      type: String,
      default: "Szukaj po nazwie",
    },
    value:{}
  },
  data() {
    return {
      search: "",
    };
  },
  watch: {
    search(val) {
      this.$emit("input", val);
    },
    value(val){
      this.search = val;
    }
  },
  methods: {
    handleSearch() {
      this.$refs.searchbar.blur();
    },
  },
};
</script>

<style scoped>
.searchbar-wrapper {
  width: 100%;
  height: 4rem;
  display: flex;
}

.search-button {
  width: 4rem;
  height: 4rem;
  background: #0e1e35;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.search-button-icon {
  height: 40%;
  width: 40%;
}
.searchbar-input {
  width: calc(100% - 4rem);
  font-size: 1.5rem;
  padding-left: 1rem;
  font-weight: 500;
}
input::placeholder {
  color: lightgray;
  font-size: 1.2rem;
  padding-left: 0.5rem;
}
input {
  border: none;
  outline: none;
}
.searchbar-input :focus {
  border: none;
  outline: none;
}
</style>
