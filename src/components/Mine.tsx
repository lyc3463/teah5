import { Button, Tag } from "antd-mobile";
import * as LoginService from '@/services/login';
import {StaticInfo} from "@/StaticInfo";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {history} from "umi";
import baseMapimg from "../../public/staticfiles/底图.png";
import {useEffect, useState} from "react";

const Mine = () => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const loginout=()=>{
        LoginService.outLogin(StaticInfo.userId).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                sessionStorage.clear();
                localStorage.clear();
                history.push('/login');
            }else {
                localStorage.clear();
                sessionStorage.clear();
                history.push('/login');
            }
        })
    };
    // 定义信息项样式
    const getInfoItemStyle = () => ({
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 0',
        borderBottom: '1px solid #eee'
    });
    const getBackgroundContainerStyle = () => {
        return {
            backgroundImage: `url(${baseMapimg})`,
            backgroundSize: 'cover', // 背景图覆盖容器
            backgroundPosition: 'center', // 背景图居中
            backgroundRepeat: 'no-repeat', // 不重复
            padding: '20px 0', // 内边距，避免内容紧贴边缘
        };
    };
    const getTitleStyle = () => {
        return {
            fontSize: windowWidth <= 480 ? '20px' : '24px',
            marginBottom: windowWidth <= 480 ? '8px' : '12px',
            textAlign: 'center'
        };
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
        };
    };
    return (
        <div >
            {/* 用户信息展示，名称在左，值在右 */}
            <div style={getBackgroundContainerStyle()}>
                <h1 className="title" style={getTitleStyle()}>我的</h1>
            </div>
            <div style={getContainerStyle()}>
                <div style={getInfoItemStyle()}>
                    <span>姓名:</span>
                    <span>{StaticInfo.username}</span>
                </div>
                <div style={getInfoItemStyle()}>
                    <span color="orange">所属园区:</span>
                    <span>{StaticInfo.park_name}</span>
                </div>
            </div>
            <div>
                <div style={{ padding: '12px' }}>
                    <Button
                        block
                        color="danger"
                        size="large"
                        onClick={loginout}
                    >
                        退出登录
                    </Button>
                </div>
            </div>
        </div>
    )
}
export default Mine;