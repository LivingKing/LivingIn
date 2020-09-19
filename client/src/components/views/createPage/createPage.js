import React, { useState } from "react";
import QuillEditor from "../../libs/QuillEditor";
import Header from "../../libs/Header/Header";
import { Typography } from "antd";
import "react-quill/dist/quill.snow.css";

const { Title } = Typography;
const CreatePost = () => {
  return (
    <div className="createPost__header">
      <Header />
      <Title level={2}>자취방 글짓기</Title>
      <QuillEditor placeholder={"Start Posting Something"} />
    </div>
  );
};
export default CreatePost;
