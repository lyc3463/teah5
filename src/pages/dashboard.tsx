import {useEffect, useState} from 'react';
import styles from './index.less';
import HPage from '@/components/HomePage';
import Order from "@/components/Order";
import Mine from "@/components/Mine";
import {connect} from "umi";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {ConfigProvider, message, Select, Drawer, Button} from "antd";
import { menuData } from '@/constants/menu/main';
import {filtermessageData} from "@/utils/OpenTool";
import ServerList from "@/pages/serverList";
import indexImg from '@/../public/staticfiles/首页.png';
import serverImg from '@/../public/staticfiles/服务.png';
import messageImg from '@/../public/staticfiles/消息2.png';
import mineImg from '@/../public/staticfiles/我的.png';
import zhCN from 'antd/lib/locale/zh_CN';
import 'dayjs/locale/zh-cn';
import {history as UmiHistory } from 'umi';
import TypeMenu from '@/ModelTypes/TypeMenu';
import {StaticInfo} from "@/StaticInfo";
import type { MenuProps } from 'antd';
type MenuItem = Required<MenuProps>['items'][number];
import SideMenu from '@/components/SideMenu';
import * as CommonService from '@/services/login';
import {CaretLeftOutlined} from "@ant-design/icons";
const HomePage=(props)=> {
    const [activeTab, setActiveTab] = useState(sessionStorage.getItem('activeTab')||'home');
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [messageCount, setMessageCount] = useState(0); // 新增消息数量状态
    const [list, setList] = useState([]); // 新增消息数量状态
    const [menus, setMenus] = useState([]);
    const [park_id, setPark_id] = useState(StaticInfo.park_id);
    const [drawerOpen, setDrawerOpen] = useState(false);

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
            position: 'relative', // 添加相对定位
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            maxWidth: windowWidth <= 480 ? '100%' : '1200px',
            margin: '0 auto'
        };
    };
    const getContentStyle = () => {
        return {
            flex: 1,
            // padding: windowWidth <= 480 ? '10px' : '20px'
        };
    };
    const getPageStyle = () => {
        return {
            width: '100%',
            height: '100%'
        };
    };
    const getTabBarStyle = () => {
        return {
            display: 'flex',
            justifyContent: 'space-around',
            borderTop: '1px solid #eee',
            padding: windowWidth <= 480 ? '8px 0' : '12px 0'
        };
    };
    const getTabItemStyle = (isActive: boolean) => {
        return {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
            color: isActive ? '#007bff' : '#333',
            fontSize: windowWidth <= 480 ? '12px' : '14px'
        };
    };
    const getTabIconStyle = () => {
        return {
            fontSize: windowWidth <= 480 ? '20px' : '24px',
            marginBottom: '4px'
        };
    };
    const tabs = [
        { id: 'home', name: '首页', icon: indexImg },
        { id: 'server', name: '服务', icon: serverImg },
        { id: 'discover', name: '消息', icon: messageImg , count: messageCount},
        { id: 'mine', name: '我的', icon: mineImg }
    ];
    const getMessageCount = () => {
      props.dispatch({
        type: 'NotificationList/fetch',
      }).then((res:TypeErrorCode)=>{
          if (res.ErrorCode==0){
              let isTask=StaticInfo.isTask.split("|").map(Number);
              let filteredData=filterDataByType(res.Data,isTask);
              let newarr=filtermessageData(filteredData);
              setList(newarr);
              if (newarr.length>0){
                  setMessageCount(newarr.length);
              }else {
                  setMessageCount(0);
              }
          }else {
              message.error(res.ErrorCode + res.Data);
          }
      })
    };
    const filterDataByType=(dataArray, filterArray)=>{
        if (!Array.isArray(dataArray) || !Array.isArray(filterArray) ||
            dataArray.length === 0 || filterArray.length === 0) {
            return [];
        }

        // 过滤数据
        return dataArray.filter(item => filterArray.includes(item.tmType));
    };
    useEffect(() => {
        getMessageCount();
        bindMenus();
    }, []);
    const changeTab=(e)=>{
      setActiveTab(e);
      sessionStorage.setItem('activeTab',e);
    };
    const bindMenus=()=>{
        const buildTree=(menuItems: TypeMenu[], parentId: number | undefined = undefined): MenuItem[] => {
            return menuItems
                .filter(item => item.parentId === parentId)
                .map(item => {
                    const children = buildTree(menuItems, item.id);
                    const treeNode: MenuItem = {
                        key: item.route || '',
                        label: item.name,
                        children: children.length > 0 ? children : undefined,
                        disabled: authArr[item.authId] === 0
                    };
                    return treeNode;
                });
        }
        let qxList=StaticInfo.uqx;
        let authArr =qxList.split('').map(Number)
        let md: TypeMenu[] = [];
        for (let i = 0; i < menuData.length; i++) {
            let m = menuData[i];
            if (authArr[m.authId] == 0) {
                if (m.parentId != undefined) {
                    md.push(m)
                }
            } else {
                md.push(m)
            }
        }
        setMenus(buildTree(md));
    };
    // 点击菜单显示列表
    const tolink=(e)=>{
        UmiHistory.push(e)
    };
    const getMenuItemStyle = (isActive: boolean) => ({
        position: 'fixed',
        top: 20,
        right: 20,
    });
   const changePark=(e:any,parkList:any)=>{
        CommonService.swPark(e).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                StaticInfo.park_id=e;
                setPark_id(e);
                sessionStorage.setItem('park_id',e);
                sessionStorage.setItem('park_name',parkList.children);
                UmiHistory.push('/');
                // window.location.reload();
            }else {
                message.error(res.Data);
            }
        })
    };
    return (
        <ConfigProvider locale={zhCN}>
            <div style={getContainerStyle()}>
                <div>
                    <SideMenu
                        menus={menus}
                        onSelect={tolink} // 传递点击回调
                    />
                </div>
                <div style={getMenuItemStyle()}>
                    <Button style={{border:'none',backgroundColor: 'transparent'}} onClick={()=>setDrawerOpen(true)}>
                        <CaretLeftOutlined />
                    </Button>
                </div>
                {/* 页面内容区域 - 适配移动端 */}
                <div style={getContentStyle()}>
                    {activeTab === 'home' && (
                        <div style={getPageStyle()}>
                            <HPage/>
                        </div>
                    )}
                    {activeTab === 'server' && (
                        <div style={getPageStyle()}>
                            <ServerList/>
                        </div>
                    )}
                    {activeTab === 'discover' && (
                        <div style={getPageStyle()}>
                            <Order/>
                        </div>
                    )}
                    {activeTab === 'mine' && (
                        <div style={getPageStyle()}>
                            <Mine/>
                        </div>
                    )}
                </div>
                {/* 底部Tab栏 - 移动端适配 */}
                <div style={getTabBarStyle()}>
                    {tabs.map(tab => (
                        <div
                            key={tab.id}
                            style={getTabItemStyle(activeTab === tab.id)}
                            onClick={()=>changeTab(tab.id)}
                        >
                            <div style={getTabIconStyle()}>
                                <img src={tab.icon} alt={tab.id} style={{width:'25px',height:'25px'}}/>
                                {tab.id === 'discover' && tab.count > 0 && (
                                    <span
                                        style={{
                                            backgroundColor: '#ff4d4f',
                                            color: 'white',
                                            borderRadius: '50%',
                                            padding: '2px 6px',
                                            fontSize: '10px',
                                            marginLeft: '4px',
                                            position: 'relative',
                                            top: '-8px'
                                        }}
                                    >
                                    {tab.count}
                                </span>
                                )}
                            </div>
                            <div>{tab.name}</div>
                        </div>
                    ))}
                </div>
            </div>
            {/*切换园区弹窗*/}
            <Drawer open={drawerOpen} onClose={()=>setDrawerOpen(false)} style={{height:'20%'}}>
                    当前园区:<Select placeholder="请选择园区" style={{ width: 200 }} value={park_id} onChange={(e,parkList)=>changePark(e,parkList)}>
                    {Array.isArray(StaticInfo.parkList) && StaticInfo.parkList.map(park => (
                        <Select.Option
                            key={park.parkId}
                            value={park.parkId}
                        >
                            {park.park_name}
                        </Select.Option>
                    ))}
                </Select>
            </Drawer>
        </ConfigProvider>
    );
}
export default connect() (HomePage);