import React, { useEffect } from "react";
import { Spin, message } from "antd";

function Login_Callback(props) {
  useEffect(() => {
    let params = props.history.location.search.split("=");
    params = params[1].split("&");
    const code = { code: params[0] };
    fetch("/auth/google/callback", {
      method: "POST",
      body: JSON.stringify(code),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        if (res.message === "logged in successfully") {
          message.info(res.nickname + "님 반갑습니다!", 1);
          return props.history.push({
            pathname: "/",
            state: { g_access_token: res.access_token },
          });
        }
      });
  });
  return (
    <div>
      <Spin size="large" />
      로그인 중입니다...
    </div>
  );
}

export default Login_Callback;
