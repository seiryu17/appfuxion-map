import axios from "axios";

const axiosCreate = (url: string) => {
  return axios.create({
    baseURL: url,
    headers: {},
  });
};
export default axiosCreate;
