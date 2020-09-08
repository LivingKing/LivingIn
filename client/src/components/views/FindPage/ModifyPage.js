import React from "react";
import { Form, Input, Button } from "antd";
import Axios from "axios";
import bcrypt from "bcryptjs";

const ModifyPage = (props) => {
  const [form] = Form.useForm();
  let params = props.history.location.search.split("=");
  console.log(params);
  const onFinish = async (values) => {
    bcrypt.hash(values.password, 10, async (err, result) => {
      if (err) throw err;
      values.password = result;
      values.confirm = result;
      const res = await Axios.post("http://localhost:8000/auth/modify", {
        token: params[1],
        password: values.password,
      });
      if (res.status === 200) {
        props.history.push({
          pathname: "/confirm/success",
          state: { title: "password" },
        });
      } else {
        props.history.push({
          pathname: "/confirm/fail",
          state: { title: "password" },
        });
      }
    });
  };
  return (
    <Form
      form={form}
      name="register"
      onFinish={onFinish}
      initialValues={{
        prefix: "82",
      }}
      scrollToFirstError
    >
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
        name="confirm"
        label="비밀번호 재확인"
        dependencies={["password"]}
        hasFeedback
        rules={[
          {
            required: true,
            message: "비밀번호 일치하지 않습니다.",
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
      <Form.Item>
        <Button type="primary" htmlType="submit">
          변경하기
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ModifyPage;
