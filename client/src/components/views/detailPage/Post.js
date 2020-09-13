import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CommentOutlined, HeartFilled, EyeFilled } from "@ant-design/icons";
import Icon from "@ant-design/icons";
import "./Post.css";

const FoodSvg = () => (
  <svg
    width="24"
    height="24"
    xmlns="http://www.w3.org/2000/svg"
    fillRule="evenodd"
    clipRule="evenodd"
  >
    <path d="M18.496 24h-.001c-.715 0-1.5-.569-1.5-1.5v-8.5s-1.172-.003-2.467 0c.802-6.996 3.103-14 4.66-14 .447 0 .804.357.807.851.01 1.395.003 16.612.001 21.649 0 .828-.672 1.5-1.5 1.5zm-11.505-12.449c0-.691-.433-.917-1.377-1.673-.697-.56-1.177-1.433-1.088-2.322.252-2.537.862-7.575.862-7.575h.6v6h1.003l.223-6h.607l.173 6h1.003l.242-6h.562l.199 6h1.003v-6h.549s.674 5.005.951 7.55c.098.902-.409 1.792-1.122 2.356-.949.751-1.381.967-1.381 1.669v10.925c0 .828-.673 1.5-1.505 1.5-.831 0-1.504-.672-1.504-1.5v-10.93z" />
  </svg>
);
const FoodIcon = () => <Icon component={FoodSvg} style={{ fill: "white" }} />;
const Post = (props) => {
  const [id, setId] = useState(0);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [views, setViews] = useState(0);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState(0);
  const [hashtags, setHashTags] = useState([]);
  useEffect(() => {
    setId(props.id);
    setTitle(props.title);
    setCategory(props.category);
    setViews(props.views);
    setLikes(props.likes);
    setComments(props.comments);
    setHashTags(props.hashtags);
  }, [
    props.id,
    props.title,
    props.category,
    props.setViews,
    props.setLikes,
    props.setComments,
    props.views,
    props.likes,
    props.comments,
    props.hashtags,
  ]);
  return (
    <div className="posts__post">
      <Link
        style={{
          position: "absolute",
          width: "300px",
          height: "300px",
          zIndex: "201",
        }}
        to={{
          pathname: "/detail",
          search: `?id=${id}`,
        }}
      />
      <div className="post__category">
        <FoodIcon style={{ fontSize: "20px" }} />
        <span>{category}</span>
      </div>
      <div className="post__like">
        <HeartFilled style={{ color: "red", fontSize: "20px" }} />
        <span>{likes}</span>
      </div>
      <div className="post__thumbnail">
        <img
          src="https://lh3.googleusercontent.com/proxy/zj91RSkiDHK6lCV8ABYbO1MAIZv73ZopkiTjmvKETlYoRZt8--NcMrT4JCRIs2YjB7tLpQmp0Ft2Kwk9heLptHSB0pu3AUiiv6a-kHjiN3PwVtJqfc2YeFkqqH8KSEOFEZDfCyY1aT0y09NNWFW-Frtl9p4NIe4WXyaCwyQvKDUP9PHZ-M8K5ub6dIgqnmqNRDrsnHly2sVuFih3CO6nUGPoqSROKThtv6A6QkO_Fi8beKdlvXq4y5w82NYX-pfrXFssJ1ZDX5fdcFS7qmADGAby2t9_FAv6yix9kTvXvOMuG6adOPzA1Qnd1_bZZ1-BAWNjhLFTiqGQBLFi_agV6pp14Zz5MCnatovFY3cODgYgnHGfJhdRJ3kbjR3i89N8AP8R6uSU20ZNG1GfFmu9"
          alt="img"
        />
      </div>
      <span className="post__title">{title}</span>
      <ul className="post__hashtag">
        {hashtags.map((hashtag, index) => {
          if (index === 2) return <li key={index}></li>;
          return <li key={index}>#{hashtag}</li>;
        })}
      </ul>
      <div className="post__etc">
        <EyeFilled style={{ fontSzie: "20px" }} />
        <span>{views}</span>
        <CommentOutlined style={{ fontSize: "20px" }} />
        <span>{comments}</span>
      </div>
    </div>
  );
};

export default Post;
