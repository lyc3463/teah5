import {history} from "umi";
import customerImg from '../../../public/staticfiles/客户关联.png';
import collectorImg from '../../../public/staticfiles/采集器.png';
import eleImg from '../../../public/staticfiles/电表.png';
import waterImg from '../../../public/staticfiles/水表 .png';
import payImg from '../../../public/staticfiles/手动充值.png';
import userImg from '../../../public/staticfiles/用户列表.png';
import orderImg from '../../../public/staticfiles/当月账单.png';
import faultImg from '../../../public/staticfiles/故障上报.png';
import staffImg from '../../../public/staticfiles/员工登记审核.png';
import changeNameImg from '../../../public/staticfiles/更名列表.png';
import changeRenewImg from '../../../public/staticfiles/续租列表.png';
import changeRenewOutImg from '../../../public/staticfiles/退租列表.png';
import changePreferentialImg from '../../../public/staticfiles/优惠列表.png';
import changeByStagesImg from '../../../public/staticfiles/分期列表.png';
import invoiceLookUpimg from '../../../public/staticfiles/银行卡审批.png';
import invoiceimg from '../../../public/staticfiles/发票抬头审核.png';
import baseMapimg from '../../../public/staticfiles/底图.png';
import itemImg from '../../../public/staticfiles/参数设置.png';
import alljiaoyiImg from '../../../public/staticfiles/线上交易.png';
import yiruzhang from '../../../public/staticfiles/已入账.png';
import zhanghupeizhi from '../../../public/staticfiles/提现配置.png';
import disanfangpeizhi from '../../../public/staticfiles/收款配置.png';
import tixian from '../../../public/staticfiles/提现记录.png';
import movementCable from '../../../public/staticfiles/手动抄电表.png';
import waterCable from '../../../public/staticfiles/手动抄水表.png';
import cableJournaling from '../../../public/staticfiles/水表报表.png';
import waterJournaling from '../../../public/staticfiles/电表报表.png';
import houseBill from '../../../public/staticfiles/房屋账单.png';
import houseList from '../../../public/staticfiles/房屋列表.png';
import sumHounsBlii from '../../../public/staticfiles/租金汇总.png';
import financialData from '../../../public/staticfiles/财务数据.png';
import conter from '../../../public/staticfiles/合同录入.png';
import financeManage from '../../../public/staticfiles/公司列表.png';
import billSum from '../../../public/staticfiles/账单汇总.png';
import waterRate from '../../../public/staticfiles/水扣费记录.png';
import CableRate from '../../../public/staticfiles/电扣费记录.png';
import serverKoufei from '../../../public/staticfiles/服务费扣费.png';
import allRate from '../../../public/staticfiles/公共扣费.png';
import rentRate from '../../../public/staticfiles/租金扣费.png';
import paymentLog from '../../../public/staticfiles/支付查询.png';
import wyList from '../../../public/staticfiles/违约金扣费.png';
import monthlyInsuranceLog from '../../../public/staticfiles/月保缴费.png';
import yinghangka from '../../../public/staticfiles/对账.png';
import finance from '../../../public/staticfiles/会员报表.png';
import hire from '../../../public/staticfiles/出租报表.png';
import TravelRecord from '../../../public/staticfiles/通行记录.png';
import AccessControlPurview from '../../../public/staticfiles/门禁权限.png';
import device from '../../../public/staticfiles/闸机设备.png';
import grouping from '../../../public/staticfiles/闸机分组.png';
import userManage from '../../../public/staticfiles/用户列表.png';
import role from '../../../public/staticfiles/角色管理.png';
import {useEffect, useState} from "react";
import {StaticInfo} from "@/StaticInfo";
import {message} from "antd";

