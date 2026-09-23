import {Tabs} from "antd";
import {useState} from "react";
import RechargeSetUp from "@/pages/systemManage/rechargeSetUp";
import ConfigurationWxId from "@/pages/systemManage/configurationWxId";
import {NavBar} from "antd-mobile";
import {history} from "@@/core/history";

const Allpz=()=>{
    const [activeKey, setActiveKey] = useState(sessionStorage.getItem('chongzhiacz') || '1');
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const onChange = (key) => {
        setActiveKey(key);
        sessionStorage.setItem('chongzhiacz', key);
    };
    const getPageContainerStyle = () => {
        return {
            maxWidth: windowWidth <= 480 ? '90%' : '600px',
            margin: '0 auto',
            padding: windowWidth <= 480 ? '10px' : '20px',
        };
    };

    const getTabsStyle = () => {
        return {
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
            '&::-webkit-scrollbar': {
                display: 'none'
            },
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            marginBottom: windowWidth <= 480 ? '10px' : '20px',
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
        };
    };
    const getTabPaneStyle = () => {
        return {
            minWidth: windowWidth <= 480 ? '100px' : '120px',
            whiteSpace: 'nowrap',
            padding: windowWidth <= 480 ? '8px 12px' : '12px 16px',
            textAlign: 'center'
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
        <div style={getPageContainerStyle()}>
            <NavBar
                onBack={() => history.push('/dashboard')}
                style={getNavBarStyle()}
            >
                系统配置
            </NavBar>
            <Tabs  activeKey={activeKey} onChange={onChange}>
                <Tabs.TabPane tab='手动充值配置' key='1'>
                    <RechargeSetUp/>
                </Tabs.TabPane>
                <Tabs.TabPane tab='配置企业ID' key='2'>
                    <ConfigurationWxId/>
                </Tabs.TabPane>
            </Tabs>
        </div>
    )
}
export default Allpz