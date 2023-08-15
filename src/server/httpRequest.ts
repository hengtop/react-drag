import { HttpRequest } from "heng-request";

const httpRequest = new HttpRequest({
  baseURL: "http://10.113.2.20:3003",
  timeout: 5000,
  cancleRequests: [],
});

export default httpRequest;
