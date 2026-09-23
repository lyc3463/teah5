import {connect, history} from 'umi'
import {useEffect, useState} from "react";
import {Tabs} from "antd";
import CheckShuidian from "@/pages/invoice/checkShuidian";
import CheckAllFp from "@/pages/invoice/checkAllFp";
import {NavBar} from "antd-mobile";
const Invoice=(props:any)=>{
    const [activeKey, setActiveKey] = useState(sessionStorage.getItem('activeTabfp') || '1');
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const onChange = (key) => {
        setActiveKey(key);
        sessionStorage.setItem('activeTabfp', key);
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

    const getContentContainerStyle = () => {
        return {
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            padding: windowWidth <= 480 ? '10px' : '20px'
        };
    };
    return(
        <div style={getPageContainerStyle()}>
                <NavBar
                    onBack={() => history.push('/dashboard')}
                    style={{
                        '--height': '48px',
                        '--border-bottom': 'none',
                        '--background-color': '#fff'
                    }}
                >
                    发票审批
                </NavBar>
                <Tabs  activeKey={activeKey} onChange={onChange} style={getTabsStyle()}>
                <Tabs.TabPane tab='审核水电发票' key='1' tabStyle={getTabPaneStyle()}>
                    <CheckShuidian/>
                </Tabs.TabPane>
                <Tabs.TabPane tab='审核发票' key='2' tabStyle={getTabPaneStyle()}>
                    <CheckAllFp/>
                </Tabs.TabPane>
            </Tabs>
        </div>
    )
}
export default connect() (Invoice)