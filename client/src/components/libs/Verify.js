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
  
  if (re_token) {
    return {access_token:re_token};
  }
};

export default Verify;
