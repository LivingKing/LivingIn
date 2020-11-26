import React, { useEffect, useState, useCallback } from "react";
import Menu from "./Menu";
import { Layout,Button,message,BackTop } from "antd";
import Header from "../../libs/Header/Header";
import Post from "../../libs/Post/Post";
import "./boardPage.css";
import check from "./check.png";
import NewCon from "./NewCon.js"


const BoardPage = (props) => {

const [Loading, setLoading] = useState(true);
let [boardList, setboardList] = useState("");

const scrollTop = document.documentElement.scrollTop;
const clientHeight = document.documentElement.clientHeight;

const style = {
  height: 40,
  width: 40,
  lineHeight: '40px',
  borderRadius: 4,
  backgroundColor: '#1088e9',
  color: '#fff',
  textAlign: 'center',
  fontSize: 14,
};

useEffect(()=>{
  if(Loading){
    const onLoad = async () => {
      const res = await fetch(`/api/getBoardPost`, {
          method: "GET",
      });
      if (res.status === 200) {
          const result = await res.json();
          if (!result) {
              console.log("empty");
          } else {
            console.log(result);
              setboardList(result);
          }

      } else {
          message.error("불러오기 실패!");
      }
  };
  onLoad();

  }
  
  
  
},[Loading])








  return (
    <div>
      <Header />
      <div className="back">
        <div class="sub_top">
        <h2>전체</h2>
          <div class="area">
            <div class="btn_area">전체</div>
          </div>
          {/* <h2>요리</h2>
          <div class="area">
            <div class="btn_area"><span>백주부</span>한식</div>
          </div> */}
        </div>
      </div>




      <div className="content22">
        <div class="contents22">


          <div class="filter_wrap">
            <Menu/>
          </div>


          <div class="list_wrap">


            <div class="top_sort">
                <div class="btn_wrap">
                <button type="button" data-sort="DISTANCE" class="on">
                  <img src={check} width="22" height="22" className="asdfasdf"/> 
                  <span>최신 순</span></button>
                  <button type="button" data-sort="LOWPRICE" class="offff"><span>조회수 순</span></button>
                  <button type="button" data-sort="HIGHPRICE" class="offff"><span>좋아요 순</span></button>
              </div>
                {/* <button type="button" class="btn_map" onclick="pop_map_pc();">지도</button> */}
            </div>

            <div id="poduct_list_area">

              <div class="title">
                <h3>전체 게시판&nbsp;</h3>
                <span>최신 순</span>                                   
                 </div>
            </div>
          </div>


          <div style={{ height: scrollTop+clientHeight, padding: 8 }}>
            <BackTop>
              <div style={style}>UP</div>
            </BackTop>
          </div>

        </div>
      </div>






      {/* <Sider><Menu/></Sider> */}


      {boardList? <NewCon board={boardList}/>:<></>}


   </div>
  );
  
};

export default BoardPage;