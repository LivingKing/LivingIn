import React from "react";
import { Form, Input, Tooltip, Select, Checkbox, Button } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { withRouter } from "react-router-dom";
import bcrypt from "bcryptjs";
import logo from "./logo.png";
import "./Register.css";
import Avatar from "./Avatar";

function RegistrationForm(props) {
  const { Option } = Select;
  //   const formItemLayout = {
  //     labelCol: {
  //       xs: {
  //         span: 24,
  //       },
  //       sm: {
  //         span: 10,
  //       },
  //     },
  //     wrapperCol: {
  //       xs: {
  //         span: 24,
  //       },
  //       sm: {
  //         span: 4,
  //       },
  //     },
  //   };
  //   const tailFormItemLayout = {
  //     wrapperCol: {
  //       xs: {
  //         span: 24,
  //         offset: 0,
  //       },
  //       sm: {
  //         span: 8,
  //         offset: 8,
  //       },
  //     },
  //   };
  const [form] = Form.useForm();

  const onFinish = (values) => {
    let url = "http://localhost:5000/register";
    bcrypt.hash(values.password, 10, (err, res) => {
      if (err) throw err;
      values.password = res;
      values.confirm = res;
      fetch(url, {
        method: "POST",
        body: JSON.stringify(values), // data can be `string` or {object}!
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((res) => console.log("Success:", JSON.stringify(res)));
    });
  };

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select
        style={{
          width: 70,
        }}
      >
        <Option value="82">+82</Option>
      </Select>
    </Form.Item>
  );

  return (
    <div className="Register">
      <img src={logo} className="logo" alt="logo" />
      <div className="RegisterForm">
        <Form
          //   {...formItemLayout}
          form={form}
          name="register"
          onFinish={onFinish}
          initialValues={{
            prefix: "82",
          }}
          scrollToFirstError
        >
          {/* <Form.Item name="icon" value={props.imageUrl} label="아이콘">
          <Avatar />
        </Form.Item> */}
          <Form.Item
            name="email"
            label="이메일"
            rules={[
              {
                type: "email",
                message: "이메일 형식으로 입력해주세요.",
              },
              {
                required: true,
                message: "Email 주소를 입력하세요.",
              },
            ]}
          >
            <Input />
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
            name="nickname"
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
                message: "닉네임을 입력하세요.",
                whitespace: true,
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="phone"
            label="휴대전화"
            rules={[
              {
                required: true,
                message: "휴대전화 번호를 입력하세요.",
              },
            ]}
          >
            <Input
              addonBefore={prefixSelector}
              style={{
                width: "100%",
              }}
            />
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
            // {...tailFormItemLayout}
          >
            <Checkbox>
              I have read the <a href="">동의합니다.</a>
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

export default withRouter(RegistrationForm);
