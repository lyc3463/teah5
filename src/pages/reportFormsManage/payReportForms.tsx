import {connect} from "umi";
import {Tabs} from "antd";
import UserPayReportForms from "@/pages/reportFormsManage/userPayReportForms";
import AppUserPayReportForms from "@/pages/reportFormsManage/appUserPayReportForms";
import {NavBar} from "antd-mobile";
import {history} from "@@/core/history";
import {useEffect, useState} from "react";
import {StaticInfo} from "@/StaticInfo";


const PayReportForms=(props)=>{
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const getPageContainerStyle = () => {
        return {
            maxWidth: windowWidth <= 480 ? '90%' : '600px',
            margin: '0 auto',
            padding: windowWidth <= 480 ? '10px' : '20px',
        };
    };
     useEffect(() => {
         const handleResize = () => {
             setWindowWidth(window.innerWidth);
         };
         window.addEventListener('resize', handleResize);
         return () => {
             window.removeEventListener('resize', handleResize);
         };
     }, []);
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
        <div style={getPageContainerStyle()}>
            <NavBar
                onBack={() => history.back()}
                style={getNavBarStyle()}
            >
                财务报表
            </NavBar>
            <Tabs>
                <Tabs.TabPane tab='租户报表'  key='1'>
                    <UserPayReportForms/>
                </Tabs.TabPane>
                <Tabs.TabPane tab='用户报表'  key='2'>
                    <AppUserPayReportForms/>
                </Tabs.TabPane>
            </Tabs>
        </div>
    )
}

export default connect() (PayReportForms)