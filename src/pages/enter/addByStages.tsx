import {useEffect, useState} from "react";
import {Button, DatePicker, Form, Input, InputNumber, message, Select, Space, Spin} from "antd";
import {connect,history,useNavigate} from "umi";
import * as StaffService from "@/services/staff";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import dayjs from "dayjs";
import {NavBar} from "antd-mobile";
import MonthRangePicker from "@/components/MonthRangePicker";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const fenqiList=[
    {value:1,label:'每月10号'},
    {value:2,label:'每月15号'},
    {value:3,label:'每月20号'}
]
const AddByStages=(props)=>{
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
    // 原租金
    const [zuMoney,setZuMoney]=useState(0);
    const [spinning,setspinning]=useState(false);
    const [futureRent,setfutureRent]=useState(0);
    // 合同起租日
    const [oldbeginTime,setbeginTime]=useState('2000-01');
    // 合同到期日
    const [oldendTime,setendTime]=useState('2099-01');
    // 分期开始时间
    const [fqStartDate,setFqStartDate]=useState('');
    // 分期结束时间
    const [fqEndDate,setfqEndDate]=useState('');
    // 分期开始时间
    const [hkStartDate,sethkStartDate]=useState('');
    // 分期结束时间
    const [hkEndDate,sethkEndDate]=useState('');
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const onFinish=(vals:any)=>{
        setspinning(true);
        props.dispatch({
            type:'ByStages/add',
            payload:{...vals,tenantId,futureRent,fqStartDate,fqEndDate,hkEndDate,hkStartDate}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0||res.ErrorCode==9038){
                message.success('提交成功');
                history.push("/enter/afterSales");
                setspinning(false);
            }else {
                message.error(res.Data);
                setspinning(false);
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
    const change=(e)=>{
        setspinning(true);
        StaffService.one(e).then((res:any)=>{
            if (res.ErrorCode==0){
                setspinning(false);
                setOldName(res.Data[0].tenant_name);
                setOldPhone(res.Data[0].tenant_phone);
                setTenantID(res.Data[0].tenantId);
                setZuMoney(res.Data[0].zuMoney);
                setbeginTime(res.Data[0].beginTime);
                setendTime(res.Data[0].endTime);
            }else {
                setspinning(false);
                message.error(res.Data)
            }
        })
    };
    const disabledDate = (current) => {
        return current && (current < dayjs(oldbeginTime) || current > dayjs(oldendTime));
    };
    const changeFqdate=(start:any,end:any)=>{
        setFqStartDate(start+'-01');
        setfqEndDate(end+'-01');
    };
    const changehkdate=(start:any,end:any)=>{
        sethkStartDate(start+'-01');
        sethkEndDate(end+'-01');
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
                    录入分期
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
                        <Input addonBefore="租户名字:" placeholder='租户名字' value={oldName} disabled/>
                    </Form.Item>
                    <Form.Item>
                        <Input addonBefore="租户手机号:" placeholder='租户手机号' value={oldPhone} disabled/>
                    </Form.Item>
                    <Form.Item>
                        <InputNumber addonBefore="原租金/月:" value={zuMoney} disabled/>元
                    </Form.Item>
                    <Form.Item>
                        分期开始/结束时间 <MonthRangePicker onMonthSelected={changeFqdate}/>
                    </Form.Item>
                    <Form.Item>
                        还款开始/结束时间<MonthRangePicker onMonthSelected={changehkdate}/>
                    </Form.Item>
                    <Form.Item>
                        <InputNumber addonBefore="每月分期租金(元):" value={futureRent} min={0} onChange={(e)=>setfutureRent(e)}/>
                    </Form.Item>
                    <Form.Item >
                        <span style={{fontSize:'12px',color:'#555'}}>分期开始/结束月份每月分期租金分配给还款开始/结束日期</span>
                    </Form.Item>
                    <Form.Item >
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
export default connect(mapStateToProps) (AddByStages)