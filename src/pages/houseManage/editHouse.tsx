import {connect,useLocation,history,useNavigate} from 'umi';
import * as HouseServer from "@/services/house";
import {useEffect, useRef, useState} from "react";
import {Button, Form, Input, InputNumber, message, Space, Spin} from "antd";
import {NavBar} from "antd-mobile";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const EditHouse=(props:any)=>{
    const navigate=useNavigate();
    const location=useLocation()
    const [isLoading,setIsLoading]=useState(false);
    const [form] = Form.useForm();
    const formRef=useRef();
    // 路由参数
    const [uid,setUid]=useState<string|undefined>();
    // 可租面积
    const [rentable_area,setrentable_area]=useState(0);
    // 原可租面积
    const [oldrentable_area,setoldrentable_area]=useState(0);
    // 剩余可租面积
    const [residue_add_area,setresidue_add_area]=useState(0);
    // 原剩余可增加面积
    const [oldresidue_add_area,setoldresidue_add_area]=useState(0);
    // 不能低于租金
    const [noRents,setnoRents]=useState(0);
    // 单价
    const [price,setprice]=useState(0);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    // 获取单个房屋详情
    const getOneBanner=async (id:string)=>{
        let res:any=await  HouseServer.one(id);
        if (res?.ErrorCode==0){
            formRef.current.setFieldsValue(res?.Data);
            setrentable_area(res.Data.rentable_area);
            setoldrentable_area(res.Data.rentable_area);
            setresidue_add_area(res.Data.residue_add_area);
            setoldresidue_add_area(res.Data.residue_add_area);
            setprice(res.Data.price);
        }else {
            message.error(res.Data);
        }
    };
    // 编辑提交
    const onFinish=async (values:any)=>{
        setIsLoading(true);
        let res=await props.dispatch({
            type:'House/edit',
            payload:{...values,uid,rentable_area,residue_add_area,price}
        })
        if (res.ErrorCode==0){
            setIsLoading(false);
            message.success('修改成功');
            history.push('/houseManage/houseList');
        }else {
            message.error(res.Data);
            setIsLoading(false);
        }
    };
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        setUid(id)
        getOneBanner(id)
    }, []);
    const changeRentableArea=(e)=>{
        setrentable_area(e);
    };
    const hdblur=()=>{
        let sumadd_area :number=oldresidue_add_area+(rentable_area-oldrentable_area);
        if (sumadd_area<0){
            message.error('剩余可增加面积低于0');
            setrentable_area(oldrentable_area);
            setresidue_add_area(oldresidue_add_area);
        }else {
            setresidue_add_area(+sumadd_area);
        }
    };
    useEffect(() => {
        setnoRents(rentable_area*price);
    }, [rentable_area,price]);
    // 监听单价
    const changeprice=(e)=>{
        setprice(e);
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
        <Spin spinning={isLoading}>
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
                    ref={formRef}
                    style={{ marginTop:'1rem'}}
                >
                    <Form.Item name='house_name' rules={[{required: true, message: '请填写房屋名称'}]}>
                        <Input addonBefore="房屋名称:"/>
                    </Form.Item>
                    <Form.Item name='floor_area' rules={[{required: true, message: '请填写建筑面积'}]}>
                        <InputNumber addonBefore="建筑面积㎡:" min={0}/>
                    </Form.Item>
                    <Form.Item>
                        <InputNumber addonBefore="可租面积㎡:" value={rentable_area} onBlur={(val)=>hdblur(val)} onChange={changeRentableArea}/>
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
                                修改
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </div>
        </Spin>
    )
}
export default connect()(EditHouse)