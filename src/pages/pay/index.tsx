import { connect, history, useNavigate } from "umi";
import {
    Button,
    Form,
    Input,
    InputNumber,
    message,
    Spin,
    Image,
    Modal,
    Radio,
} from "antd";
import { useEffect, useState } from "react";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import * as AppUserService from '@/services/appUser';
import { numberToRMB, } from "@/utils/OpenTool";
import { NavBar, List, Space } from "antd-mobile";
import { log } from "console";

const Pay = (props: any) => {
    const navigate = useNavigate();
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    // 充值类型
    const [handType, setHandType] = useState(1);
    const [spinning, setspinning] = useState(false);
    const [isxianshi, setisxianshi] = useState(false);
    // 输入查询的手机号
    const [userPhone, setUserPhone] = useState('');
    // 输入充值的金额
    const [addbalance, setaddbalance] = useState(0);
    // 弹窗输入充值的金额
    const [openBalance, setopenBalance] = useState(0);
    // 点击充值的弹窗
    const [open, setOpen] = useState(false);
    // 备注
    const [remark, setremark] = useState('');

    // 用户列表数组（唯一数据源）
    const [userForm, setUserForm] = useState<any[]>([]);
    // 当前选中充值用户
    const [currentSelectUserId, setCurrentSelectUserId] = useState<number>(0);
    const [currentUserInfo, setCurrentUserInfo] = useState<any>(null);

    // 窗口自适应监听
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // 充值提交
    const onFinish = () => {
        setspinning(true);
        if (addbalance != openBalance) {
            message.error('输入金额与弹窗金额不一致');
            setspinning(false);
            return;
        }
        props.dispatch({
            type: 'ManualRecharge/add',
            payload: {
                addbalance,
                userId: currentSelectUserId,
                handType,
                remark
            }
        }).then((res: any) => {
            if (res.ErrorCode == 0) {
                message.success('添加成功');
                setspinning(false);
                setOpen(false);
                setremark('');
                history.push('/pay');
            } else {
                message.error(res.Data);
                setspinning(false);
                setOpen(false);
            }
        })
    };

    const changeHandAmount = (e) => {
        setHandType(e.target.value);
    };

    // 搜索用户
    const sousuo = () => {
        setspinning(true);
        if (!userPhone) {
            setspinning(false);
            setisxianshi(false);
            setUserForm([]);
            return;
        }
        AppUserService.userInfo(userPhone).then((res: TypeErrorCode) => {
            log(res.Data);
            if (res.ErrorCode == 0) {
                // 判断是否为有效数组
                if (!Array.isArray(res.Data) || res.Data.length === 0) {
                    message.warning('未能查询到该用户');
                    setspinning(false);
                    setisxianshi(false);
                    setUserForm([]);
                } else {
                    setUserForm(res.Data);
                    setspinning(false);
                    setisxianshi(true);
                }
            } else {
                message.error(res.Data);
                setspinning(false);
                setisxianshi(false);
                setUserForm([]);
            }
        })
    };

    // 单条充值按钮点击，传入当前行item
    const chongzhiOpen = (item: any) => {
        if (addbalance == 0) {
            message.warning('请输入充值金额');
            return;
        }
        setCurrentSelectUserId(item.tenantId);
        setCurrentUserInfo(item);
        setOpen(true);
    };

    const changePhone = (e) => {
        setUserPhone(e.target.value);
    };

    const changeBalance = (e) => {
        setaddbalance(e);
    };

    // 页面初始化自动搜索
    useEffect(() => {
        sousuo();
    }, []);

    const getContainerStyle = () => {
        return {
            padding: windowWidth <= 480 ? '1rem' : '2rem',
            maxWidth: windowWidth <= 480 ? '100%' : '600px',
            margin: '0 auto',
            backgroundColor: '#f5f6fa',
            minHeight: '90vh'
        };
    };

    // 数组空判断
    const isEmptyData = !Array.isArray(userForm) || userForm.length === 0;

    return (
        <Spin spinning={spinning}>
            <div style={getContainerStyle()}>
                <NavBar
                    onBack={() => history.push('/dashboard/')}
                    style={{
                        '--height': '48px',
                        '--border-bottom': 'none',
                        '--background-color': '#fff'
                    }}
                />
                <div style={{ padding: '16px' }}>
                    <InputNumber
                        placeholder="请输入充值金额"
                        min={1}
                        precision={2}
                        style={{ width: '100%', marginBottom: '10px' }}
                        onChange={changeBalance}
                        value={addbalance}
                    />
                    <Space block direction='vertical' style={{ '--gap': '16px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <Input
                                placeholder="请输入手机号码"
                                style={{ flex: 1 }}
                                onChange={changePhone}
                                value={userPhone}
                            />
                            <Button
                                type='primary'
                                onClick={sousuo}
                                style={{ flexShrink: 0 }}
                            >
                                搜索
                            </Button>
                        </div>
                        {/* 充值类型单选 */}
                        <Radio.Group value={handType} onChange={changeHandAmount}>
                            <Radio value={1}>余额</Radio>
                        </Radio.Group>
                    </Space>
                </div>
                {
                    !isxianshi ? null : (
                        <div style={{ margin: '16px 0' }}>
                            {
                                isEmptyData ? (
                                    <div style={{ textAlign: 'center', padding: '30px 0' }}>暂无匹配用户数据</div>
                                ) : (
                                    userForm.map((item) => {
                                        const {
                                            userId,
                                            userImage,
                                            userName,
                                            tenant_phone,
                                            tenant_name,
                                            balance,
                                            tenantId
                                        } = item;
                                        return (
                                            <List mode="card" key={userId} style={{ marginBottom: 12 }}>
                                                <List.Item
                                                    extra={
                                                        userImage ? (
                                                            <Image
                                                                style={{ width: '50px', height: '50px' }}
                                                                src={`${window.ServerConfig.imgServer}${userImage}.png`}
                                                                fallback="/avatar-default.png"
                                                            />
                                                        ) : (
                                                            <div style={{ width: 50, height: 50, background: '#eee', lineHeight: '50px', textAlign: 'center' }}>无头像</div>
                                                        )
                                                    }
                                                >
                                                    用户头像
                                                </List.Item>
                                                <List.Item extra={userName ?? '-'}>微信昵称</List.Item>
                                                <List.Item extra={tenant_phone ?? '-'}>用户手机号</List.Item>
                                                <List.Item extra={tenant_name ?? '-'}>租户姓名</List.Item>
                                                <List.Item extra={`${Number(balance).toFixed(2)}元`}>余额</List.Item>
                                                {/* 当前卡片独立充值按钮 */}
                                                <List.Item>
                                                    <div style={{ width: '100%', textAlign: 'center', padding: '8px 0' }}>
                                                        <Button type='primary' onClick={() => chongzhiOpen(item)}>充值</Button>
                                                    </div>
                                                </List.Item>
                                            </List>
                                        )
                                    })
                                )
                            }
                        </div>
                    )
                }

                {/* 充值弹窗 */}
                <Modal
                    open={open}
                    onCancel={() => {
                        setOpen(false);
                        setremark('');
                    }}
                    title='请确认充值'
                    onOk={onFinish}
                    loading={spinning}
                >
                    <Form>
                        <Form.Item label='充值类型'>
                            <Radio.Group value={handType}>
                                <Radio value={1}>余额</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label='手机号'>
                            <Input value={currentUserInfo?.tenant_phone ?? ''} disabled />
                        </Form.Item>
                        <Form.Item label='充值量'>
                            <InputNumber
                                min={0}
                                onChange={(e) => setopenBalance(e)}
                                value={openBalance}
                                style={{ width: '100%' }}
                            />
                        </Form.Item>
                        <Form.Item label='备注'>
                            <Input.TextArea
                                value={remark}
                                onChange={(e) => setremark(e.target.value)}
                                rows={3}
                            />
                        </Form.Item>
                        <Form.Item label='大写金额'>
                            <span style={{ color: 'red', fontWeight: 600 }}>{numberToRMB(addbalance)}</span>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </Spin>
    )
}

export default connect()(Pay)