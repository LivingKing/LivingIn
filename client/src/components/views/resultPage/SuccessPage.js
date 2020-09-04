import React from "react";
import { Result } from "antd";
import { Link } from "react-router-dom";

const SuccessPage = () => {
  return (
    <Result
      status="success"
      title="이메일 인증 성공!"
      subTitle="로그인 페이지에서 로그인 해주세요."
      extra={[<Link to="/login">로그인하기</Link>]}
    />
  );
};

export default SuccessPage;
