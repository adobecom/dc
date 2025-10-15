export default class DemoBlock {
  constructor(page) {
    this.page = page;
    this.header = this.page.locator('h1');
  }
}
