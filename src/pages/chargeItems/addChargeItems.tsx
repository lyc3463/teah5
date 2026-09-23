import {
    connect,
    history,
    useNavigate
} from 'umi';
import { useEffect, useState } from 'react';
import {
    Space,
    Input,
    Button,
    message,
    Form,
    Radio,
    InputNumber,
    Spin
} from 'antd';
import {NavBar} from "antd-mobile";
const tailLayout = {
    wrapperCol: { offset: 4 },
};

function AddChargeItems(props: any) {
    const navigate=useNavigate();
    // 收费类型 1周期性收费 2一次性收费 3押金类收费
    const [itemType,setItemType]=useState(1);
    // 月金额计算方式 1固定金额 2按照单价收费 3每户手动输入
    const [monthly_amount,setMonthly_amount]=useState(1);
    // 扣款方式类型 1当期收当期 2当期收上期 3当期收下期
    const [deduction_method,setDeduction_method]=useState(0);
    //  收费间隔
    const [item_interval,setItem_interval]=useState(0);
    // 单价
    const [price,setPrice]=useState(0);
    // 预支付金额
    const [prepaidAmount,setPrepaidAmount]=useState(0);
    // 计量方式
    const [count_method,setCountMethod]=useState(1);
    const [spinning,setspinning]=useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [form] = Form.useForm();
    // 收费类型
    const shoufeiType=(e:any)=>{
        setItemType(e.target.value)
    };
    // 月金额计算方式类型
    const jierType=(e:any)=>{
        setMonthly_amount(e.target.value)
    };
    // 扣款方式类型
    const koukuanType=(e:any)=>{
        setDeduction_method(e.target.value)
    };
    const onFinish = async (values: any) => {
        setspinning(true);
        let res=await props.dispatch({
            type:'Gongsi/add',
            payload:{...values,itemType,monthly_amount,deduction_method,item_interval,price,prepaidAmount,count_method}
        })
        if (res.ErrorCode==0){
            message.success('添加成功');
            history.push('/chargeItems');
            setspinning(false);
        }else {
            message.error(res.Data);
            setspinning(false);
        }
    };
    // 收费间隔
    const changeJianGe=(e)=>{
        setItem_interval(e)
    }
    //  单价
    const changePrice=(e)=>{
        console.log(e)
        setPrice(e)
    }
    // 预支付金额
    const ChangePrepaidAmount=(e)=>{
        setPrepaidAmount(e);
    }
    // 计量方式
    const changeCountMethod=(e)=>{
        setCountMethod(e.target.value)
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
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    return (
        <Spin spinning={spinning}>
            <div  style={getContainerStyle()}>
                <NavBar
                    onBack={() => history.back()}
                    style={{
                        '--height': '48px',
                        '--border-bottom': 'none',
                        '--background-color': '#fff'
                    }}
                >
                    添加收费项目
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
                    <Form.Item  name='item_name' rules={[{required: true, message: '请输入收费项目名称'}]}>
                        <Input addonBefore="收费项目名称:"/>
                    </Form.Item>
                    <Form.Item>
                        <Radio.Group onChange={shoufeiType} defaultValue={itemType}>
                            <Radio value={1}>周期性收费</Radio>
                            <Radio value={2}>一次性收费</Radio>
                            <Radio value={3}>押金类收费</Radio>
                        </Radio.Group>
                    </Form.Item>
                    {
                        itemType==1?<><Form.Item>
                            收费间隔:每<InputNumber controls={false} defaultValue={item_interval} onChange={changeJianGe} min={0}/>天收费一次
                        </Form.Item>

                        </>:''
                    }
                    <Form.Item>
                        <Radio.Group onChange={jierType} defaultValue={monthly_amount}>
                            <Radio value={1}>固定金额</Radio>
                            <Radio value={2}>按照单价计算</Radio>
                            {itemType==1? '':<Radio value={3}> 每户手动输入</Radio>}
                        </Radio.Group>
                    </Form.Item>
                    {
                        monthly_amount==1?<Form.Item>
                            <InputNumber addonBefore="价钱:" onChange={changePrice} min={0}/>
                        </Form.Item>:''
                    }
                    {
                        monthly_amount==2?
                            <>
                                <Form.Item>
                                    <Radio.Group onChange={changeCountMethod} value={count_method}>
                                        <Radio value={1}>合同面积</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </>:''
                    }
                    {
                        monthly_amount==2?
                            <Form.Item label='单价(元)'>
                                <InputNumber onChange={changePrice}/>
                            </Form.Item>:''
                    }
                    <Form.Item label='添加备注' name='remark' rules={[{required: true, message: '请输入备注'}]}>
                        <Input.TextArea/>
                    </Form.Item>

                    <Form.Item {...tailLayout}>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                添加
                            </Button>
                            <Button type="primary" onClick={()=>navigate(-1)}>
                                返回
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </div>

        </Spin>
    );
}


export default connect()(AddChargeItems);
