import i18n from "../i18n";
import store from "../store/index";

export function getStyles(itemHeight, labelHeight) {
  return `
    <style>
    page {
      width: 100%;
    }

    .page-content {
      width: 100%;
      vertical-align: top;
    }

    .page-content td {
      width: 50%;
      vertical-align: top;
    }

    .item-table {
      width: 100%;
      height: ${itemHeight}mm;
    }

    .item-table tr {
      height: ${itemHeight}mm;
    }

    .item-table td {
      width: 33%;
      height: ${itemHeight}mm;
    }

    .item-left {
      width: 20%;
      margin-left: 10%;
      height: ${itemHeight}mm;
    }

    .image {
      margin-top: 10%;
      height: 80%;
      width: auto;
      display: block;
      object-fit: contain;
      position: center;
    }

    .item-center {
      width: 60%;
      margin-top: 10%;
      height: 80%;
    }
    .name {
      width: 100%;
      margin-bottom: 20px;
      font-size: 14px;
    }
    .description {
      width: 100%;
      font-size: 12px;
    }

    .item-right {
      width: 10%;
      text-align: right;
      margin-top: 10%;
      height: 80%;
    }

    .capacity-container {
      width: 80%;
      height: fit-content;
      text-align: center;
      font-size: 10px;
      margin-right: 10%;
    }
    .price-container {
      width: 80%;
      margin-right: 10%;
      height: fit-content;
      border: 1px solid #707070;
      border-radius: 5px;
      text-align: center;
      font-size: 10px;
    }
    .category-label {
      background: green;
      color: #fff;
      height: ${labelHeight}mm;
    }
    </style>
  `;
}

export function sectionLeft(items) {
  return `
  <!--section LEFT-->
     <td>
      ${items}
    </td>

    `;
}

export function sectionRight(items) {
  return `
  <!--section RIGHT-->
  <td>
  ${items}
  </td>
  `;
}

export const templateBegin = `
<page>
  <table class="page-content">
    <tr>
    `;

export const templateEnd = `
    </tr>
  </table>
</page>

`;

export function createLabel(category, labelHeight) {
  let data = {};
  data.name = category;
  data.template = `
  <div class="category-label">${category}</div>
`;
  data.height = labelHeight;
  data.type = "label";
  return data;
}

export function createItem(data, itemHeight) {
  const imagePath = data.path
    ? `${store.state.frontURL}/img/products/${data.path}`
    : `${store.state.frontURL}/img/products/180_01_12.png`;
  const template = `
  <table class="item-table">
  <tr>
    <td class="item-left">
     <img
      class="image"
      src="${imagePath}"
    />
    </td>
    <td class="item-center">
        <p class="name">
          ${data.name}
        </p>
        <p class="description>
          ${data.description ? data.description : i18n.t("lackOfDescription")}
        </p>
    </td>
    <td class="item-right">
      <div class="capacity-container">${data.capacity} ${
    store.state.capacityUnit
  }</div>
      <div class="price-container">${new Intl.NumberFormat(i18n.locale, {
        style: "currency",
        currency: store.state.currency,
      }).format(data.price)}</div>
    </td>
  </tr>
</table>
  `;
  data.type = "item";
  data.height = itemHeight;
  data.template = template;
  return data;
}