const ServerList = () => {
    const [uqx,setUqx]=useState([]);
    const features1 = [
        { id:1, name: '员工列表', action: () => history.push('/staff'), alt: '员工列表',img:staffImg,qx:uqx[185] == '1'?1:0},
        { id:2, name: '发票列表', action: () => history.push('/invoice'), alt: '发票列表',img:invoiceimg,qx:uqx[339] == '1'?1:0 },
        { id:13, name: '售后录入', action: () => history.push('/enter/afterSales'), alt: '售后录入',img:changeNameImg,qx:uqx[44] == '1'?1:0 },
        { id:18, name: '发票抬头', action: () => history.push('/invoiceLookUp'), alt: '发票抬头',img:invoiceimg,qx:uqx[321] == '1'?1:0 },
        { id:61, name: '物品列表', action: () => history.push('/goods'), alt: '物品列表',img:invoiceimg,qx:uqx[404] == '1'?1:0 },
        { id:62, name: '重要通知', action: () => history.push('/importantNotice'), alt: '重要通知',img:invoiceimg,qx:uqx[420] == '1'?1:0 },
    ];
    const features2 = [
        { id:3, name: '用户列表', action: () => history.push('/userList'), alt: '用户列表',img:userImg,qx:uqx[258] == '1'?1:0 },
        { id:4, name: '租户列表', action: () => history.push('/tenantList'), alt: '租户列表',img:customerImg,qx:uqx[256] == '1'?1:0 },
        { id:5, name: '客户录入', action: () => history.push('/custom'), alt: '客户录入',img:customerImg,qx:uqx[153] == '1'?1:0 },
    ];
    const features3 = [
        { id:6, name: '当月账单', action: () => history.push('/monthlybill'), alt: '当月账单',img:orderImg,qx:uqx[66] == '1'?1:0 },
        { id:7, name: '每户输入', action: () => history.push('/inputPerHousehold'), alt: '每户输入',img:payImg,qx:uqx[316] == '1'?1:0 },
        // { id:8, name: '银行卡审批', action: () => history.push('/bankCardApproval'), alt: '银行卡审批',img:invoiceLookUpimg },
    ];
    const features4 = [
        { id:9, name: '采集器管理', action: () => history.push('/collector'), alt: '采集器管理',img:collectorImg,qx:uqx[172] == '1'?1:0 },
        { id:10, name: '电表管理', action: () => history.push('/ele'), alt: '电表管理',img:eleImg,qx:uqx[176] == '1'?1:0 },
        { id:11, name: '水表管理', action: () => history.push('/water'), alt: '水表管理',img:waterImg,qx:uqx[253] == '1'?1:0 },
        { id:12, name: '参数设置', action: () => history.push('/waterAndElectricityPrices'), alt: '参数设置',img:itemImg,qx:uqx[180] == '1'?1:0 },
        { id:19, name: '线上交易', action: () => history.push('/qianbao/zonglan/alljiaoyi/'), alt: '线上交易',img:alljiaoyiImg,qx:uqx[118] == '1'?1:0 },
        { id:20, name: '已入账', action: () => history.push('/qianbao/zonglan/yiruzhang/'), alt: '已入账',img:yiruzhang,qx:uqx[119] == '1'?1:0},
        { id:21, name: '提现配置', action: () => history.push('/qianbao/zhanghupeizhi/'), alt: '提现配置',img:zhanghupeizhi,qx:uqx[315] == '1'?1:0 },
        { id:22, name: '收款配置', action: () => history.push('/qianbao/disanfangpeizhi/'), alt: '收款配置',img:disanfangpeizhi,qx:uqx[315] == '1'?1:0 },
        { id:23, name: '银行卡', action: () => history.push('/qianbao/yinghangka/'), alt: '银行卡',img:invoiceLookUpimg,qx:uqx[303] == '1'?1:0 },
        { id:24, name: '提现记录', action: () => history.push('/qianbao/tixian/'), alt: '提现记录',img:tixian,qx:uqx[318] == '1'?1:0 },
        { id:25, name: '抄电表', action: () => history.push('/MeterReading/movementCable'), alt: '抄电表',img:movementCable,qx:uqx[309] == '1'?1:0 },
        { id:26, name: '抄水表', action: () => history.push('/MeterReading/waterCable'), alt: '抄水表',img:waterCable,qx:uqx[310] == '1'?1:0 },
        { id:27, name: '电表报表', action: () => history.push('/waterCableTrade/waterJournaling'), alt: '电表报表',img:waterJournaling,qx:uqx[176] == '1'?1:0 },
        { id:28, name: '水表报表', action: () => history.push('/waterCableTrade/cableJournaling'), alt: '水表报表',img:cableJournaling,qx:uqx[253] == '1'?1:0 },
        { id:29, name: '房屋账单', action: () => history.push('/houseManage/houseBill/'), alt: '房屋账单',img:houseBill,qx:uqx[256] == '1'?1:0 },
        { id:30, name: '房屋列表', action: () => history.push('/houseManage/houseList/'), alt: '房屋列表',img:houseList,qx:uqx[37] == '1'?1:0 },
        { id:31, name: '租金汇总', action: () => history.push('/houseManage/sumHounsBlii/'), alt: '租金汇总',img:sumHounsBlii,qx:uqx[346] == '1'?1:0 },
        { id:32, name: '财务录入', action: () => history.push('/enter/financialData/'), alt: '财务录入',img:financialData,qx:uqx[198] == '1'?1:0 },
        { id:35, name: '合同申请', action: () => history.push('/enter/staff/'), alt: '合同申请',img:conter,qx:uqx[206] == '1'?1:0 },
        { id:33, name: '售后录入', action: () => history.push('/enter/afterSales/'), alt: '售后录入',img:itemImg,qx:uqx[44] == '1'?1:0 },
        { id:34, name: '公司列表', action: () => history.push('/financeManage/list/'), alt: '公司列表',img:financeManage,qx:uqx[55] == '1'?1:0 },
        { id:36, name: '账单汇总', action: () => history.push('/financeManage/billSum/'), alt: '账单汇总',img:billSum,qx:uqx[276] == '1'?1:0 },
        { id:37, name: '水扣费记录', action: () => history.push('/financeSum/waterRate/'), alt: '水扣费记录',img:waterRate,qx:uqx[58] == '1'?1:0 },
        { id:38, name: '电扣费记录', action: () => history.push('/financeSum/CableRate/'), alt: '电扣费记录',img:CableRate,qx:uqx[392] == '1'?1:0 },
        { id:39, name: '服务费扣费', action: () => history.push('/financeSum/serverKoufei/'), alt: '服务费扣费',img:serverKoufei,qx:uqx[347] == '1'?1:0 },
        { id:40, name: '公共扣费', action: () => history.push('/financeSum/allRate/'), alt: '公共扣费',img:allRate,qx:uqx[60] == '1'?1:0 },
        { id:41, name: '租金扣费', action: () => history.push('/financeSum/rentRate/'), alt: '租金扣费',img:rentRate,qx:uqx[395] == '1'?1:0 },
        { id:42, name: '支付查询', action: () => history.push('/financeSum/paymentLog/'), alt: '支付查询',img:paymentLog,qx:uqx[64] == '1'?1:0 },
        { id:43, name: '违约金扣费', action: () => history.push('/financeSum/wyList'), alt: '违约金扣费',img:wyList,qx:uqx[355] == '1'?1:0 },
        { id:44, name: '月保缴费', action: () => history.push('/financeSum/monthlyInsuranceLog/'), alt: '月保缴费',img:monthlyInsuranceLog,qx:uqx[362] == '1'?1:0 },
        { id:45, name: '银行卡对账', action: () => history.push('/billLog/yinghangka/'), alt: '银行卡对账',img:yinghangka,qx:uqx[69] == '1'?1:0 },
        // { id:46, name: '财务审核', action: () => history.push('/check/checkFinance/'), alt: '财务审核',img:itemImg },
        // { id:47, name: '合同审批', action: () => history.push('/check/checkContracte/'), alt: '财务审核',img:itemImg },
        // { id:48, name: '售后审批', action: () => history.push('/check/checkAfterSales/'), alt: '售后审批',img:itemImg },
        // { id:49, name: '手动充值审批', action: () => history.push('/check/checkReacharge/'), alt: '手动充值审批',img:itemImg },
        { id:50, name: '会员汇总', action: () => history.push('/reportFormsManage/finance/'), alt: '会员汇总',img:finance,qx:uqx[85] == '1'?1:0 },
        { id:51, name: '出租报表', action: () => history.push('/reportFormsManage/hire/'), alt: '出租报表',img:hire,qx:uqx[87] == '1'?1:0 },
        { id:52, name: '水费报表', action: () => history.push('/reportFormsManage/waterRate/'), alt: '水费报表',img:waterRate ,qx:uqx[88] == '1'?1:0},
        { id:53, name: '电费报表', action: () => history.push('/reportFormsManage/electricCharge/'), alt: '电费报表',img:waterJournaling,qx:uqx[89] == '1'?1:0 },
        { id:54, name: '财务报表', action: () => history.push('/reportFormsManage/payReportForms/'), alt: '财务报表',img:financialData,qx:uqx[91] == '1'?1:0 },
        { id:55, name: '通行记录', action: () => history.push('/AccessControlManage/TravelRecord/'), alt: '通行记录',img:TravelRecord,qx:uqx[308] == '1'?1:0 },
        { id:56, name: '门禁权限', action: () => history.push('/AccessControlManage/AccessControlPurview/'), alt: '门禁权限',img:AccessControlPurview,qx:uqx[185] == '1'?1:0 },
        { id:57, name: '设备管理', action: () => history.push('/gateManage/device/'), alt: '设备管理',img:device,qx:uqx[190] == '1'?1:0 },
        { id:58, name: '分组下发', action: () => history.push('/gateManage/grouping/'), alt: '分组下发',img:grouping,qx:uqx[307] == '1'?1:0 },
        { id:59, name: '用户管理', action: () => history.push('/systemManage/userManage/'), alt: '用户管理',img:userManage,qx:uqx[214] == '1'?1:0 },
        { id:60, name: '角色列表', action: () => history.push('/systemManage/role'), alt: '角色列表',img:role,qx:uqx[295] == '1'?1:0 },
    ];
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    // 监听窗口大小变化
    useEffect(() => {
        setUqx(StaticInfo.uqx.split(''));
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
    const getPageStyle = () => {
        return {
            maxWidth: windowWidth <= 480 ? '100%' : '1200px',
            margin: '0 auto',
            padding: windowWidth <= 480 ? '10px' : '20px'
        };
    };
    const getTitleStyle = () => {
        return {
            fontSize: windowWidth <= 480 ? '20px' : '24px',
            marginBottom: windowWidth <= 480 ? '8px' : '12px',
            textAlign: 'center'
        };
    };
    const getDescStyle = () => {
        return {
            fontSize: windowWidth <= 480 ? '14px' : '16px',
            marginBottom: windowWidth <= 480 ? '16px' : '20px',
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
    return (
        <div className="page" >
            <div>
                <div style={getBackgroundContainerStyle()}>
                    <h1 className="title" style={getTitleStyle()}>服务</h1>
                    {/*<p className="desc" style={getDescStyle()}>所属园区:{StaticInfo.park_name}</p>*/}
                </div>
                <div  style={{height:'80vh',overflowY: 'auto'}}>
                    <div>
                        <div style={getServiceHeaderStyle()}>
                            <div>物业服务</div>
                        </div>
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
                    <div style={{marginTop:'20px'}}>
                        <div style={getServiceHeaderStyle()}>
                            <div>客户管理</div>
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
                            <div>财务管理</div>
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
                    <div style={{marginTop:'20px'}}>
                        <div style={getServiceHeaderStyle()}>
                            <div>水电管理</div>
                        </div>
                        <div style={getGridContainerStyle()}>
                            {features4.map((item, index) => (
                                <div key={item.id}
                                     onClick={() => {item.qx === 1 ? item.action() : message.warning('无权访问该模块')}}
                                     style={getGridItemStyle()}>
                                    <img src={item.img} alt={item.alt} style={getLogoStyle()} />
                                    <div style={getTextStyle()}>{item.name}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};
export default ServerList;