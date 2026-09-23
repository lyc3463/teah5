import {Button, DatePicker, Form, Input, message, Select, Space, Spin} from "antd";
import {filterAndUpdateList, phonePattern} from "@/utils/OpenTool";
import {history,connect,useNavigate} from "umi";
import {useEffect, useState} from "react";
import * as StaffService from "@/services/staff";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import dayjs from "dayjs";
import {NavBar} from "antd-mobile";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const AddRenew=(props)=>{
    const navigate=useNavigate();
    const [form] = Form.useForm();
    // 原名字
    const [oldName,setOldName]=useState('');
    // 原手机号
    const [oldPhone,setOldPhone]=useState('');
    // 审核后的合同列表
    const [hetongList,setHetongList]=useState([]);
    // 租户ID
    const [tenantId,setTenantID]=useState(0);
    // 原合同开始时间
    const [oldStartDate,setoldStartDate]=useState('');
    // 原合同结束时间
    const [oldEndDate,setoldEndDate]=useState('');
    // 续租开始时间
    const [startDate,setStartDate]=useState('');
    // 到期时间
    const [endDate,setEndDate]=useState('');
    const [spinning,setspinning]=useState(false);
    const [isDate,setisDate]=useState(true);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const addOneDayFromString=(dateString)=>{
        const date = dayjs(dateString);
        if (!date.isValid()) {
            throw new Error('Invalid date string');
        }
        let newDate=date.add(1, 'day')
        return dayjs(newDate).format('YYYY-MM-DD');
    }
    const onFinish=(vals:any)=>{
        setspinning(true);
        props.dispatch({
            type:'Renew/add',
            payload:{...vals,tenantId,startDate,endDate}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0||res.ErrorCode==9038){
                message.success('提交成功');
                history.push("/enter/afterSales");
                setspinning(false);
            }else {
                setspinning(false);
                message.error(res.Data)
            }
        })
    };
    const change=(e)=>{
        setspinning(true);
        StaffService.one(e).then((res:any)=>{
            if (res.ErrorCode==0){
                setspinning(false);
                setOldName(res.Data[0].tenant_name);
                setOldPhone(res.Data[0].tenant_phone);
                setTenantID(res.Data[0].tenantId);
                setoldStartDate(res.Data[0].beginTime);
                setoldEndDate(res.Data[0].endTime);
                setStartDate(addOneDayFromString(res.Data[0].endTime));
                setisDate(false);
            }else {
                setspinning(false);
                message.error(res.Data)
            }
        })
    };
    const changeDate=(_:any,date:any)=>{
        setEndDate(date);
    };
    // 合同列表
    const getContntList=()=>{
        setspinning(true);
        props.dispatch({
            type:'SeleHetong/fetch'
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setHetongList(res.Data);
                setspinning(false);
            }else {
                message.error(res.Data);
                setspinning(false);
            }
        })
    };
    useEffect(() => {
        getContntList();
    }, []);
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
                    录入续租
                </NavBar>
                <Form
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 14 }}
                    form={form}
                    layout="horizontal"
                    size={'large'}
                    onFinish={onFinish}
                    style={{ marginTop: '1rem' }}
                >
                    <Form.Item name='contractId'>
                        <Select
                            placeholder='选择合同'
                            onChange={change}
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) => {
                                // 假设每个 option 都有一个与数据项对应的 value 属性
                                const item =hetongList.find(hetongID => hetongID.id == option?.value); // 您可能需要优化这个查找过程
                                return item?.tenant_name?.toLowerCase().includes(input.toLowerCase());
                            }}
                        >
                            {hetongList.map((item:any,index:any)=>{
                                return(
                                    <Select.Option value={item.id} key={index}>
                                        {item.identifier}-{item.tenant_name}
                                    </Select.Option>
                                )
                            })}
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Input addonBefore="租户姓名:" placeholder='租户姓名' value={oldName} disabled/>
                    </Form.Item>
                    <Form.Item>
                        <Input addonBefore="租户手机号:" value={oldPhone} disabled/>
                    </Form.Item>
                    <Form.Item>
                        <Input  addonBefore="原合同开始时间:" placeholder='原合同开始时间' value={oldStartDate?dayjs(oldStartDate).format("YYYY-MM-DD"):''} disabled />
                    </Form.Item>
                    <Form.Item>
                        <Input addonBefore="原合同结束时间:" placeholder='原合同结束时间' value={oldEndDate?dayjs(oldEndDate).format("YYYY-MM-DD"):''} disabled />
                    </Form.Item>
                    <Form.Item>
                        <Input addonBefore="续租合同开始时间:" placeholder='续租合同开始时间' value={startDate?dayjs(startDate).format("YYYY-MM-DD"):''} disabled />
                    </Form.Item>
                    <Form.Item>
                        续租结束时间:<DatePicker onChange={changeDate} minDate={startDate?dayjs(startDate,"YYYY-MM-DD"):'2099-01-01'} disabled={isDate}/>
                    </Form.Item>
                    <Form.Item label='注意'>
                        <span style={{color:'red',fontSize:'12px'}}>合同结束日期三个月内才允许续签</span>
                    </Form.Item>
                    <Form.Item {...tailLayout}>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                添加
                            </Button>
                            <Button type="primary" onClick={()=>navigate(-1)}>
                                返回
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </div>
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        CheckHetongList: state.SeleHetong.list,
    }
};

export default connect(mapStateToProps) (AddRenew)