import {connect} from "umi";
import {useState,useEffect} from "react";
import {
    Button,
    DatePicker,
    Form,
    Input,
    InputNumber,
    List,
    message,
    Modal,
    Pagination,
    Select,
    Space, Spin,
    Table,
    Tag, Tooltip
} from "antd";
import dayjs from "dayjs";
import * as WaterRateService from "@/services/payReportForms";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import DateRangePicker from "@/components/DateRangePickerProps";

const AppUserPayReportForms=(props)=>{
    const[page,setPage]=useState(1);
    const[pageSize,setPageSize]=useState(50);
    const [spinning,setspinning]=useState(false);
    const [phone,setPhone]=useState('');
    const [name,setName]=useState('');
    const [startDate,setStartDate]=useState('2000-01-01');
    const [endDate,setEndDate]=useState('2099-01-01');
    const [consumptionMoney,setconsumptionMoney]=useState(0);
    const [consumptionMoney2,setconsumptionMoney2]=useState(0);
    const [consumptionMoney3,setconsumptionMoney3]=useState(0);
    const [consumptionMoney4,setconsumptionMoney4]=useState(0);
    const [consumptionMoney5,setconsumptionMoney5]=useState(0);
    const [consumptionMoney6,setconsumptionMoney6]=useState(0);
    const [consumptionMoney7,setconsumptionMoney7]=useState(0);
    const [consumptionMoney8,setconsumptionMoney8]=useState(0);
    const [consumptionMoney9,setconsumptionMoney9]=useState(0);
    const [consumptionMoney10,setconsumptionMoney10]=useState(0);
    const [beginMoney,setbeginMoney]=useState(0);
    const [endMoney,setendMoney]=useState(0);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    // 分页
    const logFenye=()=>{
        setspinning(true);
        const originalDate = dayjs(endDate);
        const newDate = originalDate.add(1, 'day');
        props.dispatch({
            type:"AppUserPayReportForms/fetch",
            payload:{name,phone,startDate,endDate:dayjs(newDate).format('YYYY-MM-DD'),page,pageSize},
            callback:(data,res)=>{
                if (data==0){
                    setspinning(false);
                }else {
                    setspinning(false);
                }
            }
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                const sum=calculateSums(res.Data);
                setconsumptionMoney(sum.consumptionMoney);
                setconsumptionMoney2(sum.consumptionMoney2);
                setconsumptionMoney3(sum.consumptionMoney3);
                setconsumptionMoney4(sum.consumptionMoney4);
                setconsumptionMoney5(sum.consumptionMoney5);
                setconsumptionMoney6(sum.consumptionMoney6);
                setconsumptionMoney7(sum.consumptionMoney7);
                setconsumptionMoney8(sum.consumptionMoney8);
                setconsumptionMoney9(sum.consumptionMoney9);
                setbeginMoney(sum.beginMoney);
                setendMoney(sum.endMoney);
            }else {
                message.error(res.Data);
            }
        })
    };
    const calculateSums=(sumDate)=>{
        // 初始化四个求和变量
        let consumptionMoney = 0;
        let consumptionMoney2 = 0;
        let consumptionMoney3 = 0;
        let consumptionMoney4 = 0;
        let consumptionMoney5 = 0;
        let consumptionMoney6 = 0;
        let consumptionMoney7 = 0;
        let consumptionMoney8 = 0;
        let consumptionMoney9 = 0;
        let beginMoney = 0;
        let endMoney = 0;
        // 遍历数组，累加每个属性的值
        sumDate.map(transaction => {
            consumptionMoney += transaction.consumptionMoney|| 0; // 使用||0确保未定义或null值不会破坏计算
            consumptionMoney2 += transaction.consumptionMoney2 || 0;
            consumptionMoney3 += transaction.consumptionMoney3 || 0;
            consumptionMoney4 += transaction.consumptionMoney4 || 0;
            consumptionMoney5 += transaction.consumptionMoney5 || 0;
            consumptionMoney7 += transaction.consumptionMoney7 || 0;
            consumptionMoney8 += transaction.consumptionMoney8 || 0;
            consumptionMoney9 += transaction.consumptionMoney9 || 0;
            consumptionMoney6 += transaction.consumptionMoney6 || 0;
            beginMoney += transaction.beginMoney || 0;
            endMoney += transaction.endMoney || 0;
        });
        // 返回一个对象，包含四个求和结果
        return {
            consumptionMoney: consumptionMoney.toFixed(2)*1,
            consumptionMoney2: consumptionMoney2.toFixed(2)*1,
            consumptionMoney3: consumptionMoney3.toFixed(2)*1,
            consumptionMoney4: consumptionMoney4.toFixed(2)*1,
            consumptionMoney5: consumptionMoney5.toFixed(2)*1,
            consumptionMoney6: consumptionMoney6.toFixed(2)*1,
            consumptionMoney7: consumptionMoney7.toFixed(2)*1,
            consumptionMoney8: consumptionMoney8.toFixed(2)*1,
            consumptionMoney9: consumptionMoney9.toFixed(2)*1,
            beginMoney: beginMoney.toFixed(2)*1,
            endMoney: endMoney.toFixed(2)*1,
        };
    };

    const sousuo=()=>{
        logFenye();
    };
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
                        <Input
                            addonBefore="用户姓名:"
                            onChange={changeName}
                            value={name}
                        />
                        <Input
                            addonBefore="联系方式:"
                            onChange={changePhone}
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
                {props.PayReportFormsList&&props.PayReportFormsList.length>0?props.PayReportFormsList.map((item) => (
                    <div
                        key={item.userId}
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
                        <div style={getTextStyle()}>手机号: {item.tenant_phone}</div>
                        <div style={getTextStyle()}>充值(元): {(item.consumptionMoney+item.consumptionMoney6).toFixed(2)}</div>
                        <div style={getTextStyle()}>租金/管理费(元): {item.consumptionMoney2.toFixed(2)}</div>
                        <div style={getTextStyle()}>电费(元): {item.consumptionMoney3.toFixed(2)}</div>
                        <div style={getTextStyle()}>水费(元): {item.consumptionMoney4.toFixed(2)}</div>
                        <div style={getTextStyle()}>服务费(元): {item.consumptionMoney7.toFixed(2)}</div>
                        <div style={getTextStyle()}>公共缴费(元): {item.consumptionMoney5.toFixed(2)}</div>
                        <div style={getTextStyle()}>违约金(元): {item.consumptionMoney8.toFixed(2)}</div>
                        <div style={getTextStyle()}>月保(元): {item.consumptionMoney9.toFixed(2)}</div>
                        <div style={getTextStyle()}>大额转账(元): {item.consumptionMoney10.toFixed(2)}</div>
                        <div style={getTextStyle()}>数据开始:{dayjs(item.endDate).format('YYYY-MM-DD')},金额={item.beginMoney.toFixed(2)}元</div>
                        <div style={getTextStyle()}>数据结束:{dayjs(item.endTime).format('YYYY-MM-DD')},金额={item.endMoney.toFixed(2)}元</div>
                    </div>
                )):''}
            </div>
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        PayReportFormsList: state.AppUserPayReportForms.list,
    }
};
export default connect(mapStateToProps) (AppUserPayReportForms)