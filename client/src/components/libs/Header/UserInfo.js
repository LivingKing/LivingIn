import React, { useEffect, useState } from "react";
import { Avatar, Card } from "antd";
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import "./UserInfo.css";

function UserInfo(props) {
  // 올렸을때 상태
  const [isLoading, setIsLoading] = useState(true);

  // 유저 아이콘 이메일 저장
  const [icon, setIcon] = useState("");
  const [email, setEmail] = useState("");
  const [nickname,setNick] = useState("");

  useEffect(() => {
    // 올렸을 때 & 유저정보 불러온적 있을때
    if (isLoading && sessionStorage.isLogin === "1"){
      console.log("reload");
      const user = JSON.parse(sessionStorage.getItem("user"));
      setIcon(user.icon);
      setEmail(user.email);
      setNick(user.nickname);
      setIsLoading(false);
    }
  }, [props, isLoading]);

  const { Meta } = Card;

  return (
    <Card
      style={{ width: 300 }}
      actions={[
        <Link
          to={{
            pathname: "/settings",
          }}
        >
          <SettingOutlined key="setting" />
        </Link>,
         <Link
         to={{
           pathname :"/write",
         }}
         >
           <EditOutlined key="edit"

          type="text"
          className="header__write"
          />
         </Link>
      ,
        <EllipsisOutlined key="ellipsis" />,
      ]}
    >
      <Meta
        avatar={
          icon === ""? (
            <Avatar>{nickname}</Avatar>
          ) : (
            <Avatar size="large" src={icon}>
              {nickname}
            </Avatar>
          )
        }
        title={nickname + "님 환영환영^^*."}
        description={email}
      />
    </Card>
  );
}

export default UserInfo;