import {
    Tabs,
} from "antd";
import {connect} from "umi";
import {useEffect, useState} from "react";

import {StaticInfo} from "@/StaticInfo";
import CheckZsContracte from "@/pages/check/checkZsContracte";
import CheckDjContracte from "@/pages/check/CheckDjContracte";
import {NavBar} from "antd-mobile";
import {history} from "@@/core/history";

const CheckContracte=(props:any)=> {
    const [activeKey, setActiveKey] = useState(sessionStorage.getItem('activeCheckcontract') || '1');
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const onChange = (key) => {
        setActiveKey(key);
        sessionStorage.setItem('activeCheckcontract', key);
    };
    const [uqx, setUqx] = useState([]);
    useEffect(() => {
        let uq = StaticInfo.uqx.split('');
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
    return (
        <div style={getPageContainerStyle()}>
            <NavBar
                onBack={() => history.push('/dashboard/')}
                style={getNavBarStyle()}
            >
                合同审批
            </NavBar>
            <Tabs activeKey={activeKey} onChange={onChange}>
                <Tabs.TabPane tab='正式合同' key='1'>
                    <CheckZsContracte/>
                </Tabs.TabPane>
                {uqx[387] == '1' ? <Tabs.TabPane tab='定金合同' key='2'>
                    <CheckDjContracte/>
                </Tabs.TabPane> : ''
                }
            </Tabs>
        </div>
    )
}
export default connect() (CheckContracte)