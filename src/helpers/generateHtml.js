import {
  sectionLeft,
  sectionRight,
  templateBegin,
  templateEnd,
  createLabel,
  createItem,
  getStyles
} from "./constants";

export class PdfConstructor {
  constructor(width, height) {
      this.height = height;
      this.width = width;
      this.itemHeightRatio = 1/9;
      this.labelHeightRatio = 1/27;
      /**
       * in styles each item has quantity label
       * with border line top,bottom  each 1px
       * so offset for each item is 2px
      */
      this.stylesBordersOffset = 2;
      this.itemHeight = 40 + this.stylesBordersOffset;
      this.labelHeight = 10;
      this.pdfTemplate = this.getHtmlForPdf()
  }

  /**
  * Function gets templates array
  * 
  * Single template is an object  of
  * items separated in 2 buckets left
  * and right side, 
  * 
  * template = {
  *    left : [item,...,item]
  *    right: [item,...,item]
  * }
  * 
  * Function converts tamplate objects
  * into  page string recognizable
  * by pdf converter
  * 
  * @param {*} templates 
  * @returns 
  */
  createPdfScheme(templates) {
   let html = [];
 
   for (let template of templates) {
     let leftSectionBody = "";
     let rightSectionBody = "";
     if (template.left.length > 0) {
       for (let leftItem of template.left) {
         leftSectionBody += leftItem.template;
       }
     }
     if (template.right.length > 0) {
       for (let leftItem of template.right) {
         rightSectionBody += leftItem.template;
       }
     }
     const structure =
       templateBegin +
       sectionLeft(leftSectionBody) +
       sectionRight(rightSectionBody) +
       templateEnd;
     html.unshift(structure);
   }
 
   // add styles string 
   let pagesString = getStyles(this.itemHeight,this.labelHeight);
   // append html pages to string
   for (let page of html.reverse()) {
     pagesString += page;
   }
   return pagesString;
 }

 /**
 *
 * @param {Array} pdfFormat [width,height]
 * @returns string containing all pages combined
 */
 getHtmlForPdf() {

  const data = JSON.parse(
    localStorage.getItem("current_products_configuration")
  );

  let products = Object.entries(data)[0][1];
  let productsList = [];
  let itemsTemplates = [];

  for (let e of Object.entries(products)) {
    productsList.unshift(e[1]);
    itemsTemplates.unshift(createItem(e[1], this.itemHeight));
  }

  /**
   * position items of the same category
   * nearby using sort
   */
  itemsTemplates.sort(function(a, b) {
    const  keyA = a.category;
    const  keyB = b.category;
    if (keyA < keyB) return -1;
    if (keyA > keyB) return 1;
    return 0;
  });

  Object.assign(itemsTemplates, this.createLabelsObjects(itemsTemplates));

  let templates = [];
  let currentTemplate = {
    left: [],
    right: [],
  };

  let currentLeftBuffor = 0;
  let currentRightBuffor = 0;
  let forceToRight= false;
  let leftFilled = false;
  let rightFilled = false;

  /**
   * based on the amount of items,
   * assigns them to the appropriate
   *  section on a given page
   */
  for (let item of itemsTemplates) {

    leftFilled = forceToRight ? true : currentLeftBuffor + item.height >= this.height; 
    rightFilled = currentRightBuffor + item.height >= this.height ;

    if (!leftFilled) {
      currentTemplate.left.push(item);
      currentLeftBuffor += item.height;
    } else if (!rightFilled) {
      forceToRight = true;
      currentTemplate.right.push(item);
      currentRightBuffor += item.height;
    } else {

      // if page filled, add current to templates
      templates.push(currentTemplate);
      currentLeftBuffor = 0;
      currentRightBuffor = 0;
      forceToRight = false;
      currentTemplate = {
        left: [],
        right: [],
      };
      currentTemplate.left.push(item);
      currentLeftBuffor += item.height;
    }
  }
  templates.push(currentTemplate);

  return this.createPdfScheme(templates);
}

/**
 * injects label objects based on actual items
 * @param {*} templates 
 * @returns  templated with labels object
 */
  createLabelsObjects(templates) {
  let output = [];
  let category = "";
  for (let el of templates) {
    if (el.category != category) {
      category = el.category;
      output.push(createLabel(category, this.labelHeight));
    }
    output.push(el);
  }
  return output;
}



}






