import React, { useEffect, useState } from "react";
import { message, List } from "antd";
import "./NewPost.css";
import axios from "axios";

function NewPost(props) {
  const [isLoading, setIsLoading] = useState(true);
  let [boardList, setboardList] = useState("");

  useEffect(() => {
    if (isLoading) {
      const onLoad = async () => {
        const res = await axios.get(`/posts`);
        if (res.status === 200) {
          if (!res.data) {
            console.log("empty");
          } else {
            setboardList(res.data);
          }
        } else {
          message.error("불러오기 실패!");
        }
      };
      onLoad();
      setIsLoading(false);
    }
  }, [isLoading]);

  return (
    <List
      size="small"
      bordered
      // header={<div>Header</div>}
      // footer={<div>Footer</div>}
      dataSource={
        boardList
          ? boardList.map((c, index) => {
              return (
                <NewPostData
                  key={index}
                  id={c._id}
                  category={c.category}
                  hits={c.hits}
                  create={c.created_At}
                  content={c.content}
                  writer={c.writer}
                  title={c.title}
                  link={"/detail/" + c._id}
                />
              );
            })
          : ""
      }
      renderItem={(item) => <List.Item>{item}</List.Item>}
    />
  );
}

const NewPostData = (props) => {
  return (
    <div className="content">
      [{props.category}]<a href={props.link}>{props.title}</a>
      <div className="right">{props.writer}</div>
      {/* {props.hits} */}
    </div>
  );
};

export default NewPost;
