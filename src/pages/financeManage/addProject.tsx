import {connect,history,useNavigate} from 'umi'
import {Button, Form, Input, message, Select, Space, Spin} from "antd";
import {useEffect, useState} from "react";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import PageLayout from "@/components/PageLayout ";
// import {filterAndUpdateList} from "@/utils/OpenTool";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const AddProject=(props:any)=>{
    const navigate=useNavigate();
    const [isLoading,setIsLoading]=useState(false);
    const [form] = Form.useForm();
    const [companyList,setCompanyList]=useState([]);
    const onFinish=async (values)=>{
        setIsLoading(true);
        let res=await props.dispatch({
            type:'Project/add',
            payload:values
        })
        if (res.ErrorCode==0){
            message.success('添加成功');
            history.push('/financeManage/list');
            setIsLoading(false);
        }else {
            message.error(res.Data);
            setIsLoading(false);
        }
    };
    useEffect(() => {
        getCompanList();
    }, []);
    // 获取公司列表
    const getCompanList=()=>{
        props.dispatch({
            type:'Compan/fetch',
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setCompanyList(res.Data);
            }else {
                message.error(res.Data);
            }
        })
    };
    return(
        <Spin spinning={isLoading}>
            <div style={{backgroundColor:'#F0F0F0',height:"100vh"}}>
                <PageLayout
                    title="添加项目"
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
                        <Form.Item label="项目名称" name="name" rules={[{required: true, message: '请输入项目名称'}]}>
                            <Input placeholder="例:xx项目"/>
                        </Form.Item>
                        <Form.Item label="选择公司" name="company_id" rules={[{required: true, message: '请选择公司'}]}>
                            <Select>
                                {companyList.map((item:any,index:any)=>{
                                    return(
                                        <Select.Option value={item.id} key={index}>
                                            {item.company_name}
                                        </Select.Option>
                                    )
                                })}
                            </Select>
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
const mapStateToProps = (state: any) => {
    return {
        CompanList: state.Compan.list
    }
};
export default connect (mapStateToProps)(AddProject)