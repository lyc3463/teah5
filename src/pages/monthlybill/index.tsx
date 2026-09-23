import {Button, DatePicker, Input, List, Pagination, Space, Table, Tabs, Tag} from "antd";
import {connect} from "umi";
import {useEffect, useState} from "react";

import ZuList from '@/pages/monthlybill/ZuList';
import ServerList from "@/pages/monthlybill/ServerList";
import AllList from "@/pages/monthlybill/AllList";
import CableKoufeiList from "@/pages/monthlybill/CableKoufeiList";
import WaterKoufeiList from "@/pages/monthlybill/WaterKoufeiList";
import LiquidatedDamagesList from "@/pages/monthlybill/LiquidatedDamagesList";
import {NavBar} from "antd-mobile";
import {history} from "@@/core/history";
const MonthlyBill=(props:any)=>{
    const [activeKey, setActiveKey] = useState(sessionStorage.getItem('zdActive') || '1');
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const onChange = (key) => {
        setActiveKey(key);
        sessionStorage.setItem('zdActive', key);
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
    const getNavBarStyle = () => ({
        '--height': windowWidth <= 480 ? '40px' : '48px',
        '--border-bottom': 'none',
        '--background-color': '#fff',
        '--font-size': windowWidth <= 480 ? '14px' : '16px',
    });
    return(
        <div style={getPageContainerStyle()}>
             <NavBar
                 onBack={() => history.push('/dashboard/')}
                 style={getNavBarStyle()}
             >
                 当月账单
             </NavBar>
            <Tabs activeKey={activeKey} onChange={onChange} tabBarScroll style={getTabsStyle()}>
                <Tabs.TabPane tab='租金/管理费' key='1' tabStyle={getTabPaneStyle()}>
                    <ZuList/>
                </Tabs.TabPane>
                <Tabs.TabPane tab='公共缴费' key='2' tabStyle={getTabPaneStyle()}>
                    <AllList/>
                </Tabs.TabPane>
                <Tabs.TabPane tab='服务费' key='3' tabStyle={getTabPaneStyle()}>
                    <ServerList/>
                </Tabs.TabPane>
                <Tabs.TabPane tab='电费账单' key='4' tabStyle={getTabPaneStyle()}>
                    <CableKoufeiList/>
                </Tabs.TabPane>
                <Tabs.TabPane tab='水费账单' key='5' tabStyle={getTabPaneStyle()}>
                    <WaterKoufeiList/>
                </Tabs.TabPane>
                <Tabs.TabPane tab='违约金账单' key='6' tabStyle={getTabPaneStyle()}>
                    <LiquidatedDamagesList/>
                </Tabs.TabPane>
            </Tabs>
        </div>
    )
}
// const mapStateToProps = (state: any) => {
//     return {
//         MonthlyBillList: state.MonthlyBill.list,
//         count: state.MonthlyBill.count,
//     }
// };
export default connect() (MonthlyBill)