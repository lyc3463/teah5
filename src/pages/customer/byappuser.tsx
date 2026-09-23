import {Button, Form, Input, message, Radio, Space, Spin} from "antd";
import {phonePattern} from "@/utils/OpenTool";
import {useEffect, useRef, useState} from "react";
import {connect, history, useNavigate} from "umi";
import * as ZuhuServer from "@/services/zuhu";

const tailLayout = {
    wrapperCol: { offset: 4 },
};

const Byappuser = (props) => {
    const navigate = useNavigate();
    const formRef = useRef();
    const [uid, setUid] = useState('0');
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
            type: 'Zuhu/newbyappuser',
            payload: { ...vals, uid }
        }).then((res: any) => {
            if (res.ErrorCode === 0) {
                message.success('绑定成功');
                setspinning(false);
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
            padding: windowWidth <= 480 ? '10px' : '20px',
            maxWidth: windowWidth <= 480 ? '90%' : '600px',
            margin: '0 auto',
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

    const getInputStyle = () => {
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
                labelCol={{ span: windowWidth <= 480 ? 24 : 4 }}
                wrapperCol={{ span: windowWidth <= 480 ? 24 : 14 }}
                ref={formRef}
                initialValues={{ reamrk: '', minimum_recharge: 1 }}
                layout="horizontal"
                size={'large'}
                onFinish={onFinish}
                style={getFormContainerStyle()}
            >
                <Form.Item
                    name='tenant_phone'
                    rules={[
                        { required: true, message: '请输入手机号' },
                        { pattern: phonePattern, message: '请输入有效的手机号' }
                    ]}
                    style={getFormItemStyle()}
                >
                    <Input addonBefore="绑定小程序:" style={getInputStyle()} />
                </Form.Item>
                <Form.Item {...tailLayout} style={getButtonGroupStyle()}>
                    <Space>
                        <Button type="primary" htmlType="submit" style={getButtonStyle()}>
                            确定关联
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

export default connect()(Byappuser);