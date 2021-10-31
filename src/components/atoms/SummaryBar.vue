<template>
  <div class="summary-bar-wrapper">
    <pdf-loader v-if="loading"></pdf-loader>
    <div v-if="route == 'Home'" class="summation-label">
      {{ $t("Added") }}
      <span class="counter">{{ currentlySelectedLength }}</span>
      {{ $t("Products") }}
    </div>
    <div @click="handleBack" v-else class="summation-label">
      {{ $t("Back") }}
    </div>
    <div v-if="route == 'Summary'" @click="generatePDF" class="next">
      {{ $t("Generate") }}
      <img
        class="arrow-icon"
        alt="arrow icon"
        src="../../assets/arrow-left.svg"
      />
    </div>
    <div v-else @click="handleProductSummary" class="next">
      {{ $t("Next") }}
      <img
        class="arrow-icon"
        alt="arrow icon"
        src="../../assets/arrow-left.svg"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {PdfConstructor} from "../../helpers/generateHtml";
import axios from "axios";
import PdfLoader from "./loaders/RingLoader.vue";
export default {
  components: { PdfLoader },
  name: "SummaryBar",
  props: {
    currentlySelectedLength: {
      type: Number,
      default: null,
    },
    route: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    ...mapGetters(["getApiURL"]),
  },
  methods: {
    handleBack() {
      this.$router.push({
        name: this.route == "summary" ? "Products" : "Home",
      });
    },
    handleProductSummary() {
      const payload = {
        type: this.route,
      };
      this.$emit("summary", payload);
    },
    downloadPDF(pdf, filename) {
      const linkSource = `data:application/pdf;base64,${pdf}`;
      const downloadLink = document.createElement("a");
      downloadLink.href = linkSource;
      downloadLink.download = filename;
      downloadLink.click();
    },
    async generatePDF() {
      const pdfFormat = [424, 301];

      const pdfConstructor = new PdfConstructor(pdfFormat[0],pdfFormat[1])
      let source = pdfConstructor.pdfTemplate;
      
      await axios.get(`${this.getApiURL}/pdf/auth`);

      const data = {
        html: source,
        name: "name.doc",
        options: {
          orientation: "L",
          format: pdfFormat,
          lang: "pl",
          unicode: true,
          margins: "[0,0,0,0]",
          pdfa: true,
        },
      };

      this.loading = true;
      const pdfResponse = await axios.post(`${this.getApiURL}/pdf/get`,{data});
      this.loading = false;
      const pdfTitle = `${this.$t("pdfTitle")}.pdf`;

      this.downloadPDF(pdfResponse.data.pdf, pdfTitle);
    },
  },
};
</script>

<style scoped>
.counter {
  margin-right: 5px;
  margin-left: 5px;
  font-weight: 600;
}
.arrow-icon {
  margin-left: 0.5rem;
}
.summary-bar-wrapper {
  max-width: 1000px;
  background: #64b138;
  position: fixed;
  bottom: 0;
  height: 4rem;
  width: 100%;
  display: flex;
  align-items: center;
  padding-bottom: env(safe-area-inset-bottom);
}
.summation-label {
  cursor: pointer;
  height: 100%;
  width: 50%;
  text-align: left;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: 5%;
  color: white;
}
.next {
  cursor: pointer;
  height: 100%;
  width: 50%;
  text-align: right;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 5%;
  font-weight: bold;
  color: white;
}
</style>
