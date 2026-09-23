import {connect, history,useNavigate} from "umi";
import {Button, DatePicker, Form, Input, message, Select, Space, Spin} from "antd";
import * as StaffService from '@/services/staff';
import {useEffect, useState} from "react";
import {filterAndUpdateList, phonePattern} from "@/utils/OpenTool";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {NavBar} from "antd-mobile";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const AddRename=(props:any)=>{
    const navigate=useNavigate();
    const [form] = Form.useForm();
    // 原名字
    const [oldName,setOldName]=useState('');
    // 原身份证
    const [oldcustomCard,setoldcustomCard]=useState('');
    // 原手机号
    const [oldPhone,setOldPhone]=useState('');
    // 审核后的合同列表
    const [hetongList,setHetongList]=useState([]);
    // 租户ID
    const [tenantId,setTenantID]=useState(0);
    const [spinning,setspinning]=useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const onFinish=(vals:any)=>{
        setspinning(true);
        props.dispatch({
            type:'Rename/add',
            payload:{...vals,tenantId}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0||res.ErrorCode==9038){
                message.success('提交成功');
                history.push("/enter/afterSales");
                setspinning(false);
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
                setoldcustomCard(res.Data[0].customCard);
                setTenantID(res.Data[0].tenantId);
            }else {
                setspinning(false);
                message.error(res.Data)
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
                    录入更名
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
                            onChange={change}
                            placeholder='选择合同'
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
                        <Input addonBefore="原名字:" placeholder='原名字' value={oldName} disabled/>
                    </Form.Item>
                    <Form.Item>
                        <Input addonBefore="原手机号:" placeholder='原手机号' value={oldPhone} disabled/>
                    </Form.Item>
                    <Form.Item>
                        <Input addonBefore="原身份证:" placeholder='原身份证' value={oldcustomCard} disabled/>
                    </Form.Item>
                    <Form.Item name='name' rules={[ {required: true, message: '请填写更改后的名字'}]}>
                        <Input addonBefore="更改后的名字:" placeholder='更改后的名字'/>
                    </Form.Item>
                    <Form.Item name='phone' rules={[ {required: true, message: '请填写更改后的手机号'},{pattern: phonePattern, message: '请输入有效的手机号'}]}>
                        <Input addonBefore="更改后的手机号:" placeholder='更改后的手机号'/>
                    </Form.Item>
                    <Form.Item name='customCard' rules={[ {required: true, message: '请填写更改后的身份证'}]}>
                        <Input addonBefore="更改后的身份证:" placeholder='更改后的身份证'/>
                    </Form.Item>
                    <Form.Item>
                        <span style={{color:'red',fontSize:'12px'}}>该租户如有账单未结清，不能更名</span>
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
export default connect(mapStateToProps) (AddRename)