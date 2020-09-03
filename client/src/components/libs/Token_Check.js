import { message } from "antd";
const Token_Check = (token, token_type, props) => {
  let url;
  if (token_type === "local") url = "/auth/token_check";
  else if (token_type === "google") url = "/auth/google/token_check";
  else if (token_type === "kakao") url = "/auth/kakao/token_check";
  fetch(url, {
    method: "POST",
    headers: {
      "x-access-token": token,
    },
  })
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        return message.error(
          "로그인이 필요합니다.",
          2,
          props.history.push("/login")
        );
      }
    })
    .then((res) => {
      const re_token = res.result.access_token;
      const { type } = res.result;
      if (re_token !== undefined) {
        console.log("토큰갱신");
        if (type === "local")
          props.history.replace({
            state: { access_token: re_token },
          });
        else if (type === "kakao")
          props.history.replace({
            state: { k_access_token: re_token },
          });
        else if (type === "google")
          props.history.replace({
            state: { g_access_token: re_token },
          });
      }
    });
};

export default Token_Check;
