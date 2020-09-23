import React, { useState, useRef, useEffect } from "react";
import { withRouter } from "react-router-dom";
import {
  Form,
  Input,
  Tooltip,
  Button,
  message,
  Upload,
  DatePicker,
} from "antd";
import {
  QuestionCircleOutlined,
  LoadingOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import Header from "../../libs/Header/Header";
import "./Settings.css";
import bcrypt from "bcryptjs";
import axios from "axios";

const Settings = (props) => {
  console.log(props);
  const [form] = Form.useForm();
  const u_key = "updatable";
  const iv_key = "invalid";
  const v_key = "valid";

  const [email, setEmail] = useState("");
  const [nickname, setNickName] = useState("");
  const [password, setPassword] = useState("");
  const [birthday, setBirthDay] = useState("");
  const [nick_checked, setNickChecked] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [is_email_vaild, setIsEmailVaild] = useState(false);
  const [is_nick_vaild, setIsNickVaild] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const emailInput = useRef();
  const nickInput = useRef();

  useEffect(() => {
    message.info(props);
    getUser();
  });

  const getUser = async () => {
    const user = await axios(
      `http://localhost:8000/api/userinfo?email=${props.email}`
    );
    setEmail(user.email);
    setNickName(user.nickname);
    setImageUrl(user.icon);
    setPassword(user.password);
    setIsLoading(false);
  };
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
    if (!nick_checked)
      return message.error({
        content: "닉네임 중복체크를 실시해주시기 바랍니다.",
        iv_key: iv_key,
      });

    message.loading({ content: "Loading...", u_key });

    bcrypt.hash(values.password, 10, async (err, res) => {
      if (err) throw err;
      result.password = res;
      result.confirm = res;
      const res2 = await axios.post("/create", result);
      if (res2.status === 200) {
        message
          .success(
            "회원가입에 성공하였습니다! 이메일 인증을 진행해주세요!",
            2,
            destory_message("all")
          )
          .then(props.history.push("/login"));
      } else {
        throw new Error("알 수 없는 오류가 발생했습니다.");
      }
    });
  };

  const check = async (key, value) => {
    const url = "auth/vaild_check";
    const res = await axios.post(url, { [key]: value }).catch(() => {
      return { status: 409 };
    });
    return res;
  };

  const checkNick = async () => {
    if (!is_nick_vaild) {
      return message.error("닉네임은 2글자 이상 해야합니다.");
    }
    const res = await check("nickname", nickname);
    if (res.status === 200) {
      setNickChecked(true);
      message.destroy(iv_key);
      return message.success({ content: "사용 가능한 닉네임입니다.", v_key });
    } else if (res.status === 409) {
      nickInput.current.focus();
      return message.error({ content: "이미 등록된 닉네임입니다.", iv_key });
    }
  };

  function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  function beforeUpload(file) {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("JPG/PNG 파일만 업로드 가능합니다!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("이미지는 2MB보다 작아야합니다!");
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
      {loading ? (
        <LoadingOutlined />
      ) : (
        <div>
          <PlusOutlined />
        </div>
      )}
      <div>Upload</div>
    </div>
  );
  return (
    <div className="settings__container">
      <Header />
      {isLoading ? (
        <div></div>
      ) : (
        <div className="profile">
          <div className="profile__form">
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
                    <img
                      src={imageUrl}
                      alt="avatar"
                      style={{ width: "100%", borderRadius: "100px" }}
                    />
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
                        const pattern = new RegExp(
                          /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
                        );

                        if (pattern.test(value)) {
                          setEmail(value);
                          setIsEmailVaild(true);
                          return Promise.resolve();
                        } else {
                          setIsEmailVaild(false);
                        }
                      },
                    }),
                  ]}
                  style={{ display: "inline-block", width: "calc(70% - 16px)" }}
                >
                  <Input
                    ref={emailInput}
                    disabled={true}
                    defaultValue={email}
                  />
                </Form.Item>
              </Form.Item>
              <Form.Item
                name="password"
                label="비밀번호"
                rules={[
                  {
                    required: true,
                    message: "비밀번호 입력하세요.",
                  },
                ]}
                hasFeedback
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                name="name"
                label="이름"
                rules={[{ required: true, message: "이름 입력하세요." }]}
              >
                <Input disabled={true} />
              </Form.Item>
              <Form.Item
                name="birthday"
                label="생년월일"
                rules={[
                  {
                    required: true,
                    message: "생년월일을 입력하세요.",
                  },
                ]}
              >
                <DatePicker
                  style={{ width: "31vh" }}
                  locale="ko-kr"
                  disabled={true}
                  defaultValue={birthday}
                />
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
                        if (value.replace(/\s/gi, "").length >= 2) {
                          setNickName(value);
                          setIsNickVaild(true);
                          return Promise.resolve();
                        } else {
                          setIsNickVaild(false);
                          return Promise.reject(
                            "닉네임은 공백을 제외한 2글자 이상 입력해야합니다."
                          );
                        }
                      },
                    }),
                  ]}
                  style={{ display: "inline-block", width: "calc(70% - 16px)" }}
                >
                  <Input
                    ref={nickInput}
                    disabled={nick_checked ? true : false}
                  />
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

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  저장하기
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      )}
    </div>
  );
};

export default withRouter(Settings);