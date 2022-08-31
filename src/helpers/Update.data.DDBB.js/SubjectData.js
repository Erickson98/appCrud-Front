export class SubjectCollection {
  constructor() {
    this.observerDbList = [];
    this.data = null;
  }
  subscribe(observer) {
    this.observerDbList.push(observer);
  }
  unSubscribe(observer) {
    this.observerDbList = this.observerDbList.filter((obs) => obs !== observer);
  }
  notify() {
    return this.observerDbList.forEach((subscriber) => subscriber.update());
  }
  getUpdate() {
    return this.data;
  }
  setData(newData) {
    this.data = newData;
  }
}
