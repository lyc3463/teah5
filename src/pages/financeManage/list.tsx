import {Button, Space,Tabs} from "antd";
import CompanyList from "@/pages/financeManage/companyList";
import ProjectList from "@/pages/financeManage/projectList";
import AccountList from "@/pages/financeManage/accountList";
import SubjectList from "@/pages/financeManage/subjectList";
import Supplier from "@/pages/financeManage/supplier";
import {useEffect, useState} from "react";
import {StaticInfo} from "@/StaticInfo";
import {history} from "@@/core/history";
import {NavBar} from "antd-mobile";
const List=()=>{
    const [activeKey, setActiveKey] = useState(sessionStorage.getItem('financeManageList') || '1');
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    // 用户权限
    const [uqx,setUqx]=useState([]);
    const onChange = (key) => {
        setActiveKey(key);
        sessionStorage.setItem('financeManageList', key);
    };
    useEffect(() => {
        let uq=StaticInfo.uqx.split('');
        setUqx(uq);
    }, []);
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    const getPageContainerStyle = () => {
        return {
            maxWidth: windowWidth <= 480 ? '90%' : '600px',
            margin: '0 auto',
            padding: windowWidth <= 480 ? '10px' : '20px',
        };
    };
    const getNavBarStyle = () => {
        return {
            '--height': windowWidth <= 480 ? '40px' : '48px',
            '--border-bottom': 'none',
            '--background-color': '#fff',
            '--color': '#333',
            '--font-size': windowWidth <= 480 ? '16px' : '18px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
        };
    };
    return(
        <div>
            <NavBar
                onBack={() => history.push('/dashboard/')}
                style={getNavBarStyle()}
            >
            </NavBar>
            <Tabs activeKey={activeKey} onChange={onChange} style={getPageContainerStyle()}>
                {uqx[145]=='1'?
                    <Tabs.TabPane tab="公司列表" key="1">
                        <CompanyList/>
                    </Tabs.TabPane>
                    :''}
                {uqx[149]=='1'?
                    <Tabs.TabPane tab="项目列表" key="2">
                        <ProjectList/>
                    </Tabs.TabPane>
                    :''}
                {uqx[157]=='1'?
                    <Tabs.TabPane tab="账户列表" key="3">
                        <AccountList/>
                    </Tabs.TabPane>
                    :''}
                {uqx[161]=='1'?
                    <Tabs.TabPane tab="科目列表" key="4">
                        <SubjectList/>
                    </Tabs.TabPane>
                    :''}
                <Tabs.TabPane tab="供应商" key="5">
                    <Supplier/>
                </Tabs.TabPane>

            </Tabs>
        </div>
    )
}
export default List