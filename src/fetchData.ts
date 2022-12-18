export const fetchData = <T>(url: string): Promise<T> => {
  return fetch(url)
  .then((res) => {
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    return res.json();
  }).then((json: T) => {
    return json;
  })
  .catch((error: string) => {
    return Promise.reject(error);
  })
}
