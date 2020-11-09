import React, { useEffect, useState } from "react";
import { Avatar, message, Card } from "antd";
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

  // 새로고침 등 다시 불러올때 저장용
  const dataSave={
    iconData: "",
    emailData: ""
  };

  useEffect(() => {
    // 올렸을 때 & 유저정보 불러온적 있을때
    if (isLoading && localStorage.onSave === "1"){
      console.log("reload");
      setIcon(JSON.parse(localStorage.dataSave).iconData);
      setEmail(JSON.parse(localStorage.dataSave).emailData);
      setIsLoading(false);
    } // localStorage에서 값 가져옴

    // 올렸을 때 & 처음 불러올 때
    else if (isLoading && localStorage.onSave === "0") {
      const onLoad = async () => {
        console.log("first load");
        const res = await fetch(`/api/getUserIcon?nickname=${props.nickname}`, {
          method: "GET",
        });
        if (res.status === 200) {
          const result = await res.json();
          if (!result) {
            setIcon();
            setEmail("(일반로그인만 작동됨)");
          } else {
            setIcon(result.icon);
            setEmail(result.email);
          } // 서버에서 유저 정보 가져옴
          dataSave.iconData = result.icon;
          dataSave.emailData = result.email;
          localStorage.dataSave = JSON.stringify(dataSave);
          localStorage.onSave = 1;
          // localstorage에 유저정보 저
        } else {
          message.error("불러오기 실패!");
        }
      };
      onLoad();
      setIsLoading(false);
    }
  }, [props, isLoading, dataSave]);

  const { Meta } = Card;

  return (
    <Card
      style={{ width: 300 }}
      actions={[
        <Link
          to={{
            pathname: "/settings",
            state: {
              access_token: props.token,
            },
          }}
        >
          <SettingOutlined key="setting" />
        </Link>,
        <EditOutlined key="edit" />,
        <EllipsisOutlined key="ellipsis" />,
      ]}
    >
      <Meta
        avatar={
          icon === ""? (
            <Avatar>{props.nickname}</Avatar>
          ) : (
            <Avatar size="large" src={icon}>
              {props.nickname}
            </Avatar>
          )
        }
        title={props.nickname + "님 환영환영^^*."}
        description={email}
      />
    </Card>
  );
}

export default UserInfo;