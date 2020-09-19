import React, { useEffect, useState } from "react";
import { message, Menu, List, Card } from "antd";
import { withRouter } from "react-router-dom";
import Verify from "../../libs/Verify";
import LogOut from "../../libs/LogOut";
import "./Main.css";
import Header from "../../libs/Header/Header.js";
import ModalButton from "./Modal/ModalButton.js";

function MainPage(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState("");
  const [nickname, setNickName] = useState("");
  useEffect(() => {
    if (
      !props.history.location.state ||
      Object.keys(props.history.location.state).length === 0
    ) {
      message.error("로그인이 필요합니다.");
      return props.history.push("/login");
    }
    if (isLoading) {
      setNickName(props.history.location.state.nickname);
      setIsLoading(false);
    }
    const {
      access_token,
      g_access_token,
      k_access_token,
    } = props.history.location.state;
    if (access_token) {
      Verify(access_token, "local", props);
      setToken(access_token);
    } else if (g_access_token) {
      Verify(g_access_token, "google", props);
      setToken(g_access_token);
    } else if (k_access_token) {
      Verify(k_access_token, "kakao", props);
      setToken(k_access_token);
    }
  }, [props, isLoading]);

  // 메인 젤 위 메뉴이동
  const [now, setNow] = useState("요리");
  const handleClick = (e) => {
    console.log("click ", e);
    setNow(e.key);
  };

  const listData = [];
  for (let i = 1; i <= 100; i++) {
    listData.push({
      href: "link",
      title: `${i}번째 게시글`,
      avatar: "src",
      description: "description",
      content: "content",
    });
  }

  return (
    <div className="main_page">
      {/* header */}
      {isLoading ? <></> : <Header token={token} nickname={nickname} />}

      {/* navigation */}
      <section className="main">
        <nav>
          <Menu
            onClick={handleClick}
            selectedKeys={[now]}
            mode="horizontal"
            className="centerStyle"
          >
            <Menu.Item key="요리" className="content_title">
              <b>요리</b>
            </Menu.Item>
            <Menu.Item key="가전" className="content_title">
              <b>가전</b>
            </Menu.Item>
            <Menu.Item key="생활" className="content_title">
              <b>생활</b>
            </Menu.Item>
            <Menu.Item key="욕실" className="content_title">
              <b>욕실</b>
            </Menu.Item>
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
          </Menu>
          <div>
            <br />
            <List
              className="bb"
              pagination={{
                onChange: (page) => {
                  console.log(page);
                },
                pageSize: 4,
                showSizeChanger: false,
                simple: true,
                position: "bottom",
              }}
              grid={{ gutter: 16, column: 4 }}
              dataSource={listData}
              renderItem={(item) => (
                <List.Item className="aa">
                  <Card title={item.title}>
                    {now}
                    <br />
                    <br />
                    <br />
                    <br />
                  </Card>
                </List.Item>
              )}
              // footer={
              //     <div>
              //         <b>inje university</b> computer engineering
              //     </div>
              // }
            />
          </div>
        </nav>
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
              <ModalButton />
            </header>
          </div>
        </article>

        <div className="box2"></div>
        <div className="box2"></div>

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
      <footer>
        <div className="box">
          <h1>footer</h1>
        </div>
      </footer>
    </div>
  );
}

export default withRouter(MainPage);
