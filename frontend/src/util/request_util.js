import axios from "axios";
import EnumUtil from "util/enum_util";
import NavUtil from "util/nav_util";
import StorageUtil from "util/storage_util";
import { PROTOCOL, DOMAIN, API_PREFIX } from "src/consts";

export const REQUEST_STATUS = {
    WAITING: 0,
    SUCCESS: 1,
    ERROR: 2
};

export default class RequestUtil {
    /**
     * responseIntercept.
     *
     * @returns {void}
     */
    static responseIntercept() {
        axios.defaults.withCredentials = false;
        axios.defaults.xsrfHeaderName = "X-CSRFToken";
        axios.defaults.xsrfCookieName = "csrftoken";
    }

    /**
     * Prepare JSON payload for HTTP request
     * @param {Object} data
     * @returns {Object}
     */
    static getJsonPayload(data) {
        return {
            data: data,
            "Content-Type": "application/json"
        };
    }

    /**
     * Prepare FormData payload for HTTP request
     * @param {Object} data
     * @returns {Object}
     */
    static getFormDataPayload(data) {
        const formData = new FormData();
        for (const key in data) {
            const value = data[key];
            formData.set(key, value);
        }
        return {
            data: formData,
            "Content-Type": ""
        };
    }

    /**
     * Check if any key of a map contains file
     * @param {Object} data
     * @returns {boolean}
     */
    static fileInObject(data) {
        return !!Object.values(data).filter((item) => item instanceof Blob).length;
    }

    /**
     * Prepare payload for axios, if method is not POST or PUT
     *  Append it to a map with params key
     * @param {string} method
     * @param {Object} data
     * @returns {Object}
     */
    static convertParams(method, data) {
        if (["post", "put"].includes(method.toLowerCase())) return data;
        return { params: data };
    }

    /**
     * Make a HTTP request using Axios, do not check for refreshing token
     * @param {string} url
     * @param {Object} params
     * @param {string} method - method: get, post, put, delete
     * @returns {Promise} Axios response promise
     */
    static async request(url, params = {}, method = "get", blobResponseType = false) {
        const { data, "Content-Type": contentType } = RequestUtil.fileInObject(params)
            ? RequestUtil.getFormDataPayload(params)
            : RequestUtil.getJsonPayload(params);
        const token = StorageUtil.getToken();
        const config = {
            method,
            baseURL: RequestUtil.getApiBaseUrl(),
            url,
            headers: {
                Authorization: token ? `JWT ${token}` : undefined,
                "Content-Type": contentType,
                "Accept-Language": StorageUtil.getStorageStr("locale")
            }
        };
        if (blobResponseType) {
            config.responseType = "blob";
        }
        if (
            !EnumUtil.isEmptyObj(params) &&
            ["get", "delete"].includes(method.toLowerCase())
        ) {
            const query = new URLSearchParams(params).toString();
            config.url = [config.url, query].join("?");
        } else {
            config.data = RequestUtil.convertParams(method, data);
        }
        return await axios(config);
    }

    /**
     * Make a HTTP request using Axios, checking for refreshing token also
     * @param {string} url
     * @param {Object} params
     * @param {string} method - method: get, post, put, delete
     * @returns {Promise} Axios response promise
     */
    static async apiCall(url, params = {}, method = "get", blobResponseType = false) {
        try {
            const result = await RequestUtil.request(
                url,
                params,
                method,
                blobResponseType
            );
            return result.data;
        } catch (err) {
            if (err.response.status === 401) {
                const refreshUrl = "auth/common-auth/refresh-token/";
                const checkUrl = "auth/common-auth/refresh-check/";
                try {
                    const refreshTokenResponse = await RequestUtil.request(
                        refreshUrl,
                        { access_token: StorageUtil.getToken() },
                        "post"
                    );
                    const token = refreshTokenResponse.data.access_token;
                    StorageUtil.setToken(token);

                    try {
                        const result = await RequestUtil.request(url, params, method);
                        return result.data;
                    } catch (err) {
                        if (err.response.status === 401) {
                            // Logout
                            NavUtil.cleanAndMoveToLoginPage();
                            return Promise.reject({ status_code: err.response.status });
                        }
                        // Return error
                        const errResponse = err.response.data || {};
                        errResponse.status_code = err.response.status;
                        return Promise.reject(errResponse);
                    }
                } catch (err) {
                    RequestUtil.request(checkUrl).catch((err) => {
                        // Logout
                        NavUtil.cleanAndMoveToLoginPage();
                        return Promise.reject({ status_code: err.response.status });
                    });
                }
            }
            // Return error
            const errResponse = err.response.data || {};
            errResponse.status_code = err.response.status;
            return Promise.reject(errResponse);
        }
    }

    /**
     * setFormErrors.
     *
     * @param {Dict} errors
     * @returns {FormikErrorDict}
     */
    static setFormErrors(errors) {
        return Object.entries(errors)
            .map(([key, value]) => [key, RequestUtil.errorFormat(value)])
            .filter((item) => !!item[1].length)
            .reduce((result, [key, value]) => {
                result[key] = value;
                return result;
            }, {});
    }

    /**
     * errorFormat.
     *
     * @param {string | number | Dict | string[]} input
     * @returns {string[]}
     */
    static errorFormat(input) {
        if (!input) return [];
        if (typeof input === "string") return [input];
        if (Array.isArray(input))
            return input.filter((item) => item).map((item) => item.toString());
        return [];
    }

    /**
     * getApiBaseUrl.
     *
     * @returns {string}
     */
    static getApiBaseUrl() {
        return PROTOCOL + DOMAIN + API_PREFIX;
    }

    /**
     * prefixMapValues.
     *
     * @param {Object} input
     * @param {string} input.prefix
     * @param {Object} input.endpoints
     * @returns {Object}
     */
    static prefixMapValues({ prefix, endpoints }) {
        const result = {};
        for (const key in endpoints) {
            const value = endpoints[key];
            result[key] = [prefix, value].join("/");
            if (result[key][result[key].length - 1] !== "/") {
                result[key] += "/";
            }
        }
        return result;
    }

    /**
     * handleDownload.
     *
     * @param {Object} data
     * @param {string} filename
     * @returns {Object}
     */
    static handleDownload(data, filename) {
        const url = window.URL.createObjectURL(new Blob([data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
    }
}
