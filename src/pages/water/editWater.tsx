import {connect,useLocation,history,useNavigate} from 'umi'
import {Button, Form, Input, InputNumber, message, Radio, Select, Space, Spin, Tag} from "antd";
import {useEffect, useRef, useState} from "react";
import * as WatertServer from "@/services/watert";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {NavBar} from "antd-mobile";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const EditWater=(props)=>{
    const navigate=useNavigate();
    const formRef =useRef();
    const [form] = Form.useForm();
    const [isSpinning,setIsSpinning]=useState(false);
    const [uid,setUid]=useState('');
    // 参数名称
    const [cname,setCname]=useState('');
    // 收费类型
    const [priceType,setPriceType]=useState(0);
    // 1水价 2电价 0全部
    const [we_type,setwe_type]=useState(1);
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
    // 获取单个水表信息详情
    const getOneCable=async (id:string)=>{
        let res:any=await  WatertServer.one(id);
        if (res.ErrorCode==0){
            formRef.current.setFieldsValue(res?.Data);
        }else {
            message.error(res.Data);
        }
    };
    const onFinish=async (values)=>{
        setIsSpinning(true);
        props.dispatch({
            type:'Watert/edit',
            payload:{...values,uid}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setIsSpinning(false);
                history.push('/water');
                message.success('修改成功');
            }else {
                message.error(res.Data);
                setIsSpinning(false);
            }
        })
    };
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        setUid(id);
        getOneCable(id);
        getCableParameterList();
        getCollectorList();
    }, []);
    // 获取采集器列表
    const getCollectorList=()=>{
        props.dispatch({
            type:'Collector/fetch'
        })
    };
    // 获取价格列表
    const getCableParameterList=()=>{
        props.dispatch({
            type:'CableParameter/fetch',
            payload:{cname,priceType,we_type}
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
        <Spin spinning={isSpinning}>
            <div style={getContainerStyle()}>
                <NavBar
                    onBack={() => history.back()}
                    style={getNavBarStyle()}
                >
                    修改水表
                </NavBar>
                <Form
                    form={form}
                    layout="horizontal"
                    size={'large'}
                    onFinish={onFinish}
                    ref={formRef}
                    initialValues={{remark:'',rate:1}}
                    style={getButtonStyle()}
                >
                    <Form.Item name='address' style={getFormItemStyle()}>
                        <Input addonBefore="水表地址/表号:" disabled/>
                    </Form.Item>
                    <Form.Item name='cid' style={getFormItemStyle()}>
                        <Select disabled>
                            {props.CollectorList?props.CollectorList.map((item:any,index:any)=>{
                                return(
                                    <Select.Option value={item.id} key={index}>
                                        {item.collectorid}-{item.remark}
                                    </Select.Option>
                                )
                            }):''}
                        </Select>
                    </Form.Item>
                    <Form.Item name='water_type' style={getFormItemStyle()}>
                        <Select disabled options={[
                            {label:'无线无预付',value:'13301'}
                        ]}/>
                    </Form.Item>
                    <Form.Item name='priceid' style={getFormItemStyle()}>
                        <Select placeholder='选择价格'>
                            {props.CableParameterList?props.CableParameterList.map((item:any,index:any)=>{
                                let displayText;
                                switch (item.price_type) {
                                    case 1:
                                        displayText = <Tag color='green'>水价</Tag>;
                                        break;
                                    case 2:
                                        displayText =  <Tag color='lime'>阶梯水价</Tag>;
                                        break;
                                    case 3:
                                        displayText = <Tag color='cyan'>单费率电价</Tag>;
                                        break;
                                    case 4:
                                        displayText = <Tag color='red'>多费率电价</Tag>;
                                        break;
                                    case 5:
                                        displayText = <Tag color='blue'>阶梯电价</Tag>;
                                        break;
                                    default:
                                        displayText = item || <Tag color='red'>未知类型</Tag>;
                                }
                                return(
                                    <Select.Option value={item.id} key={index}>
                                        {item.price_name}-{displayText}
                                    </Select.Option>
                                )
                            }):''}
                        </Select>
                    </Form.Item>
                    <Form.Item name='remark' rules={[{required: true, message: '必须填表备注'}]} style={getFormItemStyle()}>
                        <Input addonBefore="水表地址/表号:"/>
                    </Form.Item>
                    <Form.Item style={getFormItemStyle()}>
                        <Button type="primary"  htmlType="submit" style={{width:'100%'}}>
                            编辑
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        CableParameterList: state.CableParameter.list,
        CollectorList: state.Collector.list
    }
};
export default connect(mapStateToProps) (EditWater)