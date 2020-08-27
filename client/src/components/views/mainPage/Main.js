import React, { useEffect } from "react";
import { Button, message } from "antd";
import { withRouter } from "react-router-dom";

function MainPage(props) {
  useEffect(() => {
    fetch("/auth/token_check", {
      method: "POST",
    }).then((res) => {
      if (res.status !== 200) {
        return message.error(
          "로그인이 필요합니다.",
          2,
          props.history.push("/login")
        );
      } else {
        return;
      }
    });
  });
  return (
    <div>
      <Button type="primary">Primary Button</Button>
    </div>
  );
}

export default withRouter(MainPage);
