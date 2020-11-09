import React, {useState, useEffect} from "react";
import QuillEditor from "../../libs/QuillEditor";
import Tags from "../../libs/EditableTagGroup";
import Header from "../../libs/Header/Header";
import Verify from "../../libs/Verify";
import { Typography, Input, Select, Divider, Button, Checkbox, Popconfirm, message } from "antd";
import "react-quill/dist/quill.snow.css";
import "./createPage.css";
import { withRouter } from "react-router-dom";
import axios from "axios";

function onChange(e) {
  console.log(`checked = ${e.target.checked}`);
}



const { Title, Text } = Typography;
const children = [];
const { Option } = Select;
const text = "Are you sure to delete this post?";


const CreatePost = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [content, setContent] = useState("");
  const [tokeninfo, setTokenInfo] = useState([]);
  const [nickname, setNickName] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] =useState([]);

  useEffect(() => {
    if (
      !props.history.location.state ||
      Object.keys(props.history.location.state).length === 0
    ) {
      message.error("로그인이 필요합니다.");
      return props.history.push("/login");
    }
    if (isLoading) {
      setNickName(props.history.location.state.nickname);
      setIsLoading(false);
    }
    const {
      access_token,
      g_access_token,
      k_access_token,
    } = props.history.location.state;
    if (access_token) {
      Verify(access_token, "local", props);
      setTokenInfo({ access_token: access_token, type: "local" });
    } else if (g_access_token) {
      Verify(g_access_token, "google", props);
      setTokenInfo({ access_token: g_access_token, type: "google" });
    } else if (k_access_token) {
      Verify(k_access_token, "kakao", props);
      setTokenInfo({ access_token: k_access_token, type: "kakao" });
    }
  }, [props, isLoading]);

  const contentHandleChange = (value)=>{
      setContent(value);
  }
  const titleHandleChange = (e) =>{
    setTitle(e.target.value);
  }
  const onTest =async(e)=>{
    e.preventDefault();
    console.log(title);
    console.log(category);
    console.log(tags);
    console.log(content);
    console.log(nickname);
    const res = await axios.post("/post",{
      title:title,
      content:content,
      writer:nickname,
      tags:tags.values,
      category:category
    })
    if(res.status === 200){
      message.success("글 작성 성공!");
       return props.history.push({
        pathname: "/",
        state: { tokeninfo: props.tokeninfo, nickname: props.nickname },
      });
    }
  }

  const selectHandleChange = (value)=>{
    switch(value){
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
  }
  const tagHandleChange = (values)=>{
    setTags({values});
    console.log(values);
  }

  return (
    <div className="total__container">
      {isLoading ? <></> : <Header tokeninfo={tokeninfo} nickname={nickname} history={props.history} />}
      <section className="write__container">
        <form className="writeForm" onSubmit={onTest}>
        <div className="container__title">
          <Title level={3}>Title</Title>
          <Input placeholder="Add a Title" value={title} name="title" onChange={titleHandleChange} className="title__Input" allowClear />
          <Select defaultValue="카테고리를 선택해 주세요." onChange={selectHandleChange}>
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
            <QuillEditor value={content} onTextChange={contentHandleChange} placeholder={"Start Posting Something"} className="description__Editor" />
          </div>
        </div>
        <div className="container__Button">
          <Divider />
          <Button type="primary" htmlType="submit" className={"buttons"}>
            Update
          </Button>
          <Popconfirm placement="right" title={text}>
            <Button className={"buttons"}>
              Cancel
            </Button>
          </Popconfirm>
        </div>
        </form>
      </section>
    </div>
  );
};

export default withRouter(CreatePost);