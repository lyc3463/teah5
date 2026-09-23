import './homePage.less';
import {history} from "umi";
import customerImg from '../../public/staticfiles/客户关联.png';
import payImg from '../../public/staticfiles/手动充值.png';
import carImg from '../../public/staticfiles/车辆管理.png';
import inviteImg from '../../public/staticfiles/访客邀请.png';
import addfault from '../../public/staticfiles/故障上报.png';
import faultImg from '../../public/staticfiles/报修记录.png';
import staffImg from '../../public/staticfiles/员工登记审核.png';
import complaintImg from '../../public/staticfiles/投诉建议.png';
import orderImg from '../../public/staticfiles/工单记录.png';
import baseMapimg from '../../public/staticfiles/底图.png';
import noticeImg from '../../public/staticfiles/园区公告.png';
import tenantNotificationImg from '../../public/staticfiles/租户通知.png';
import financeImg from '../../public/staticfiles/财务数据录入.png';
import financeCheckImg from '../../public/staticfiles/财务数据审核.png';
import monthCardImg from '../../public/staticfiles/月卡管理.png';
import {useEffect, useState} from "react";
import {StaticInfo} from "@/StaticInfo";
import ServerList from "@/pages/serverList";
import {message} from "antd";

const HomePage = () => {
    const [isTab,setIsTab]=useState(0);
    const [uqx,setUqx]=useState([]);
    const features1 = [
        { id:1, name: '报修记录', action: () => history.push('/fault'), alt: '报修记录',img:faultImg,qx:uqx[271] == '1'?1:0},
        { id:2, name: '工单记录', action:  () => history.push('/order'), alt: '工单记录',img:orderImg,qx:uqx[271] == '1'?1:0 },
        { id:3, name: '投诉建议', action: () => history.push('/complaint'), alt: '投诉建议',img:complaintImg,qx:uqx[275] == '1'?1:0},
    ];
    const features2 = [
        { id:7, name: '园区公告', action: () => history.push('/notice'), alt: '园区公告',img:noticeImg,qx:uqx[50] == '1'?1:0 },
        { id:5, name: '租户通知', action: () => history.push('/tenantNotification'), alt: '租户通知',img:tenantNotificationImg,qx:uqx[262] == '1'?1:0 },
        { id:6, name: '车辆管理', action: () => history.push('/carList'), alt: '车辆管理',img:carImg,qx:uqx[366] == '1'?1:0 },
        { id:4, name: '故障上报', action: () => history.push('/addfault'), alt: '故障上报',img:addfault,qx:uqx[268] == '1'?1:0},
        { id:8, name: '月卡管理', action:  () => history.push('/monthCard'), alt: '月卡管理',img:monthCardImg,qx:uqx[371] == '1'?1:0 },
        { id:9, name: '访客邀请', action:  () => history.push('/invite'), alt: '访客邀请',img:inviteImg,qx:uqx[190] == '1'?1:0 },
        { id:16, name: '报销录入', action:  () => history.push('/enter/financialData/'), alt: '财务数据录入',img:financeImg,qx:uqx[40] == '1'?1:0 },
        { id:17, name: '报销审核', action:  () => history.push('/check/checkFinance/'), alt: '财务数据审核',img:financeCheckImg,qx:uqx[40] == '1'?1:0 },
    ];
    const features3 = [
        { id:10, name: '客户关联', action: () => history.push('/customer'), alt: '客户关联',img:customerImg,qx:uqx[256] == '1'?1:0 },
        { id:11, name: '手动充值', action: () => history.push('/pay'), alt: '手动充值',img:payImg,qx:uqx[328] == '1'?1:0 },
        { id:12, name: '缴费统计', action: () => history.push('/payFees'), alt: '缴费统计',img:staffImg,qx:uqx[259] == '1'?1:0 },
        { id:13, name: '收费项目', action: () => history.push('/chargeItems'), alt: '收费项目',img:staffImg,qx:uqx[168] == '1'?1:0 },
        { id:14, name: '员工审批', action: () => history.push('/check/checkStaff'), alt: '员工审批',img:staffImg,qx:uqx[185] == '1'?1:0 },
        { id:15, name: '客户审批', action: () => history.push('/customerApproval'), alt: '客户审批',img:staffImg,qx:uqx[153] == '1'?1:0 },
    ];
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
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
    const getGridContainerStyle = () => {
        return {
            display: 'grid',
            gridTemplateColumns: windowWidth <= 480 ? 'repeat(4, 1fr)' : 'repeat(4, 1fr)',
            padding: windowWidth <= 480 ? '10px' : '20px',
            gap: windowWidth <= 480 ? '10px' : '20px',
            borderBottom: '1px solid #ccc',
        };
    };
    const getGridItemStyle = () => {
        return {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
            transition: 'transform 0.2s ease',
            padding: windowWidth <= 480 ? '8px' : '12px'
        };
    };
    const getLogoStyle = () => {
        return {
            width: windowWidth <= 480 ? '50px' : '50px',
            height: windowWidth <= 480 ? '50px' : '50px',
            marginBottom: windowWidth <= 480 ? '6px' : '8px'
        };
    };
    const getTextStyle = () => {
        return {
            fontSize: windowWidth <= 480 ? '12px' : '14px',
            color: '#333'
        };
    };
    const getTitleStyle = () => {
        return {
            fontSize: windowWidth <= 480 ? '20px' : '24px',
            marginBottom: windowWidth <= 480 ? '8px' : '12px',
            textAlign: 'center'
        };
    };
    // 新增：背景容器样式
    const getBackgroundContainerStyle = () => {
        return {
            backgroundImage: `url(${baseMapimg})`,
            backgroundSize: 'cover', // 背景图覆盖容器
            backgroundPosition: 'center', // 背景图居中
            backgroundRepeat: 'no-repeat', // 不重复
            padding: '20px 0', // 内边距，避免内容紧贴边缘
        };
    };
    // 新增：物业服务标题区域样式（响应式内边距）
    const getServiceHeaderStyle = () => {
        return {
            display: 'flex',
            justifyContent: 'space-between',
            // 小屏幕(<=480px)使用10px内边距，大屏幕使用50px内边距
            padding: windowWidth <= 480 ? '0 30px' : '0 50px'
        };
    };
    useEffect(() => {
        setUqx(StaticInfo.uqx.split(''));
    }, []);
    return (
        <div className="page" >
            {isTab==1?<ServerList/>:<div>
                <div style={getBackgroundContainerStyle()}>
                    <div style={{display:'flex',justifyContent:"center",alignItems:'center'}}>
                        <h1 className="title" style={getTitleStyle()}>首页</h1>
                    </div>
                    {/*<p className="desc" style={getDescStyle()}>所属园区:{StaticInfo.park_name}</p>*/}
                    <div style={getGridContainerStyle()}>
                        {features1.map((item, index) => (
                            <div key={item.id}
                                 onClick={() => {item.qx === 1 ? item.action() : message.warning('无权访问该模块')}}
                                 style={getGridItemStyle()}>
                                <img src={item.img} alt={item.alt} style={getLogoStyle()} />
                                <div style={getTextStyle()}>{item.name}</div>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <div style={getServiceHeaderStyle()}>
                        <div>物业服务</div>
                    </div>
                    <div style={getGridContainerStyle()}>
                        {features2.map((item, index) => (
                            <div key={item.id}
                                 onClick={() => {item.qx === 1 ? item.action() : message.warning('无权访问该模块')}}
                                 style={getGridItemStyle()}>
                                <img src={item.img} alt={item.alt} style={getLogoStyle()} />
                                <div style={getTextStyle()}>{item.name}</div>
                            </div>
                        ))}
                    </div>
                </div>
                <div style={{marginTop:'20px'}}>
                    <div style={getServiceHeaderStyle()}>
                        <div>客户管理</div>
                    </div>
                    <div style={getGridContainerStyle()}>
                        {features3.map((item, index) => (
                            <div key={item.id}
                                 onClick={() => {item.qx === 1 ? item.action() : message.warning('无权访问该模块')}}
                                 style={getGridItemStyle()}>
                                <img src={item.img} alt={item.alt} style={getLogoStyle()} />
                                <div style={getTextStyle()}>{item.name}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>}
        </div>
    )
};
export default HomePage;