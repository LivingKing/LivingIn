import React, { useState, useRef } from "react";
import { Form, Input, Tooltip, Checkbox, Button, message, Upload } from "antd";
import {
  QuestionCircleOutlined,
  LoadingOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { withRouter } from "react-router-dom";
import bcrypt from "bcryptjs";
import logo from "./logo.png";
import "./Register.css";

function RegistrationPage(props) {
  const [form] = Form.useForm();
  const u_key = "updatable";
  const iv_key = "invalid";
  const v_key = "valid";

  const [email, setEmail] = useState("");
  const [nickname, setNickName] = useState("");
  const [email_checked, setEmailChecked] = useState(false);
  const [nick_checked, setNickChecked] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const emailInput = useRef();
  const nickInput = useRef();

  const destory_message = (key) => {
    if (key === "all") {
      message.destroy(u_key);
      message.destroy(iv_key);
      message.destroy(v_key);
    } else {
      message.destroy(key);
    }
  };
  const onFinish = (values) => {
    const result = Object.assign({ imageUrl: imageUrl }, values);
    if (!email_checked)
      return message.error({
        content: "이메일 중복체크를 실시해주시기 바랍니다.",
        iv_key: iv_key,
      });
    if (!nick_checked)
      return message.error({
        content: "닉네임 중복체크를 실시해주시기 바랍니다.",
        iv_key: iv_key,
      });

    message.loading({ content: "Loading...", u_key });

    bcrypt.hash(values.password, 10, (err, res) => {
      if (err) throw err;
      result.password = res;
      result.confirm = res;
      fetch("/create", {
        method: "POST",
        body: JSON.stringify(result),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (res.status === 200) {
            message
              .success("회원가입에 성공하였습니다!", 2, destory_message("all"))
              .then(props.history.push("/login"));
          } else {
            throw new Error("알 수 없는 오류가 발생했습니다.");
          }
        })
        .catch((err) => {
          alert(err);
        });
    });
  };

  function check(key, value) {
    return new Promise((resolve, reject) => {
      const url = "auth/vaild_check";
      fetch(url, {
        method: "POST",
        body: JSON.stringify({ [key]: value }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          resolve(res.status);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  const checkEmail = () => {
    check("email", email).then((result) => {
      if (result === 200) {
        setEmailChecked(true);
        message.destroy(iv_key);
        return message.success({ content: "사용 가능한 이메일입니다.", v_key });
      } else if (result === 409) {
        emailInput.current.focus();
        return message.error({ content: "이미 등록된 이메일입니다.", iv_key });
      }
    });
  };

  const checkNick = () => {
    check("nickname", nickname).then((result) => {
      if (result === 200) {
        setNickChecked(true);
        message.destroy(iv_key);
        return message.success({ content: "사용 가능한 닉네임입니다.", v_key });
      } else if (result === 409) {
        nickInput.current.focus();
        return message.error({ content: "이미 등록된 닉네임입니다.", iv_key });
      }
    });
  };

  function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  function beforeUpload(file) {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  }

  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      getBase64(info.file.originFileObj, (imageUrl) => {
        setImageUrl(imageUrl);
        setLoading(false);
      });
    }
  };
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div className="ant-upload-text">Upload</div>
    </div>
  );
  return (
    <div className="Register">
      <img src={logo} className="logo" alt="logo" />
      <div className="RegisterForm">
        <Form
          form={form}
          name="register"
          onFinish={onFinish}
          initialValues={{
            prefix: "82",
          }}
          scrollToFirstError
        >
          <Form.Item label="아이콘">
            <Upload
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              beforeUpload={beforeUpload}
              onChange={handleChange}
            >
              {imageUrl ? (
                <img src={imageUrl} alt="avatar" style={{ width: "100%" }} />
              ) : (
                uploadButton
              )}
            </Upload>
          </Form.Item>
          <Form.Item
            label="이메일"
            style={{ marginBottom: 0 }}
            rules={[
              {
                required: true,
              },
            ]}
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
                  message: "Email 주소를 입력하세요.",
                },
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    setEmail(getFieldValue("email"));
                    return Promise.resolve();
                  },
                }),
              ]}
              style={{ display: "inline-block", width: "calc(70% - 16px)" }}
            >
              <Input ref={emailInput} disabled={email_checked ? true : false} />
            </Form.Item>
            <Form.Item
              style={{
                display: "inline-block",
                width: "calc(30% - 16px)",
                margin: "0 8px",
              }}
            >
              <Button
                type="primary"
                onClick={checkEmail}
                disabled={email_checked ? true : false}
              >
                중복체크
              </Button>
            </Form.Item>
          </Form.Item>
          <Form.Item
            name="password"
            label="비밀번호"
            rules={[
              {
                required: true,
                message: "비밀번호 입력",
              },
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="confirm"
            label="비밀번호 재확인"
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "비밀번호 확인",
              },
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  console.log(getFieldValue("email"));
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }

                  return Promise.reject(
                    "비밀번호가 일치하지 않습니다. 다시 시도해주세요."
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label={
              <span>
                닉네임&nbsp;
                <Tooltip title="자취인에서 이름 대신 사용합니다!">
                  <QuestionCircleOutlined />
                </Tooltip>
              </span>
            }
            rules={[
              {
                required: true,
              },
            ]}
            style={{ marginBottom: 0 }}
          >
            <Form.Item
              name="nickname"
              rules={[
                {
                  required: true,
                  message: "닉네임을 입력하세요.",
                  whitespace: true,
                },
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    setNickName(getFieldValue("nickname"));
                    return Promise.resolve();
                  },
                }),
              ]}
              style={{ display: "inline-block", width: "calc(70% - 16px)" }}
            >
              <Input ref={nickInput} disabled={nick_checked ? true : false} />
            </Form.Item>
            <Form.Item
              style={{
                display: "inline-block",
                width: "calc(30% - 16px)",
                margin: "0 8px",
              }}
            >
              <Button
                type="primary"
                onClick={checkNick}
                disabled={nick_checked ? true : false}
              >
                중복체크
              </Button>
            </Form.Item>
          </Form.Item>

          <Form.Item
            name="agreement"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value
                    ? Promise.resolve()
                    : Promise.reject("Should accept agreement"),
              },
            ]}
          >
            <Checkbox>
              {/* <a
                href=""
                onClick="window.open(this.href, '_blank,'width=600,height=400'); return false"
              > */}
              이용약관
              {/* </a> */}에 동의합니다.
            </Checkbox>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              회원가입
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default withRouter(RegistrationPage);
