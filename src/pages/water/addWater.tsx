import {connect,history,useNavigate} from 'umi'
import {Button, Form, Input, InputNumber, message, Select, Space, Spin, Tag} from "antd";
import {useEffect, useState} from "react";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import * as CollectorService from "@/services/collector";
import {NavBar} from "antd-mobile";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const AddWater=(props:any)=>{
    const navigate=useNavigate();
    const [form] = Form.useForm();
    // 采集器列表
    const [collectorList,setCollectorList]=useState([]);
    // 价格列表
    const [cable,setCable]=useState([]);
    // 采集器编号
    const [collectorid,setCollectorNuber]=useState('');
    // 转圈
    const [spinning,setspinning]=useState(false);
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
    const onFinish=async (values:any)=>{
        setspinning(true);
        let res=await props.dispatch({
            type:'Watert/add',
            payload:{...values,collectorid}
        })
        if (res.ErrorCode==0){
            setspinning(false);
            message.success('添加成功')
            history.push('/water')
        }else {
            message.error(res.Data);
            setspinning(false);
        }
    };
    const ChangeOps=(e)=>{
        const selectedItem = collectorList.find(item => item.id === e);
        setCollectorNuber(selectedItem.collectorid)
    };
    useEffect(() => {
        getCollectorList();
        getPriceList();
    }, []);
    // 采集器列表
    const getCollectorList=()=>{
        CollectorService.fetchCtr().then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setCollectorList(res.Data);
            }else {
                message.error(res.Data)
            }
        })
    };
    // 价格列表
    const getPriceList=()=>{
        props.dispatch({
            type:'CableParameter/fetch',
            payload:{cname,priceType,we_type}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setCable(res.Data);
            }else {
                message.error(res.Data)
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
        <Spin spinning={spinning}>
            <div style={getContainerStyle()}>
                <NavBar
                    onBack={() => history.back()}
                    style={getNavBarStyle()}
                >
                    添加水表
                </NavBar>
                <Form
                    form={form}
                    layout="horizontal"
                    size={'large'}
                    initialValues={{remark:'',rate:1}}
                    onFinish={onFinish}
                    style={getButtonStyle()}
                >
                    <Form.Item name='address' rules={[{required: true, message: '必须填水表地址/表号'}]} style={getFormItemStyle()}>
                        <Input addonBefore="水表地址/表号:"/>
                    </Form.Item>
                    <Form.Item name='cid' style={getFormItemStyle()}>
                        <Select
                            placeholder='采集器id'
                            onChange={ChangeOps}
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) => {
                                // 假设每个 option 都有一个与数据项对应的 value 属性
                                const item = collectorList.find(unit => unit.id == option.value); // 您可能需要优化这个查找过程
                                return item?.remark?.toLowerCase().includes(input.toLowerCase());
                            }}
                        >
                            {collectorList.map((item:any,index:any)=>{
                                return(
                                    <Select.Option value={item.id} key={index}>
                                        {item.collectorid}-{item.remark}
                                    </Select.Option>
                                )
                            })}
                        </Select>
                    </Form.Item>
                    <Form.Item  name='priceid' style={getFormItemStyle()}>
                        <Select placeholder='选择价格'>
                            {cable.map((item:any,index:any)=>{
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
                            })}
                        </Select>
                    </Form.Item>
                    <Form.Item name='water_type' style={getFormItemStyle()}>
                        <Select
                            placeholder='水表类型'
                            options={[
                                {label:'无线无预付',value:'13301'}
                            ]}
                        />
                    </Form.Item>
                    <Form.Item name='remark' rules={[{required: true, message: '必须填表备注'}]} style={getFormItemStyle()}>
                        <Input addonBefore="水表地址/表号:"/>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary"  htmlType="submit" style={{width:"100%"}}>
                            添加
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        CollectorList: state.Collector.list,
        CableParameterList: state.CableParameter.list,

    }
};
export default connect(mapStateToProps) (AddWater)