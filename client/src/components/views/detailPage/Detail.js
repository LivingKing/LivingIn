import React, { useEffect, useState } from "react";
import { CSSTransition } from "react-transition-group";
import {
  Comment,
  Input,
  Form,
  List,
  Button,
  Avatar,
  BackTop,
  Skeleton,
} from "antd";
import {
  DownOutlined,
  CommentOutlined,
  LikeOutlined,
  DislikeOutlined,
  LikeFilled,
  DislikeFilled,
} from "@ant-design/icons";
// import BackTop from "../../libs/BackTopButton";
import moment from "moment";
import "./Detail.css";
import Post from "./Post";

const { TextArea } = Input;

const CommentList = ({ comments }) => (
  <List
    dataSource={comments}
    header={`댓글 ${comments.length}`}
    itemLayout="horizontal"
    renderItem={(props) => <Comment {...props} />}
  />
);

const Editor = ({ onChange, onSubmit, submitting, value }) => (
  <>
    <Form.Item>
      <TextArea rows={3} onChange={onChange} value={value} />
    </Form.Item>
    <Form.Item>
      <Button
        htmlType="submit"
        loading={submitting}
        onClick={onSubmit}
        type="primary"
      >
        댓글 달기
      </Button>
    </Form.Item>
  </>
);

const Detail = () => {
  const [visible, setVisible] = useState(false); // 댓글창 눌렀는지
  const [comments, setComments] = useState([]); // 댓글 state
  const [submitting, setSubmitting] = useState(false); // 댓글 달기 요청 중인지
  const [isCommentLoading, setIsCommentLoading] = useState(true); // 댓글 로딩 전인지
  const [islike, setIsLike] = useState(false); // 좋아요 눌렀는지
  const [likes, setLikes] = useState(0); // 좋아요 수
  const [isdislike, setIsdislike] = useState(false); // 싫어요 눌렀는지
  const [dislikes, setDisLikes] = useState(0); // 싫어요 수
  const [value, setValue] = useState(""); // 댓글 입력 메시지

  useEffect(() => {
    console.log("hi");
  }, [comments, islike, isdislike]);
  const toggle = () => {
    setVisible(!visible);
  };

  const handleSubmit = () => {
    if (!value) {
      return;
    }

    setSubmitting(true);

    setSubmitting(false);
    setValue("");
    setComments([
      {
        author: "Han Solo",
        avatar:
          "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
        content: <p>{value}</p>,
        datetime: moment().fromNow(),
      },
      ...comments,
    ]);
  };

  const handleChange = (e) => {
    setValue(e.target.value);
  };
  const handleLike = () => {
    if (isdislike) setIsdislike(!isdislike);
    setIsLike(!islike);
  };
  const handleDisLike = () => {
    if (islike) setIsLike(!islike);
    setIsdislike(!isdislike);
  };

  return (
    <section className="container">
      <content>
        <h1>게시물 보기</h1>
        <h3 className="title_text"> 제목제목제목제목제목</h3>
        <div className="nick_box">닉네임</div>
        <span className="date">2020.09.01 19:20 </span>
        <span className="count">조회 13</span>
        <div id="rectangle">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat error
          dignissimos veniam excepturi accusantium earum accusamus tempore
          cupiditate obcaecati cum, reiciendis consequatur quibusdam
          exercitationem mollitia id doloremque? Sit, excepturi inventore.
        </div>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <Post
            id={1}
            title={"진라면 맛있게 끓이는 법"}
            category={"요리"}
            views={50}
            likes={50}
            comments={30}
            hashtags={["해시태그1", "해시태그2", "해시태그3"]}
          />
          <Post
            id={2}
            title={"삼양라면 맛있게 끓이는 법"}
            category={"요리"}
            views={30}
            likes={62}
            comments={32}
            hashtags={["해시태그1", "해시태그2", "해시태그3"]}
          />
        </div>

        <BackTop />
      </content>
      <footer>
        {!visible && (
          <div className="outer">
            <ul className="menu">
              <li className="menu__list">
                {islike ? (
                  <LikeFilled
                    className="menu__icon"
                    onClick={handleLike}
                    style={{ color: "#2196F3" }}
                  />
                ) : (
                  <LikeOutlined className="menu__icon" onClick={handleLike} />
                )}
                <h3>{likes}</h3>
              </li>
              <li className="menu__list">
                {isdislike ? (
                  <DislikeFilled
                    className="menu__icon"
                    onClick={handleDisLike}
                    style={{ color: "#F44336" }}
                  />
                ) : (
                  <DislikeOutlined
                    className="menu__icon"
                    onClick={handleDisLike}
                  />
                )}

                <h3>{dislikes}</h3>
              </li>
              <li className="menu__list">
                <CommentOutlined className="menu__icon" onClick={toggle} />
                <h3>0</h3>
              </li>
            </ul>
          </div>
        )}

        <CSSTransition
          classNames="inner__animation"
          timeout={300}
          unmountOnExit
          in={visible}
        >
          <div className="inner">
            {visible && (
              <div className="menu">
                <DownOutlined className="menu__icon" onClick={toggle} />
              </div>
            )}
            <Comment
              className="comment__box"
              avatar={
                <Avatar
                  src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                  alt="Han Solo"
                />
              }
              content={
                <Editor
                  onChange={handleChange}
                  onSubmit={handleSubmit}
                  submitting={submitting}
                  value={value}
                />
              }
            />
            <div className="comment__list">
              {isCommentLoading && (
                <Skeleton avatar paragraph={{ rows: 4 }} active />
              )}
              {comments.length > 0 && <CommentList comments={comments} />}
            </div>
          </div>
        </CSSTransition>
      </footer>
    </section>
  );
};

export default Detail;
