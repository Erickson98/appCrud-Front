import Ruter from "./Ruter.Class";
const Person = () => {
  const ruter = Ruter();
  const module = process.env.REACT_APP_API_MODULE_PERSON;
  return {
    getPerson: async () => {
      const s = await ruter.get(module);
      return s;
    },
    createPerson: async (element) => {
      return await ruter.post(module, element);
    },
    updatePerson: async (element, id) => {
      await ruter.put(module, element, id);
    },
    deletePerson: async (id) => {
      await ruter.delete(module, id);
    },
  };
};
export default Person;
