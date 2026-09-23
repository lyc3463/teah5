import {Button, Form, Input, message, Radio, Select, Space, Spin} from "antd";
import {useEffect, useState} from "react";
import {connect,history,useNavigate} from "umi";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {NavBar} from "antd-mobile";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const AddDevice=(props)=>{
    const [isLoading,setIsLoading]=useState(false);
    const [form] = Form.useForm();
    const navigate=useNavigate();
    const [houseList,setHouseList]=useState([]);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const onFinish=async (values)=>{
        setIsLoading(true);
        props.dispatch({
            type:'Gate/add',
            payload:values
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('添加成功');
                history.push('/gateManage/device');
                setIsLoading(false);
            }else{
                message.error(res.Data);
                setIsLoading(false);
            }
        })
    };

    // 获取房屋列表
    const getHouseList=()=>{
        props.dispatch({
            type:'House/fetch',
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setHouseList(res.Data);
            }
        })
    };
    useEffect(() => {
        getHouseList();
    }, []);
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
    const getFormItemStyle = () => {
        return {
            '--label-width': windowWidth <= 480 ? '80px' : '100px',
            '--label-font-size': windowWidth <= 480 ? '14px' : '16px',
            '--input-font-size': windowWidth <= 480 ? '14px' : '16px',
            marginBottom: windowWidth <= 480 ? '12px' : '16px'
        };
    };
    const getButtonStyle = () => {
        return {
            '--font-size': windowWidth <= 480 ? '14px' : '16px',
            marginTop: windowWidth <= 480 ? '12px' : '16px'
        };
    };
    return(
        <div style={getContainerStyle()}>
            <NavBar
                onBack={() => navigate(-1)}
                style={getNavBarStyle()}
            >
                添加闸机
            </NavBar>
            <Spin spinning={isLoading}>
                <Form
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 14 }}
                    form={form}
                    layout="horizontal"
                    size={'large'}
                    onFinish={onFinish}
                    style={{ marginTop: '1rem' }}
                >
                    <Form.Item name='house_id'>
                        <Select placeholder='选择房屋'>
                            {houseList.map((item:any,index:any)=>{
                                return(
                                    <Select.Option value={item.id} key={index}>
                                        {item.house_name}
                                    </Select.Option>
                                )
                            })}
                        </Select>
                    </Form.Item>
                    <Form.Item  name='deviceSn' rules={[{required: true, message: '请填写闸机编号'}]}>
                        <Input addonBefore="闸机编号:"/>
                    </Form.Item>
                    <Form.Item name='position' rules={[{required: true, message: '请填写闸机地点'}]}>
                        <Input addonBefore="闸机地点:"/>
                    </Form.Item>
                    <Form.Item {...tailLayout}>
                        <Space>
                            <Button type="primary"  htmlType="submit" >
                                添加
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Spin>
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        HouseList: state.House.list
    }
};
export default connect(mapStateToProps) (AddDevice)