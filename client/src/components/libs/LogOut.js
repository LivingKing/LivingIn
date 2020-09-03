import axios from "axios";
const LogOut = async (props) => {
  let result = "";
  const { access_token, g_access_token, k_access_token } = props.location.state;
  if (access_token) {
    result = await axios.post("/auth/logout/", { access_token: access_token });
    if (result.data.success)
      props.history.replace({
        state: { access_token: "" },
      });
  } else if (g_access_token) {
    result = await axios.post("auth/google/logout", {
      access_token: g_access_token,
    });
    if (result.data.success)
      props.history.replace({
        state: { g_access_token: "" },
      });
  } else if (k_access_token) {
    result = await axios.post("/auth/kakao/logout", {
      access_token: k_access_token,
    });
    if (result.data.success)
      props.history.replace({
        state: { k_access_token: "" },
      });
  }
};

export default LogOut;
