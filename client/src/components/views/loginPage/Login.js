import React, { useRef } from "react";
import { Form, Input, Button, Checkbox, message } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import logo from "./logo.png";
import "./Login.css";
import KakaoLogin from "react-kakao-login";
import { withRouter, Link } from "react-router-dom";
import axios from "axios";

function LoginPage(props) {
  const emailInput = useRef();
  const passwordInput = useRef();
  const responseGoogle = async () => {
    const res = await axios("/auth/google", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.data.url) window.open(res.data.url, "_self");
  };

  const responseKakao = async (values) => {
    const res = await axios.post("/auth/kakao", values);
    if (res.data.status === 403) return;
    else {
      if (res.data.message === "logged in successfully") {
        message.info(res.data.nickname + "님 반갑습니다!", 1);
        return props.history.push({
          pathname: "/",
          state: { k_access_token: res.data.access_token },
        });
      }
    }
  };

  const onFinish = async (values) => {
    let res = await fetch("/auth/login", {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      return res.json();
    });
    if (res.message === "uncertified")
      return message.error("이메일 인증을 진행해주세요!");
    else if (res.message === "user not exist") {
      emailInput.current.focus();
      return message.error("존재하지 않는 이메일입니다.");
    } else if (res.message === "password incorrect") {
      passwordInput.current.focus();
      return message.error("비밀번호가 틀립니다.");
    } else if (res.message === "logged in successfully") {
      message.info(res.nickname + "님 반갑습니다!", 1);
      return props.history.push({
        pathname: "/",
        state: { access_token: res.access_token },
      });
    } else {
      return message.error(res.message);
    }
  };

  return (
    <section className="Login">
      <div className="container">
        <img src={logo} className="Login-logo" alt="logo" />
        <div className="LoginForm">
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
          >
            <Form.Item
              name="email"
              rules={[
                {
                  type: "email",
                  message: "이메일 형식으로 입력해주세요.",
                },
                {
                  required: true,
                  message: "이메일을 입력하세요!",
                },
              ]}
            >
              <Input
                ref={emailInput}
                prefix={<MailOutlined className="site-form-item-icon" />}
                placeholder="이메일"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "비밀번호를 입력하세요!",
                },
              ]}
            >
              <Input
                ref={passwordInput}
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="비밀번호"
              />
            </Form.Item>
            <Form.Item>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>자동 로그인</Checkbox>
              </Form.Item>
              <Button type="link">아이디/비밀번호 찾기</Button>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                로그인
              </Button>
              &nbsp;또는 <Link to="/register">회원가입</Link>
            </Form.Item>
          </Form>
        </div>
        <div className="LoginForm2">
          <button className="GoogleLogin" onClick={responseGoogle}></button>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <KakaoLogin
              className="Item3"
              //styled component 통해 style을 입혀 줄 예정
              jsKey={"baef566d75829ac6ace44db138489ed7"}
              //카카오에서 할당받은 jsKey를 입력
              buttonText=""
              //로그인 버튼의 text를 입력
              onSuccess={responseKakao}
              //성공했을때 불러올 함수로서 fetch해서 localStorage에 저장할 함수를 여기로 저장
              getProfile={true}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default withRouter(LoginPage);
