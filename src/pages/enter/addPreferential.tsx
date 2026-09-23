import {Button, DatePicker, Form, Input, InputNumber, message, Radio, Select, Space, Spin} from "antd";
import {useEffect, useState} from "react";
import {connect,history,useNavigate} from "umi";
import {filterAndUpdateList, phonePattern} from "@/utils/OpenTool";
import * as StaffService from "@/services/staff";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {NavBar} from "antd-mobile";
import DateRangePickerProps from "@/components/DateRangePickerProps";
import MonthRangePicker from "@/components/MonthRangePicker";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const AddPreferential=(props)=>{
    const navigate=useNavigate();
    const [form] = Form.useForm();
    // 租户名字
    const [oldName,setOldName]=useState('');
    // 租户手机号
    const [oldPhone,setOldPhone]=useState('');
    // 审核后的合同列表
    const [hetongList,setHetongList]=useState([]);
    // 租户ID
    const [tenantId,setTenantID]=useState(0);
    const [spinning,setspinning]=useState(false);
    const [zuMoney,setmoney]=useState(0);
    // 优惠类型
    const [youhuiType,setyouhuiType]=useState(1);
    const [startDate,setStartDate]=useState('');
    const [endDate,setEndDate]=useState('');
    const [discountMoney,setdiscountMoney]=useState(0);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const onFinish=(vals:any)=>{
        setspinning(true);
        props.dispatch({
            type:'Preferential/add',
            payload:{...vals,tenantId,startDate,endDate,youhuiType,discountMoney}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0||res.ErrorCode==9038){
                setspinning(false);
                message.success('提交成功');
                history.push("/enter/afterSales")
            }else {
                setspinning(false);
                message.error(res.Data);
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
                setmoney(res.Data[0].zuMoney);
            }else {
                setspinning(false);
                message.error(res.Data);
            }
        })
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
    const onRadioChange=(e)=>{
        setyouhuiType(e.target.value);
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
                    录入优惠
                </NavBar>
                <Form
                    form={form}
                    layout="horizontal"
                    size={'large'}
                    initialValues={{discountMoney:0}}
                    onFinish={onFinish}
                >
                    <Form.Item  name='contractId'>
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
                        <Input addonBefore="租户名字:" placeholder='租户名字' value={oldName} disabled/>
                    </Form.Item>
                    <Form.Item>
                        <Input addonBefore="租户手机号:" placeholder='租户手机号' value={oldPhone} disabled/>
                    </Form.Item>
                    <Form.Item>
                        <InputNumber addonBefore="合同租金:" value={zuMoney} disabled/>元
                    </Form.Item>
                    <Form.Item>
                        <InputNumber addonBefore="每月优惠金额:" min={0} max={zuMoney} value={discountMoney} onChange={(e)=>setdiscountMoney(e)}/>元
                    </Form.Item>
                    <Form.Item label=''>
                        优惠开始/结束月份 <MonthRangePicker onMonthSelected={changeDate}/>
                    </Form.Item>
                    <Form.Item label='优惠类型'>
                        <Radio.Group value={youhuiType} onChange={onRadioChange}>
                            <Radio  value={1}>满合同优惠</Radio>
                            <Radio  value={2}>未满合同优惠</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item label='注意'>
                        <span style={{color:'red',fontSize:'12px'}}>满合同优惠，中途退租，合同未到期，历史优惠金额算到账单一起出</span>
                    </Form.Item>
                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                添加
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
export default connect(mapStateToProps) (AddPreferential)