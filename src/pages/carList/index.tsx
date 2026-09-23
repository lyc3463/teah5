import WxUserCarList from "@/pages/carList/wxUserCarList";
import {Tabs} from "antd";
import {useEffect, useState} from "react";
import UserCarList from "@/pages/carList/userCarList";
import {NavBar} from "antd-mobile";
import {history} from "@@/core/history";
import PageLayout from "@/components/PageLayout ";

const CarList=()=>{
    const [activeKey, setActiveKey] = useState(sessionStorage.getItem('activeTabCar') || '1');

    const onChange = (key) => {
        setActiveKey(key);
        sessionStorage.setItem('activeTabCar', key);
    };

    return(
        <PageLayout
            title="车辆管理"
            onBack={()=>history.push('/dashboard/')}
        >
            <Tabs activeKey={activeKey} onChange={onChange}>
                <Tabs.TabPane tab='租户车辆' key='1'>
                    <WxUserCarList/>
                </Tabs.TabPane>
                <Tabs.TabPane tab='系统车辆' key='2'>
                    <UserCarList/>
                </Tabs.TabPane>
            </Tabs>
        </PageLayout>

    )
}
export default CarList;