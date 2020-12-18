import React, { useRef, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Input, Select, List, Divider, message, Spin, Tag } from "antd";
import { Drawer } from "antd";
import "./Header.css";
import axios from "axios";
import parse from "html-react-parser";
import getFormatDate from "../../libs/getFormatDate";

const tagColor = [
  "magenta",
  "red",
  "volcano",
  "orange",
  "gold",
  "lime",
  "green",
  "cyan",
  "blue",
  "geekblue",
];

function QuickSearch(props) {
  const [firstLoad, setFirstLoad] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isFinish, setIsFinish] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hashTags, setHashTags] = useState([]);
  let [boardList, setboardList] = useState("");
  const [favKeyword, setFavKeyword] = useState("");
  const [command, setCommand] = useState(`/search/posts/?value=`);

  const inputRef = useRef();
  const { Search } = Input;
  const { Option } = Select;

  const onSearch = (value) => {
    if (value === "") return;
    setIsLoading(true);
    setIsFinish(false);
    setFirstLoad(false);

    console.log(command + value);
    if (!sessionStorage.getItem("search"))
      sessionStorage.setItem("search", "normal_search");
    const onLoad = async () => {
      if (value.includes("#")) value = value.replace("#", "");
      const res = await fetch(`${command + value}`, {
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
      setIsLoading(false);
      setIsFinish(true);
    };
    onLoad();
  };

  const selectChange = (value) => {
    value === "all"
      ? setCommand(`/search/posts/?value=`)
      : setCommand(`/search/posts/?${value}=`);
  };

  const selectBefore = (
    <Select
      defaultValue="all"
      onChange={selectChange}
      disabled={isLoading ? true : false}
    >
      <Option value="all">전체</Option>
      <Option value="writer">글쓴이</Option>
      <Option value="title">제목</Option>
      <Option value="tag">태그</Option>
    </Select>
  );

  const showDrawer = async () => {
    const user = await axios.get("/users", {
      params: {
        email: JSON.parse(sessionStorage.getItem("user")).email,
      },
    });
    if (user.status === 200) {
      setHashTags(user.data.hashTags);
    }
    setVisible(true);
  };
  const onClose = () => {
    setFavKeyword("");
    sessionStorage.removeItem("search");
    setVisible(false);
    setIsFinish(false);
    setFirstLoad(true);
  };
  const handleTag = (e) => {
    console.log(e.target.innerText);
    setFavKeyword("#" + e.target.innerText);
    sessionStorage.setItem("search", "favorite_search");
  };
  return (
    <div>
      <SearchOutlined onClick={showDrawer} className="header__search" />

      <Drawer
        title="빠른 게시물 찾기"
        placement="top"
        closable={true}
        onClose={onClose}
        visible={visible}
        width="400px"
        height="50vh"
        destroyOnClose="true"
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Search
            ref={inputRef}
            placeholder="찾을 내용을 입력하세요"
            allowClear
            value={favKeyword}
            onChange={(e) => setFavKeyword(e.target.value)}
            onSearch={onSearch}
            style={{ width: 350, margin: "0 2px" }}
            size="large"
            addonBefore={selectBefore}
            loading={isLoading}
            enterButton={isLoading}
          />
          <div style={{ marginTop: "10px" }}>
            {hashTags.map((tag, i) => (
              <Tag
                style={{ cursor: "pointer" }}
                key={i}
                color={tagColor[i]}
                onClick={handleTag}
                value={tag}
              >
                {tag}
              </Tag>
            ))}
          </div>
        </div>

        {isFinish ? (
          <div>
            <Divider orientation="center">게시물 검색 결과</Divider>
            <List
              size="small"
              bordered
              dataSource={boardList.map((c, index) => {
                return (
                  <SearchResult
                    key={index}
                    id={c._id}
                    category={c.category}
                    hits={c.hits}
                    create={c.created_At}
                    content={c.content}
                    writer={c.writer}
                    title={c.title}
                    hashTags={c.hash_Tags}
                    link={"/detail/" + c._id}
                  />
                );
              })}
              renderItem={(item) => <List.Item>{item}</List.Item>}
            />
          </div>
        ) : (
          <div style={{ textAlign: "center" }}>
            {firstLoad ? (
              <></>
            ) : (
              <Spin
                style={{ marginTop: "10px" }}
                tip="Loading..."
                size="large"
              />
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
}
const SearchResult = (props) => {
  return (
    <div className="content">
      <a href={props.link} className="tit_txt">
        {props.title}
      </a>
      <p className="writerInSearch">{props.writer}</p>
      <div className="link_dsc_txt">{parse(props.content)}</div>
      <p className="dsc_sub">
        <a href="/board" className="sub_txt">
          {props.category}
        </a>
        <span className="date_time">{getFormatDate(props.create)}</span>
      </p>
      <p>
        {props.hashTags.map((tag, index) => {
          return (
            <span key={index} style={{ fontStyle: "italic", color: "#12cb7f" }}>
              #{tag}{" "}
            </span>
          );
        })}
      </p>
    </div>
  );
};
export default QuickSearch;
