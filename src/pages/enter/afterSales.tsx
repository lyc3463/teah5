import {useEffect, useState} from "react";
import {StaticInfo} from "@/StaticInfo";
import {Tabs} from "antd";
import ChangeName from "@/pages/changeName";
import ChangeRenew from "@/pages/changeRenew";
import ChangeRenewOut from "@/pages/changeRenewOut";
import ChangePreferential from "@/pages/changePreferential";
import ChangeByStages from "@/pages/changeByStages";
import {NavBar} from "antd-mobile";
import {history} from "@@/core/history";
const AfterSales=()=>{
    const [activeKey, setActiveKey] = useState(sessionStorage.getItem('activeTabKey1') || '1');
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    // 用户权限
    const [uqx,setUqx]=useState([]);
    const onChange = (key) => {
        setActiveKey(key);
        sessionStorage.setItem('activeTabKey1', key);
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
             售后列表
         </NavBar>
            <Tabs activeKey={activeKey} onChange={onChange}>
                {uqx[219]=='1'? <Tabs.TabPane tab='更名录入' key='1'>
                        <ChangeName/>
                    </Tabs.TabPane>
                    :''}
                {uqx[221]=='1'?<Tabs.TabPane tab='续租录入' key='3'>
                        <ChangeRenew/>
                    </Tabs.TabPane>
                    :''}
                {uqx[222]=='1'?<Tabs.TabPane tab='退租录入' key='4'>
                        <ChangeRenewOut/>
                    </Tabs.TabPane>
                    :''}
                {uqx[223]=='1'?<Tabs.TabPane tab='优惠录入' key='5'>
                        <ChangePreferential/>
                    </Tabs.TabPane>
                    :''}
                {uqx[223]=='1'?<Tabs.TabPane tab='分期录入' key='6'>
                        <ChangeByStages/>
                    </Tabs.TabPane>
                    :''}
            </Tabs>
        </div>

    )
}
export default AfterSales
