import axios from "axios";
const LogOut = async (props) => {
  let result = "";
  const { access_token, g_access_token, k_access_token } = props.location.state;
  let token, url;
  if (access_token) {
    token = access_token;
    url = "/auth/logout/";
  } else if (g_access_token) {
    token = g_access_token;
    url = "auth/google/logout";
  } else if (k_access_token) {
    token = k_access_token;
    url = "auth/kakao/logout";
  }

  result = await axios.post(url, { access_token: token });
  if (result.data.success)
    props.history.replace({
      state: {},
    });
};

export default LogOut;
