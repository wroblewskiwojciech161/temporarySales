import * as Twig from "twig";

export default async function renderTemplate(path,options) {
    return new Promise((resolve, reject) => {
      Twig.renderFile(
       path,
        options,
        (err, html) => {
          if (err) throw err;
          else resolve(html);
        }
      );
    });
  }
  