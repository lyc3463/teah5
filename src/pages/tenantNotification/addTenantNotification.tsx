import {Button, Form, Select, Input, Radio, message, Image, Spin, Space} from "antd";
import {connect,history} from "umi";
import {useEffect, useState} from "react";
import ImageUploader from "@/components/ImageUploader";
import * as TenantInfoService from '@/services/tenantInfo';
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import * as ZuhuService from '@/services/zuhu';
import {useNavigate} from "@@/exports";
import {NavBar} from "antd-mobile";
import PageLayout from "@/components/PageLayout ";
import ImageUploadPng from "@/components/ImageUploadPng";

const tailLayout = {
    wrapperCol: { offset: 4 },
};
const AddTenantInfo=(props)=>{
    const navigate=useNavigate();
    const [page,setPage]=useState(1);
    const [name,setName]=useState('');
    const [phone,setPhone]=useState('');
    const [pagecount,setpagecount]=useState(999);
    const [form] = Form.useForm();
    const [upimg,setUpImg]=useState('');
    const [imgB64,setImgB64]=useState('');
    const [spinning,setspinning]=useState(false);
    // 用户列表
    const [list,setList]=useState([]);

    const onFinish=(values)=>{
        setspinning(true);
        props.dispatch({
            type:'TenantInfo/add',
            payload:{...values,upimg}
        }).then((res:any)=>{
            if (res.ErrorCode==0){
                setspinning(false);
                message.success('添加成功');
                navigate(-1);
            }else {
                setspinning(false);
                message.error(res.Data);
            }
        })
    };
    const onimgname=(item:string)=>{
        setUpImg(item);
    };
    const onb64=(item:string)=>{
        setImgB64(item);
    };
    // 获取用户列表
    const logFenye=()=>{
        ZuhuService.fetch({page,name,phone,pagecount}).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setList(res.Data.data);
            }else {
                message.error(res.Data);
            }
        })
    };
    useEffect(() => {
        logFenye();
    }, []);

    return(
        <Spin spinning={spinning}>
            <PageLayout
                title="租户消息"
                onBack={()=>history.push('/dashboard/')}
            >
                <Form
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 14 }}
                    form={form}
                    layout="horizontal"
                    size={'large'}
                    onFinish={onFinish}
                    style={{ marginTop: '1rem' }}
                >
                    <Form.Item label='选择租户' name='tenantId'>
                        <Select
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) => {
                                // 假设每个 option 都有一个与数据项对应的 value 属性
                                const item =list.find(hetongID => hetongID.id == option?.value); // 您可能需要优化这个查找过程
                                return item?.tenant_name?.toLowerCase().includes(input.toLowerCase());
                            }}
                        >
                            {
                                list.map((item:any,index:number)=>{
                                    return(
                                        <Select.Option value={item.id} key={index}>
                                            {item.tenant_name}-{item.tenant_phone}
                                        </Select.Option>
                                    )
                                })
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item label='标题' name='title' rules={[{ required: true, message: '请输入标题' }]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item label='消息内容' name='conten' rules={[{ required: true, message: '请输入消息内容' }]}>
                        <Input.TextArea/>
                    </Form.Item>
                    <Form.Item label='图片'>
                        <ImageUploadPng onImageUpload={onimgname} oldBase64={onb64}/>
                        {imgB64?<Image src={imgB64} style={{width:'100px',height:'100px'}}/>:''}
                    </Form.Item>
                    <Form.Item {...tailLayout}>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                添加
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </PageLayout>
        </Spin>
    )
}
export default connect() (AddTenantInfo)