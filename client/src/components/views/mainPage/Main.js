import React, { useEffect, useState } from "react";
import { message, Menu } from "antd";
import { withRouter } from "react-router-dom";
import Verify from "../../libs/Verify";
import "./Main.css";
import ModalButton from "./Modal/ModalButton.js";
import NewPost from "./Post/NewPost";
import { PlusOutlined } from "@ant-design/icons";
import CategoryPost from "./Post/CategoryPost";
import Header from "../../libs/Header/Header";
import Footer from "../../libs/Footer/Footer";
import LogOut from "../../libs/LogOut";

function MainPage(props) {
  const [isLoading, setIsLoading] = useState(true);
  sessionStorage.cat = "";
  useEffect(() => {
    if (isLoading) {
      setIsLoading(false);
    }
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
  }, [isLoading, props]);

  // 메인 젤 위 메뉴이동
  const [now, setNow] = useState("요리");
  const handleClick = (e) => {
    console.log("click ", e);
    setNow(e.key);
    sessionStorage.cat = now;
    console.log(sessionStorage.cat);
  };

  return (
    <div className="main_page">
      {/* header */}
      <Header {...props} />

      {/* navigation */}
      <section className="main">
        <article>
          <h2 className="blind">최신 팁</h2>
          <div className="tip">
            <header className="underline2">
              {isLoading ? (
                <div></div>
              ) : (
                <div>
                  <a
                    className="logout"
                    onClick={() => {
                      LogOut(props);
                    }}
                  >
                    로그아웃
                  </a>
                </div>
              )}
              <Menu
                onClick={handleClick}
                selectedKeys={[now]}
                mode="horizontal"
              >
                {now === "요리" ? (
                  <Menu.Item key="요리" className="content_title_select">
                    <b>요리</b>
                  </Menu.Item>
                ) : (
                  <Menu.Item key="요리" className="content_title">
                    <b>요리</b>
                  </Menu.Item>
                )}

                {now === "가전" ? (
                  <Menu.Item key="가전" className="content_title_select">
                    <b>가전</b>
                  </Menu.Item>
                ) : (
                  <Menu.Item key="가전" className="content_title">
                    <b>가전</b>
                  </Menu.Item>
                )}

                {now === "생활" ? (
                  <Menu.Item key="생활" className="content_title_select">
                    <b>생활</b>
                  </Menu.Item>
                ) : (
                  <Menu.Item key="생활" className="content_title">
                    <b>생활</b>
                  </Menu.Item>
                )}

                {now === "욕실" ? (
                  <Menu.Item key="욕실" className="content_title_select">
                    <b>욕실</b>
                  </Menu.Item>
                ) : (
                  <Menu.Item key="욕실" className="content_title">
                    <b>욕실</b>
                  </Menu.Item>
                )}
              </Menu>
            </header>

            <div className="margin"></div>
            {isLoading ? <></> : <CategoryPost category={now} />}
          </div>
        </article>

        <br />
      </section>

      {/* main */}
      <section className="main">
        <article>
          <h2 className="blind">최신 팁</h2>
          <div className="tip">
            <header className="underline">
              <h3 className="art_title">
                <a href="/">NEW TIP</a>
              </h3>
              <a href="/board" className="modal">
                <PlusOutlined /> 더보기
              </a>
            </header>
            <div className="margin"></div>
            {/* <Divider orientation="left">Small Size</Divider> */}
            {isLoading ? <></> : <NewPost />}
            <div className="margin">[최신 글 다섯개만 출력]</div>
          </div>
        </article>

        <div className="box2"></div>
        {/* <div className="box2"></div> */}

        <article>
          <h2 className="blind">최신 팁</h2>
          <div className="tip">
            <header className="underline">
              <h3 className="art_title">
                <a href="/">HOT TIP</a>
              </h3>
              <ModalButton />
            </header>
          </div>
        </article>

        <div className="box2"></div>
      </section>

      <div className="box2"></div>
      <div className="box2"></div>
      <div className="box2"></div>
      <div className="box2"></div>
      <div className="box2"></div>
      <div className="box2"></div>

      {/* footer */}
      <Footer />
    </div>
  );
}

export default withRouter(MainPage);
