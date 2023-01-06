import axios from "../utils/axios";

class AllDogsService {
  getAllBreeds() {
    return axios.get("/breeds/list/all");
  }
  getAllImages(breed: string) {
    return axios.get(`/breed/${breed}/images`);
  }
}

export default new AllDogsService();
