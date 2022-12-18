export const backendApi = (uid, token) => {
  return {
    GET: (url: string) =>
      fetch(process.env.NEXT_PUBLIC_API_BASE_URL + url, {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          uid,
          token,
        },
      })
        .then((res) => {
          return res.json();
        })
        .catch((e) => {
          console.error(e);
        }),
    POST: (url: string) =>
      fetch(process.env.NEXT_PUBLIC_API_BASE_URL + url, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          uid,
          token,
        },
      })
        .then((res) => {
          return res.json();
        })
        .catch((e) => {
          console.error(e);
        }),
  };
};
