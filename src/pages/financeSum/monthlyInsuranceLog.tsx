import {connect} from "umi";
import {useEffect, useState} from "react";
import dayjs from "dayjs";
import {Button, DatePicker, Input, List, message, Pagination, Select, Space, Spin, Table, Tag} from "antd";
import * as RechargeRateService from "@/services/monthlyInsurance";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {StaticInfo} from "@/StaticInfo";
import {NavBar} from "antd-mobile";
import {history} from "@@/core/history";
import {QuestionCircleOutlined} from "@ant-design/icons";
import DateRangePicker from "@/components/DateRangePickerProps";

const MonthlyInsuranceLog=(props:any)=>{
    // 当前页数
    const [page,setPage]=useState(1);//页码
    const [name,setName]=useState('');// 租户姓名
    const [phone,setPhone]=useState('');// 租户手机号
    const [type,setType]=useState(9);// 消费类型 0全部 1充值、2租金、3电费、4水费、5公共缴费、6手动充值、7物业管理费、8违约金、9月保
    const [startDate,setStartDate]=useState('2000-01-01');//开始时间
    const [endDate,setEndDate]=useState('2099-01-01');// 结束时间
    const [userID,setuserID]=useState(0);// 租户ID
    const [spinning,setspinning]=useState(false);
    const [pageSize,setpageSize]=useState(50);
    const [uqx,setUqx]=useState([]);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    // 搜索
    const sousuo=()=>{
        setPage(1);
        fenye();
        logFenye();
    };
    // 列表
    const logFenye=()=>{
        props.dispatch({
            type:"MonthlyInsuranceLog/fetch",
            payload:{page,name,phone,type,startDate,endDate,userID,pageSize}
        })
    };
    // 分页信息
    const fenye=()=>{
        props.dispatch({
            type:'MonthlyInsuranceLog/fenye',
            payload:{name,phone,type,startDate,endDate,userID,pageSize}
        });
    };
    // 监听页数
    const onChange=(e:number,pageSizez:number)=>{
        setPage(e);
        setpageSize(pageSizez);
    };
    useEffect(() => {
        logFenye();
    }, [page,pageSize]);
    useEffect(() => {
        fenye();
        let uq=StaticInfo.uqx.split('');
        setUqx(uq);
    }, []);
    // 监听日期
    const changeDate=(start:any,end:any)=>{
        setStartDate(start);
        setEndDate(end);
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
                    onBack={() => history.back()}
                    style={getNavBarStyle()}
                >
                    月保缴费
                </NavBar>
                <List>
                    <List.Item>
                        <Space>
                            <Input
                                onChange={changeName}
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
                    {props.RechargeRateList&&props.RechargeRateList.length>0?props.RechargeRateList.map((item) => (
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
                            <div style={getTextStyle()}>手机号: {item.phone}</div>
                            <div style={getTextStyle()}>金额(元): -{item.consumptionMoney.toFixed(2)}</div>

                        </div>
                    )):''}
                </div>
            </div>
            <div style={{display:'flex',justifyContent:'space-around',marginTop:'5px',flexWrap:'wrap'}}>
                <div>总金额:{props.count?props.count.moneySum.toFixed(2):0}元</div>
            </div>
            {props.count?<Pagination showSizeChanger total={props.count.count} pageSize={pageSize} current={page}  onChange={onChange}  pageSizeOptions={[50, 100, 500, 1000]}/>:''}
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        RechargeRateList: state.MonthlyInsuranceLog.list,
        count: state.MonthlyInsuranceLog.count,
    }
};
export default connect(mapStateToProps) (MonthlyInsuranceLog)