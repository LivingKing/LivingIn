import React, { useEffect, useState, useCallback } from "react";
import { message, List } from "antd";
import Post from "../../libs/Post/Post";

function NewPost(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [isLoadAll, setIsLoadAll] = useState(false);

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
      fetchMoreInstaFeeds();
    }
  });
  const fetchInstaFeeds = async () => {
    setItems([
      {
        id: props.board[0]._id,
        title: props.board[0].title,
        category: props.board[0].category,
        content: props.board[0].content,
        views: props.board[0].hits,
        likes: props.board[0].likes,
        liked: props.board[0].liked,
        comments: props.board[0].comments,
        hashtags: props.board[0].hash_Tags,
      },
      {
        id: props.board[1]._id,
        title: props.board[1].title,
        category: props.board[1].category,
        content: props.board[1].content,
        views: props.board[1].hits,
        likes: props.board[1].likes,
        liked: props.board[1].liked,
        comments: props.board[1].comments,
        hashtags: props.board[1].hash_Tags,
      },
    ]);
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

  const [fetching, setFetching] = useState(false); // 추가 데이터를 로드하는지 아닌지를 담기위한 state

  const fetchMoreInstaFeeds = async () => {
    // 추가 데이터를 로드하는 상태로 전환
    setFetching(true);

    console.log(items.length);

    const item = {
      id: props.board[items.length]._id,
      title: props.board[items.length].title,
      category: props.board[items.length].category,
      content: props.board[items.length].content,
      views: props.board[items.length].hits,
      likes: props.board[items.length].likes,
      liked: props.board[items.length].liked,
      comments: props.board[items.length].comments,
      hashtags: props.board[items.length].hash_Tags,
    };
    setItems([...items, item]);
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
