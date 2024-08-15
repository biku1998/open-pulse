import axios from "axios";
import { envVariables } from "../config";

export const api = axios.create({
  baseURL: envVariables.API_BASE_ENDPOINT,
});
