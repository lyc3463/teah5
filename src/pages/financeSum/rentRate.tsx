import {connect} from "umi";
import {
    Button,
    DatePicker,
    Image,
    Input,
    List,
    message,
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
import * as RechargeRateService from '@/services/rechargeRate';
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {StaticInfo} from "@/StaticInfo";
import DateRangePicker from "@/components/DateRangePickerProps";
import {NavBar} from "antd-mobile";
import {history} from "@@/core/history";

const RentRate=(props)=>{
    // 当前页数
    const [page,setPage]=useState(1);
    const [spinning,setspinning]=useState(false);
    const [pageSize,setPageSize]=useState(50);
    const [name,setName]=useState('');
    const [phone,setPhone]=useState('');
    const [tenandId,settenandId]=useState(0);
    const [startDate,setStartDate]=useState('2000-01-01');
    const [endDate,setEndDate]=useState('2099-01-01');
    // 总页码
    const [count,setcount]=useState(0);
    // 列表
    const [dataSource,setdataSource]=useState([]);
    // 租金管理费统计
    const [moneySum,setmoneySum]=useState(0);
    const [uqx,setUqx]=useState([]);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    // 搜索
    const sousuo=()=>{
        setPage(1);
        getzujinList();
        logFenye();
    };
    // 查看租金缴费列表
    const getzujinList=()=>{
        setspinning(true);
        RechargeRateService.zujinList({page,name,phone,startDate,endDate,tenandId,pageSize}).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setdataSource(res.Data);
                setspinning(false);
            }else {
                message.error(res.Data);
                setspinning(false);
            }
        })
    };
    // 分页
    const logFenye=()=>{
        RechargeRateService.zujinListFenye({name,phone,startDate,endDate,tenandId,pageSize}).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setcount(res.Data.count);
                setmoneySum(res.Data.moneySum);
            }else {
                message.error(res.Data);
            }
        })
    };
    // 监听页数
    const onChange=(e:number,pageSize:number)=>{
        setPage(e);
        setPageSize(pageSize);
    };
    useEffect(() => {
        logFenye();
        let uq=StaticInfo.uqx.split('');
        setUqx(uq);
    }, []);
    useEffect(() => {
        getzujinList();
    }, [page,pageSize]);
    // 监听日期
    const changeDate=(start:any,end:any)=>{
        setStartDate(start);
        setEndDate(end);
    };
    const changePhone=(e)=>{
        setPhone(e.target.value);
    };
    const changName=(e)=>{
        setName(e.target.value);
    };
    const getContainerStyle = () => {
        return {
            padding: windowWidth <= 480 ? '1rem' : '2rem',
            maxWidth: windowWidth <= 480 ? '100%' : '1200px',
            margin: '0 auto',
            backgroundColor: '#f5f6fa',
            minHeight: '80vh'
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
    const getInputStyle = () => {
        return {
            width: windowWidth <= 480 ? '100%' : 'auto',
            borderRadius: '8px',
            borderColor: '#e0e0e0'
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
    return(
        <Spin spinning={spinning}>
            <div style={getContainerStyle()}>
                <NavBar
                    onBack={() => history.push('/dashboard/')}
                    style={getNavBarStyle()}
                >
                    租金扣费
                </NavBar>
                <List>
                    <List.Item>
                        <Space>
                            <Input
                                onChange={changName}
                                addonBefore="姓名:"
                                value={name}
                            />
                            <Input
                                onChange={changePhone}
                                addonBefore="手机号:"
                                value={phone}
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
                    {dataSource.map((item) => (
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
                            <div style={getTextStyle()}>交租日期: {dayjs(item.payrentDate).format('YYYY-MM-DD')}</div>
                            <div style={getTextStyle()}>租金周期: {dayjs(item.billBeginDate).format("YYYY-MM-DD")}至{dayjs(item.billEndDate).format("YYYY-MM-DD")}</div>
                            <div style={getTextStyle()}>姓名: {item.tenant_name}</div>
                            <div style={getTextStyle()}>手机号: {item.tenant_phone}</div>
                            <div style={getTextStyle()}>租金/管理费: {item.payAmount.toFixed(2)}元</div>
                            <div style={getTextStyle()}>优惠金额(元): {item.preRen.toFixed(2)}</div>
                            <div style={getTextStyle()}>优惠前租金(元): {(item.preRen+item.payAmount).toFixed(2)}</div>
                            <div style={getTextStyle()}>违约金(元): {(item.defaultAmount).toFixed(2)}</div>
                            <div style={getTextStyle()}>状态:{item.billStatus==1?<Tag color='red'>未交</Tag>:<Tag color='green'>已交</Tag>}</div>
                        </div>
                    ))}
                </div>
            </div>
            <div style={{display:'flex',justifyContent:'space-around',marginTop:'5px',flexWrap:'wrap'}}>
                <div>总金额:{moneySum.toFixed(2)}元</div>
            </div>
            <Pagination total={count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>
        </Spin>
    )
}

export default connect() (RentRate)