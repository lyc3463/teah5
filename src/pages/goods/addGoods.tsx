import {Button, DatePicker, Form, Input, InputNumber, message, Radio, Space, Spin} from "antd";
import {useEffect, useState} from "react";
import {useNavigate,history,connect} from "umi";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {NavBar} from "antd-mobile";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const AddGoods=(props)=>{
    const navigate=useNavigate();
    const [form] = Form.useForm();
    const [spinning,setspinning]=useState(false);
    const [goodsMoney,setgoodsMoney]=useState(0);
    const [goodsType,setGoodsType]=useState(1);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const changeGoodsMoney=(e)=>{
        setgoodsMoney(e);
    };
    const changeGoodsType=(e)=>{
        setGoodsType(e.target.value);
    };
    const onFinish=(val)=>{
        setspinning(true);
        props.dispatch({
            type:'Goods/add',
            payload:{...val,userId:-1,goodsMoney,goodsType}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('添加成功');
                navigate(-1);
                setspinning(false);
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
                    添加物品
                </NavBar>
                <Form
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 14 }}
                    form={form}
                    layout="horizontal"
                    size={'large'}
                    initialValues={{reason:''}}
                    onFinish={onFinish}
                    style={{ marginTop: '1rem' }}
                >
                    <Form.Item label='物品名称' name='goodsName' rules={[{required: true, message: '请输入' }]}>
                        <Input/>
                    </Form.Item>
                    {goodsType==1? <Form.Item label='物品金额(元)'>
                        <InputNumber min={0} value={goodsMoney} onChange={changeGoodsMoney}/>
                    </Form.Item>:''}
                    <Form.Item label='物品类型'>
                        <Radio.Group value={goodsType} onChange={changeGoodsType}>
                            <Radio value={1}>固定金额</Radio>
                            <Radio value={2}>自定义金额</Radio>
                        </Radio.Group>
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
};
export default connect() (AddGoods)