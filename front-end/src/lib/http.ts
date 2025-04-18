import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosRequestHeaders,
  AxiosResponse,
} from "axios";
import apiConfig from "../config/api";

interface MyAxiosRequestConfig extends Omit<AxiosRequestConfig, "headers"> {
  headers?: any;
}

const createBaseHttpRequest = (
  baseURL: string,
  headers?: AxiosRequestHeaders
): AxiosInstance =>
  axios.create({
    baseURL,
    ...apiConfig.commonConfig,
    ...(headers || {}),
  });

type HTTPRequestLogger<T> = {
  path: string;
  method: string;
  body?: T;
};

export type HttpMethod = {
  getHttpRequest: <T>(
    path: string,
    additionalConfig?: MyAxiosRequestConfig
  ) => Promise<T>;
  postHttpRequest: <T>(
    path: string,
    body: object,
    additionalConfig?: MyAxiosRequestConfig
  ) => Promise<T>;
  putHttpRequest: <T>(
    path: string,
    body: object,
    additionalConfig?: MyAxiosRequestConfig
  ) => Promise<T>;
  deleteHttpRequest: <T>(
    path: string,
    additionalConfig?: MyAxiosRequestConfig
  ) => Promise<T>;
  rawtHttpRequest: () => AxiosInstance;
};

const httpRequestLogger = ({
  path,
  method,
  body,
}: HTTPRequestLogger<object>) => {
  if (apiConfig.debug) {
    console.log(`[HTTP REQUEST][${method}]`, path, body || "");
  }
};

function responseLogger(response: AxiosResponse) {
  if (apiConfig.debug) {
    console.log(
      `[HTTP RESPONSE][${response.config.method}] ${response.config.url}`,
      response.data
    );
  }
  return response;
}

export const wrapTokenAsHeader = (token: string) => ({
  Authorization: `Bearer ${token}`,
});

export default (
  baseURL = apiConfig.service.main as string,
  headers?: AxiosRequestHeaders
): HttpMethod => ({
  /**
   * GET HTTP Request
   */
  getHttpRequest: <T>(
    path: string,
    additionalConfig?: MyAxiosRequestConfig
  ): Promise<T> => {
    httpRequestLogger({ path, method: "GET" });
    return createBaseHttpRequest(baseURL, headers)
      .get(path, additionalConfig)
      .then(responseLogger)
      .then((response) => response.data);
  },
  /**
   * POST HTTP Request
   */
  postHttpRequest: <T>(
    path: string,
    body: object,
    additionalConfig: MyAxiosRequestConfig = {}
  ): Promise<T> => {
    httpRequestLogger({ path, body, method: "POST" });
    return createBaseHttpRequest(baseURL, headers)
      .post(path, body, additionalConfig)
      .then(responseLogger)
      .then((response) => response.data);
  },
  /**
   * PUT HTTP Request
   */
  putHttpRequest: <T>(
    path: string,
    body: object,
    additionalConfig: MyAxiosRequestConfig = {}
  ): Promise<T> => {
    httpRequestLogger({ path, body, method: "PUT" });
    return createBaseHttpRequest(baseURL, headers)
      .put(path, body, additionalConfig)
      .then(responseLogger)
      .then((response) => response.data);
  },
  /**
   * DELETE HTTP Request
   */
  deleteHttpRequest: <T>(
    path: string,
    additionalConfig: MyAxiosRequestConfig = {}
  ): Promise<T> => {
    httpRequestLogger({ path, method: "DELETE" });
    return createBaseHttpRequest(baseURL, headers)
      .delete(path, additionalConfig)
      .then(responseLogger)
      .then((response) => response.data);
  },
  /**
   * Any HTTP Request
   */
  rawtHttpRequest: (): AxiosInstance => createBaseHttpRequest(baseURL, headers),
});
