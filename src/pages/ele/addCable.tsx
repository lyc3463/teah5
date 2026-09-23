import { connect, useNavigate } from 'umi';
import { Button, Form,Input, InputNumber, message, Select, Space, Spin, Tag } from "antd";
import { useEffect, useState } from "react";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import * as CollectorService from '@/services/collector';
import * as UnitService from '@/services/unit';
import PageLayout from "@/components/PageLayout ";

let defaultValues={
    page:1,
    name: '',
    beginRents:0,
    endRents:9999999999,
    status:0,
    house_id:0,
    pageSize:100000
}
const AddCable = (props: any) => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    // 采集器列表
    const [collectorList, setCollectorList] = useState([]);
    // 采集器映射，用于快速查找
    const [collectorMap, setCollectorMap] = useState<Record<number, any>>({});
    // 价格列表
    const [cable, setCable] = useState([]);
    // 价格映射，用于快速查找
    const [cableMap, setCableMap] = useState<Record<number, any>>({});
    // 采集器编号
    const [collectorid, setCollectorNuber] = useState('');
    const [spinning, setspinning] = useState(false);
    // 单元列表
    const [unitList,setUnitList]=useState([]);
    // 单元id
    const [unitid,setUnitid]=useState(0);
    const onFinish = async (values: any) => {
        setspinning(true);
        let res = await props.dispatch({
            type: 'Cable/add',
            payload: { ...values, collectorid,unitid }
        });
        if (res.ErrorCode === 0) {
            setspinning(false);
            message.success('添加成功');
            navigate('/waterCableManage/cable');
        } else {
            message.error(res.Data);
            setspinning(false);
        }
    };
    useEffect(() => {
        getPriceList();
        getCollectorList();
        getUnitList();
    }, []);
    const ChangeOps = (e) => {
        const selectedItem = collectorMap[e];
        if (selectedItem) {
            setCollectorNuber(selectedItem.collectorid);
        }
    };

    // 采集器列表
    const getCollectorList = () => {
        CollectorService.fetchCtr().then((res: TypeErrorCode) => {
            if (res.ErrorCode === 0) {
                setCollectorList(res.Data);
                const map = res.Data.reduce((acc, item) => {
                    acc[item.id] = item;
                    return acc;
                }, {} as Record<number, any>);
                setCollectorMap(map);
            } else {
                message.error(res.Data);
            }
        });
    };

    // 价格列表
    const getPriceList = () => {
        props.dispatch({
            type: 'CableParameter/fetch',
        }).then((res: TypeErrorCode) => {
            if (res.ErrorCode === 0) {
                setCable(res.Data);
                const map = res.Data.reduce((acc, item) => {
                    acc[item.id] = item;
                    return acc;
                }, {} as Record<number, any>);
                setCableMap(map);
            } else {
                message.error(res.Data);
            }
        });
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
    return (
        <Spin spinning={spinning}>
            <PageLayout
                title="添加电表"
                onBack={()=>navigate(-1)}
            >
                <Form
                    form={form}
                    layout="horizontal"
                    size={'large'}
                    initialValues={{ rate: 1 }}
                    onFinish={onFinish}
                >
                    <Form.Item name='address' >
                        <Input addonBefore="电表地址:" placeholder='标号/表地址' />
                    </Form.Item>
                    <Form.Item name='cid'>
                        <Select
                            onChange={ChangeOps}
                            showSearch
                            placeholder={'采集器'}
                            optionFilterProp="children"
                            filterOption={(input, option) => {
                                const item = collectorMap[option.value];
                                return item?.remark?.toLowerCase().includes(input.toLowerCase());
                            }}
                        >
                            {collectorList.map((item: any, index: any) => {
                                return (
                                    <Select.Option value={item.id} key={index}>
                                        {item.collectorid}-{item.remark}
                                    </Select.Option>
                                );
                            })}
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Select
                            placeholder={'单元'}
                            onChange={changeUnit}
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
                    <Form.Item name='priceid'>
                        <Select
                            showSearch
                            placeholder='收费类型'
                            optionFilterProp="children"
                            filterOption={(input, option) => {
                                const item = cableMap[option.value];
                                return item?.price_name?.toLowerCase().includes(input.toLowerCase());
                            }}
                        >
                            {cable.map((item: any, index: any) => {
                                let displayText;
                                switch (item.price_type) {
                                    case 1:
                                        displayText = <Tag color='green'>水价</Tag>;
                                        break;
                                    case 2:
                                        displayText = <Tag color='lime'>阶梯水价</Tag>;
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
                                return (
                                    <Select.Option value={item.id} key={index}>
                                        {item.price_name}-{displayText}
                                    </Select.Option>
                                );
                            })}
                        </Select>
                    </Form.Item>
                    <Form.Item name='electricity_type' >
                        <Select
                            placeholder='电表类型'
                            options={[
                                { label: '单相单费率 07 抄表', value: '65361' },
                                { label: '三相单费率 07 抄表', value: '65362' }
                            ]}
                        >
                        </Select>
                    </Form.Item>
                    <Form.Item name='rate' rules={[{ required: true, message: '必须填倍率' }]} >
                        <InputNumber addonBefore="倍率:" min={1} />
                    </Form.Item>
                    <Form.Item name='remark' rules={[{ required: true, message: '必须填表描述' }]}>
                        <Input addonBefore="电表描述:" placeholder='电表描述(不能为空)' />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary"  htmlType="submit" style={{width:"100%"}}>
                            添加
                        </Button>
                    </Form.Item>
                </Form>
            </PageLayout>
        </Spin>
    );
};

const mapStateToProps = (state: any) => {
    return {
        CollectorList: state.Collector.list,
        CableParameterList: state.CableParameter.list,
    };
};

export default connect(mapStateToProps)(AddCable);