import dayjs from "dayjs";
import {Button, DatePicker, Input, List, message, Pagination, Select, Space, Spin, Table, Tag, Tooltip} from "antd";
import * as PaymentLogService from '@/services/paymentLog';
import {useEffect, useState} from "react";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import DateRangePicker from "@/components/DateRangePickerProps";

const AutoTopUp=()=>{
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    // 订单编号
    const [orderNum,setorderNum]=useState('');
    // 充值开始时间
    const [startDate,setstartDate]=useState('2000-01-01');
    // 充值结束时间
    const [endDate,setendDate]=useState('2099-01-01');
    // 订单查询列表
    const [dataSource,setdataSource]=useState([]);
    // 总条数
    const [count,setcount]=useState(0);
    // 支付类型
    const [type,setType]=useState(1);
    // 支付状态
    const [stutes,setStutes]=useState(1);
    const [moneySum,setmoneySum]=useState(0);
    const [spinning,setspinning]=useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    // 订单列表
    const getPaymentLogList=()=>{
        PaymentLogService.fetch({page,orderNum,startDate,endDate,type,stutes,pageSize}).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setdataSource(res.Data);
            }else {
                message.error(res.Data);
            }
        })
    };
    // 订单列表分页信息
    const getPaymentLogListfenye=()=>{
        PaymentLogService.fenye({orderNum,startDate,endDate,type,stutes,pageSize}).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setcount(res.Data.count);
                setmoneySum(res.Data.moneySum);
            }else {
                message.error(res.Data);
            }
        })
    };
    useEffect(() => {
        getPaymentLogList();
        getPaymentLogListfenye();
    }, []);
    // 监听下一页页码
    const onChange=(e,pageSize:number)=>{
        setPage(e);
        setPageSize(pageSize);
    };
    const sousuo=()=>{
        setPage(1);
        getPaymentLogListfenye();
        getPaymentLogList();
    };
    // 监听日期
    const changeDate=(_:any,data:string[])=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setstartDate('2000-01-01');
            setendDate('2099-01-01');
        } else {
            setstartDate(data[0]);
            setendDate(data[1]);
        }
    };
    useEffect(() => {
        getPaymentLogList();
    }, [page,pageSize]);
    // 监听支付状态
    const changeStute=(e)=>{
        setStutes(e);
    };
    // 监听支付类型
    const changeType=(e)=>{
        setType(e);
    };
    const changeOrderNum=(e)=>{
        setorderNum(e.target.value);
    };
    const getContainerStyle = () => {
        return {
            padding: windowWidth <= 480 ? '1rem' : '2rem',
            maxWidth: windowWidth <= 480 ? '100%' : '1200px',
            margin: '0 auto',
            backgroundColor: '#f5f6fa',
            minHeight: '90vh'
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
    return(
        <Spin spinning={spinning}>
            <List>
                <List.Item>
                    <Space>
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
                                }}
                            >
                                订单类型:
                            </div>
                            <Select
                                onChange={changeType}
                                defaultValue={type}
                                style={{ width: 150 }}
                                options={[
                                    { value:1, label: '短信充值(微信)' },
                                    { value:5, label: '短信充值(支付宝)' },
                                ]}
                            />
                        </Space.Compact>
                    </Space>
                </List.Item>
                <Space>
                    <DateRangePicker  onDateSelected={changeDate}/>
                    <Button type="primary" onClick={sousuo}>
                        搜索
                    </Button>
                </Space>
            </List>
            <div style={{ display: 'flex', flexDirection: 'column', height: '60vh', overflowY: 'auto' }}>
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
                        <div style={getTextStyle()}>日期: {dayjs(item.created).format('YYYY-MM-DD HH:mm:ss')}</div>
                        <div style={getTextStyle()}>订单编号: {item.orderNum}</div>
                        <div style={getTextStyle()}>订单描述: {item.orderReason}</div>
                        <div style={getTextStyle()}>充值金额(元): {(item.orderAmount/100).toFixed(2)}</div>
                        <div style={getTextStyle()}>支付状态:{item.orderStatus === 1 ? (<Tag color='green'>充值成功</Tag>) : item.orderStatus === 0 ? (<Tag color='blue'>用户未支付</Tag>) : item.orderStatus === 2 ? (<Tag color='orange'>充值失败</Tag>) : item.orderStatus === 3 ?(<Tag color='orange'>支付错误</Tag>) : (<Tag color='grey'>付款失败</Tag>)}</div>
                        <div style={getTextStyle()}>订单类型:{item.orderType === 1 ? (<Tag color='green'>短信充值(微信)</Tag>) : item.orderType === 2 ? (<Tag color='blue'>微信充值</Tag>) : item.orderType === 3 ? (<Tag color='red'>代充值</Tag>) : item.orderType === 4 ?(<Tag color='orange'>园区续费(微信)</Tag>) : item.orderType === 5 ?(<Tag color='yellow'>短信充值(支付宝)</Tag>): item.orderType === 6 ?(<Tag color='warning'>园区续费(支付宝)</Tag>):item.orderType === 7 ?(<Tag color='warning'>支付宝支付</Tag>): (<Tag color='red'>未知类型</Tag>)}</div>
                    </div>
                ))}
            </div>
            <Pagination total={count}showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>
        </Spin>
    )
}
export default AutoTopUp