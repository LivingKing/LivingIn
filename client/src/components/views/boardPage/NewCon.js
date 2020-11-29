import React, { useEffect, useState, useCallback } from "react";
import { message, List } from "antd";
import Post from "../../libs/Post/Post";
import axios from "axios";

function NewPost(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [isLoadAll, setIsLoadAll] = useState(false);
  const [fetching, setFetching] = useState(false); // 추가 데이터를 로드하는지 아닌지를 담기위한 state

  // 스크롤 이벤트 핸들러
  const handleScroll = useCallback(() => {
    if (items.length === props.board.length - 1) {
      if (!isLoadAll) {
        setIsLoadAll(true);
      }
    }
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;
    if (
      scrollTop + clientHeight === scrollHeight &&
      fetching === false &&
      !isLoadAll
    ) {
      // 페이지 끝에 도달하면 추가 데이터를 받아온다
      if (!fetching) fetchMoreInstaFeeds();
    }
  });
  const fetchInstaFeeds = async () => {
    let item = [];
    for (let i = 0; i < props.board.length; i++) {
      item.push({
        id: props.board[i]._id,
        title: props.board[i].title,
        category: props.board[i].category,
        content: props.board[i].content,
        views: props.board[i].hits,
        likes: props.board[i].likes,
        liked: props.board[i].liked,
        comments: props.board[i].comments,
        hashtags: props.board[i].hash_Tags,
      });
    }
    console.log(item);
    setItems(item);
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
      },
    });
    if (res.status === 200) {
      let item = [...items];
      for (let i = 0; i < res.data.length; i++) {
        item.push({
          id: res.data[i]._id,
          title: res.data[i].title,
          category: res.data[i].category,
          content: res.data[i].content,
          views: res.data[i].hits,
          likes: res.data[i].likes,
          liked: res.data[i].liked,
          comments: res.data[i].comments,
          hashtags: res.data[i].hash_Tags,
        });
      }
      setItems(item);
    }
    // 추가 데이터 로드 끝
    setFetching(false);
  };

  useEffect(() => {
    console.log(items.length);
    // scroll event listener 등록
    window.addEventListener("scroll", handleScroll);
    return () => {
      // scroll event listener 해제
      window.removeEventListener("scroll", handleScroll);
    };
  });

  return (
    <div className="Scrollbar">
      {items.map((i, index) => (
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
        />
      ))}
    </div>

    // <List
    //     size="small"
    //     bordered
    //     // header={<div>Header</div>}
    //     // footer={<div>Footer</div>}
    //     dataSource=
    //     {boardList? boardList.map((c, index) => {
    //         return <Post
    //             key={index}
    //             id={c._id}
    //             category={c.category}
    //             hits={c.hits}
    //             create={c.created_At}
    //             content={c.content}
    //             writer={c.writer}
    //             title={c.title}
    //             link={"/detail/" + c._id}
    //         />
    //     }) : ""}
    //     renderItem={item => <List.Item>{item}</List.Item>}
    // />
  );
}

export default NewPost;
