<template>
  <div class="summary-container">
    <logo></logo>

    <div class="summary-content">
      <div class="summary-product-list-header">
        {{ $t("ChooseCard") }}
        <img
          v-if="currentCard"
          src="../assets/approve.svg"
          alt="approve icon"
        />
      </div>
      <div class="cards-wrapper">
        <img
          @click="setCard(1)"
          v-bind:class="[currentCard == 1 ? 'card-item-active' : 'card-item']"
          alt="card-item"
          src="../assets/card1.svg"
          rel="preload"
        />
        <img
          @click="setCard(2)"
          v-bind:class="[currentCard == 2 ? 'card-item-active' : 'card-item']"
          alt="card-item"
          src="../assets/card2.svg"
          rel="preload"
        />
      </div>

      <div class="summary-product-list-header">
        {{ $t("SetRestaurantName") }}
        <img
          v-if="nameAccepted"
          src="../assets/approve.svg"
          alt="approve icon"
        />
      </div>

      <div class="restaurant-name-wrapper">
        <input
          v-model="currentRestaurantName"
          class="input-restaurant-name"
          placeholder="Nazwa restauracji"
        />
      </div>

      <div class="summary-product-list-header">
        {{ $t("SetRestaurantLogo")
        }}<span class="text-optional"> ({{ $t("Optional") }}) </span>
        <img
          v-if="logoAccepted"
          src="../assets/approve.svg"
          alt="approve icon"
        />
      </div>

      <div class="restaurant-name-wrapper">
        <div v-if="!image" class="uploadInputWrapper">
          <input
            type="file"
            name="file"
            id="file"
            class="inputfile"
            @change="onFileChange"
          />
          <label for="file">
            {{ $t("AttachFile") }}
            <img src="../assets/upload.svg" alt="approve icon"
          /></label>
        </div>
        <div v-else>
          <img class="uploadedImage" :src="image" />
          <button class="removeImage" @click="removeImage">
            {{ $t("RemoveFile") }}
            <img
              class="delete-icon"
              src="../assets/delete.svg"
              alt="delete icon"
            />
          </button>
        </div>
      </div>
    </div>
    <summary-bar @summary="handleSummary" route="Summary"></summary-bar>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Logo from "../components/atoms/Logo.vue";
import SummaryBar from "../components/atoms/SummaryBar.vue";

export default {
  name: "Products",
  components: {
    Logo,
    SummaryBar,
  },
  data() {
    return {
      image: "",
      language: "pl-PL",
      currentCard: 1,
      currentRestaurantName: "",
    };
  },
  computed: {
    ...mapGetters(["getObject"]),
    nameAccepted() {
      return this.currentRestaurantName.length > 0;
    },
    logoAccepted() {
      return this.image.length > 0;
    },
  },
  watch: {
    image(val) {
      this.invokeUpdateAdditionalInfo({
        key: "restaurantLogo",
        data: val,
      });
      this.updateCookie();
    },
    currentCard(val) {
      this.invokeUpdateAdditionalInfo({
        key: "cardType",
        data: val,
      });
      this.updateCookie();
    },
    currentRestaurantName(val) {
      this.invokeUpdateAdditionalInfo({
        key: "restaurantName",
        data: val.length ? val : "",
      });
      this.updateCookie();
    },
  },
  methods: {
    onFileChange(e) {
      let files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.createImage(files[0]);
    },
    createImage(file) {
      let reader = new FileReader();
      let vm = this;

      reader.onload = (e) => {
        vm.image = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    removeImage: function () {
      this.image = "";
    },
    ...mapActions(["invokeUpdateAdditionalInfo"]),
    handleSummary() {
      this.$router.push({ name: "Summary" });
    },
    setCard(id) {
      this.currentCard = id;
    },
    updateCookie() {
      localStorage.setItem(
        "current_products_configuration",
        JSON.stringify(this.getObject)
      );
    },
  },
  mounted() {
    if (localStorage.getItem("current_products_configuration").length > 0) {
      const local = JSON.parse(
        localStorage.getItem("current_products_configuration")
      );
      this.image = local.restaurantLogo;
      this.currentCard = local.cardType;
      this.currentRestaurantName = local.restaurantName;
    }
  },
};
</script>
<style scoped>
input::placeholder {
  color: rgb(163, 154, 154);
}
.text-optional {
  color: rgb(163, 154, 154);
  font-weight: 500;
}
.delete-icon {
  height: 1.5rem;
  width: auto;
  filter: invert(50%) sepia(97%) saturate(312%) hue-rotate(54deg)
    brightness(99%) contrast(91%);
}
label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 1rem;
  padding-right: 1rem;
  font-weight: 600;
  cursor: pointer;
}
.uploadInputWrapper {
  width: 100%;
}

.inputfile + label {
  min-width: calc(100% - 2rem);
  width: calc(100% - 2rem);
  height: 4rem;
  font-size: 1.2rem;
  background: white;
  text-align: left;
  text-align: left;
}

.inputfile {
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
}

input[type="file"] {
  color: transparent;
}
.card-item {
  cursor: pointer;
}
.card-item-active {
  cursor: pointer;
  filter: invert(47%) sepia(90%) saturate(1000%) hue-rotate(60deg)
    brightness(82%) contrast(100%);
}
.summary-container {
  width: 100%;
  background: #f8f5ef;
  margin: 0 0 0 0;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: flex-start;
  align-items: center;
  padding-bottom: 5rem;
}
.summary-content {
  max-width: 1000px;
  height: fit-content;
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
}
.cards-wrapper {
  margin-left: 5%;
  margin-right: 5%;
  width: 90%;
  margin-top: 1rem;
  margin-bottom: 1rem;
  height: 30%;
  display: flex;
  justify-content: space-evenly;
}
.restaurant-name-wrapper {
  margin-left: 5%;
  margin-right: 5%;
  width: 90%;
  margin-top: 1rem;
  margin-bottom: 1rem;
  height: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.summary-product-list-header {
  margin-bottom: 1rem;
  text-align: left;
  border-bottom: 1px solid black;
  font-size: 1.2rem;
  padding-bottom: 0.5rem;
  width: 90%;
  margin-left: 5%;
  margin-right: 5%;
  font-weight: bold;
}
.summary-product-list-header:not(:first-child) {
  margin-top: 1rem;
}

.input-restaurant-name {
  width: 100%;
  height: 4rem;
  padding-left: 1rem;
  font-size: 1.2rem;
}

input,
button {
  border: none;
  outline: none;
}
.searchbar-input :focus {
  border: none;
  outline: none;
}
.uploadedImage {
  max-width: 100%;
  height: auto;
  margin-bottom: 1rem;
}
.removeImage {
  min-width: 100%;
  width: 100%;
  height: 4rem;
  padding-left: 1rem;
  font-size: 1.2rem;
  margin-bottom: 10rem;
  background: white;
  text-align: left;
  font-weight: 600;
  color: black;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 1rem;
}
.removeImage:hover {
  min-width: 100%;
  width: 100%;
  height: 4rem;
  padding-left: 1rem;
  font-size: 1.2rem;
  margin-bottom: 10rem;
  background: #8bda5d;
  text-align: left;
  font-weight: 600;
  color: white;
}
</style>
