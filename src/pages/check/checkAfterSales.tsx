import {useEffect, useState} from "react";
import {StaticInfo} from "@/StaticInfo";
import {Tabs} from "antd";
import {NavBar} from "antd-mobile";
import {history} from "@@/core/history";
import CheckName from "@/pages/check/checkName";
import CheckRenew from "@/pages/check/checkRenew";
import CheckRenewOut from "@/pages/check/checkRenewOut";
import CheckPreferential from "@/pages/check/checkPreferential";
import CheckByStages from "@/pages/check/checkByStages";
import CheckDeept from "@/pages/check/checkDeept";
const CheckAfterSales=()=>{
    const [activeKey, setActiveKey] = useState(sessionStorage.getItem('checkactiveTabKey1') || '1');
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    // 用户权限
    const [uqx,setUqx]=useState([]);
    const onChange = (key) => {
        setActiveKey(key);
        sessionStorage.setItem('checkactiveTabKey1', key);
    };
    useEffect(() => {
        let uq=StaticInfo.uqx.split('');
        setUqx(uq);
    }, []);
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
    const getNavStyle = () => {
        return {
            padding: windowWidth <= 480 ? '12px' : '16px',
            maxWidth: windowWidth <= 480 ? '100%' : '600px',
            margin: '0 auto',
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
        <div style={getContainerStyle()}>
            <NavBar
                onBack={() => history.push('/dashboard')}
                style={{
                    '--height': '48px',
                    '--border-bottom': 'none',
                    '--background-color': '#fff'
                }}
            >
                审核售后
            </NavBar>
            <Tabs activeKey={activeKey} onChange={onChange}>
                {uqx[219]=='1'? <Tabs.TabPane tab='更名审核' key='1'>
                        <CheckName/>
                    </Tabs.TabPane>
                    :''}
                {uqx[221]=='1'?<Tabs.TabPane tab='续租审核' key='3'>
                        <CheckRenew/>
                    </Tabs.TabPane>
                    :''}
                {uqx[222]=='1'?<Tabs.TabPane tab='退租审核' key='4'>
                        <CheckRenewOut/>
                    </Tabs.TabPane>
                    :''}
                {uqx[223]=='1'?<Tabs.TabPane tab='优惠审核' key='5'>
                        <CheckPreferential/>
                    </Tabs.TabPane>
                    :''}
                {uqx[223]=='1'?<Tabs.TabPane tab='分期审核' key='6'>
                        <CheckByStages/>
                    </Tabs.TabPane>
                    :''}
                {uqx[438]=='1'?<Tabs.TabPane tab='押金申请' key='7'>
                        <CheckDeept/>
                    </Tabs.TabPane>
                    :''}
            </Tabs>
        </div>

    )
}
export default CheckAfterSales
