import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CommentOutlined, EyeFilled, HeartFilled } from "@ant-design/icons";
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
  const [liked, setLiked] = useState(props.liked);
  return (
    <div className="posts__post">
      <Link
        style={{
          position: "absolute",
          width: "610px",
          height: "400px",
          zIndex: "201",
        }}
        to={{
          pathname: `/detail/${props.id}`,
        }}
      />
      <div className="post__category">
        <FoodIcon style={{ fontSize: "20px" }} />
        <span>{props.category}</span>
      </div>
      <div className="post__thumbnail">
        <img src={props.thumbnail} alt="img" />
      </div>
      <div className="post__info">
        <div className="info__detail1">
          <p className="post__title">{props.title}</p>
        </div>
        <div className="info__detail2">
          <ul className="post__hashtag">
            {props.hashtags !== undefined ? (
              props.hashtags.map((hashtag, index) => {
                if (index === 2) return <li key={index}></li>;
                return <li key={index}>#{hashtag}</li>;
              })
            ) : (
              <></>
            )}
          </ul>
          <div className="post__etc">
            <HeartFilled style={{ fontSize: "20px" }} />
            <span>{props.likes}</span>
            <EyeFilled style={{ fontSize: "20px" }} />
            <span>{props.views}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
