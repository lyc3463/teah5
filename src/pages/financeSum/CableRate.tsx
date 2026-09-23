import {connect} from "umi";
import {Button, DatePicker, Image, Input, List, message, Pagination, Select, Space, Spin, Table, Tabs, Tag} from "antd";
import dayjs from "dayjs";
import {useEffect, useState} from "react";
import HourCableRate from "@/pages/financeSum/hourCableRate";
import DayCableRate from "@/pages/financeSum/dayCableRate";
import {StaticInfo} from "@/StaticInfo";
import {NavBar} from "antd-mobile";
import {history} from "@@/core/history";

const CableRate=(props)=>{
    const [uqx,setUqx]=useState([]);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [activeKey, setActiveKey] = useState(sessionStorage.getItem('cableRateActive') || '1');
    const onChange = (key) => {
        setActiveKey(key);
        sessionStorage.setItem('cableRateActive', key);
    };
    useEffect(() => {
        let uq=StaticInfo.uqx.split('');
        setUqx(uq);
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
                电费扣费记录
            </NavBar>
            <Tabs  activeKey={activeKey} onChange={onChange}  style={getTabsStyle()}>
                <Tabs.TabPane tab='小时扣电费' key='1' tabStyle={getTabPaneStyle()}>
                    <HourCableRate/>
                </Tabs.TabPane>
                {uqx[392]=='1'?
                    <Tabs.TabPane tab='天扣电费' key='2' tabStyle={getTabPaneStyle()}>
                        <DayCableRate/>
                    </Tabs.TabPane>:''}
            </Tabs>
        </div>
    )
}
export default connect() (CableRate)