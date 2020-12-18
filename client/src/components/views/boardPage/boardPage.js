import React, { useEffect } from "react";
import Menu from "./Menu";
import { BackTop, message } from "antd";
import Header from "../../libs/Header/Header";
import "./boardPage.css";
import NewCon from "./NewCon.js";
import Verify from "../../libs/Verify";

const BoardPage = (props) => {
  const scrollTop = document.documentElement.scrollTop;
  const clientHeight = document.documentElement.clientHeight;
  useEffect(() => {
    if (!sessionStorage.isLogin) {
      message.error("로그인이 필요합니다.");
      return props.history.push("/login");
    } else {
      const res = Verify(
        JSON.parse(sessionStorage.getItem("token_info")).access_token,
        JSON.parse(sessionStorage.getItem("token_info")).token_type,
        props
      );
      res.then((result) => {
        if (result !== undefined) {
          try {
            const token_type = JSON.parse(sessionStorage.getItem("token_info"))
              .token_type;
            sessionStorage.removeItem("token_info");
            sessionStorage.setItem(
              "token_info",
              JSON.stringify({
                token_type: token_type,
                access_token: result.access_token,
              })
            );
          } catch {}
        }
      });
    }
  });
  return (
    <div>
      <Header />
      <div className="back">
        <div className="sub_top">
          <h2>전체</h2>
          <div className="area">
            <div className="btn_area">전체</div>
          </div>
        </div>
      </div>

      <div className="content22">
        {/* <div class="filter_wrap">
            <Menu />
          </div> */}
        <BackTop />

        {/* <Sider><Menu/></Sider> */}
        <NewCon />
      </div>
    </div>
  );
};

export default BoardPage;
