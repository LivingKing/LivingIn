import React from "react";
import { Result, Button } from "antd";

const FailPage = () => {
  const closeWindow = () => {
    window.open("", "_self").close();
  };
  return (
    <Result
      status="error"
      title="이메일 인증 실패"
      subTitle="이미 이메일 인증을 시도하였거나 잘못된 인증 토큰이거나 인증시간이 만료되었습니다. 인증시간이 만료되었을 경우 해당 이메일 가입을 무효 처리합니다."
      extra={[
        <Button onClick={closeWindow} danger>
          창닫기
        </Button>,
      ]}
    ></Result>
  );
};

export default FailPage;
