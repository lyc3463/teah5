import {Button, DatePicker, Form, Input, message, Select, Space, Spin} from "antd";
import {filterAndUpdateList, phonePattern} from "@/utils/OpenTool";
import {connect,history,useNavigate} from 'umi'
import {useEffect, useRef, useState} from "react";
import * as OutRentService from '@/services/outRent';
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import dayjs from "dayjs";
import {NavBar} from "antd-mobile";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const editOutRent=(props)=>{
    const navigate=useNavigate();

    // 路由参数
    const [uid,setUid]=useState<string|undefined>();
    const formRef=useRef();
    const [form] = Form.useForm();
    // 原名字
    const [oldName,setOldName]=useState('');
    // 原手机号
    const [oldPhone,setOldPhone]=useState('');
    const [spinning,setspinning]=useState(false);
    const [startDate,setStartDate]=useState('2000-01-01');
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const getInfo=(e)=>{
        OutRentService.one(e).then((res:TypeErrorCode)=>{
            setspinning(true);
            if (res.ErrorCode==0){
                setOldName(res.Data.tenant_name);
                setOldPhone(res.Data.tenant_phone);
                formRef.current.setFieldsValue(res.Data);
                setStartDate(res.Data.refundData);
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
            type:"OutRent/edit",
            payload:{uid,startDate,...val}
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
    const changeDate=(_:any,date:any)=>{
        setStartDate(date);
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
                    编辑退租
                </NavBar>
                <Form
                    form={form}
                    initialValues={{refundReason:''}}
                    ref={formRef}
                    layout="horizontal"
                    size={'large'}
                    onFinish={onFinish}
                >
                    <Form.Item>
                        <Input addonBefore="姓名:" placeholder='姓名' value={oldName} disabled/>
                    </Form.Item>
                    <Form.Item>
                        <Input addonBefore="手机号:" placeholder='手机号' value={oldPhone} disabled/>
                    </Form.Item>
                    <Form.Item >
                        退租时间<DatePicker value={dayjs(startDate)} onChange={changeDate}/>
                    </Form.Item>
                    <Form.Item label='退租原因' name='refundReason' rules={[ {required: true, message: '请填写原因'}]}>
                        <Input.TextArea/>
                    </Form.Item>
                    <Form.Item {...tailLayout}>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                编辑
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </div>
        </Spin>
    )
}
export default connect() (editOutRent)