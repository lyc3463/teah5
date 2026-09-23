import {Button, Form, Image, Input, message, Space, Spin} from "antd";
import {useNavigate,history,connect} from "umi";
import {useEffect, useState} from "react";
import NoyasuoImgCmp from "@/components/NoyasuoImgCmp";
import {NavBar} from "antd-mobile";
const ImportantNoticeAdd=(props)=>{
    const [form] = Form.useForm();
    const [spinning,setspinning]=useState(false);
    const [unitImages,setunitImgName]=useState([]);
    const [unitB64,setuintB64]=useState([]);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const onFinish=(val)=>{
        setspinning(true);
        let joinImg=unitImages.join('|');
        props.dispatch({
            type:'ImportantNotice/add',
            payload:{...val,imgs:joinImg}
        }).then((res)=>{
            if(res.ErrorCode==0){
                message.success('添加成功');
                history.push('/importantNotice');
                setspinning(false);
            }else {
                message.error(res.Data);
                setspinning(false);
            }
        })
    };
    const getunitImgName=(e:string)=>{
        setunitImgName((prevItems=>[...prevItems,e]))
    };
    const getunitB64=(e:string)=>{
        setuintB64((prevItems=>[...prevItems,e]))
    };
    const handleDeleteunitImg=(index:number)=>{
        const newImages = [...unitImages];
        newImages.splice(index, 1);
        setunitImgName(newImages);
        const newB64 = [...unitB64];
        newB64.splice(index, 1);
        setuintB64(newB64);
    };
    const getNavBarStyle = () => {
        return {
            '--height': windowWidth <= 480 ? '40px' : '48px',
            '--border-bottom': 'none',
            '--background-color': '#fff',
            '--color': '#333',
            '--font-size': windowWidth <= 480 ? '16px' : '18px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
        };
    };
    const getContainerStyle = () => {
        return {
            padding: windowWidth <= 480 ? '1rem' : '2rem',
            maxWidth: windowWidth <= 480 ? '100%' : '1200px',
            margin: '0 auto',
            backgroundColor: '#f5f6fa',
            minHeight: '90vh'
        };
    };
    // 监听窗口大小变化
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
                    onBack={() => history.push('/dashboard/')}
                    style={getNavBarStyle()}
                >
                    添加重要通知
                </NavBar>
                <Form
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 14 }}
                    form={form}
                    layout="horizontal"
                    size={'large'}
                    initialValues={{reason:''}}
                    onFinish={onFinish}
                    style={{ marginTop: '1rem' }}
                >
                    <Form.Item label='标题' name='title' rules={[{required: true, message: '请输入' }]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item label='内容' name='content' rules={[{required: true, message: '请输入' }]}>
                        <Input.TextArea/>
                    </Form.Item>
                    <Form.Item label='图片(选填)'>
                        <NoyasuoImgCmp onImageUpload={getunitImgName} oldBase64={getunitB64}/>
                        <Space style={{display:'flex',flexWrap:'wrap',marginTop:'25px'}}>
                            {unitB64.length>0?unitB64.map((item:any,index:number)=>{
                                return(
                                    <div key={index} style={{ display: 'flex', alignItems: 'center', position: 'relative',marginLeft:'20px'}}>
                                        <Image src={item} style={{ width: '80px', height: '80px' }} />
                                        <Button
                                            type="primary"
                                            danger
                                            onClick={() => handleDeleteunitImg(index)}
                                            style={{
                                                position: 'absolute',
                                                top: '0',
                                                left: '0',
                                                zIndex: 1,
                                                padding: '2px 4px',
                                                transform: 'translate(-50%, -50%)',
                                            }}
                                        >
                                            删除
                                        </Button>
                                    </div>
                                )
                            }):''}
                        </Space>
                    </Form.Item>
                    <Form.Item>
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
export default connect() (ImportantNoticeAdd);
