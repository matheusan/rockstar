import Axios from 'axios';
import qs from 'qs';

export default class APIClient {
  axios;

  constructor(baseURL = '') {
    if (!baseURL) {
      throw Error(
        'An API URL must be passed in order to create a client instance',
      );
    }

    this.createInstance(baseURL);
    this.registerInterceptors();
  }

  createInstance(baseURL) {
    this.axios = Axios.create({
      baseURL,
      headers: {
        'Api-Key': 'application/json; charset=utf-8',
        'Accept-Language': 'en-us',
      },
      paramsSerializer: params =>
        qs.stringify(params, { arrayFormat: 'repeat' }),
    });
  }

  registerInterceptors() {
    this.axios.interceptors.request.use(
      (config: AxiosRequestConfig) =>
        Object.assign(config, {
          params: {
            ...config.params,
            api_key: process.env.REACT_APP_API_KEY,
          },
          headers: {
            Accept: '*'
          }
        }),
      error => error,
    );

    this.axios.interceptors.response.use(
      response => response.data,
    );
  }

  get(url, config = {}) {
    return this.axios.get(url, config);
  }
}
