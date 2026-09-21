type HtmlSanitizer = (text: string) => DocumentFragment;

let htmlSanitizer: HtmlSanitizer | undefined;

export function setHtmlSanitizer(sanitizer: HtmlSanitizer): void {
  htmlSanitizer = sanitizer;
}

export function setElContent(text: string, el: HTMLElement) {
  if (htmlSanitizer) {
    el.replaceChildren(htmlSanitizer(text));
  } else {
    el.setText(text);
  }
}

// Parse a locale string into a DocumentFragment if it contains HTML (e.g. <a>,
// <code>, <b>), otherwise return the plain string. Suitable for `desc` fields
// on SettingDefinitionItem and for setting.setDesc(...) in render callbacks.
export function richDescription(text: string): string | DocumentFragment {
  return htmlSanitizer ? htmlSanitizer(text) : text;
}
