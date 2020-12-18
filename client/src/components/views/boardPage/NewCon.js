import React, { useEffect, useState, useCallback } from "react";
import { message, Spin } from "antd";
import Post from "../../libs/Post/Post";
import axios from "axios";
import check from "./check.png";
import { LoadingOutlined } from "@ant-design/icons";
import parse from "html-react-parser";
import "./NewCon.css";
function NewPost() {
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [fetching, setFetching] = useState(false); // 추가 데이터를 로드하는지 아닌지를 담기위한 state
  const [sort_type, setSort_type] = useState("created_At");

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

  const fetchInstaFeeds = async () => {
    console.log(items);
    const onLoad = async () => {
      const res = await axios.get(`/posts`, {
        params: {
          length: 0,
          sort_type: sort_type,
        },
      });
      if (res.status === 200) {
        if (!res.data) {
          console.log("empty");
        } else {
          const item = [];
          console.log(res.data);
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
        }
      } else {
        message.error("불러오기 실패!");
      }
    };
    onLoad();
  };

  useEffect(() => {
    if (isLoading) {
      fetchInstaFeeds();
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

    const res = await axios.get(`/posts`, {
      params: {
        length: items.length,
        sort_type: sort_type,
      },
    });
    if (res.status === 200) {
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
    }
    // 추가 데이터 로드 끝
    setFetching(false);
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
        width: "40vw",
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

        <div id="poduct_list_area">
          <div className="title"></div>
        </div>
      </div>
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
