import {connect,useLocation,history,useNavigate} from 'umi'
import {Button, Form, Input, InputNumber, message, Radio, Select, Space, Spin, Tag} from "antd";
import {useEffect, useRef, useState} from "react";
import * as CableServer from "@/services/cable";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import PageLayout from "@/components/PageLayout ";
import * as UnitService from "@/services/unit";
let defaultValues={
    page:1,
    name: '',
    beginRents:0,
    endRents:9999999999,
    status:0,
    house_id:0,
    pageSize:100000
}
const EditCable=(props:any)=>{
    const navigate=useNavigate();
    const location=useLocation();
    const formRef =useRef();
    // 路由参数
    const [uid,setUid]=useState<string|undefined>();
    // 采集器列表
    const [collectorList,setCollectorList]=useState([]);
    // 价格列表
    const [cable,setCable]=useState([]);
    const [spinning,setspinning]=useState(false);
    // 参数名称
    const [cname,setCname]=useState('');
    // 收费类型
    const [priceType,setPriceType]=useState(0);
    // 1水价 2电价 0全部
    const [we_type,setwe_type]=useState(2);
    // 单元列表
    const [unitList,setUnitList]=useState([]);
    // 单元id
    const [unitid,setUnitid]=useState(0);
    const onFinish=async (values)=>{
        setspinning(true);
        let res=await props.dispatch({
            type:'Cable/edit',
            payload:{...values,uid,unitid}
        })
        if (res.ErrorCode==0){
            setspinning(false);
            history.push('/ele');
            message.success('修改成功');
        }else {
            message.error(res.Data);
            setspinning(false);
        }
    };
    // 获取单个电表信息详情
    const getOneCable=async (id:string)=>{
        let res=await  CableServer.one(id);
        if (res?.ErrorCode==0){
            formRef.current.setFieldsValue(res?.Data)
            setUnitid(res?.Data.unitId);
            setUid(res?.Data.id)

        }else {
            message.error(res.Data);
        }
    };
    useEffect(()=>{
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        getOneCable(id);
        getPriceList();
        getUnitList();
    },[]);
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
const getUnitList=()=>{
    UnitService.fetch(defaultValues).then((res:TypeErrorCode)=>{
        console.log('res',res);
        if (res.ErrorCode==0){
            setUnitList(res.Data);
        }else {
            message.error(res.Data);
        }
    })
};
    const changeUnit=(e)=>{
        setUnitid(e);
    };
    return(
        <Spin spinning={spinning}>
            <PageLayout
                title="修改电表"
                onBack={()=>navigate(-1)}
            >
                <Form
                    ref={formRef}
                    layout="horizontal"
                    size={'large'}
                    initialValues={{rate:1}}
                    onFinish={onFinish}
                >
                    <Form.Item name='address'>
                        <Input addonBefore='电表地址' placeholder='标号/表地址' disabled/>
                    </Form.Item>
                    <Form.Item  name='collectorid'>
                        <Select placeholder={'采集器'} disabled>
                            {collectorList.map((item:any,index:any)=>{
                                return(
                                    <Select.Option value={item.value} key={index}>
                                        {item.label}
                                    </Select.Option>
                                )
                            })}
                        </Select>
                    </Form.Item>
                    <Form.Item  name='electricity_type'>
                        <Select
                            placeholder='收费类型'
                            disabled options={[
                            {label:'单相单费率2020Z款远程预付费',value:'16225'},
                            {label:'三相单费率2020Z款远程预付费',value:'16226'},
                            {label:'单相单费率07抄表',value:'65361'},
                            {label:'三相单费率07抄表',value:'65362'}
                        ]}
                        >
                        </Select>
                    </Form.Item>
                    <Form.Item  name='rate'  rules={[{required: true, message: '必填'}]}>
                        <InputNumber addonBefore="倍率:"/>
                    </Form.Item>
                    <Form.Item>
                        <Select
                            placeholder={'单元'}
                            onChange={changeUnit}
                            value={unitid}
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) => {
                                // 假设每个 option 都有一个与数据项对应的 value 属性
                                const item = unitList.find(unit => unit.id == option.value); // 您可能需要优化这个查找过程
                                return item?.unit_name?.toLowerCase().includes(input.toLowerCase());
                            }}
                        >
                            {unitList.map((item:any,index:any)=>{
                                return(
                                    <Select.Option value={item.id} key={index}>
                                        {item.house_name}-{item.unit_name}
                                    </Select.Option>
                                )
                            })}
                        </Select>
                    </Form.Item>
                    <Form.Item  name='priceid'>
                        <Select placeholder='收费类型'>
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
                    <Form.Item name='remark'   rules={[{required: true, message: '必须填表备注'}]}>
                        <Input addonBefore="电表描述:" placeholder='电表备注(不能为空)'/>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary"  htmlType="submit" style={{width:"100%"}}>
                            编辑
                        </Button>
                    </Form.Item>
                </Form>
            </PageLayout>
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        CableParameterList: state.CableParameter.list,
        CollectorList: state.Collector.list
    }
};
export default connect(mapStateToProps) (EditCable)