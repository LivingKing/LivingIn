import React, { useEffect, useState } from "react";
import { Popover } from "antd";
import { UserOutlined, CaretDownOutlined } from "@ant-design/icons";
import "./Header.css";
import UserInfo from "./UserInfo.js";

function Header(props) {
  // 스크롤 시 헤더 색 변경
  const [scroll, setScroll] = useState(1);
  useEffect(() => {
    document.addEventListener("scroll", () => {
      const scrollCheck = window.scrollY < 30;
      if (scrollCheck !== scroll) {
        setScroll(scrollCheck);
      }
    });
  });

  const content = <UserInfo nickname={props.nickname} token={props.token} />;

  return (
    <header className={scroll ? "header" : "header_scroll"}>
      <a className="header__mainhome" href="/">
        자취인
      </a>
      <UserOutlined className="header__person" />
      <Popover
        placement="bottomRight"
        content={content}
        trigger="hover"
        className="top"
      >
        <CaretDownOutlined className="header__info" />
      </Popover>
    </header>
  );
}

export default Header;
