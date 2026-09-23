import dayjs from "dayjs";
import {
    Button,
    DatePicker,
    Input,
    List,
    message,
    Pagination,
    Select,
    Space,
    Spin,
    Table,
    Tabs,
    Tag,
    Tooltip
} from "antd";
import {useEffect, useState} from "react";
import WxOrder from "@/pages/financeSum/wxOrder";
import BackOrder from "@/pages/financeSum/backOrder";
import {NavBar} from "antd-mobile";
import {history} from "@@/core/history";
import {StaticInfo} from "@/StaticInfo";

const PaymentLog=()=>{
    const [activeKey, setActiveKey] = useState(sessionStorage.getItem('payActive') || '1');
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const onChange = (key) => {
        setActiveKey(key);
        sessionStorage.setItem('payActive', key);
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
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    return(
        <div style={getPageContainerStyle()}>
            <NavBar
                onBack={() => history.back()}
                style={getNavBarStyle()}
            >
                支付订单
            </NavBar>
            <Tabs activeKey={activeKey} onChange={onChange}>
                <Tabs.TabPane tab='微信订单' key='1'>
                    <WxOrder/>
                </Tabs.TabPane>
                <Tabs.TabPane tab='银行转账订单' key='2'>
                    <BackOrder/>
                </Tabs.TabPane>
            </Tabs>
        </div>
    )
}
export default PaymentLog