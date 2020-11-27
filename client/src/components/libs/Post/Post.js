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
        <img
          src="https://lh3.googleusercontent.com/proxy/Mj6E9VxyIemvOcNpTlCRP-1nqTogiL74km8AqViwg7J-X_DaLZ6gEpI0VAd7U43PgccDC7FkLz4-JFVPQNMykClzQK4Vvs4vE06Fm8s3Q_NVXYJkkEdTUcsGSCvtMg3a0aUBPmf0sayTDQGBtsg_2t7mHmNSYxRhtN_jSlakAo_LiCkkP-SHcQQwmKPHvvwS8UhqAq_HYlrgcipgkJMTAboPV_kSAo9G9YTS-TN_EvE8TaKtzk8R-QQyTefOYjVPGpPmPn1RVveLSUiKUMS7hTtNEGz7AhPeuy25T3LAJXJ7vJTHaQcA4If5p1ssN9zw_bg3dupVx3DufuaMc2hAC8expg3dryFJ1A2nOmokZvAwU6_Z7FgjmMcBt5h-CRwgWOfucyjfvo7ZPv1ODG2r"
          alt="img"
        />
      </div>
      <div className="post__info">
        <div className="info__detail1">
          <p className="post__title">{props.title}</p>
          <span className="post__content">{props.content}</span>
        </div>
        <div className="info__detail2">
          <ul className="post__hashtag">
            {props.hashtags.map((hashtag, index) => {
              if (index === 2) return <li key={index}></li>;
              return <li key={index}>#{hashtag}</li>;
            })}
          </ul>
          <div className="post__etc">
            <HeartFilled style={{ fontSize: "20px" }} />
            <span>{props.likes}</span>
            <EyeFilled style={{ fontSize: "20px" }} />
            <span>{props.views}</span>
            <CommentOutlined style={{ fontSize: "20px" }} />
            <span>{props.comments}</span>
          </div>
        </div>
      </div>
      <div className="abcabc"></div>
      <div className="post__like">
        <span className="like__icon" onClick={() => setLiked(!liked)}>
          <svg
            className={liked ? "like__animation" : "none"}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M12 4.248c-3.148-5.402-12-3.825-12 2.944 0 4.661 5.571 9.427 12 15.808 6.43-6.381 12-11.147 12-15.808 0-6.792-8.875-8.306-12-2.944z" />
          </svg>
        </span>
      </div>
    </div>
  );
};

export default Post;
