import React, { useEffect } from "react";
import { Button, message } from "antd";
import { withRouter } from "react-router-dom";
import Token_Check from "../../libs/Token_Check";

function MainPage(props) {
  useEffect(() => {
    if (props.history.location.state === undefined) {
      return message.error(
        "로그인이 필요합니다.",
        2,
        props.history.push("/login")
      );
    }

    const {
      access_token,
      g_access_token,
      k_access_token,
    } = props.history.location.state;
    console.log("현재토큰", k_access_token);
    if (access_token !== undefined) {
      Token_Check(access_token, "local", props);
    } else if (g_access_token !== undefined)
      Token_Check(g_access_token, "google", props);
    else if (k_access_token !== undefined)
      Token_Check(k_access_token, "kakao", props);
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
