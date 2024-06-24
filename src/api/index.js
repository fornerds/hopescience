// api/index.js
import axios from "axios";

const send = async ({
  method = "",
  path = "",
  data = {},
  access_token = "",
  headers = {},
} = {}) => {
  const commonUrl = process.env.REACT_APP_API_URL; // 수정된 부분
  const url = commonUrl + path;

  const defaultHeaders = {
    "content-type": "application/json;charset=UTF-8",
    accept: "application/json",
    Authorization: `Bearer ${access_token}`,
  };

  const mergedHeaders = {
    ...defaultHeaders,
    ...headers,
  };

  const options = {
    method,
    url,
    headers: mergedHeaders,
    data,
    withCredentials: true,
  };

  try {
    const response = await axios(options);
    return response.data;
  } catch (error) {
    console.error("API Error:", error.response || error.message);
    throw error;
  }
};

const getApi = ({ path = "", access_token = "" } = {}) =>
  send({ method: "GET", path, access_token });
const putApi = ({ path = "", data = {}, access_token = "" } = {}) =>
  send({ method: "PUT", path, data, access_token });
const patchApi = ({ path = "", data = {}, access_token = "" } = {}) =>
  send({ method: "PATCH", path, data, access_token });
const postApi = ({ path = "", data = {}, access_token = "" } = {}) =>
  send({ method: "POST", path, data, access_token });
const deleteApi = ({ path = "", data = {}, access_token = "" } = {}) =>
  send({ method: "DELETE", path, data, access_token });

export { getApi, putApi, postApi, patchApi, deleteApi };
