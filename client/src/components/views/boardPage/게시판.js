import React from "react";
import Menu from './Menu';
import Menu from './Grid';
const {  Layout  } = antd;

const { Header, Footer, Sider, Content } = Layout;

ReactDOM.render(
<Layout>
    <Sider><Menu /></Sider>
    <Layout>
      <Header>Header</Header>
      <Content><Grid /></Content>
      <Footer>Footer</Footer>
    </Layout>
  </Layout>


);