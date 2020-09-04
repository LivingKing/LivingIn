import { message } from "antd";
import axios from "axios";
const Verify = async (token, token_type, props) => {
  let url;
  if (token_type === "local") url = "/auth/verify";
  else if (token_type === "google") url = "/auth/google/verify";
  else if (token_type === "kakao") url = "/auth/kakao/verify";
  const res = await axios({
    method: "POST",
    url: url,
    headers: {
      "x-access-token": token,
    },
  });

  if (res.status !== 200) {
    return message.error(
      "로그인이 필요합니다.",
      2,
      props.history.push("/login")
    );
  }
  const re_token = res.data.result.access_token;
  const { type } = res.data.result;
  if (re_token) {
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
};

export default Verify;
