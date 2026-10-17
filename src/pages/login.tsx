import 'weui/dist/style/weui.min.css';
import {StaticInfo} from "@/StaticInfo";
import {history} from "umi";
import {useEffect, useState} from "react";
import * as LoginService from '@/services/login';
import { sleep } from '@/utils/common';
import {phonePattern, pwdPattern} from "@/utils/OpenTool";
import CryptoUtils from "@/utils/Crypto";
import {EventMgr} from "@/Event/EventMgr";
import {info_event} from "@/Event/EventEnum";
import {message, Modal} from "antd";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import styles from './login.less';
import { Button, Input, Form ,Toast} from 'antd-mobile';
import { Input as AntdInput} from 'antd';
import Cookies from 'js-cookie'
import ver from '../../public/ver.json';
import FingerprintJS from '@fingerprintjs/fingerprintjs'


const Login = () => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [editForm] = Form.useForm();
    const evtthis = Symbol('Login');
    const [modal, modalContextHolder] = Modal.useModal();
    const [form] = Form.useForm();
    const [countdown, setCountdown] = useState(0); // 验证码倒计时
    const [loading, setLoading] = useState(false);
    const [phone, setPhone] = useState('');
    const [pwd,setpwd]=useState('');
    const [yzCode,setYzCode]=useState('');
    const [error, setError] = useState(false);
    const [errorstr, setErrorstr] = useState('');
    const [maskvsi, setMaskvsi] = useState(false);
    const [isyzmOpen,setIsyzmOpen]=useState(false);
    const [editPassword, setEditPassword] = useState(false);
    // 找回密码输入密码弹窗
    const [mmOpen,setmmOpen]=useState(false);
    // 修改密码填写的验证码
    const [editPwdYzm,setEditPwdYzm]=useState('');
    // 修改密码输入的手机号
    const [editpwdPhone, setEditpwdPhone] = useState('');
    // 找回密码倒计时时间
    const [editCountdown, setEditCountdown] = useState(0);
    const [deviceId,setDeviceId]=useState('');
    const [isSms,setIsSms]=useState(0);

    useEffect(() => {
        didmount();
        getDeviceId();
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    // 登录时获取设备id
    const getDeviceId = async () => {
        // 先读取cookie中的deviceId
        const cacheId = Cookies.get('deviceId');
        console.log("缓存的设备号",cacheId);
        // 初始化指纹库，生成当前浏览器设备标识
        const fp = await FingerprintJS.load()
        const result = await fp.get()
        const deviceId = result.visitorId;
        setDeviceId(deviceId);
        // 判断cookie是否不存在
        if (!cacheId) {
            setIsSms(1);
        } else {
            if (cacheId === deviceId) {
                setIsSms(0);
            } else {
                setIsSms(1);
            }
        }
    };
    const onError = async (_str: string) => {
        setError(true);
        setErrorstr(_str);
        await sleep(3000);
        setError(false);
        setErrorstr('');
    };
    let showWaitTimeout = setTimeout(() => { }, 1000);
    const showWaitChaoshi = async () => {
        clearTimeout(showWaitTimeout);
        setMaskvsi(false);
        modal.error({
            content: '请求超时',
            centered: true,
            okText: '刷新'
        });
        window.location.replace(window.location.href);
    }
    const shhowWait = () => {
        setMaskvsi(true);
        showWaitTimeout = setTimeout(showWaitChaoshi, 30000);
    };
    const hideWait = () => {
        clearTimeout(showWaitTimeout);
        setMaskvsi(false);
    };
    const didmount = async () => {
        let zuixin = await fetch('/ver.json')
            .then(res => {
                return res.json();
            })
            .then(resjson => {
                const curversion = resjson.version;
                const jeguo = localStorage.getItem('curversion') == curversion;
                if (!jeguo) {
                    localStorage.setItem('curversion', curversion);
                }
                return jeguo;
            });
        if (!zuixin) {
            window.location.replace(window.location.href);
            return;
        }
        StaticInfo.userState = false;
        sessionStorage.removeItem('sxxx');
        EventMgr.on(info_event.Error, evtthis, onError);
        EventMgr.on(info_event.showWait, evtthis, shhowWait);
        EventMgr.on(info_event.hideWait, evtthis, hideWait);
    };
    // useEffect(() => {
    //     issms();
    // }, []);
    // // 不需要验证码登录
    // const issms=()=>{
    //     if (localStorage.getItem('ispwd')&&localStorage.getItem('isphone')) {
    //         let ismm =CryptoUtils.md5(localStorage.getItem('ispwd'));
    //         let isphone =localStorage.getItem('isphone');
    //         LoginService.loginIsSms(isphone,ismm,deviceId,1,'1',isSms).then((res:TypeErrorCode)=>{
    //             if (res.ErrorCode==0){
    //                 let data = res.Data;
    //                 StaticInfo.userId = data.id;
    //                 StaticInfo.userState = true;
    //                 StaticInfo.token = data.token;
    //                 StaticInfo.park_id = data.park_id;
    //                 StaticInfo.username= data.uname;
    //                 StaticInfo.uqx= data.authority;
    //                 StaticInfo.park_name= data.park_name;
    //                 StaticInfo.beginTime= data.beginTime;
    //                 StaticInfo.endTime= data.endTime;
    //                 StaticInfo.meal_id= data.meal_id;
    //                 StaticInfo.isTask= data.isTask;
    //                 StaticInfo.parkList= data.parkList;
    //                 sessionStorage.setItem('userId',data.id);
    //                 sessionStorage.setItem('userState','true');
    //                 sessionStorage.setItem('token',data.token);
    //                 sessionStorage.setItem('park_id',data.park_id);
    //                 sessionStorage.setItem('username',data.uname);
    //                 sessionStorage.setItem('uqx',data.authority);
    //                 sessionStorage.setItem('park_name',data.park_name);
    //                 sessionStorage.setItem('loginbeginTime',data.beginTime);
    //                 sessionStorage.setItem('loginendTime',data.endTime);
    //                 sessionStorage.setItem('loginmeal_id',data.meal_id);
    //                 sessionStorage.setItem('isTask',data.isTask);
    //                 sessionStorage.setItem('parkList',JSON.stringify(data.parkList));
    //                 history.push('/dashboard/');
    //                 LoginService.getUserId(isphone).then(()=>console.log("111"));
    //                 setCookie('deviceId', deviceId);
    //             }else if(res.ErrorCode == -8888){
    //                 setIsSms(1);
    //                 Cookies.remove('deviceId', { path: '/' })
    //             }else if(res.ErrorCode == -7777){
    //                 setIsSms(1);
    //                 Cookies.remove('deviceId', { path: '/' });
    //                 message.error('账户或密码错误');
    //             }else {
    //                 localStorage.clear();
    //                 sessionStorage.clear();
    //             }
    //         })
    //     }else {
    //         console.log('错误的密码',localStorage.getItem('ispwd'));
    //         console.log('错误的手机',localStorage.getItem('isphone'));
    //     }
    // };
    const handleFinish = () => {
        if (!phonePattern.test(phone)){
            Toast.show({
                content: '请输入正确的手机号码',
            });
            return;
        }
        if (pwd===''){
            Toast.show({
                content: '请输入密码',
            });
            return;
        }
        if (isSms==1 &&yzCode===''){
            Toast.show({
                content: '请输入验证码',
            });
            return;
        }
        setLoading(true);
        let mm =CryptoUtils.md5(pwd);
        LoginService.login(phone,mm,deviceId,1,yzCode,isSms).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                let data = res.Data;
                StaticInfo.userId = data.id;
                StaticInfo.userState = true;
                StaticInfo.token = data.token;
                StaticInfo.park_id = data.park_id;
                StaticInfo.username= data.uname;
                StaticInfo.uqx= data.authority;
                StaticInfo.park_name= data.park_name;
                StaticInfo.beginTime= data.beginTime;
                StaticInfo.endTime= data.endTime;
                StaticInfo.meal_id= data.meal_id;
                StaticInfo.isTask= data.isTask;
                StaticInfo.parkList= data.parkList;
                sessionStorage.setItem('userId',data.id);
                sessionStorage.setItem('userState','true');
                sessionStorage.setItem('token',data.token);
                sessionStorage.setItem('park_id',data.park_id);
                sessionStorage.setItem('username',data.uname);
                sessionStorage.setItem('uqx',data.authority);
                sessionStorage.setItem('park_name',data.park_name);
                sessionStorage.setItem('loginbeginTime',data.beginTime);
                sessionStorage.setItem('loginendTime',data.endTime);
                sessionStorage.setItem('loginmeal_id',data.meal_id);
                history.push('/dashboard/');
                localStorage.setItem('isphone',phone);
                localStorage.setItem('ispwd',pwd);
                sessionStorage.setItem('isTask',data.isTask);
                sessionStorage.setItem('parkList',JSON.stringify(data.parkList));
                LoginService.getUserId(phone).then(()=>console.log("111"));
                setCookie('deviceId', deviceId);
            }else if(res.ErrorCode == -8888){
                setIsSms(1);
                Cookies.remove('deviceId', { path: '/' })
            }else if(res.ErrorCode == -7777){
                setIsSms(1);
                Cookies.remove('deviceId', { path: '/' });
                message.error('账户或密码错误');
            }else {
                Toast.show({
                    content: res.Data,
                });
                if (res.ErrorCode == -1013) {
                    sleep(3000).then(res => {
                        window.location.replace(window.location.href);
                    });
                }
            }
        })
    };
    // 设置4小时Cookie
    const setCookie=(deviceIdName:string, value:string)=> {
        const time = new Date(Date.now() + 4 * 60 * 60 * 1000)
        document.cookie = `${encodeURIComponent(deviceIdName)}=${encodeURIComponent(value)};expires=${time.toUTCString()};path=/`
    }
    // 获取验证码函数
    const getVerifyCode = () => {
        if (!phonePattern.test(phone)) {
            Toast.show({
                content: '请输入正确的手机号码',
            });
            return;
        }
        let type=1;
        let shebei='设备'
        LoginService.loginYzm(phone,type,shebei,1).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                Toast.show({
                    content: '验证码已发送',
                });
            }else {
                Toast.show({
                    content: res.Data,
                });
            }
        })
        setCountdown(60);
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) clearInterval(timer);
                return prev - 1;
            });
        }, 1000);
    };
    const changeYzCode = (e: any) => {
        setYzCode(e);
    };
    const changePwd = (e: any) => {
        setpwd(e);
    };
    const changePhone = (e: any) => {
        setPhone(e);
    };
    const getPageStyle = () => {
        return {
            maxWidth: 600,
            margin: '0 auto',
            padding: windowWidth <= 480 ? '24px 8px' : '24px 16px'
        };
    };
    const getHeaderStyle = () => {
        return {
            textAlign: 'center',
            marginBottom: 24
        };
    };
    const getH1Style = () => {
        return {
            fontSize: windowWidth <= 480 ? 20 : 24,
            marginBottom: 8
        };
    };
    const getVersionInfoStyle = () => {
        return {
            textAlign: 'center',
            marginTop: 16
        };
    };
    const getVersionTextStyle = () => {
        return {
            fontSize: 12,
            color: '#999'
        };
    };
    const getLoginContainerStyle = () => {
        return {
            margin: '20px auto',
            width: '100%',
            maxWidth: 300
        };
    };
    //   忘记密码输入手机验证
    const onEditPasswordPhoneValue = (values: any) => {
        console.log('values',values)
        if (!editPwdYzm){
            message.error('请输入验证码');
            return false
        }
        LoginService.duanxinyanzhen(values.phone,editPwdYzm).then((res:any)=>{
            console.log('验证',res)
            if (res.ErrorCode==0){
                message.success('验证码通过');
                setIsyzmOpen(false);
                setmmOpen(true);
            }else {
                message.error(res.Data)
            }
        })
    };
    const getEditPwdYzm = async () => {
        if (!phonePattern.test(editpwdPhone)) {
            message.error('请输入有效的手机号');
            return false
        }
        let type=1;
        let shebei=deviceId;
        let res:any=await LoginService.loginYzm(editpwdPhone,type,shebei,1);
        if (res.ErrorCode==0){
            message.success('验证码已发送，请留意');
        }else {
            message.error(res.Data);
            return false
        }
        setEditPassword(true); // 禁用按钮
        setEditCountdown(60); // 设置倒计时为60秒

        const interval = setInterval(() => {
            setEditCountdown((prevCountdown) => {
                if (prevCountdown <= 1) {
                    clearInterval(interval); // 清除定时器
                    setEditPassword(false); // 倒计时结束，启用按钮
                    return 0; // 重置倒计时
                }
                return prevCountdown - 1; // 倒计时减一
            });
        }, 1000); // 每秒更新一次倒计时
    };
    // 确定修改密码
    const onOKmm=(values:any)=>{
        let md5Pwd= CryptoUtils.md5(values.password);
        LoginService.editPwd(editpwdPhone,md5Pwd).then((res:any)=>{
            if (res.ErrorCode==0){
                message.success('修改成功');
                setmmOpen(false);
            }else {
                message.error(res.Data)
            }
        })
    };
    // 验证两次输入的密码是否一致
    const compareToFirstPassword = (_, value) => {
        if (!value || !editForm.getFieldValue('password')) {
            return Promise.resolve();
        }
        if (value !== editForm.getFieldValue('password')) {
            return Promise.reject(new Error('两次输入的密码不一致!'));
        }
        return Promise.resolve();
    };
    const changeEditPhone=(e)=>{
        setEditpwdPhone(e.target.value);
    };
    return (
        <div style={getPageStyle()}>
            <div style={getHeaderStyle()}>
                <h1 style={getH1Style()}>茶叶系统</h1>
            </div>
            <Form
                form={form}
                layout="horizontal"
                onFinish={handleFinish}
                footer={
                    <>
                        <Button block type='submit' color='primary' size='large'>
                            登录
                        </Button>
                        <a type='primary' className={styles.yzmBtn} onClick={()=>setIsyzmOpen(true)}>忘记密码</a>
                        <div style={getVersionInfoStyle()}>
                            <p style={getVersionTextStyle()}>版本:{ver.version}</p>
                        </div>
                    </>
                }
            >
                <Form.Item
                    name="account"
                    label="账号"
                    rules={[{ required: true, message: '请输入账号' }]}
                >
                    <Input placeholder="请输入账号" clearable value={phone} onChange={changePhone}/>
                </Form.Item>
                <Form.Item
                    name="password"
                    label="密码"
                    rules={[{ required: true, message: '请输入密码' }]}
                >
                    <Input type="password" placeholder="请输入密码" clearable value={pwd} onChange={changePwd}/>
                </Form.Item>
                <Form.Item
                    name="verifyCode"
                    label="验证码"
                    rules={[{ required: true, message: '请输入验证码' }]}
                    extra={
                        <Button
                            size="small"
                            color="primary"
                            onClick={getVerifyCode}
                            disabled={countdown > 0}
                        >
                            {countdown > 0 ? `${countdown}秒后重试` : '获取验证码'}
                        </Button>
                    }
                >
                    <Input placeholder="请输入验证码" clearable value={yzCode} onChange={changeYzCode}/>
                </Form.Item>
            </Form>
            {/*忘记密码输入手机验证弹窗*/}
            <Modal open={isyzmOpen} onCancel={()=>setIsyzmOpen(false)} title='忘记密码' footer={false}>
                <Form
                    name='editPwd'
                    onFinish={onEditPasswordPhoneValue}
                >
                    <Form.Item name='phone'  rules={[{required: true, message: '请输入手机号' },{pattern: phonePattern, message: '请输入有效的手机号'}]}>
                        <AntdInput  placeholder='手机号' onChange={changeEditPhone}/>
                    </Form.Item>
                    {isSms==1?
                        <Form.Item>
                            <AntdInput  placeholder='验证码' style={{marginRight:'5px'}} onChange={(e)=>setEditPwdYzm(e.target.value)}/>
                            <a
                                href="#"
                                className={styles.yzmBtn}
                                onClick={editPassword ? undefined : getEditPwdYzm}
                                style={{ pointerEvents: editPassword ? 'none' : 'auto', cursor: editPassword ? 'not-allowed' : 'pointer' }}
                            >
                                {editCountdown > 0 ? `${editCountdown}秒后重新获取` : '获取验证码'}
                            </a>
                        </Form.Item>:''
                    }
                    <Form.Item>
                        <Button  type='primary' htmlType="submit">下一步</Button>
                    </Form.Item>
                </Form>
            </Modal>
            {/*输入密码弹窗*/}
            <Modal open={mmOpen} onCancel={()=>setmmOpen(false)} title='找回密码' footer={false}>
                <Form
                    form={editForm}
                    onFinish={onOKmm}
                >
                    <Form.Item label='输入密码' name='password' rules={[{required: true, message: '请输入密码' },{pattern: pwdPattern, message: '密码必须包含大小写加特殊符号，总长度6位以上'}]}>
                        <AntdInput.Password/>
                    </Form.Item>
                    <Form.Item
                        label='确认密码'
                        name="confirmPassword"
                        rules={[
                            {required: true, message: '请确认密码'},
                            {validator: compareToFirstPassword },
                        ]}
                    >
                        <AntdInput.Password/>
                    </Form.Item>
                    <Form.Item>
                        <Button  type='primary' htmlType="submit">确定修改</Button>
                    </Form.Item>
                </Form>
            </Modal>
            <div id="ww-login-container" style={getLoginContainerStyle()}></div>
        </div>
    );
};

export default Login;