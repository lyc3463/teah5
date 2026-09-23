import {connect,history,useNavigate} from 'umi'
import {useLocation} from "@@/exports";
import {useEffect, useRef, useState} from "react";
import {Button, Form, Input, InputNumber, message, Modal, Select, Space, Spin, Tag} from "antd";
import * as WatertService from '@/services/watert';
import {NavBar} from "antd-mobile";

const Waterjiben=(props)=>{
    const navigate=useNavigate();
    const location=useLocation();
    const [isSpinning,setIsSpinning]=useState(false);
    const formRef =useRef();
    // 路由参数
    const [uid,setUid]=useState('0');
    // 关阀弹窗
    const [lazha,setlazha]=useState(false);
    // 开阀弹窗
    const [hezha,sethezha]=useState(false);
    // 充值弹窗
    const [cz,setCz]=useState(false);
    // 充值金额
    const [q,changeQ]=useState(0);
    const [kh,setkh]=useState(false);
    // 远程清零弹窗
    const [qlOpen,setQlOpen]=useState(false);
    // 水表状态 1 表示合闸/开阀， 0 表示拉闸/关阀
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
    const offlazha=()=>{
        setIsSpinning(true);
        WatertService.off({uid,stutes:0}).then((res:any)=>{
            if (res.ErrorCode==0){
                message.success('关阀成功');
                setlazha(false);
                setIsSpinning(false);
            }else {
                message.error(res.Data);
                setlazha(false);
                setIsSpinning(false);
            }
        })
    };
    const offhezha=()=>{
        setIsSpinning(true);
        WatertService.off({uid,stutes:1}).then((res:any)=>{
            if (res.ErrorCode==0){
                message.success('开阀成功');
                sethezha(false);
                setIsSpinning(false);
            }else {
                message.error(res.Data);
                sethezha(false);
                setIsSpinning(false);
            }
        })
    };
    // 获取单个水表详情
    const getOneWater=async (id:string)=>{
        let res:any=await  WatertService.one(id);
        if (res?.ErrorCode==0){
            formRef.current.setFieldsValue(res?.Data);
            setrelay_state(res.Data.relay_state);
        }else {
            message.error(res.Data)
        }
    };
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        setUid(id)
        getOneWater(id)
    }, []);
    const chongzhi=()=>{
        WatertService.addcz({uid,q}).then((res:any)=>{
            if (res.ErrorCode==0){
                message.success('充值成功');
            }else {
                message.error(res.Data)
            }
        })
    };
    const iskh=()=>{
        WatertService.addkh({uid}).then((res:any)=>{
            if (res.ErrorCode==0){
                message.success('开户成功');
            }else {
                message.error(res.Data);
            }
        })
    };
    const qlOk=()=>{
        setIsSpinning(true);
        WatertService.ql(uid).then((res:any)=>{
            if (res.ErrorCode==0){
                message.success('清零成功');
                setIsSpinning(false);
                setQlOpen(false);
                getOneWater(uid);
            }else {
                message.error(res.Data);
                setIsSpinning(false);
                setQlOpen(false);
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
        <Spin spinning={isSpinning}>
            <div style={getContainerStyle()}>
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
                        <Input addonBefore="采集器编号:"/>
                    </Form.Item>
                    <Form.Item name='address' style={getFormItemStyle()}>
                        <Input addonBefore="表编号/地址:"/>
                    </Form.Item>
                    <Form.Item name='water_type' style={getFormItemStyle()}>
                        <Select
                            placeholder={'水表类型'}
                            options={[
                                {label:'无线无预付',value:'13301'}
                            ]}
                        />
                    </Form.Item>
                    <Form.Item name='remark' style={getFormItemStyle()}>
                        <Input addonBefore="描述:"/>
                    </Form.Item>
                    <Form.Item  name='total_used_amount' style={getFormItemStyle()}>
                        <InputNumber addonBefore="当前总用量(m³):"/>
                    </Form.Item>
                    <Form.Item style={getFormItemStyle()}>
                        <Space>
                            状态：{relay_state==1?<Tag color='green'>开阀</Tag>:<Tag color='red'>关阀</Tag>}
                            <Button type='primary' onClick={()=>setlazha(true)}>关阀</Button>
                            <Button type='primary' onClick={()=>sethezha(true)}>开阀</Button>
                        </Space>
                    </Form.Item>
                </Form>
                {/*拉闸的弹窗*/}
                <Modal open={lazha} onCancel={()=>setlazha(false)} onOk={offlazha}>
                    <div>
                        确定要关阀吗？
                    </div>
                </Modal>
                {/*合闸的弹窗*/}
                <Modal open={hezha} onCancel={()=>sethezha(false)} onOk={offhezha}>
                    <div>
                        确定要开阀吗？
                    </div>
                </Modal>
                {/*充值弹窗*/}
                <Modal open={cz} onCancel={()=>setCz(false)} onOk={chongzhi}>
                    <div>
                        <Form>
                            <Form.Item label='充值金额'>
                                <InputNumber min={0} onChange={(e:number)=>changeQ(e)}/>
                            </Form.Item>
                        </Form>
                    </div>
                </Modal>
                {/*开户弹窗*/}
                <Modal open={kh} onCancel={()=>setkh(false)} onOk={iskh} title='是否开户'>
                    <div>

                    </div>
                </Modal>
                {/*远程清零弹窗*/}
                <Modal open={qlOpen} onCancel={()=>setQlOpen(false)} onOk={qlOk} title='远程清零'>
                    <div>
                        是否远程清零?
                    </div>
                </Modal>
            </div>
        </Spin>
    )
}
export default connect() (Waterjiben)