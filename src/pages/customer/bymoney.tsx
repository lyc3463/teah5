import {Button, Form, InputNumber, message, Space, Input, Spin, Radio} from "antd";
import {useEffect, useRef, useState} from "react";
import {connect, history, useNavigate} from "umi";
import * as ZuhuServer from "@/services/zuhu";

const tailLayout = {
    wrapperCol: { offset: 4 },
};

const Bymoney = (props) => {
    const navigate = useNavigate();
    const [uid, setUid] = useState('0');
    // 预留金额
    const [reserved_amount, setreserved_amount] = useState(0);
    // 警告金额
    const [warn_amount, setwarn_amount] = useState(0);
    // 最低充值金额
    const [minimum_recharge, setminimum_recharge] = useState(100);
    const formRef = useRef();
    // 租户金额
    const [tenantAmount, settenantAmount] = useState(0);
    // 原先预留金额
    const [oldreserved_amount, setoldreserved_amount] = useState(0);
    const [spinning, setspinning] = useState(false);
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

    const getOneCustom = async (id: string) => {
        let res: any = await ZuhuServer.one(id);
        if (res.ErrorCode === 0) {
            let data = res.Data;
            formRef.current.setFieldsValue(data[0]);
            settenantAmount(data[0].tenantAmount);
            setminimum_recharge(data[0].minimum_recharge);
            setoldreserved_amount(data[0].reserved_amount);
            setreserved_amount(data[0].reserved_amount);
            setwarn_amount(data[0].warn_amount);
        } else {
            message.error(res.Data);
        }
    };

    useEffect(() => {
        setUid(props.id);
        getOneCustom(props.id);
    }, [props.id]);

    const onFinish = (vals) => {
        setspinning(true);
        props.dispatch({
            type: 'Zuhu/newbyzhuhu',
            payload: { ...vals, uid, tenantAmount, warn_amount, reserved_amount, oldreserved_amount }
        }).then((res: any) => {
            if (res.ErrorCode === 0) {
                message.success('绑定成功');
                setspinning(false);
                // getOneCustom(uid);
                history.push('/customer');
            } else {
                setspinning(false);
                message.error(res.Data);
                getOneCustom(uid);
            }
        });
    };

    const getFormContainerStyle = () => {
        return {
            // 进一步减小最大宽度
            maxWidth: windowWidth <= 480 ? '90%' : '600px',
            margin: '0 auto',
            padding: windowWidth <= 480 ? '1rem' : '2rem',
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)'
        };
    };

    const getFormItemStyle = () => {
        return {
            marginBottom: windowWidth <= 480 ? '1rem' : '1.5rem'
        };
    };

    const getInputNumberStyle = () => {
        return {
            width: '100%',
            marginBottom: '0.5rem'
        };
    };

    const getNoteTextStyle = () => {
        return {
            color: '#666',
            fontSize: windowWidth <= 480 ? '0.6rem' : '0.9rem',
            display: 'block'
        };
    };

    const getTextAreaStyle = () => {
        return {
            width: '100%'
        };
    };

    const getButtonGroupStyle = () => {
        return {
            marginTop: windowWidth <= 480 ? '1rem' : '1.5rem',
            display: 'flex',
            justifyContent: 'center'
        };
    };

    const getButtonStyle = () => {
        return {
            minWidth: windowWidth <= 480 ? '80px' : '100px'
        };
    };

    return (
        <Spin spinning={spinning}>
            <Form
                labelCol={{ span: windowWidth <= 480 ? 24 : 6 }}
                wrapperCol={{ span: windowWidth <= 480 ? 24 : 18 }}
                ref={formRef}
                initialValues={{ remark: '', minimum_recharge: 1 }}
                layout="horizontal"
                size={'large'}
                onFinish={onFinish}
                style={getFormContainerStyle()}
            >
                <Form.Item rules={[{ required: true, message: '请填写' }]} style={getFormItemStyle()}>
                    <InputNumber
                        addonBefore="预留金额(元):"
                        min={0}
                        precision={0}
                        value={reserved_amount}
                        onChange={(e: number) => setreserved_amount(e)}
                        style={getInputNumberStyle()}
                    />
                    <p style={getNoteTextStyle()}>注意:用户余额低于预留金额会发消息到小程序提醒用户</p>
                </Form.Item>
                <Form.Item rules={[{ required: true, message: '请填写' }]} style={getFormItemStyle()}>
                    <InputNumber
                        addonBefore="警告金额(元):"
                        min={0}
                        value={warn_amount}
                        onChange={(e: number) => setwarn_amount(e)}
                        style={getInputNumberStyle()}
                    />
                    <p style={getNoteTextStyle()}>注意:用户余额低于警告金额会发短信到用户手机提醒用户</p>
                </Form.Item>
                <Form.Item
                    name='minimum_recharge'
                    rules={[
                        { required: true, message: '请填写' },
                        { min: 1, transform: (value) => Number(value), message: '最低充值不能低于 1' }
                    ]}
                    style={getFormItemStyle()}
                >
                    <InputNumber
                        addonBefore="最低充值(元):"
                        min={1}
                        value={minimum_recharge}
                        onChange={(e) => setminimum_recharge(e)}
                        style={getInputNumberStyle()}
                    />
                    <Form.Item label='是否自动扣款' name='is_deduction' style={getFormItemStyle()}>
                        <Radio.Group>
                            <Radio value={1}>是</Radio>
                            <Radio value={0}>否</Radio>
                        </Radio.Group>
                    </Form.Item>
                </Form.Item>
                <Form.Item name='remark' style={getFormItemStyle()}>
                    <Input.TextArea placeholder="备注" style={getTextAreaStyle()} />
                </Form.Item>
                <Form.Item {...tailLayout} style={getButtonGroupStyle()}>
                    <Space>
                        <Button type="primary" htmlType="submit" style={getButtonStyle()}>
                            确定修改
                        </Button>
                        <Button type="primary" onClick={() => navigate(-1)} style={getButtonStyle()}>
                            返回
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Spin>
    );
};

export default connect()(Bymoney);