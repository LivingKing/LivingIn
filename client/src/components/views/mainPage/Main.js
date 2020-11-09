import React, { useEffect, useState } from "react";
import { message, Menu, List, Card, Layout } from "antd";
import { withRouter } from "react-router-dom";
import Verify from "../../libs/Verify";
import LogOut from "../../libs/LogOut";
import "./Main.css";
import Header from "../../libs/Header/Header.js";
import ModalButton from "./Modal/ModalButton.js";
import Content from "../../libs/Content/Content";

function MainPage(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [tokeninfo, setTokenInfo] = useState([]);
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
      setTokenInfo({ access_token: access_token, type: "local" });
    } else if (g_access_token) {
      Verify(g_access_token, "google", props);
      setTokenInfo({ access_token: g_access_token, type: "google" });
    } else if (k_access_token) {
      Verify(k_access_token, "kakao", props);
      setTokenInfo({ access_token: k_access_token, type: "kakao" });
    }
  }, [props, isLoading, setTokenInfo]);

  // 메인 젤 위 메뉴이동
  const [now, setNow] = useState("요리");
  const handleClick = (e) => {
    console.log("click ", e);
    setNow(e.key);
  };

  const listData = [];
  listData.push({
    href: "link",
    title: `1번째 게시글`,
    avatar: "src",
    description: "description",
    content:          
    <Content
      id={1}
      title={"진라면 맛있게 끓이는 법"}
      category={"요리"}
      views={50}
      likes={50}
      liked={false}
      comments={30}
      hashtags={["음식", "만두라면", "해시태그3"]}
      content={"진라면 끓이는 방법 ㅎㅎ"}
      Image = {"jin"}
    />
  });
  listData.push({
    href: "link",
    title: `2번째 게시글`,
    avatar: "src",
    description: "description",
    content:          
    <Content
      id={1}
      title={"삼양라면을 맛있게 끓여보장"}
      category={"요리"}
      views={30}
      likes={10}
      liked={false}
      comments={79}
      hashtags={["라면", "삼양라면", "해시태그3"]}
      content={"삼양라면 끓이는 방법 ㅎㅎㅎ1. 물을넣는다. 2. 스프넣는다. 3. 면을넣는다 4. 보글보글 지글지글 자글자글"}
      Image = {"ansung"}
    />
  });
  listData.push({
    href: "link",
    title: `3번째 게시글`,
    avatar: "src",
    description: "description",
    content:          
    <Content
      id={1}
      title={"신라면을 맛있게 끓여보장"}
      category={"요리"}
      views={49}
      likes={78}
      liked={false}
      comments={21}
      hashtags={["신라면", "요리킹조리킹", "해시태그3"]}
      content={"신라면은 요리킹 조리킹 이리저리 킹킹 끓이면 됩니당."}
      Image = {"shin"}
    />
  });
  listData.push({
    href: "link",
    title: `4번째 게시글`,
    avatar: "src",
    description: "description",
    content:          
    <Content
      id={1}
      title={"라면 또 뭐있냐"}
      category={"요리"}
      views={99}
      likes={5}
      liked={false}
      comments={13}
      hashtags={["라면", "이제생각안남", "해시태그3"]}
      content={"그냥 라면 끓이는 법. 냄비에 라면 넣고 팔팔 !"}
      Image = {"ramen"}
    />
  });

  for (let i = 1; i <= 100; i++) {
   listData.push({
      href: "link",
      title: `${i}번째 게시글`,
      avatar: "src",
      description: "description",
      content:          
      <Content
        id={1}
        title={"진라면 맛있게 끓이는 법"}
        category={"요리"}
        views={50}
        likes={50}
        liked={false}
        comments={30}
        hashtags={["해시태그1", "해시태그2", "해시태그3"]}
        Image = {"./ramen.jpg"}
      />
    });
  }

  return (
    <div className="main_page">
      {/* header */}
      {isLoading ? <></> : <Header tokeninfo={tokeninfo} nickname={nickname} history={props.history} />}

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
                    localStorage.clear();
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
                    {item.content}
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