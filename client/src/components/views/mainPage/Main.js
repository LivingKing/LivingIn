import React, { useEffect } from "react";
import { Button, message } from "antd";
import { withRouter } from "react-router-dom";

function MainPage(props) {
  useEffect(() => {
    if (props.history.location.state === undefined) {
      return message.error(
        "로그인이 필요합니다.",
        2,
        props.history.push("/login")
      );
    }

    const { access_token, g_access_token } = props.history.location.state;

    const check = (token) => {
      let url;
      if (token === access_token) {
        url = "/auth/token_check";
      } else if (token === g_access_token) {
        url = "/auth/google/token_check";
      }
      fetch(url, {
        method: "POST",
        headers: {
          "x-access-token": token,
        },
        body: {
          test: "test",
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
          if (re_token !== undefined) {
            props.history.replace({
              state: { access_token: res.result.access_token },
            });
          }
        });
    };
    if (access_token !== undefined) {
      check(access_token);
    } else if (g_access_token !== undefined) check(g_access_token);
  });
  return (
    <div>
      <Button type="primary">Primary Button</Button>
      <Button type="primary">Primary Button</Button>
      <Button type="primary">Primary Button</Button>
      <Button type="primary">Primary Button</Button>
      <Button type="primary">Primary Button</Button>
      <Button type="primary">Primary Button</Button>
      <Button type="primary">Primary Button</Button>
      <Button type="primary">Primary Button</Button>
      <Button type="primary">Primary Button</Button>
      <Button type="primary">Primary Button</Button>
      <Button type="primary">Primary Button</Button>
      <Button type="primary">Primary Button</Button>
      <Button type="primary">Primary Button</Button>
      <Button type="primary">Primary Button</Button>
      <Button type="primary">Primary Button</Button>
      <Button type="primary">Primary Button</Button>
      <Button type="primary">Primary Button</Button>
      <Button type="primary">Primary Button</Button>
      <Button type="primary">Primary Button</Button>
      <Button type="primary">Primary Button</Button>
    </div>
  );
}

export default withRouter(MainPage);
