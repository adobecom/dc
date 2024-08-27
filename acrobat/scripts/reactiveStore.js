export default class ReactiveStore {
  #initialData = null;

  #loaded = false;

  #loading = false;

  #subscribers = [];

  constructor(initial = null, isLoaded = false) {
    if (initial) this.#initialData = initial;
    this.data = initial;
    this.#loaded = isLoaded;
  }

  subscribe(fn, triggerIfLoaded = true) {
    if (!this.#subscribers.includes(fn)) this.#subscribers.push(fn);
    if (!triggerIfLoaded) return;
    if (this.#loaded) fn(this.data, this.#loading);
  }

  unsubscribe(fn) {
    const indexOfFn = this.#subscribers.indexOf(fn);
    if (indexOfFn !== -1) this.#subscribers.splice(indexOfFn, 1);
  }

  update(data) {
    if (typeof data === 'function') this.data = data(this.data);
    else this.data = data;
    this.#loaded = true;
    this.#loading = false;
    this.#subscribers.forEach((subscriber) => {
      subscriber(this.data, this.#loading);
    });
  }

  startLoading(resetData = true) {
    this.#loading = true;
    if (resetData) this.data = this.#initialData;
    this.#subscribers.forEach((subscriber) => {
      subscriber(this.data, this.#loading);
    });
  }
}
