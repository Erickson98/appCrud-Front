import axios from "axios";

const UserRouter = () => {
  return {
    get: async () => {
      const s = await fetch(process.env.REACT_APP_API_ROUTER_USERS)
        .then((result) => result.json())
        .then((result) => {
          return result;
        });
      return s;
    },

    put: async (element, id, rol) => {
      await axios.put(
        `${process.env.REACT_APP_API_ROUTER_USERS}/${id}/${rol}`,
        element
      );
    },
    delete: async (id) => {
      await axios.delete(`${process.env.REACT_APP_API_ROUTER_USERS}/${id}`);
    },
  };
};
export default UserRouter;
