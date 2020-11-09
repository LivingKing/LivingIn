import React, { useEffect, useState } from "react";
import Menu from "./Menu";
import { Layout } from "antd";
import Header from "../../libs/Header/Header";
import InfiniteScroll from "react-infinite-scroll-component";
import Post from "../../libs/Post/Post";
import Item from "antd/lib/list/Item";
import "./boardPage.css"
const {Sider, Content}= Layout;

const BoardPage = (props) => {
  const [postItems, setPostItems] = useState([]);
  const [hasmore, setHasmore] = useState(true);

  const fetchMoreData = () =>{
    console.log(postItems.length>=4?false:true);
    if (postItems.length >= 50) {
      setHasmore(false);
    }
    
    setTimeout(() => {
        setPostItems([...postItems,{
          id : "1",
          title:"진라면 맛있게 끓이는 법",
          category:"요리"
            ,views:50
            ,likes:50
            ,liked:false
            ,comments:30
            ,hashtags:["해시태그1", "해시태그2", "해시태그3"]
      },{
        id : "2",
        title:"장원영 쏘 큐리어스 벌꿀 졸귀탱",
        category:"요리"
          ,views:50
          ,likes:50
          ,liked:false
          ,comments:30
          ,hashtags:["해시태그1", "해시태그2", "해시태그3"]
      }])
    }, 1500);
  }
  return (
    <Layout>
      <Header />
      <Layout>
        <Sider><Menu/></Sider>
        <InfiniteScroll 
    className="test"
    dataLength={postItems.length}
    hasMore={postItems.length>=50?false:true}
    next={fetchMoreData()}
    loader={<h4>Loading...</h4>}
    endMessage={
      <p style={{ textAlign: "center" }}>
        <b>Yay! You have seen it all</b>
      </p>
    }
    >
    <Content>
      {postItems.map((i,index)=>(
        <Post key={postItems[index].id}
         id={postItems[index].id}
        title={postItems[index].title}
        category={postItems[index].category}
        views={postItems[index].views}
        likes={postItems[index].likes}
        liked={postItems[index].liked}
        comments={postItems[index].comments}
        hashtags={postItems[index].hashtags} />
      ))}
    </Content>
    </InfiniteScroll>
      </Layout>
    </Layout>
  );
};

export default BoardPage;