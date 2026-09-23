import {useEffect, useState} from "react";
import {connect} from "umi";
import {Button, DatePicker, Input, List, message, Pagination, Space, Spin, Table, Tooltip} from "antd";
import dayjs from "dayjs";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {NavBar} from "antd-mobile";
import {history} from "@@/core/history";
import DateRangePicker from "@/components/DateRangePickerProps";

const ElectricCharge=(props:any)=>{
    const [address,setaddress]=useState('');
    const [remark,setremark]=useState('');
    const [name,setName]=useState('');
    const [startDate,setStartDate]=useState('2000-01-01');
    const [endDate,setEndDate]=useState('2099-01-01');
    const [spinning,setspinning]=useState(false);
    const [tenantId,settenantId]=useState(0);
    const [energyNew,setenergyNew]=useState(0);// 开始数据总和
    const [energyNew2,setenergyNew2]=useState(0);// 结束数据总和
    const [eleMoneySum,seteleMoneySum]=useState(0);// 金额总和
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    // 累加
    const calculateSums=(sumDate)=>{
        // 初始化四个求和变量
        let energyNew = 0;
        let energyNew2 = 0;
        let eleMoneySum = 0;
        // 遍历数组，累加每个属性的值
        sumDate.map(transaction => {
            energyNew += transaction.energyNew || 0; // 使用||0确保未定义或null值不会破坏计算
            energyNew2 += transaction.energyNew2 || 0;
            eleMoneySum += transaction.eleMoneySum || 0;
        });
        // 返回一个对象，包含四个求和结果
        return {
            energyNew: energyNew.toFixed(2)*1,
            energyNew2: energyNew2.toFixed(2)*1,
            eleMoneySum: eleMoneySum.toFixed(2)*1,
        };
    };
    // 分页
    const logFenye=()=>{
        setspinning(true);
        const originalDate = dayjs(endDate);
        const newDate = originalDate.add(1, 'day');
        props.dispatch({
            type:"ElectricCharge/fetch",
            payload:{address,remark,name,startDate,endDate:dayjs(newDate).format('YYYY-MM-DD'),tenantId},
            callback:(data,err)=>{
                if (data==0){
                    setspinning(false);
                }else {
                    setspinning(false);
                }
            }
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                const sum=calculateSums(res.Data);
                setenergyNew(sum.energyNew);
                setenergyNew2(sum.energyNew2);
                seteleMoneySum(sum.eleMoneySum);
            }
        })
    };
    // 监听日期
    const changeDate=(start:any,end:any)=>{
        setStartDate(start);
        setEndDate(end);
    };
    const shousuo=()=>{
        logFenye();
    };
    const changName=(e)=>{
        setName(e.target.value);
    };
    const changeAddress=(e)=>{
        setaddress(e.target.value);
    };
    const changeRemark=(e)=>{
        setremark(e.target.value);
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
                    onBack={() => history.back()}
                    style={getNavBarStyle()}
                >
                    电表报表
                </NavBar>
                <List>
                    <List.Item>
                        <Space>
                            <Input
                                addonBefore="租户姓名:"
                                onChange={changName}
                                value={name}
                            />
                            <Input
                                addonBefore="电表描述:"
                                onChange={changeRemark}
                                value={remark}
                            />
                        </Space>
                        <Space>
                            <DateRangePicker  onDateSelected={changeDate}/>
                            <Button type="primary" onClick={shousuo}>
                                搜索
                            </Button>
                        </Space>
                    </List.Item>
                </List>
                <div style={{ display: 'flex', flexDirection: 'column', height: '65vh', overflowY: 'auto' }}>
                    {props.ElectricChargeList&&props.ElectricChargeList.length>0?props.ElectricChargeList.map((item) => (
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
                            <div style={getTextStyle()}>房屋: {item.house_name}</div>
                            <div style={getTextStyle()}>租户: {item.tenant_name}</div>
                            <div style={getTextStyle()}>采集器: {item.collectorid}</div>
                            <div style={getTextStyle()}>通讯地址: {item.address}</div>
                            <div style={getTextStyle()}>电表描述: {item.remark}</div>
                            <div style={getTextStyle()}>电表数据开始:{dayjs(item.beginTime).format('YYYY-MM-DD')},度数={item.energyNew.toFixed(2)}kWh</div>
                            <div style={getTextStyle()}>电表数据结束:{dayjs(item.endTime).format('YYYY-MM-DD')},度数={item.energyNew2.toFixed(2)}kWh</div>
                            <div style={getTextStyle()}>金额: {item.eleMoneySum.toFixed(2)}元</div>
                        </div>
                    )):''}
                </div>
            </div>
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        ElectricChargeList: state.ElectricCharge.list,
        // count: state.ElectricCharge.count,
    }
};
export default  connect(mapStateToProps) (ElectricCharge)