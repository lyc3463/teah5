import {Button, DatePicker, Form, Input, message, Select, Spin, Radio, Space} from "antd";
import {filterAndUpdateList, phonePattern} from "@/utils/OpenTool";
import {history,connect,useNavigate} from "umi";
import {useEffect, useState} from "react";
import * as StaffService from "@/services/staff";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {NavBar} from "antd-mobile";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const AddOutRent=(props)=>{
    const navigate=useNavigate();
    const [form] = Form.useForm();
    // 租户名字
    const [oldName,setOldName]=useState('');
    // 审核后的合同列表
    const [hetongList,setHetongList]=useState([]);
    // 租户ID
    const [tenantId,setTenantID]=useState(0);
    // 退租时间
    const [startDate,setStartDate]=useState('');
    // 租户手机号
    const [tenant_phone,settenant_phone]=useState('');
    const [spinning,setspinning]=useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    // 1正常退租,2强制退租
    const [type,settype]=useState(2);
    const onFinish=(vals:any)=>{
        setspinning(true);
        props.dispatch({
            type:'OutRent/add',
            payload:{...vals,tenantId,startDate,type}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0||res.ErrorCode==9038){
                setspinning(false);
                message.success('提交成功');
                history.push("/enter/afterSales");
            }else {
                message.error(res.Data);
                setspinning(false);
            }
        })
    };
    const change=(e)=>{
        setspinning(true);
        StaffService.one(e).then((res:any)=>{
            if (res.ErrorCode==0){
                setspinning(false);
                setOldName(res.Data[0].tenant_name);
                setTenantID(res.Data[0].tenantId);
                settenant_phone(res.Data[0].tenant_phone);
            }else {
                message.error(res.Data);
                setspinning(false);
            }
        })
    };
    const changeDate=(_:any,data:string)=>{
        setStartDate(data);
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
    const changeType=(e)=>{
        settype(e.target.value);
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
                    录入退租
                </NavBar>
                <Form
                    form={form}
                    layout="horizontal"
                    size={'large'}
                    initialValues={{reason:''}}
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
                        <Input addonBefore="原手机号:" value={tenant_phone} disabled/>
                    </Form.Item>
                    <Form.Item>
                        <Input addonBefore="租户名字:" value={oldName} disabled/>
                    </Form.Item>
                    <Form.Item >
                        退租时间:<DatePicker onChange={changeDate}/>
                    </Form.Item>
                    <Form.Item name='reason' rules={[{required: true, message: '请输入' }]}>
                        <Input.TextArea placeholder='退租原因'/>
                    </Form.Item>
                    <Form.Item label='退租类型'>
                        <Radio.Group value={type} onChange={changeType}>
                            <Radio value={1}>正常退租</Radio>
                            <Radio value={2}>强制退租</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item {...tailLayout}>
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
export default connect(mapStateToProps) (AddOutRent)