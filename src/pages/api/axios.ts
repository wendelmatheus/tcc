import axios from "axios";
import { parseCookies } from "nookies";

export function getAPIClient(ctx?: any) {
  const { "sitededenuncias.token": token } = parseCookies(ctx);

  const api = axios.create({
    //baseURL: "http://localhost:3000",
    baseURL: "https://petdenuncie.vercel.app/"
  });

  api.interceptors.request.use((config) => {
    console.log(config);

    return config;
  });

  if (token) {
    api.defaults.headers["Authorization"] = `Bearer ${token}`;
  }

  return api;
}