import {connect} from "umi";
import {Tabs} from "antd";
import ManualRecharge from '@/pages/message/manualRecharge';
import AutoTopUp from "@/pages/message/autoTopUp";
import {NavBar} from "antd-mobile";
import {history} from "@@/core/history";
import {useEffect, useState} from "react";
const ChongzhiLog=(props)=>{
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [activeKey, setActiveKey] = useState(sessionStorage.getItem('msgLogactive') || '1');
    const getContainerStyle = () => {
        return {
            padding: windowWidth <= 480 ? '12px' : '16px',
            maxWidth: windowWidth <= 480 ? '100%' : '600px',
            margin: '0 auto',
            height: '90vh',
            overflowY: 'auto',
            scrollbarWidth: 'thin',
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
    const onChange = (key) => {
        setActiveKey(key);
        sessionStorage.setItem('msgLogactive', key);
    };
    return(
        <div style={getContainerStyle()}>
             <NavBar
                 onBack={() => history.push('/dashboard')}
                 style={{
                     '--height': '48px',
                     '--border-bottom': 'none',
                     '--background-color': '#fff'
                 }}
             >
                 短信充值
             </NavBar>
            <Tabs activeKey={activeKey} onChange={onChange}>
                <Tabs.TabPane tab='手动充值' key='1'>
                    <ManualRecharge/>
                </Tabs.TabPane>
                <Tabs.TabPane tab='自动充值' key='2'>
                    <AutoTopUp/>
                </Tabs.TabPane>
            </Tabs>
        </div>
    )
}
export default connect() (ChongzhiLog)