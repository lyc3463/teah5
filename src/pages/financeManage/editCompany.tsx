import {useLocation, connect, history,useNavigate} from 'umi';
import {useEffect, useRef, useState} from "react";
import * as CompanService from '@/services/compan';
import {Button, Form, Image, Input, message, Radio, Space, Spin, Upload} from "antd";
import PageLayout from "@/components/PageLayout ";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const EditCompany=(props:any)=>{
    const location=useLocation();
    const navigate=useNavigate();
    const formRef =useRef();
    const [isLoading,setIsLoading]=useState(false);
    // 路由参数
    const [uid,setUid]=useState<string|undefined>();
    // 获取公司详情信息
    const getCompanyOne=async (e:any)=>{
        let res=await CompanService.one(e)
        if (res?.ErrorCode==0){
            formRef.current.setFieldsValue(res?.Data)
        }
    };
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        setUid(id)
        getCompanyOne(id)
    }, []);
    const  onFinish=async (values:any)=>{
        setIsLoading(true);
        let res=await props.dispatch({
            type:'Compan/edit',
            payload:{...values,uid}
        })
        if (res.ErrorCode==0){
            message.success('修改成功');
            history.push('/financeManage/list');
            setIsLoading(false);
        }else {
            message.error(res.Data);
            setIsLoading(false);
        }
    };
    return(
        <Spin spinning={isLoading}>
            <div style={{backgroundColor:'#F0F0F0',height:"100vh"}}>
                <PageLayout
                    title="编辑"
                    onBack={()=>navigate(-1)}
                >
                    <Form
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 14 }}
                        layout="horizontal"
                        size={'large'}
                        onFinish={onFinish}
                        ref={formRef}
                        style={{ marginTop:'1rem'}}
                    >
                        <Form.Item label="公司名称" name="company_name" rules={[{required: true, message: '请输入公司名'}]}>
                            <Input placeholder="例如:001"/>
                        </Form.Item>
                        <div
                            style={{
                                position: "fixed",
                                bottom: 0,
                                left: 0,
                                right: 0,
                                backgroundColor: "#fff",
                                borderTop: "1px solid #eee",
                                padding: 12
                            }}
                        >
                            <Button type="primary" htmlType="submit" style={{width:'100%'}}>
                                修改
                            </Button>
                        </div>
                    </Form>
                </PageLayout>
            </div>
        </Spin>
    )
}
export default connect()(EditCompany)