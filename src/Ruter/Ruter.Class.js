import axios from "axios";

const Ruter = () => {
  const URL = `${process.env.REACT_APP_API_PAGE}`
  return {
    get: async (module) => {
      const s = await fetch(`${URL}/${module}`)
        .then((result) => result.json())
        .then((result) => {
          return result;
        });
      return s;
    },
    put: async (module, element, id) => {
      await axios.put(`${URL}/${module}/${id}`, element);
    },
    post: async (module, element) => {
      return await axios.post(`${URL}/${module}`, element);
      
    },
    delete: async (module, id) => {
      await axios.delete(`${URL}/${module}/${id}`);
    },
  };
};

export default Ruter;
