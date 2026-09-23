import {Button, Form, Input, InputNumber, message, Select, Space, Spin} from "antd";
import {useEffect, useState} from "react";
import {useNavigate} from "umi";
import * as AppPzService from '@/services/appPz';
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {NavBar} from "antd-mobile";
const AddConfigurationWxId=()=>{
    const navigate=useNavigate();
    const [spinning,setspinning]=useState(false);
    const [form] = Form.useForm();
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const onFinish=(val)=>{
        setspinning(true);
        AppPzService.addWxInfo(val).then((res:TypeErrorCode)=>{
            try {
                if(res.ErrorCode===0){
                    message.success('添加成功');
                    setspinning(false);
                    navigate(-1);
                }else {
                    message.error(res.Data);
                    setspinning(false);
                }
            }catch (e) {
                message.error(e);
                setspinning(false);
            }
        })
    };
    const getContainerStyle = () => {
        return {
            padding: `0 ${windowWidth <= 480 ? '12px' : '16px'}`,
            maxWidth: windowWidth <= 480 ? '100%' : '600px',
            margin: '0 auto',
            overflowY: 'auto',
            scrollbarWidth: 'thin',
        };
    };
    const getNavBarStyle = () => {
        return {
            '--border-bottom': 'none',
            '--background-color': '#fff',
            '--font-size': windowWidth <= 480 ? '16px' : '18px'
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
                    添加企业
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
                    <Form.Item  name="qyName" rules={[{required: true, message: '请输入企业名称'}]}>
                        <Input addonBefore='企业名称'/>
                    </Form.Item>
                    <Form.Item name="authCorpId" rules={[{required: true, message: '请输入企业ID'}]}>
                        <Input addonBefore='企业ID'/>
                    </Form.Item>
                    <Form.Item>
                        <Space>
                            <Button type="primary"  htmlType="submit">
                                添加
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </div>
        </Spin>
    )
}
export default AddConfigurationWxId