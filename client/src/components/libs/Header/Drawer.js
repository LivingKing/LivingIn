import React, { useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Input, Select, List, Divider, message, Spin} from "antd";
import {  Drawer } from "antd";
import "./Header.css";

function QuickSearch(props) {
    const [firstLoad, setFirstLoad] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [isFinish, setIsFinish] = useState(false);
    const [visible, setVisible] = useState(false);
    let [boardList, setboardList] = useState("");
    const [command, setCommand] = useState(`/api/searchAll?value=`);

    const { Search } = Input;
    const { Option } = Select;

    const onSearch = (value) => {
        setIsLoading(true);
        setIsFinish(false);
        setFirstLoad(false);

        console.log(command + value);
        const onLoad = async () => {
            const res = await fetch(`${command + value}`, {
                method: "GET",
            });
            if (res.status === 200) {
                const result = await res.json();
                if (!result) {
                    console.log("empty");
                } else {
                    setboardList(result);
                }

            } else {
                message.error("불러오기 실패!");
            }
        };
        onLoad();

        setTimeout(() => {
            setIsLoading(false);
            setIsFinish(true);
            console.log(command + value);
        }, 2000);

    }

    const selectChange = (value) => {
        value === "all" ? setCommand(`/api/searchAll?value=`) :
            value === "title" ? setCommand(`/api/searchTitle?title=`) :
                setCommand(`/api/searchWriter?writer=`);
        console.log(command);
    };

    const selectBefore = (
        <Select defaultValue="all" onChange={selectChange} disabled={isLoading ? true : false}>
            <Option value="all">전체</Option>
            <Option value="writer">글쓴이</Option>
            <Option value="title">제목</Option>
        </Select>
    )

    const showDrawer = () => {
        setVisible(true);
    };
    const onClose = () => {
        setVisible(false);
        setIsFinish(false);
        setFirstLoad(true);
    };

    return (
        <div>
            <SearchOutlined onClick={showDrawer} className="header__search" />

            <Drawer
                title="빠른 게시물 찾기"
                placement="right"
                closable={true}
                onClose={onClose}
                visible={visible}
                width="400px"
                destroyOnClose="true"
            >

                <div style={isLoading ? { marginBottom: 60 } : { marginBottom: 25 }}>
                    {isLoading ? <Search
                        placeholder="찾을 내용을 입력하세요"
                        allowClear
                        onSearch={onSearch}
                        style={{ width: 350, margin: '0 2px' }}
                        size="large"
                        addonBefore={selectBefore}
                        loading enterButton
                    /> : <Search
                            placeholder="찾을 내용을 입력하세요"
                            allowClear
                            onSearch={onSearch}
                            style={{ width: 350, margin: '0 2px' }}
                            size="large"
                            addonBefore={selectBefore}
                        />}


                </div>



                {isFinish ? <div>
                    <Divider orientation="left">게시물 검색 결과</Divider>
                    <List
                        size="small"
                        bordered
                        // header={<div>Header</div>}
                        // footer={<div>Footer</div>}
                        dataSource=
                        {boardList.map((c, index) => {
                            return <SearchResult
                                key={index}
                                id={c._id}
                                category={c.category}
                                hits={c.hits}
                                create={c.created_At}
                                content={c.content}
                                writer={c.writer}
                                title={c.title}
                                link={"/detail/" + c._id}
                            />
                        })}
                        renderItem={item => <List.Item>{item}</List.Item>}
                    /></div> :
                    <div style={{ textAlign: "center" }}>
                        {firstLoad ? <></> : <Spin tip="Loading..." size="large" />}
                    </div>}





            </Drawer>
        </div>
    );
}
const SearchResult = (props) => {
    return (
        <div className="content">
            <li>
                <a href={props.link} class="tit_txt">{props.title}</a>
                <p class="writerInSearch">{props.writer}</p>
                <p class="link_dsc_txt">{props.content}</p>
                <p class="dsc_sub"><a href="/board" class="sub_txt">{props.category}</a><span class="date_time">{props.create}</span></p>
            </li>
        </div>

    );
};
export default QuickSearch;