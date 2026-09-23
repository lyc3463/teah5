import {connect} from "umi";
import {useEffect, useState} from "react";
import dayjs from "dayjs";
import {Button, DatePicker, Input, List, message, Pagination, Select, Space, Spin, Table, Tag} from "antd";
import * as FinanceService from '@/services/finance';
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {StaticInfo} from "@/StaticInfo";
import {NavBar} from "antd-mobile";
import {history} from "@@/core/history";

const Finance=(props)=>{
    const [page,setPage]=useState(1);
    const [spinning,setspinning]=useState(false);
    const [pageSize,setPageSize]=useState(10000);
    const [startDate,setStartDate]=useState('2000-01-01');
    const [endDate,setEndDate]=useState('2099-01-01');
    const [dataSource,setdataSource]=useState([]);
    const [uqx,setUqx]=useState([]);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const getFenyeInfo=()=>{
        props.dispatch({
            type:'Finance/fenye',
            payload:{startDate,endDate,pageSize}
        });
    };
    // 分页
    const logFenye=()=>{
        setspinning(true);
        props.dispatch({
            type:"Finance/fetch",
            payload:{page,startDate,endDate,pageSize}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                let a=addDifferenceField(res.Data);
                setdataSource(a);
                setspinning(false);
            }else {
                message.error(res.Data);
                setspinning(false);
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
    }, [page,pageSize]);
    useEffect(() => {
        getFenyeInfo();
        let uq=StaticInfo.uqx.split('');
        setUqx(uq);
    }, []);
    const  addDifferenceField=(data)=> {
        // 创建一个Map以便快速查找某一天的记录
        const dateMap = new Map();
        data.forEach(item => {
            const date = dayjs(item.countDate).format('YYYY-MM-DD'); // 使用dayjs格式化日期，忽略时间
            dateMap.set(date, item);
        });
        // 处理每条记录
        return data.map(item => {
            const currentDate = dayjs(item.countDate);
            const prevDate = currentDate.subtract(1, 'day').format('YYYY-MM-DD');
            const prevItem = dateMap.get(prevDate);
            let difference = 0;
            if (prevItem) {
                const currentCalc = item.balance - item.rechargeAmount + item.amount;
                difference = currentCalc - prevItem.balance;
            }
            return {
                ...item,
                difference1: parseFloat(difference.toFixed(2)) // 保留4位小数
            };
        });
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
            <div style={getContainerStyle()}>
                <NavBar
                    onBack={() => history.push('/dashboard/')}
                    style={getNavBarStyle()}
                >
                    会员汇总
                </NavBar>
                <div style={{ display: 'flex', flexDirection: 'column', height: '80vh', overflowY: 'auto' }}>
                    {dataSource.map((item:any)=>(
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
                            <div style={getTextStyle()}>日期: {dayjs(item.countDate).format('YYYY-MM-DD')}</div>
                            <div style={getTextStyle()}>租户总余额(元): {item.balance.toFixed(2)}</div>
                            <div style={getTextStyle()}>充值总金额(元): {item.rechargeAmount.toFixed(2)}</div>
                            <div style={getTextStyle()}>扣费总金额(元): {item.amount.toFixed(2)}</div>
                            <div style={getTextStyle()}>差异(元): {item.difference1.toFixed(2)}</div>
                        </div>
                    ))}
                </div>
            </div>
            {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        FinanceList: state.Finance.list,
        count: state.Finance.count
    }
};
export default connect(mapStateToProps) (Finance)