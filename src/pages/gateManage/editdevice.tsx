import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
import {connect,history,useNavigate} from "umi";
import {useEffect, useRef, useState} from "react";
import * as GateServer from "@/services/gate";
import dayjs from "dayjs";
import {Button, Form, Input, message, Select, Space, Spin} from "antd";
import {NavBar} from "antd-mobile";
const Editdevice=(props:any)=>{
    // 路由参数
    const [uid,setUid]=useState('0');
    const navigate=useNavigate();
    const [isLoading,setIsLoading]=useState(false);
    const formRef=useRef();
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    // 获取单个信息详情
    const getOneCustom=async (id:string)=>{
        let res:any=await  GateServer.one(id);
        if (res.ErrorCode==0){
            formRef.current.setFieldsValue(res?.Data);
        }else {
            message.error(res.Data);
        }
    };
    useEffect(()=>{
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        setUid(id);
        getOneCustom(id);
        getHouseList();
    },[]);
    // 提交闸机信息
    const onFinish=(vals:any)=>{
        props.dispatch({
            type:'Gate/edit',
            payload:{...vals,uid}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('添加成功');
                history.push('/gateManage/device');
                setIsLoading(false);
            }else{
                message.error(res.Data)
                setIsLoading(false);
            }
        })
    };
    const getHouseList=()=>{
        props.dispatch({
            type:'House/fetch',
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
        <Spin spinning={isLoading}>
            <div style={getContainerStyle()}>
                <NavBar
                    onBack={() => navigate(-1)}
                    style={getNavBarStyle()}
                >
                    修改闸机
                </NavBar>
                <Form
                    labelCol={{ span: 4 }}
                    ref={formRef}
                    wrapperCol={{ span: 14 }}
                    layout="horizontal"
                    size={'large'}
                    onFinish={onFinish}
                    style={{ marginTop: '1rem' }}
                >
                    <Form.Item name='house_id' >
                        <Select placeholder='选择房屋'>
                            {props.HouseList?props.HouseList.map((item:any,index:any)=>{
                                return(
                                    <Select.Option value={item.id} key={index}>
                                        {item.house_name}
                                    </Select.Option>
                                )
                            }):''}
                        </Select>
                    </Form.Item>
                    <Form.Item name='deviceSn' rules={[{required: true, message: '请填写闸机编号'}]}>
                        <Input addonBefore="闸机编号:"/>
                    </Form.Item>
                    <Form.Item name='position' rules={[{required: true, message: '请填写闸机地点'}]}>
                        <Input addonBefore="闸机地点:"/>
                    </Form.Item>
                    <Form.Item {...tailLayout}>
                        <Space>
                            <Button type="primary"  htmlType="submit" >
                                修改
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </div>
        </Spin>
    )
};

const mapStateToProps = (state: any) => {
    return {
        HouseList: state.House.list
    }
};
export default connect(mapStateToProps)(Editdevice)