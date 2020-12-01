import React, { useEffect } from "react";
import Menu from "./Menu";
import { BackTop } from "antd";
import Header from "../../libs/Header/Header";
import "./boardPage.css";
import NewCon from "./NewCon.js";

const BoardPage = (props) => {
  const scrollTop = document.documentElement.scrollTop;
  const clientHeight = document.documentElement.clientHeight;

  return (
    <div>
      <Header />
      <div className="back">
        <div class="sub_top">
          <h2>전체</h2>
          <div class="area">
            <div class="btn_area">전체</div>
          </div>
          {/* <h2>요리</h2>
          <div class="area">
            <div class="btn_area"><span>백주부</span>한식</div>
          </div> */}
        </div>
      </div>

      <div className="content22">
        <div class="contents22">
          <div class="filter_wrap">
            <Menu />
          </div>

          <div style={{ height: scrollTop + clientHeight, padding: 8 }}>
            <BackTop />
          </div>
        </div>
      </div>

      {/* <Sider><Menu/></Sider> */}
      <NewCon />
    </div>
  );
};

export default BoardPage;
