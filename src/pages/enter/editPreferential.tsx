import {useEffect, useState} from "react";
import {connect, history,useNavigate} from "umi";
import {Button, DatePicker, Form, Input, InputNumber, message, Radio, Space, Spin} from "antd";
import * as Preferential from '@/services/preferential';
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import dayjs from "dayjs";
import {NavBar} from "antd-mobile";
import DefMonthRangePicker from "@/components/DefMonthRangePicker";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const EditPreferential=(props)=>{
    const navigate=useNavigate();
    const [uid,setUid]=useState<string|undefined>('0');
    // 分期金额
    const [preRen,setpreRen]=useState(0);
    // 分期类型
    const [preType,setpreType]=useState(0);
    const [spinning,setspinning]=useState(false);
    // 租户姓名
    const [tenant_name,settenant_name]=useState('');
    // 租户手机号
    const [tenant_phone,settenant_phone]=useState('');
    // 优惠开始 月份
    const [startDate,setStartDate]=useState('2000-01-01');
    // 优惠结束月份
    const [endDate,setEndDate]=useState('2000-02-01');
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        setUid(id);
        getInfo(id);
    }, []);
    const getInfo=(id:string)=>{
        setspinning(true);
        Preferential.one(id).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setspinning(false);
                setpreRen(res.Data.preRen);
                setUid(res.Data.id);
                setpreType(res.Data.preType);
                settenant_name(res.Data.tenant_name);
                settenant_phone(res.Data.tenant_phone);
                setStartDate(res.Data.preBeginTime);
                setEndDate(res.Data.preEndTime);
            }else {
                setspinning(false);
                message.error(res.Data);
            }
        });
    };
    const onOK=()=>{
        setspinning(true)
        props.dispatch({
            type:'Preferential/edit',
            payload:{uid,preRen,startDate,endDate,preType}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setspinning(false);
                message.success('修改成功');
                history.push('/enter/afterSales/');
            }else {
                message.error(res.Data);
                setspinning(false);
            }
        })
    };
    const changeDate=(start:any,end:any)=>{
        setStartDate(start+'-01');
        setEndDate(end+'-01');
    };
    const getContainerStyle = () => {
        return {
            padding: windowWidth <= 480 ? '12px' : '16px',
            maxWidth: windowWidth <= 480 ? '100%' : '600px',
            margin: '0 auto',
            height: '90vh',
            overflowY: 'auto',
            scrollbarWidth: 'thin',
        };
    };
    const getNavBarStyle = () => {
        return {
            '--height': windowWidth <= 480 ? '40px' : '48px',
            '--border-bottom': 'none',
            '--background-color': '#fff',
            '--font-size': windowWidth <= 480 ? '16px' : '18px',
            padding: windowWidth <= 480 ? '12px' : '16px',
            maxWidth: windowWidth <= 480 ? '100%' : '600px',
            margin: '0 auto',
        };
    };
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
                    onBack={() => navigate(-1)}
                    style={getNavBarStyle()}
                >
                    编辑优惠
                </NavBar>
                <Form
                    layout="horizontal"
                    size={'large'}
                >
                    <Form.Item>
                        <Input addonBefore="租户姓名:" value={tenant_name}/>
                    </Form.Item>
                    <Form.Item>
                        <Input addonBefore="租户手机号:" value={tenant_phone}/>
                    </Form.Item>
                    <Form.Item label='优惠开始-结束月份'>
                        <DefMonthRangePicker onMonthSelected={changeDate} defaultStart={dayjs(startDate).format('YYYY-MM')} defaultEnd={dayjs(endDate).format('YYYY-MM')}/>
                        {/*<DatePicker.RangePicker picker="month" value={[dayjs(startDate),dayjs(endDate)]} onChange={changeDate}/>*/}
                    </Form.Item>
                    {/*<Form.Item label='优惠结束月份'>*/}
                    {/*    <DatePicker picker="month" value={dayjs(endDate)}/>*/}
                    {/*</Form.Item>*/}
                    <Form.Item label='优惠金额(元)'>
                        <InputNumber value={preRen} onChange={(e)=>setpreRen(e)}/>
                    </Form.Item>
                    <Form.Item label='优惠类型'>
                        <Radio.Group value={preType} onChange={(e)=>setpreType(e.target.value)}>
                            <Radio value={2}>未满合同优惠</Radio>
                            <Radio value={1}>满合同优惠</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item label='注意'>
                        <span style={{color:'#555',fontSize:"12px"}}>满合同优惠，中途退租，合同未到期，历史优惠金额算到账单一起出</span>
                    </Form.Item>
                    <Form.Item>
                        <Space>
                            <Button type="primary" onClick={onOK}>
                                确定修改
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </div>
        </Spin>
    )
};
export default connect() (EditPreferential);