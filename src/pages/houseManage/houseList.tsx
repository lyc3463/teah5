import {Tabs} from "antd";
import House from "@/pages/houseManage/house";
import Unit from "@/pages/houseManage/unit";
import {useEffect, useState} from "react";
import {NavBar} from "antd-mobile";
import {history} from "@@/core/history";

const HouseList=()=>{
    const [activeKey, setActiveKey] = useState(sessionStorage.getItem('activeTabKey4') || '1');
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const onChange = (key) => {
        setActiveKey(key);
        sessionStorage.setItem('activeTabKey4', key);
    };
    // 监听窗口大小变化
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    const getContainerStyle = () => {
        return {
            padding: windowWidth <= 480 ? '1rem' : '2rem',
            maxWidth: windowWidth <= 480 ? '100%' : '1200px',
            margin: '0 auto',
            backgroundColor: '#f5f6fa',
            minHeight: '90vh'
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
        <div style={getContainerStyle()}>
            <NavBar
                onBack={() => history.push('/dashboard/')}
                style={getNavBarStyle()}
            >
                房屋管理
            </NavBar>
            <Tabs  activeKey={activeKey} onChange={onChange}>
                <Tabs.TabPane key={"1"}  tab='房屋列表'>
                    <House/>
                </Tabs.TabPane>
                <Tabs.TabPane key={"2"}  tab='单元列表'>
                    <Unit/>
                </Tabs.TabPane>
            </Tabs>
        </div>
    )
}
export default HouseList