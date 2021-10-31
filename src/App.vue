<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      mobile: window.innerWidth <= 600,
    };
  },
  watch: {
    mobile(val) {
      this.invokeUpdateScreenMode(val);
    },
  },
  methods: {
    ...mapActions(["invokeUpdateScreenMode"]),
  },

  created() {
    addEventListener("resize", () => {
      this.mobile = innerWidth <= 600;
    });
    this.invokeUpdateScreenMode(this.mobile);
  },
};
</script>

<style>
body,
html {
  font-family: "Montserrat", Helvetica, sans-serif;
  margin: 0 0 0 0;
  background: #f8f5ef;
  position: relative;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}
</style>
