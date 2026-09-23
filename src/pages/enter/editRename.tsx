import {Button, Form, Input, message, Select, Space, Spin} from "antd";
import {filterAndUpdateList, phonePattern} from "@/utils/OpenTool";
import {connect,history,useNavigate} from 'umi'
import {useEffect, useRef, useState} from "react";
import * as RenameService from '@/services/rename';
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {NavBar} from "antd-mobile";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const EditRename=(props)=>{
    const navigate=useNavigate();
    // 路由参数
    const [uid,setUid]=useState<string|undefined>();
    const formRef=useRef();
    const [form] = Form.useForm();
    // 原名字
    const [oldName,setOldName]=useState('');
    // 原手机号
    const [oldPhone,setOldPhone]=useState('');
    const [customCard,setcustomCard]=useState('');
    const [spinning,setspinning]=useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const getInfo=(e)=>{
        RenameService.one(e).then((res:TypeErrorCode)=>{
            setspinning(true);
            if (res.ErrorCode==0){
                console.log("详细信息",res)
                setOldName(res.Data.tenant_name);
                setOldPhone(res.Data.tenant_phone);
                setcustomCard(res.Data.customCard);
                formRef.current.setFieldsValue(res.Data);
                setspinning(false);
            }else {
                setspinning(false);
                message.error(res.Data);
            }
        })
    };
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        setUid(id);
        getInfo(id);
    }, []);
    const onFinish=(val)=>{
        setspinning(true);
        props.dispatch({
            type:"Rename/edit",
            payload:{uid,...val}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('修改成功');
                setspinning(false);
                history.push(`/enter/afterSales`);
            }else {
                message.error(res.Data);
                setspinning(false);
            }
        })
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
                    修改更名
                </NavBar>
                <Form
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 14 }}
                    form={form}
                    ref={formRef}
                    layout="horizontal"
                    size={'large'}
                    onFinish={onFinish}
                    style={{ marginTop: '1rem' }}
                >
                    <Form.Item>
                        <Input addonBefore="原名字:" placeholder='原名字' value={oldName} disabled/>
                    </Form.Item>
                    <Form.Item>
                        <Input addonBefore="原手机号:" placeholder='原手机号' value={oldPhone} disabled/>
                    </Form.Item>
                    <Form.Item>
                        <Input addonBefore="原身份证:" placeholder='原身份证' value={customCard} disabled/>
                    </Form.Item>
                    <Form.Item name='rename' rules={[ {required: true, message: '请填写更改后的名字'}]}>
                        <Input addonBefore="更改后的名字:" placeholder='更改后的名字'/>
                    </Form.Item>
                    <Form.Item name='reCard' rules={[ {required: true, message: '请填写更改后的身份证'}]}>
                        <Input addonBefore="更改后的手机号:" placeholder='更改后的手机号'/>
                    </Form.Item>
                    <Form.Item name='rephone' rules={[ {required: true, message: '请填写更改后的手机号'},{pattern: phonePattern, message: '请输入有效的手机号'}]}>
                        <Input addonBefore="更改后的身份证:" placeholder='更改后的身份证'/>
                    </Form.Item>
                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                确定编辑
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </div>
        </Spin>
    )
}
export default connect() (EditRename)