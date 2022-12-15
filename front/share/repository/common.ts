export const backendApi = (url: string, uid, token) => {
  return {
    GET: () =>
      fetch(process.env.NEXT_PUBLIC_API_BASE_URL + url, {
        method: "GET",
        mode: "cors",
        redirect: "follow",
        referrerPolicy: "no-referrer",
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
