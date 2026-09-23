import {useEffect, useRef, useState} from "react";
import {useLocation,connect,useNavigate} from 'umi'
import {Button, Form, Input, InputNumber, message, Modal, Select, Space, Spin, Tag} from "antd";
import * as CableServer from "@/services/cable";
import {NavBar} from "antd-mobile";
import {history} from "@@/core/history";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const ElectricityBasicBusiness=(props:any)=>{
    const location=useLocation();
    const navigate=useNavigate();
    const [isSpinning,setIsSpinning]=useState(false);
    const formRef =useRef();
    // 路由参数
    const [uid,setUid]=useState('0');
    // 拉闸弹窗
    const [lazha,setlazha]=useState(false);
    // 合闸弹窗
    const [hezha,sethezha]=useState(false);
    // 清零弹窗
    const [qlOpen,setQlOpen]=useState(false);
    // 充值弹窗
    const [cz,setcz]=useState(false);
    // 充值金额
    const [money,setMoney]=useState(0);
    // 电表状态 1合闸,2拉闸
    const [relay_state,setrelay_state]=useState(0);
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
    // 获取单个电表详情
    const getOneCable=async (id:string)=>{
        let res:any=await  CableServer.one(id);
        if (res.ErrorCode==0){
            formRef.current.setFieldsValue(res?.Data);
            setrelay_state(res.Data.relay_state);
        }else {
            message.error(res.Data)
        }
    };
    // 拉闸弹窗确定
    const offlazha= ()=>{
        CableServer.off({uid,stutes:2}).then((res:any)=>{
            if (res.ErrorCode==0){
                message.success('拉闸成功');
                getOneCable(uid);
                setlazha(false);
            }else {
                message.error(res.Data);
                setlazha(false);
            }
        })
    };
    // 合闸弹窗确定
    const offhezha=()=>{
        setIsSpinning(true);
        CableServer.off({uid,stutes:1}).then((res:any)=>{
            if (res.ErrorCode==0){
                message.success('合闸成功');
                sethezha(false);
                setIsSpinning(false);
                getOneCable(uid);
            }else{
                message.error(res.Data)
                setIsSpinning(false);
            }
        })
    };
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        setUid(id)
        getOneCable(id)
    }, []);
    const chongzhi=()=>{
        CableServer.addcz({uid,money}).then((res:any)=>{
            if (res.ErrorCode==0){
                message.success('充值成功');
            }else {
                message.error(res.Data)
            }
        })
    };
    const qlOk=()=>{
        setIsSpinning(true);
        CableServer.ql(uid).then((res:any)=>{
            if (res.ErrorCode==0){
                message.success('清零成功');
                setQlOpen(false);
                setIsSpinning(false);
            }else {
                message.error(res.Data);
                setQlOpen(false);
                setIsSpinning(false);
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
        <div style={getContainerStyle()}>
            <Spin spinning={isSpinning}>
                <NavBar
                    onBack={() => history.back()}
                    style={getNavBarStyle()}
                />
                <Form
                    layout="horizontal"
                    size={'large'}
                    ref={formRef}
                    style={getButtonStyle()}
                >
                    <Form.Item name='collectorid' style={getFormItemStyle()}>
                        <Input addonBefore='采集器编号'/>
                    </Form.Item>
                    <Form.Item name='address' style={getFormItemStyle()}>
                        <Input addonBefore='表编号/地址'/>
                    </Form.Item>
                    <Form.Item name='electricity_type' style={getFormItemStyle()}>
                        <Select
                            placeholder={'电能表类型'}
                            options={[
                                {label:'单相单费率07抄表',value:'65361'},
                                {label:'三相单费率07抄表',value:'65362'}
                            ]}
                        >
                        </Select>
                    </Form.Item>
                    <Form.Item name='remark' style={getFormItemStyle()}>
                        <Input addonBefore='采集器编号'/>
                    </Form.Item>
                    <Form.Item  style={getFormItemStyle()}>
                        <Space>
                            <Button type='primary' onClick={()=>setlazha(true)}>拉闸</Button>
                            <Button type='primary' onClick={()=>sethezha(true)}>合闸</Button>
                        </Space>
                        <div>
                            状态：{relay_state==1?<Tag color='green'>合闸</Tag>:<Tag color='red'>拉闸</Tag>}
                        </div>
                    </Form.Item>
                    <Form.Item name='c0'  style={getFormItemStyle()}>
                        <InputNumber addonBefore='当前电量kwh'/>
                    </Form.Item>
                </Form>
                {/*拉闸的弹窗*/}
                <Modal open={lazha} onCancel={()=>setlazha(false)} onOk={offlazha}>
                    <div>
                        确定要拉闸吗？
                    </div>
                </Modal>
                {/*合闸的弹窗*/}
                <Modal open={hezha} onCancel={()=>sethezha(false)} onOk={offhezha}>
                    <div>
                        确定要合闸吗？
                    </div>
                </Modal>
                {/*充值弹窗*/}
                {/*<Modal open={cz} onCancel={()=>setcz(false)} onOk={chongzhi}>*/}
                {/*    <Form>*/}
                {/*        <Form.Item label='充值金额'>*/}
                {/*            <InputNumber min={0} onChange={(e:number)=>setMoney(e)}/>*/}
                {/*        </Form.Item>*/}
                {/*    </Form>*/}
                {/*</Modal>*/}
                {/*远程清零弹窗*/}
                <Modal open={qlOpen} onCancel={()=>setQlOpen(false)} onOk={qlOk}>
                    <div>
                        确定要清零吗？
                    </div>
                </Modal>
            </Spin>
        </div>

    )
}
export default connect() (ElectricityBasicBusiness)