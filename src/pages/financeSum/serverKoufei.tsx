import {Button, DatePicker, Input, List, message, Pagination, Space, Spin, Table, Tag, Tooltip} from "antd";
import {useEffect, useState} from "react";
import * as RechargeRateService from "@/services/rechargeRate";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import dayjs from "dayjs";
import {StaticInfo} from "@/StaticInfo";
import {NavBar} from "antd-mobile";
import {history} from 'umi';
import DateRangePicker from "@/components/DateRangePickerProps";

const ServerKoufei=()=>{
    const [spinning,setspinning]=useState(false);
    // 当前页数
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    const [name,setName]=useState('');
    const [phone,setCid]=useState('');
    const [startDate,setStartDate]=useState('2000-01-01');
    const [endDate,setEndDate]=useState('2099-01-01');
    const [tenandId,settenandId]=useState(0);
    const [count,setcount]=useState(0);
    const [dataSource,setdataSource]=useState([]);
    const [moneySum,setmoneySum]=useState(0);
    const [uqx,setUqx]=useState([]);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    // 搜索
    const sousuo=()=>{
        setPage(1);
        getAllRate();
        getAllRatefenye();
    };
    // 获取公共缴费记录
    const getAllRate=()=>{
        setspinning(true);
        RechargeRateService.sunhaoList({page,name,phone,startDate,endDate,tenandId,pageSize}).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setspinning(false);
                setdataSource(res.Data);
            }else {
                setspinning(false);
                message.error(res.Data);
            }
        })
    };
    // 公共缴费记录分页
    const getAllRatefenye=()=>{
        setspinning(true);
        RechargeRateService.sunhaoListFenye({name,phone,startDate,endDate,tenandId,pageSize}).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setspinning(false);
                setcount(res.Data.count);
                setmoneySum(res.Data.moneySum);
            }else {
                setspinning(false);
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
        getAllRate()
    }, [page,pageSize]);
    useEffect(() => {
        getAllRatefenye();
        let uq=StaticInfo.uqx.split('');
        setUqx(uq);
    }, []);
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
                    服务费扣费
                </NavBar>
                <List>
                    <List.Item>
                        <Space>
                            <Input
                                addonBefore="姓名:"
                                value={name}
                                onChange={changeName}
                            />
                            <Input
                                addonBefore="电表地址:"
                                value={phone}
                                onChange={changeCid}
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
                <div style={{ display: 'flex', flexDirection: 'column', height: '70vh', overflowY: 'auto' }}>
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
                            <div style={getTextStyle()}>姓名: {item.tenant_name}</div>
                            <div style={getTextStyle()}>电表地址: {item.address}</div>
                            <div style={getTextStyle()}>扣费金额(元): {item.payAmount.toFixed(2)}</div>
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
export default ServerKoufei