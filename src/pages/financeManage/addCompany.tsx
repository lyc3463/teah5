import {connect,history,useNavigate} from 'umi'
import {Button,Form, Image, Input, message, Radio, Space, Spin, Upload} from "antd";
import {useState} from "react";
import PageLayout from "@/components/PageLayout ";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const AddCompany=(props:any)=>{
    const navigate=useNavigate();
    const [isLoading,setIsLoading]=useState(false)
    const [form] = Form.useForm();
    const onFinish=async (values)=>{
        setIsLoading(true);
        let res=await props.dispatch({
            type:'Compan/add',
            payload:{...values,addCompanyHouseId:1,addCompanyUnitId:1}
        })
        if (res.ErrorCode==0){
            message.success('添加成功');
            history.push('/financeManage/list');
            setIsLoading(false);
        }else {
            message.error(res.Data);
            setIsLoading(false);
        }
    }
    return(
        <Spin spinning={isLoading}>
            <div style={{backgroundColor:'#F0F0F0',height:"100vh"}}>
                <PageLayout
                    title="添加公司"
                    onBack={()=>navigate(-1)}
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
                        <Form.Item label="公司" name="name" rules={[{required: true, message: '请输入公司名称'}]}>
                            <Input placeholder="例:xx公司"/>
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
                                添加
                            </Button>
                        </div>

                    </Form>
                </PageLayout>
            </div>
        </Spin>
    )
}
export default connect()(AddCompany)