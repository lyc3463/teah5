import {Button, DatePicker, Form, Input, List, Modal, Pagination, Select, Space, Table, Tag} from "antd";
import {connect} from "umi";
import {useEffect, useState} from "react";
import {Simulate} from "react-dom/test-utils";
import change = Simulate.change;
import dayjs from "dayjs";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {NavBar} from "antd-mobile";
import {history} from "@@/core/history";
import DateRangePicker from "@/components/DateRangePickerProps";
interface PayInfo {
    created: string;
    cardId: string;
    accountName: string;
    bankName: string;
    userName: string;
    withdAmount: number;
    commission: number;
}
const initialPayInfo: PayInfo = {
    created: '',
    cardId: '',
    accountName: '',
    bankName: '',
    userName: '',
    withdAmount: 0,
    commission: 0,
};

const Tixian=(props:any)=>{
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    const [stutes,setStutes]=useState(0);
    const [startDate,setStartDate]=useState('2000-01-01');
    const [endDate,setEndDate]=useState('2099-01-01');
    const [dataSource,setdataSource]=useState([]);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [payInfo, setPayInfo] = useState<PayInfo>(initialPayInfo);
    const [open, setOpen] = useState(false);
    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"Tixian/fetch",
            payload:{page,stutes,startDate,endDate,pageSize}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setdataSource(res.Data);
            }
        })
    };
    const sousuo=()=>{
        setPage(1);
        getFenye();
        logFenye();
    };
    const getFenye=()=>{
        props.dispatch({
            type:"Tixian/fenye",
            payload:{stutes,startDate,endDate,pageSize}
        });
    };
    // 监听日期
    const changeDate=(start:any,end:any)=>{
        setStartDate(start);
        setEndDate(end);
    };
    const onChange=(e:number,pageSize:number)=>{
        setPage(e);
        setPageSize(pageSize);
    };
    useEffect(() => {
        logFenye();
    }, [page,pageSize]);
    useEffect(() => {
        getFenye();
    }, []);
    const toinfo=(e:PayInfo)=>{
        setPayInfo(e);
        setOpen(true);
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
        <div style={getContainerStyle()}>
            <NavBar
                onBack={() => history.push('/dashboard')}
                style={getNavBarStyle()}
            >
                提现记录
            </NavBar>
            <List>
                <Space>
                    <DateRangePicker  onDateSelected={changeDate}/>
                </Space>
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
                                状态:
                            </div>
                            <Select
                                onChange={(e:number)=>setStutes(e)}
                                defaultValue={stutes}
                                style={{ width: 120 }}
                                options={[
                                    { value: 0, label: '全部' },
                                    { value: 1, label: '未审核' },
                                    { value: 2, label: '已审核' },
                                    { value: 3, label: '未通过' },
                                ]}
                            />
                        </Space.Compact>
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
                        <div style={getTextStyle()}>日期: {dayjs(item.created).format('YYYY-MM-DD HH:mm:ss')}</div>
                        <div style={getTextStyle()}>银行卡号: {item.cardId}</div>
                        {/*<div style={getTextStyle()}>户名: {item.accountName}</div>*/}
                        {/*<div style={getTextStyle()}>开户行: {item.bankName}</div>*/}
                        {/*<div style={getTextStyle()}>提现申请人: {item.userName?item.userName:''}</div>*/}
                        <div style={getTextStyle()}>提现金额(元): {item.withdAmount.toFixed(2)}</div>
                        <div style={getTextStyle()}>手续费比例(元): {item.commission/1000}</div>
                        <div style={getTextStyle()}>到账金额(元): {(item.withdAmount-(item.withdAmount*item.commission/1000)).toFixed(2)}</div>
                        {/*<div style={getTextStyle()}>交易说明:{item.remark}</div>*/}
                        <div style={getTextStyle()}>交易状态:{item.withdStatus === 1 ? (<Tag color='red'>未审核</Tag>) : item.withdStatus === 2 ? (<Tag color='blue'>已审核</Tag>) : item.withdStatus === 3 ? (<Tag color='orange'>未通过</Tag>) : (<Tag color='grey'>未知状态</Tag>)}</div>
                        <Button type='primary' onClick={()=>toinfo(item)}>详情</Button>

                    </div>
                ))}
            </div>
            <div style={{display:'flex',justifyContent:'space-around',marginTop:'5px'}}>
                <div>提现总金额：{props.count?props.count.withdAmountSum:''}元</div>
                <div>到账总金额：{props.count?props.count.actualAmountSum:''}元</div>
            </div>
            <Modal open={open} title='详情' onCancel={()=>setOpen(false)} onOk={()=>setOpen(false)}>
                <div style={getTextStyle()}>日期: {dayjs(payInfo.created).format("YYYY-MM-DD HH:mm:ss")}</div>
                <div style={getTextStyle()}>银行卡号: {payInfo.cardId}</div>
                <div style={getTextStyle()}>户名: {payInfo.accountName}</div>
                <div style={getTextStyle()}>开户行: {payInfo.bankName}</div>
                <div style={getTextStyle()}>提现申请人: {payInfo.userName?payInfo.userName:''}</div>
                <div style={getTextStyle()}>提现金额(元): {payInfo.withdAmount.toFixed(2)}</div>
                <div style={getTextStyle()}>手续费比例(元): {payInfo.commission/1000}</div>
                <div style={getTextStyle()}>到账金额(元): {(payInfo.withdAmount-(payInfo.withdAmount*payInfo.commission/1000)).toFixed(2)}</div>
            </Modal>
            {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        TixianList: state.Tixian.list,
        count: state.Tixian.count
    }
};
export default connect(mapStateToProps)(Tixian)