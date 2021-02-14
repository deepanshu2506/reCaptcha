import querystring from "querystring";
export const get = (api, params = {}, headers = {}) => {
  return new Promise((resolve, reject) => {
    const allHeaders = {
      "Content-type": "application/json",
      ...headers,
      Authorization: "563492ad6f91700001000001d10ab1d2a10c4497beeac689976b1a07",
    };

    const query = querystring.stringify(params);
    const url = api + (query.length > 0 ? "?" + query : "");
    const options = {
      method: "GET",
      headers: allHeaders,
    };
    fetch(url, options)
      .then((res) => res.json())
      .then((res) => {
        resolve(res);
      })
      .catch((err) => reject(err));
  });
};
