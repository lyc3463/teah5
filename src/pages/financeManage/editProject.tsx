import {useLocation,history,connect} from "umi";
import {useEffect, useRef, useState} from "react";
import {Button, Form, Input, message, Select, Space, Spin} from "antd";
import * as ProjectService from "@/services/project";
import {useNavigate} from "@@/exports";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import PageLayout from "@/components/PageLayout ";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const EditProject=(props)=>{
    const location=useLocation();
    const navigate=useNavigate();
    const formRef =useRef();
    const [isLoading,setIsLoading]=useState(false);
    // 路由参数
    const [uid,setUid]=useState<string|undefined>();
    // 公司列表
    const [company,setCompany]=useState([]);
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        setUid(id)
        getCompanyOne(id)
    }, []);
    const  onFinish=async (values:any)=>{
        setIsLoading(true);
        let res=await props.dispatch({
            type:'Project/edit',
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
    }
    // 获取项目详情信息
    const getCompanyOne=async (e:any)=>{
        let res=await ProjectService.one(e)
        if (res?.ErrorCode==0){
            formRef.current.setFieldsValue(res?.Data);
        }
    }
    // 获取公司列表
    const getCompanList=()=>{
        props.dispatch({
            type:'Compan/fetch',
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setCompany(res.Data);
            }else {
                message.error(res.Data);
            }
        })
    };
    useEffect(() => {
        getCompanList();
    }, []);
    return(
        <Spin spinning={isLoading}>
            <div style={{backgroundColor:'#F0F0F0',height:"100vh"}}>
                <PageLayout
                    title="编辑项目"
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
                        <Form.Item label="项目名称" name='project_name' rules={[{required: true, message: '请输入项目名称'}]}>
                            <Input placeholder="例如:001"/>
                        </Form.Item>
                        <Form.Item label="项目名称"  name='company_id'>
                            <Select>
                                {company.map((item:any,index:any)=>{
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
                                编辑
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
export default connect(mapStateToProps)(EditProject)