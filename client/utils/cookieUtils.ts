export const getAccessTokenInCookie = () => {
  const cookies = document?.cookie?.split(";");
  let access_token: string | undefined;
  if (cookies) {
    cookies.forEach((i) => {
      if (i.includes("authorization")) {
        access_token = i.split("=")[1];
      }
    });
  }
  return access_token;
};
