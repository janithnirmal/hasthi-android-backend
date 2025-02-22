/**
 * mange component functionalities
 */

export class Component {
  constructor(compoennt, callback) {
    this.compoenntName = compoennt;
    this.callback = callback;
    this.fetchDesign();
  }

  async fetchDesign() {
    const response = await fetch(
      "/public/view/component/custom/" + this.compoenntName + ".comp.php"
    );
    if (!response.ok) {
      return false;
    }
    const designHtml = await response.text();
    await this.createComponent(designHtml, this.callback);
  }

  async createComponent(compoenntHtml, compoennUpdateCallback) {
    await compoennUpdateCallback(this.createDOMbyHTML(compoenntHtml));
  }

  createDOMbyHTML(html) {
    const template = document.createElement("template");
    template.innerHTML = html.trim();
    return template.content.firstChild;
  }
}