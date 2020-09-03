import React, { useEffect, useState } from "react";
import { Button, message } from "antd";
import { withRouter } from "react-router-dom";
import Token_Check from "../../libs/Token_Check";
import LogOut from "../../libs/LogOut";

function MainPage(props) {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const {
      access_token,
      g_access_token,
      k_access_token,
    } = props.history.location.state;
    if (!access_token && !g_access_token && !k_access_token) {
      message.error("로그인이 필요합니다.");
      props.history.push("/login");
    }
    if (access_token) {
      Token_Check(access_token, "local", props);
    } else if (g_access_token) {
      Token_Check(g_access_token, "google", props);
    } else if (k_access_token) {
      Token_Check(k_access_token, "kakao", props);
    }
    if (isLoading) setIsLoading(false);
  }, [props, isLoading]);

  return (
    <section className="container">
      {isLoading ? (
        <div></div>
      ) : (
        <div>
          <Button
            onClick={() => {
              LogOut(props);
            }}
          >
            로그아웃
          </Button>
        </div>
      )}
    </section>
  );
}

export default withRouter(MainPage);
