import axiosCreate from "../../utils/api";
import api from "../../utils/api";

export default {
  GetListPlaces: (input: string): Promise<any> => {
    return axiosCreate(
      `https://maps.googleapis.com/maps/api/place/autocomplete/`
    ).get(`json?input=${input}&key=${process.env.NEXT_PUBLIC_BASE_API}`);
  },
  GetLangLat: (place_id: string): Promise<any> => {
    return axiosCreate(
      `https://maps.googleapis.com/maps/api/place/details/`
    ).get(`json?place_id=${place_id}&key=${process.env.NEXT_PUBLIC_BASE_API}`);
  },
};
