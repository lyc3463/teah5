import {connect} from "umi";
import {
    Button,
    DatePicker,
    Image,
    Input,
    List,
    message, Modal,
    Pagination,
    Select,
    Space,
    Spin,
    Table,
    Tag,
    Tooltip
} from "antd";
import dayjs from "dayjs";
import {useEffect, useState} from "react";
import * as dateWaterService from '@/services/dateWater';
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {StaticInfo} from "@/StaticInfo";
import {NavBar} from "antd-mobile";
import {history} from "@@/core/history";
import DateRangePicker from "@/components/DateRangePickerProps";
interface PayInfo {
    recordTime: string;
    tenant_name: string;
    address: string;
    remark: string;
    energyNew: number;
    energyUsage: number;
    consumptionType: number;
    energyOld: number;
    // 其他支付相关字段
}
const initialPayInfo: PayInfo = {
    recordTime: '',
    tenant_name: '',
    address: '',
    remark: '',
    energyNew: 0,
    energyUsage: 0,
    consumptionType: 0,
    energyOld: 0,
};
const WaterRate=(props)=>{
    // 当前页数
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    // 租户姓名
    const [name,setName]=useState('');
    // 表地址
    const [cid,setCid]=useState('');
    // 开始时间
    const [startDate,setStartDate]=useState('2000-01-01');
    // 结束时间
    const [endDate,setEndDate]=useState('2099-01-01');
    // 租户ID
    const [tenantId,settenantId]=useState(0);
    // 水费扣费列表
    const [waterRatelist,setwaterRateList]=useState([]);
    // 总条数
    const [count,setcount]=useState(0);
    const [spinning,setspinning]=useState(false);
    // 水费扣费统计
    const [moneySum,setmoneySum]=useState(0);
    // 扣费状态
    const [recordStatus,setrecordStatus]=useState('扣费成功');
    // 消耗度数累加
    const [energyUsage,setenergyUsage]=useState(0);
    // 水表备注
    const [remark,setremark]=useState('');
    const [uqx,setUqx]=useState([]);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [payInfo, setPayInfo] = useState<PayInfo>(initialPayInfo);
    const [open,setOpen]=useState(false);
    // 获取水表扣费记录
    const getwaterRateList=()=>{
        setspinning(true);
        dateWaterService.fetch(page,cid,name,startDate,endDate,tenantId,recordStatus,remark,pageSize).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setspinning(false);
                setwaterRateList(res.Data);
            }else {
                setspinning(false);
                message.error(res.Data);
            }
        })
    };
    // 获取水表扣费记录分页
    const getwaterFenye=()=>{
        dateWaterService.fenye(cid,name,startDate,endDate,tenantId,recordStatus,remark,pageSize).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setcount(res.Data.count);
                setmoneySum(res.Data.moneySum);
                setenergyUsage(res.Data.energyUsage);
            }else {
                message.error(res.Data);
            }
        })
    };
    // 搜索
    const sousuo=()=>{
        setPage(1);
        getwaterRateList();
        getwaterFenye();
    };
    // 监听页数
    const onChange=(e:number,pageSize:number)=>{
        setPage(e);
        setPageSize(pageSize);
    };
    useEffect(() => {
        getwaterRateList();
        getwaterFenye();
        let uq=StaticInfo.uqx.split('');
        setUqx(uq);
    }, []);
    useEffect(() => {
        getwaterRateList();
    }, [page,pageSize]);
    // 监听日期
    const changeDate=(start:any,end:any)=>{
        setStartDate(start);
        setEndDate(end);
    };
    const changeName=(e:any)=>{
        setName(e.target.value);
    };
    const changeCid=(e:any)=>{
        setCid(e.target.value);
    };
    const changeRemark=(e:any)=>{
        setremark(e.target.value)
    };
    const getContainerStyle = () => {
        return {
            padding: windowWidth <= 480 ? '1rem' : '2rem',
            maxWidth: windowWidth <= 480 ? '100%' : '1200px',
            margin: '0 auto',
            backgroundColor: '#f5f6fa',
            minHeight: '85vh'
        };
    };
    const getCardStyle = () => {
        return {
            marginBottom: windowWidth <= 480 ? '0.8rem' : '1.6rem',
            borderRadius: '12px',
            backgroundColor: '#fff',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
            padding: windowWidth <= 480 ? '1rem' : '1.5rem',
            transition: 'all 0.3s ease',
            position: 'relative'
        };
    };
    const getCardHoverStyle = () => {
        return {
            transform: 'translateY(-3px)',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)'
        };
    };

    const getTextStyle = () => {
        return {
            fontSize: windowWidth <= 480 ? '0.9rem' : '1rem',
            color: '#333',
            marginBottom: windowWidth <= 480 ? '0.4rem' : '0.8rem',
            display: 'flex',
            alignItems: 'center'
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
    const toinfo=(e:PayInfo)=>{
        setPayInfo(e);
        setOpen(true);
    };
    return(
        <Spin spinning={spinning}>
            <div style={getContainerStyle()}>
                <NavBar
                    onBack={() => history.back()}
                    style={getNavBarStyle()}
                >
                    水费扣费记录
                </NavBar>
                <List>
                    <List.Item>
                        <Space>
                            <Input
                                onChange={changeName}
                                addonBefore="租户姓名:"
                                value={name}
                            />

                            <Input
                                addonBefore="水表备注:"
                                onChange={changeRemark}
                                value={remark}
                            />
                        </Space>
                        <Space>
                            <DateRangePicker  onDateSelected={changeDate}/>
                            <Button type="primary" onClick={sousuo}>
                                搜索
                            </Button>
                        </Space>
                    </List.Item>
                </List>
                <div style={{ display: 'flex', flexDirection: 'column', height: '65vh', overflowY: 'auto' }}>
                    {waterRatelist.map((item) => (
                        <div
                            key={item.id}
                            style={{ ...getCardStyle(), ...getCardHoverStyle() }}
                            onMouseEnter={(e) => {
                                const target = e.currentTarget as HTMLElement;
                                Object.assign(target.style, getCardHoverStyle());
                            }}
                            onMouseLeave={(e) => {
                                const target = e.currentTarget as HTMLElement;
                                Object.assign(target.style, getCardStyle());
                            }}
                        >
                            <div style={getTextStyle()}>日期: {dayjs(item.recordTime).format('YYYY-MM-DD')}</div>
                            <div style={getTextStyle()}>租户: {item.tenant_name}</div>
                            {/*<div style={getTextStyle()}>水表地址: {item.address}</div>*/}
                            <div style={getTextStyle()}>水表描述: {item.remark}</div>
                            {/*<div style={getTextStyle()}>度数: {item.energyNew.toFixed(2)}m³</div>*/}
                            <div style={getTextStyle()}>消耗度数:{(item.energyNew-item.energyOld).toFixed(2)}m³</div>
                            <div style={getTextStyle()}>扣费金额:{item.energyUsage.toFixed(2)}m³</div>
                            <div style={getTextStyle()}>操作:<Button type='primary' onClick={()=>toinfo(item)} >详情</Button></div>
                        </div>
                    ))}
                </div>
            <Modal open={open} title='详情' onCancel={()=>setOpen(false)} onOk={()=>setOpen(false)}>
                <div style={getTextStyle()}>日期: {dayjs(payInfo.recordTime).format('YYYY-MM-DD')}</div>
                <div style={getTextStyle()}>租户: {payInfo.tenant_name}</div>
                <div style={getTextStyle()}>水表地址: {payInfo.address}</div>
                <div style={getTextStyle()}>水表描述: {payInfo.remark}</div>
                <div style={getTextStyle()}>度数: {payInfo.energyNew.toFixed(2)}m³</div>
                <div style={getTextStyle()}>消耗度数:{(payInfo.energyNew-payInfo.energyOld).toFixed(2)}m³</div>
                <div style={getTextStyle()}>扣费金额:{payInfo.energyUsage.toFixed(2)}m³</div>
            </Modal>
            </div>
            <div style={{padding:"10px"}}>
                <span>度数:{energyUsage.toFixed(2)}m³</span>--
                <span>金额:{moneySum.toFixed(2)}元</span>
            </div>
            <Pagination total={count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>
        </Spin>
    )
}

export default connect() (WaterRate)