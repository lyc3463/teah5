import {Button, Form, Input, InputNumber, message, Space, Spin} from "antd";
import {connect, history,useNavigate} from "umi";
import {useEffect, useState} from "react";
import {NavBar} from "antd-mobile";

const tailLayout = {
    wrapperCol: { offset: 4 },
};
const AddHouse=(props:any)=>{
    const navigate=useNavigate();
    const [form] = Form.useForm();
    const [spinning,setspinning]=useState(false);
    // 可租面积
    const [rentable_area,setrentable_area]=useState(0);
    // 可增加面积
    const [residue_add_area,setresidue_add_area]=useState(0);
    // 单价
    const [price,setprice]=useState(0);
    // 不能低于租金
    const [noRents,setnoRents]=useState(0);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const onFinish=async (values:any)=>{
        setspinning(true);
        let res=await props.dispatch({
            type:'House/add',
            payload:{...values,rentable_area,residue_add_area,price}
        })
        if (res.ErrorCode==0){
            setspinning(false);
            message.success('添加成功')
            history.push('/houseManage/houseList')
        }else {
            message.error(res.Data);
            setspinning(false);
        }
    };
    const changeArea=(e:number)=>{
        setresidue_add_area(e);
        setrentable_area(e);
    };
    // 监听单价
    const changeprice=(e)=>{
        setprice(e);
    };
    useEffect(() => {
        setnoRents(rentable_area*price);
    }, [rentable_area,price]);
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
                    添加房屋
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
                    <Form.Item name='house_name' rules={[{required: true, message: '请填写房屋名称'}]}>
                        <Input addonBefore="房屋名称:"/>
                    </Form.Item>
                    <Form.Item name='floor_area' rules={[{required: true, message: '请填写建筑面积'}]}>
                        <InputNumber addonBefore="建筑面积㎡:" min={0}/>
                    </Form.Item>
                    <Form.Item>
                        <InputNumber addonBefore="可租面积㎡:" onChange={changeArea} value={rentable_area}/>
                    </Form.Item>
                    <Form.Item>
                        <InputNumber addonBefore="单价/(元):" value={price} onChange={changeprice} min={0}/>
                    </Form.Item>
                    <Form.Item  name='rents' rules={[
                        { required: true, message: '请填写总租金' },
                        {
                            validator: (_, value) => {
                                if (value < noRents) {
                                    return Promise.reject(`不能低于 ${noRents}元`);
                                }
                                return Promise.resolve();
                            },
                        },
                    ]}>
                        <InputNumber addonBefore="总租金(元):" min={0}/>
                    </Form.Item>
                    <Form.Item>
                        <span style={{fontSize:'12px',color:'#555'}}>总租金不能低于{noRents}元=单价*可租面积</span>
                    </Form.Item>
                    <Form.Item  name='address' rules={[{required: true, message: '请填写详细地址'}]}>
                        <Input addonBefore="详细地址:"/>
                    </Form.Item>
                    <Form.Item name='floors' rules={[{required: true, message: '请填写总楼层'}]}>
                        <InputNumber addonBefore="总楼层(层)" min={0}/>
                    </Form.Item>
                    <Form.Item>
                        <InputNumber addonBefore="剩余可增加面积㎡" value={residue_add_area} disabled/>
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
export default connect() (AddHouse)