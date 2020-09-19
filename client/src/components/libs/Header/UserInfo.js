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
  // 닉네임 가져오기
  const [isLoading, setIsLoading] = useState(true);
  // 유저 정보 저장
  const [icon, setIcon] = useState("");
  const [email, setEmail] = useState("");
  console.log(props);
  useEffect(() => {
    if (isLoading) {
      const onLoad = async () => {
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
          }
        } else {
          message.error("불러오기 실패!");
        }
      };
      onLoad();
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
          icon === "" ? (
            <Avatar>{props.nickname}</Avatar>
          ) : (
            <Avatar size="large" src={icon}>
              {props.nickname}
            </Avatar>
          )
        }
        title={props.nickname + "님 환영합니다."}
        description={email}
      />
    </Card>
  );
}

export default UserInfo;
