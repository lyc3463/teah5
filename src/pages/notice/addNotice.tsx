import {Button, DatePicker, Form, Image, Input, message, Radio, Select, Space, Spin} from "antd";
import {useEffect, useState} from "react";
import {history,connect,useNavigate} from "umi";
import {getCurrentDate} from "@/utils/OpenTool";
import dayjs from "dayjs";
import {NavBar} from "antd-mobile";
const tailLayout = {
    wrapperCol: { offset: 4 },
};

const AddNotice=(props:any)=>{
    const navigate=useNavigate();
    const [isLoading,setIsLoading]=useState(false);
    const [form] = Form.useForm();
    const [noticeDate,setNoticeDate]=useState(getCurrentDate());
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    const onFinish=async (values)=>{
        setIsLoading(true);
        let res=await props.dispatch({
            type:'Notice/add',
            payload:{...values,noticeDate}
        });
        if (res.ErrorCode==0){
            message.success('添加成功');
            history.push('/notice');
            setIsLoading(false);
        }else {
            message.error(res.Data);
            setIsLoading(false);
        }
    };
    const changeDate=(_,date)=>{
        setNoticeDate(date);
    };
    const getContainerStyle = () => {
        return {
            padding: windowWidth <= 480 ? '12px' : '16px',
            maxWidth: windowWidth <= 480 ? '100%' : '600px',
            margin: '0 auto'
        };
    };
    const getNavBarStyle = () => {
        return {
            '--height': windowWidth <= 480 ? '40px' : '48px',
            '--border-bottom': 'none',
            '--background-color': '#fff',
            '--font-size': windowWidth <= 480 ? '16px' : '18px'
        };
    };
    return(
        <Spin spinning={isLoading}>
            <div style={getContainerStyle()}>
                <NavBar
                    onBack={() => history.back()}
                    style={getNavBarStyle()}
                >
                    添加公告
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
                    <Form.Item label="时间">
                        <DatePicker defaultValue={dayjs(noticeDate)} onChange={changeDate}/>
                    </Form.Item>
                    <Form.Item label="标题" name="title" rules={[{ required: true, message: '请输入标题' }]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item label="通知内容" name="notice_content"  rules={[{ required: true, message: '请输入通知内容' }]}>
                        <Input.TextArea/>
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
export default connect() (AddNotice)