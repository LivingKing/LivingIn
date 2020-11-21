import React, { useEffect, useState, useCallback } from "react";
import Menu from "./Menu";
import { Layout,Button } from "antd";
import { render } from "react-dom";
import Header from "../../libs/Header/Header";
import InfiniteScroll from "react-infinite-scroll-component";
import Post from "../../libs/Post/Post";
import postItems from "./Postitem";
import "./boardPage.css";
import throttle from "lodash/throttle";
const {Sider, Content}= Layout;

const BoardPage = (props) => {

const [Loading, setLoading] = useState(true);
const [items, setItems] = useState([]);
// 스크롤 이벤트 핸들러
const handleScroll = useCallback(() => {
  const scrollHeight = document.documentElement.scrollHeight;
  const scrollTop = document.documentElement.scrollTop;
  const clientHeight = document.documentElement.clientHeight;
  if (scrollTop + clientHeight >= scrollHeight && fetching === false) {
    // 페이지 끝에 도달하면 추가 데이터를 받아온다
    fetchMoreInstaFeeds();
    onscroll = {Scrolltimer};
  }
  
 });
useEffect(()=>{
  if(Loading){
    fetchInstaFeeds();
    setLoading(false);
  }
  window.addEventListener("scroll", handleScroll());
  return () => {
    // scroll event listener 해제
    window.removeEventListener("scroll", handleScroll());
  };
  
  
},[Loading, handleScroll, items])

const fetchInstaFeeds = async () => {
    setItems([{
      id: 1,
      title:'test123', 
      category :"요리",
      content:"테스트테스트",
      views:150,
      likes:200,
      liked:true,
      comments:63,
      hashtags:["React", "Js", "Node"],
    },{
      id: 2,
      title:'test345', 
      category :"요",
      content:"테스트",
      views:150,
      likes:200,
      liked:true,
      comments:63,
      hashtags:["React", "Js", "Node"],
    }])
    
};

const [fetching, setFetching] = useState(false); // 추가 데이터를 로드하는지 아닌지를 담기위한 state
  
const fetchMoreInstaFeeds = async () => {
  // 추가 데이터를 로드하는 상태로 전환
  setFetching(true);
  
  const item = {
    id: items.length+1,
    title:'test'+items.length, 
    category :"요리",
    content:"테스트테스트",
    views:150,
    likes:200,
    liked:false,
    comments:63,
    hashtags:["React", "Js", "Node"],
    }
  setItems(items => [...items,item]);
  // 추가 데이터 로드 끝
  setFetching(false);
};




 const Scrolltimer = throttle(handleScroll,10000); // 게시글 받아오는 로딩 시간

 useEffect(() => {
  // scroll event listener 등록
  window.addEventListener("scroll", handleScroll);
  return () => {
    // scroll event listener 해제
    window.removeEventListener("scroll", handleScroll);
  };
});

  return (
   <Layout>
     <Header />
     <Layout>
       <Sider><Menu/></Sider>
   <Content>
   <div 
   className = "Scrollbar"
   onScroll={Scrolltimer}>

{items.map((i,index)=>(
  <Post key={items[index].id}
  id={items[index].id}
  title={items[index].title}
  category={items[index].category}
  views={items[index].views}
  likes={items[index].likes}
  liked={items[index].liked}
  comments={items[index].comments}
  hashtags={items[index].hashtags} />
  ))}
  </div>
  
   </Content>
     </Layout>
   </Layout>
  );
  
};

export default BoardPage;