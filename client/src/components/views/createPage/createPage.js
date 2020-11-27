import React, { useState, useEffect } from "react";
import QuillEditor from "../../libs/QuillEditor";
import Tags from "../../libs/EditableTagGroup";
import Header from "../../libs/Header/Header";
import Verify from "../../libs/Verify";
import {
  Typography,
  Input,
  Select,
  Divider,
  Button,
  Popconfirm,
  message,
} from "antd";
import "react-quill/dist/quill.snow.css";
import "./createPage.css";
import { withRouter } from "react-router-dom";
import axios from "axios";

const { Title } = Typography;
const { Option } = Select;
const text = "Are you sure to delete this post?";

const CreatePost = (props) => {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState([]);

  useEffect(() => {
    if (!sessionStorage.getItem("isLogin")) {
      message.error("로그인이 필요합니다.");
      return props.history.push("/login");
    } else {
      const res = Verify(
        JSON.parse(sessionStorage.getItem("token_info")).access_token,
        JSON.parse(sessionStorage.getItem("token_info")).token_type,
        props
      );
      res.then((result) => {
        if (result !== undefined) {
          try {
            const token_type = JSON.parse(sessionStorage.getItem("token_info"))
              .token_type;
            sessionStorage.removeItem("token_info");
            sessionStorage.setItem(
              "token_info",
              JSON.stringify({
                token_type: token_type,
                access_token: result.access_token,
              })
            );
          } catch {}
        }
      });
    }
  }, [props]);

  const contentHandleChange = (value) => {
    setContent(value);
  };
  const titleHandleChange = (e) => {
    setTitle(e.target.value);
  };
  const onTest = async (e) => {
    e.preventDefault();
    console.log(title);
    console.log(category);
    console.log(tags);
    console.log(content);
    const res = await axios.post("/posts", {
      title: title,
      content: content,
      access_token: JSON.parse(sessionStorage.getItem("token_info"))
        .access_token,
      tags: tags.values,
      category: category,
    });
    if (res.status === 200) {
      message.success("글 작성 성공!");
      return props.history.push({
        pathname: "/",
        state: { tokeninfo: props.tokeninfo, nickname: props.nickname },
      });
    }
  };

  const selectHandleChange = (value) => {
    switch (value) {
      case "1":
        setCategory("가전");
        break;
      case "2":
        setCategory("요리");
        break;
      case "3":
        setCategory("생활");
        break;
      case "4":
        setCategory("욕실");
        break;
      default:
        setCategory("");
        break;
    }
  };
  const tagHandleChange = (values) => {
    setTags({ values });
    console.log(values);
  };

  return (
    <div className="total__container">
      <Header {...props} />
      <section className="write__container">
        <form className="writeForm" onSubmit={onTest}>
          <div className="container__title">
            <Title level={3}>Title</Title>
            <Input
              placeholder="Add a Title"
              value={title}
              name="title"
              onChange={titleHandleChange}
              className="title__Input"
              allowClear
            />
            <Select
              defaultValue="카테고리를 선택해 주세요."
              onChange={selectHandleChange}
            >
              <Option value="1">가전</Option>
              <Option value="2">요리</Option>
              <Option value="3">생활</Option>
              <Option value="4">욕실</Option>
            </Select>
          </div>
          <div className="container__tags">
            <Divider />
            <Title level={3}>Tags</Title>
            <Tags tags={tags} onTagsChange={tagHandleChange} className="tgs" />
          </div>
          <div className="container__Description">
            <Divider />
            <Title level={3}>Description</Title>
            <div className="container__editor">
              <QuillEditor
                value={content}
                onTextChange={contentHandleChange}
                placeholder={"Start Posting Something"}
                className="description__Editor"
              />
            </div>
          </div>
          <div className="container__Button">
            <Divider />
            <Button type="primary" htmlType="submit" className={"buttons"}>
              Update
            </Button>
            <Popconfirm placement="right" title={text}>
              <Button className={"buttons"}>Cancel</Button>
            </Popconfirm>
          </div>
        </form>
      </section>
    </div>
  );
};

export default withRouter(CreatePost);
