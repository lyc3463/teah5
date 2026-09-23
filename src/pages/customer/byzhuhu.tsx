import {Tabs} from "antd";
import {useEffect, useState} from "react";
import {StaticInfo} from "@/StaticInfo";
import Bymoney from "@/pages/customer/bymoney";
import Byappuser from "@/pages/customer/byappuser";
import Byele from "@/pages/customer/byele";
import Bywater from "@/pages/customer/bywater";
import Byitem from "@/pages/customer/byitem";
import {NavBar} from "antd-mobile";
import {history} from "@@/core/history";

const Byzhuhu=()=>{
    const [uqx,setUqx]=useState([]);
    const [uid,setUid]=useState('0');
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        setUid(id);
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
    const getContentContainerStyle = () => {
        return {
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            padding: windowWidth <= 480 ? '10px' : '20px'
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
                onBack={() => history.push('/customer')}
                style={getNavBarStyle()}
            >
                客户关联
            </NavBar>
            <Tabs
                style={getTabsStyle()}
                tabBarScroll
            >
                {uqx[254] === '1' && (
                    <Tabs.TabPane
                        tab='修改最低充值'
                        key='1'
                        tabStyle={getTabPaneStyle()}
                    >
                        <div style={getContentContainerStyle()}>
                            <Bymoney id={uid}/>
                        </div>
                    </Tabs.TabPane>
                )}
                {uqx[351] === '1' && (
                    <Tabs.TabPane
                        tab='绑定小程序'
                        key='2'
                        tabStyle={getTabPaneStyle()}
                    >
                        <div style={getContentContainerStyle()}>
                            <Byappuser id={uid}/>
                        </div>
                    </Tabs.TabPane>
                )}
                {uqx[352] === '1' && (
                    <Tabs.TabPane
                        tab='绑定电表'
                        key='3'
                        tabStyle={getTabPaneStyle()}
                    >
                        <div style={getContentContainerStyle()}>
                            <Byele id={uid}/>
                        </div>
                    </Tabs.TabPane>
                )}
                {uqx[353] === '1' && (
                    <Tabs.TabPane
                        tab='绑定水表'
                        key='4'
                        tabStyle={getTabPaneStyle()}
                    >
                        <div style={getContentContainerStyle()}>
                            <Bywater id={uid}/>
                        </div>
                    </Tabs.TabPane>
                )}
                {uqx[354] === '1' && (
                    <Tabs.TabPane
                        tab='绑定公共缴费'
                        key='5'
                        tabStyle={getTabPaneStyle()}
                    >
                        <div style={getContentContainerStyle()}>
                            <Byitem id={uid}/>
                        </div>
                    </Tabs.TabPane>
                )}
            </Tabs>
        </div>
    );
};

export default Byzhuhu;