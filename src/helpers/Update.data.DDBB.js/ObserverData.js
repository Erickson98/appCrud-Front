import Person from "../../Ruter/Person";
export class ObserverData {
  constructor() {
    this.subject = null;
  }
  setSubject(subject) {
    this.subject = subject;
  }
  update = async () => {
    if (this.subject.getUpdate()) {
      return await Person().getPerson();
    }
  };
}
