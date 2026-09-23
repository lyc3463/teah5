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
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {StaticInfo} from "@/StaticInfo";
import {NavBar} from "antd-mobile";
import {history} from "@@/core/history";
import DateRangePicker from "@/components/DateRangePickerProps";
interface PayInfo {
    consumptionDate: string;
    user_name: string;
    phone: string;
    renderType: number;
    oldMoney: number;
    newMoney: number;
    consumptionType: number;
    consumptionMoney: number;
    // 其他支付相关字段
}
const initialPayInfo: PayInfo = {
    consumptionDate: '',
    user_name: '',
    phone: '',
    renderType: 0,
    oldMoney: 0,
    newMoney: 0,
    consumptionType: 0,
    consumptionMoney: 0,
};
const PayFees=(props)=>{
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    // 当前页数
    const [page,setPage]=useState(1);
    const [name,setName]=useState('');
    const [phone,setPhone]=useState('');
    // 消费类型 0全部 1充值、2租金、3电费、4水费、5公共缴费、6手动充值、7物业管理费、8违约金、9月保
    const [type,setType]=useState(0);
    const [startDate,setStartDate]=useState('2000-01-01');
    const [endDate,setEndDate]=useState('2099-01-01');
    const [userID,setuserID]=useState(0);
    const [pageSize,setpageSize]=useState(50);
    const [spinning,setspinning]=useState(false);
    const [uqx,setUqx]=useState([]);
    const [list,setList]=useState([]);
    const [payInfo, setPayInfo] = useState<PayInfo>(initialPayInfo);
    const [open,setOpen]=useState(false);
    // 搜索
    const sousuo=()=>{
        setPage(1);
        // fenye();
        logFenye();
    };
    // 列表
    const logFenye=()=>{
        setspinning(true);
        props.dispatch({
            type:"RechargeRate/fetch",
            payload:{page,name,phone,type,startDate,endDate,userID,pageSize}
        }).then((res:TypeErrorCode)=>{
            setspinning(false);
            if (res.ErrorCode==0){
                setList(res.Data.data);
                setspinning(false);
            }else {
                setspinning(false);
            }
        })
    };
    // 分页信息
    // const fenye=()=>{
    //     props.dispatch({
    //         type:'RechargeRate/fenye',
    //         payload:{name,phone,type,startDate,endDate,userID,pageSize}
    //     });
    // };
    // 监听页数
    const onChange=(e:number,pageSizez:number)=>{
        setPage(e);
        setpageSize(pageSizez);
    };
    useEffect(() => {
        logFenye();
    }, [page,pageSize]);
    useEffect(() => {
        // fenye();
        let uq=StaticInfo.uqx.split('');
        setUqx(uq);
    }, []);
    // 监听日期
    const changeDate=(start:any,end:any)=>{
        setStartDate(start);
        setEndDate(end);
    };
    // 监听类型
    const changeType=(e)=>{
        setType(e);
    };
    const changeName=(e)=>{
        setName(e.target.value);
    };
    const changePhone=(e)=>{
        setPhone(e.target.value);
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
    const getButtonStyle = () => {
        return {
            marginTop: windowWidth <= 480 ? '0.6rem' : '1.2rem',
            borderRadius: '8px',
            textTransform: 'capitalize'
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
    const getInputStyle = () => {
        return {
            width: windowWidth <= 480 ? '100%' : 'auto',
            borderRadius: '8px',
            borderColor: '#e0e0e0'
        };
    };
    const getSearchButtonStyle = () => {
        return {
            borderRadius: '8px',
            backgroundColor: '#1890ff',
            color: '#fff',
            transition: 'background-color 0.3s ease',
            '&:hover': {
                backgroundColor: '#40a9ff'
            }
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
    const renderType=(consumptionType)=>{
        let consumptionTypeText;
        switch (consumptionType) {
            case 1:
                consumptionTypeText = <Tag style={{ color: '#4CAF50' }}>微信充值</Tag>;
                break;
            case 2:
                consumptionTypeText = <Tag style={{ color: '#F44336' }}>租金</Tag>;
                break;
            case 3:
                consumptionTypeText = <Tag style={{ color: '#2196F3' }}>电费</Tag>;
                break;
            case 4:
                consumptionTypeText = <Tag style={{ color: '#FFC107' }}>水费</Tag>;
                break;
            case 5:
                consumptionTypeText = <Tag style={{ color: '#9C27B0' }}>公共缴费</Tag>;
                break;
            case 6:
                consumptionTypeText = <Tag style={{ color: '#E91E63' }}>手动充值</Tag>;
                break;
            case 7:
                consumptionTypeText = <Tag style={{ color: '#795548' }}>损耗</Tag>;
                break;
            case 8:
                consumptionTypeText = <Tag style={{ color: '#795548' }}>违约金</Tag>;
                break;
            case 9:
                consumptionTypeText = <Tag style={{ color: '#795588' }}>月保</Tag>;
                break;
            default:
                consumptionTypeText = <Tag style={{ color: '#777777' }}>未知类型</Tag>;
        }
        return (
            consumptionTypeText
        );
    };
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
                    缴费统计
                </NavBar>
                <List>
                    <List.Item>
                        <Space>
                            <Input
                                onChange={changeName}
                                addonBefore="姓名:"
                                value={name}
                            />
                            <Space.Compact>
                                <div
                                    style={{
                                        borderRadius: '6px',
                                        borderStartEndRadius: 0,
                                        borderEndEndRadius: 0,
                                        padding: '0 11px',
                                        border: '1px solid #d9d9d9',
                                        display: 'flex',
                                        alignItems: 'center',
                                        borderInlineEnd: 0,
                                        width:'40px'
                                    }}
                                >
                                    类型:
                                </div>
                                <Select
                                    onChange={changeType}
                                    defaultValue={type}
                                    style={{ width: 100 }}
                                    options={[
                                        { value:0, label: '全部' },
                                        { value:1, label: '微信充值' },
                                        { value:2, label: '租金' },
                                        { value:3, label: '电费' },
                                        { value:4, label: '水费' },
                                        { value:5, label: '公共缴费' },
                                        { value:6, label: '手动充值' },
                                        { value:7, label: '服务费' },
                                        { value:8, label: '违约金' },
                                        { value:9, label: '月保' },
                                        { value:10, label: '银行转账' },
                                    ]}
                                />
                            </Space.Compact>
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
                    {list.map((item) => (
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
                            <div style={getTextStyle()}>日期: {dayjs(item.consumptionDate).format('YYYY-MM-DD')}</div>
                            <div style={getTextStyle()}>姓名: {item.user_name}</div>
                            {/*<div style={getTextStyle()}>手机号: {item.phone}</div>*/}
                            {/*<div style={getTextStyle()}>类型: {renderType(item.consumptionType)}</div>*/}
                            <div style={getTextStyle()}>金额(元): {item.consumptionType==1||item.consumptionType==6?<span style={{color:'#58bc58'}}>+{item.consumptionMoney.toFixed(2)}</span>:<span style={{color:'red'}}>-{item.consumptionMoney.toFixed(2)}</span>}</div>
                            <div style={getTextStyle()}>原余额(元): {item.oldMoney.toFixed(2)}</div>
                            <div style={getTextStyle()}>余额(元):{item.newMoney.toFixed(2)}</div>
                            <div style={getTextStyle()}>操作:<Button type='primary' onClick={()=>toinfo(item)} >详情</Button></div>
                        </div>
                    ))}
                </div>
            </div>
            <Modal open={open} title='详情' onCancel={()=>setOpen(false)} onOk={()=>setOpen(false)}>
                <div style={getTextStyle()}>日期: {dayjs(payInfo.consumptionDate).format('YYYY-MM-DD')}</div>
                <div style={getTextStyle()}>姓名: {payInfo.user_name}</div>
                <div style={getTextStyle()}>手机号: {payInfo.phone}</div>
                <div style={getTextStyle()}>类型: {renderType(payInfo.consumptionType)}</div>
                <div style={getTextStyle()}>金额(元): {payInfo.consumptionType==1||payInfo.consumptionType==6?<span style={{color:'#58bc58'}}>+{payInfo.consumptionMoney.toFixed(2)}</span>:<span style={{color:'red'}}>-{payInfo.consumptionMoney.toFixed(2)}</span>}</div>
                <div style={getTextStyle()}>原余额(元): {payInfo.oldMoney.toFixed(2)}</div>
                <div style={getTextStyle()}>余额(元):{payInfo.newMoney.toFixed(2)}</div>
            </Modal>
            <div style={{display:'flex',justifyContent:'space-around',marginTop:'5px',flexWrap:'wrap'}}>
                金额:{props.count?props.count.moneySum.toFixed(2):''}元
            </div>
            {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        RechargeRateList: state.RechargeRate.list,
        count: state.RechargeRate.count,
    }
};
export default connect(mapStateToProps) (PayFees)