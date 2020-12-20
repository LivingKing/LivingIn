import React, { useEffect, useState, useCallback } from "react";
import { message, Spin, Typography } from "antd";
import Post from "../../libs/Post/Post";
import axios from "axios";
import check from "./check.png";
import { LoadingOutlined } from "@ant-design/icons";
import qs from "querystring";
import "./NewCon.css";
const { Title } = Typography;

function NewPost() {
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [favItems, setFavItems] = useState([]);
  const [fetching, setFetching] = useState(false); // 추가 데이터를 로드하는지 아닌지를 담기위한 state
  const [sort_type, setSort_type] = useState("created_At");
  const [favCategory, setFavCategory] = useState("");
  const getUserInfo = async () => {
    const { access_token, token_type } = JSON.parse(
      sessionStorage.getItem("token_info")
    );
    const result = await axios.get("/api/userinfo", {
      params: {
        access_token: access_token,
        type: token_type,
      },
    });
    return result.data.user;
  };
  // 스크롤 이벤트 핸들러
  const handleScroll = useCallback(() => {
    // if (items.length === props.board.length - 1) {
    //   if (!isLoadAll) {
    //     setIsLoadAll(true);
    //   }
    // }
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;
    if (
      scrollTop + clientHeight === scrollHeight &&
      fetching === false
      // &&!isLoadAll
    ) {
      // 페이지 끝에 도달하면 추가 데이터를 받아온다
      if (!fetching) fetchMoreInstaFeeds();
    }
  });

  const fetchInstaFeeds = async (favorite_category) => {
    const onLoad = async () => {
      let res;
      if (
        window.location.search !== "" &&
        qs.parse(window.location.search).length !== 0
      ) {
        const search_type = Object.keys(qs.parse(window.location.search))[0];
        const search_word = Object.values(qs.parse(window.location.search))[0];
        if (favorite_category !== "") {
          res = await axios.get(
            `/search/posts${search_type}=${search_word}&&fav=${favorite_category}&&sort_type=${sort_type}`
          );
        } else
          res = await axios.get(`/search/posts${search_type}=${search_word}`);
      } else {
        res = await axios.get(`/posts`, {
          params: {
            length: 0,
            sort_type: sort_type,
          },
        });
      }
      if (res.status === 200) {
        if (!res.data) {
          console.log("empty");
        } else {
          const items = [];
          console.log(res.data);
          for (let i = 0; i < res.data.length; i++) {
            items.push({
              id: res.data[i]._id,
              title: res.data[i].title,
              category: res.data[i].category,
              views: res.data[i].hits,
              likes: res.data[i].likes.length,
              liked: res.data[i].liked,
              hashtags: res.data[i].hash_Tags,
              thumbnail: res.data[i].thumbnail,
            });
          }
          if (
            window.location.search !== "" &&
            qs.parse(window.location.search).length !== 0 &&
            favorite_category
          ) {
            console.log("123213");
            setFavItems(items);
          } else {
            console.log("4545");
            setItems(items);
          }
        }
      } else {
        message.error("불러오기 실패!");
      }
    };
    onLoad();
  };

  useEffect(() => {
    if (isLoading) {
      const getUser = async () => {
        const user = await getUserInfo();
        setFavCategory(user.favorite_category);
        fetchInstaFeeds(user.favorite_category);
      };
      getUser();

      setIsLoading(false);
    }
    window.addEventListener("scroll", handleScroll());
    return () => {
      // scroll event listener 해제
      window.removeEventListener("scroll", handleScroll());
    };
  }, [isLoading, handleScroll, items, fetchInstaFeeds]);

  const fetchMoreInstaFeeds = async () => {
    // 추가 데이터를 로드하는 상태로 전환
    setFetching(true);
    let res;
    if (
      window.location.search !== "" &&
      qs.parse(window.location.search).length !== 0
    ) {
      const search_type = Object.keys(qs.parse(window.location.search))[0];
      const search_word = Object.values(qs.parse(window.location.search))[0];
      res = await axios.get(
        `/search/posts${search_type}=${search_word}&&length=${items.length}&&sort_type=${sort_type}`
      );
    } else {
      res = await axios.get(`/posts`, {
        params: {
          length: items.length,
          sort_type: sort_type,
        },
      });
    }
    if (res.status === 200) {
      if (res.data.length !== 0) {
        let item = [...items];
        for (let i = 0; i < res.data.length; i++) {
          item.push({
            id: res.data[i]._id,
            title: res.data[i].title,
            category: res.data[i].category,
            views: res.data[i].hits,
            likes: res.data[i].likes.length,
            liked: res.data[i].liked,
            hashtags: res.data[i].hash_Tags,
            thumbnail: res.data[i].thumbnail,
          });
        }
        setItems(item);
        // 추가 데이터 로드 끝
        setFetching(false);
      }
    }
  };

  useEffect(() => {
    // scroll event listener 등록
    window.addEventListener("scroll", handleScroll);
    return () => {
      // scroll event listener 해제
      window.removeEventListener("scroll", handleScroll);
    };
  });

  return (
    <div
      style={{
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="list_wrap">
        <div className="top_sort">
          <div className="btn_wrap">
            <button
              style={{ outline: "0 none" }}
              type="button"
              data-sort="DISTANCE"
              className="btn_new"
              onClick={() => {
                setSort_type("created_At");
                setItems([]);
                setIsLoading(true);
              }}
            >
              {sort_type === "created_At" ? (
                <img
                  src={check}
                  alt="check"
                  width="22"
                  height="22"
                  className="check_image"
                />
              ) : (
                <></>
              )}

              <span>
                <b>최신 순</b>
              </span>
            </button>
            <button
              style={{ outline: "0 none" }}
              type="button"
              data-sort="LOWPRICE"
              className="btn_view"
              onClick={() => {
                setSort_type("hits");
                setItems([]);
                setIsLoading(true);
              }}
            >
              {sort_type === "hits" ? (
                <img
                  src={check}
                  alt="check"
                  width="22"
                  height="22"
                  className="check_image"
                />
              ) : (
                <></>
              )}
              <span>
                <b>조회수 순</b>
              </span>
            </button>
            <button
              style={{ outline: "0 none" }}
              type="button"
              data-sort="HIGHPRICE"
              className="btn_likes"
              onClick={() => {
                setSort_type("likes");
                setItems([]);
                setIsLoading(true);
              }}
            >
              {sort_type === "likes" ? (
                <img
                  src={check}
                  alt="check"
                  width="22"
                  height="22"
                  className="check_image"
                />
              ) : (
                <></>
              )}
              <span>
                <b>좋아요 순</b>
              </span>
            </button>
          </div>
        </div>
      </div>
      {Object.keys(qs.parse(window.location.search)).length !== 0 &&
      favCategory ? (
        <>
          <div>
            <br></br>
            <Title level={3}>선호 카테고리 기반 추천 게시물</Title>
          </div>
          <div className="Scrollbar">
            {favItems.map((i, index) => (
              <Post
                key={"fav" + favItems[index].id}
                id={favItems[index].id}
                title={favItems[index].title}
                category={favItems[index].category}
                views={favItems[index].views}
                likes={favItems[index].likes}
                liked={favItems[index].liked}
                comments={favItems[index].comments}
                content={favItems[index].content}
                hashtags={favItems[index].hashtags}
                thumbnail={favItems[index].thumbnail}
              />
            ))}
          </div>
        </>
      ) : (
        <></>
      )}
      {Object.keys(qs.parse(window.location.search)).length !== 0 ? (
        <div>
          <br></br>
          <Title level={3}>검색 결과</Title>
        </div>
      ) : (
        <></>
      )}
      <div className="Scrollbar">
        {isLoading ? (
          <Spin
            indicator={<LoadingOutlined style={{ fontSize: 100 }} spin />}
          />
        ) : (
          items.map((i, index) => (
            <Post
              key={items[index].id}
              id={items[index].id}
              title={items[index].title}
              category={items[index].category}
              views={items[index].views}
              likes={items[index].likes}
              liked={items[index].liked}
              comments={items[index].comments}
              content={items[index].content}
              hashtags={items[index].hashtags}
              thumbnail={items[index].thumbnail}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default NewPost;
