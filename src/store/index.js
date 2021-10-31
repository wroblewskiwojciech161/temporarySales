import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    mobile: false,
    currentCategory: "home",
    capacityUnit: 'ml',
    currency: "PLN",
    apiURL: "/api",
    frontURL: "https://ncmid.k-fx-server1.usermd.net",
    current: {
      products: {},
      cardType: 1,
      restaurantName: "",
      restaurantLogo: "",
    },
  },
  mutations: {
    updateCurrentObject(state, value) {
      state.current = value;
    },
    updateProduct(state, { key, data }) {
      Vue.set(state.current.products, key, data);
    },

    updateAdditionalInfo(state, { key, data }) {
      Vue.set(state.current, key, data);
    },
    deleteProduct(state, id) {
      Vue.delete(state.current.products, id.id);
    },
    updateCurrentCategory(state, value) {
      state.currentCategory = value;
    },
    updateScreenMode(state, value) {
      state.mobile = value;
    },
  },
  actions: {
    invokeUpdateProducts({ commit }, payload) {
      const { key, data } = payload;
      commit("updateProduct", { key, data });
    },
    invokeUpdateAdditionalInfo({ commit }, payload) {
      const { key, data } = payload;
      commit("updateAdditionalInfo", { key, data });
    },
    invokeProductDelete({ commit }, id) {
      commit("deleteProduct", id);
    },
    invokeUpdateCurrentObject({ commit }, object) {
      commit("updateCurrentObject", object);
    },
    invokeUpdateCurrentCategory({ commit }, category) {
      commit("updateCurrentCategory", category);
    },
    invokeUpdateScreenMode({ commit }, category) {
      commit("updateScreenMode", category);
    },
  },
  getters: {
    getApiURL: (state) => state.apiURL,
    getProducts: (state) => state.current.products,
    getObject: (state) => state.current,
    getCurrentCategory: (state) => state.currentCategory,
    getCurrentScreenMode: (state) => state.mobile,
  },
  modules: {},
});

export default store;
