import {Button, Form, Input, NavBar, Toast} from 'antd-mobile';
import {connect, useNavigate,history} from 'umi';
import { useState, useEffect } from 'react';


const AddCollector = (props: any) => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
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

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const res = await props.dispatch({
                type: 'Collector/add',
                payload: values
            });
            if (res.ErrorCode === 0) {
                Toast.show({
                    icon: 'success',
                    content: '添加成功',
                });
                history.push('/collector')
                setLoading(false);
            } else {
                Toast.show({
                    icon: 'fail',
                    content: res.Data,
                });
                setLoading(false);
            }
        } finally {
            setLoading(false);
        }
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

    return (
        <div style={getContainerStyle()}>
            <NavBar
                onBack={() => navigate(-1)}
                style={getNavBarStyle()}
            >
                添加采集器
            </NavBar>
            <Form
                form={form}
                layout='horizontal'
                onFinish={onFinish}
                footer={
                    <Button
                        block
                        type='submit'
                        color='primary'
                        size='large'
                        loading={loading}
                        style={getButtonStyle()}
                    >
                        添加采集器
                    </Button>
                }
            >
                <Form.Header>添加采集器</Form.Header>
                <Form.Item
                    name='collector_number'
                    label='采集器ID'
                    rules={[{ required: true, message: '请填写采集器ID' }]}
                    style={getFormItemStyle()}
                >
                    <Input placeholder='请输入采集器ID' clearable />
                </Form.Item>
                <Form.Item
                    name='remark'
                    label='备注'
                    rules={[{ required: true, message: '请填写备注' }]}
                    style={getFormItemStyle()}
                >
                    <Input placeholder='请输入备注' clearable />
                </Form.Item>
            </Form>
        </div>
    );
};

export default connect()(AddCollector);