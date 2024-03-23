const cheerio = require("cheerio");

export function utilsCleaner(htmlContent) {
  const $ = cheerio.load(htmlContent, { decodeEntities: false });

  $("*:empty").remove();
  const contentToRemove = [
    "Title:",
    "URL:",
    "Keywords:",
    "Description:",
    "H1:",
    "Alt:",
    "Image:",
  ];

  contentToRemove.forEach((content) => {
    $(`p:contains('${content}')`).remove();
  });

  $("body *").removeAttr("id");

  // Remove empty paragraphs
  $("p")
    .filter(function () {
      return $(this).is(":empty") || $(this).html().trim() === "<br>";
    })
    .remove();

  // Remove <p> tags containing only <br>
  $("p").each(function () {
    const $this = $(this);
    if ($this.children().length === 1 && $this.children().first().is("br")) {
      $this.remove();
    }
  });
  // Remove empty tags

  const modifiedHtmlContent = $("body").html();
  const trimmedContent = modifiedHtmlContent.trim().replace(/<strong>(.*?)<\/strong>/g, '<strong> $1 </strong>');

  return trimmedContent;
}

export function getTitleAndMeta(props) {
  let resultObject = {};
  let cleanedContent = props;
  let sourceCode = props;
  sourceCode
    .split(/<\/p>\s*<p.*?>/)
    .slice(0, 10)
    .map((line) => line.replace(/<p.*?>|<\/p>/g, ""))
    .join("\n")
    .split("\n")
    .forEach((line) => {
      const match = line.match(/^([A-Za-z0-9]+):\s*(.+)$/);
      if (match) {
        const [, name, value] = match;
        resultObject[name] = value.trim();
      }
    });

    console.log(resultObject)
  return [resultObject, cleanedContent];
}