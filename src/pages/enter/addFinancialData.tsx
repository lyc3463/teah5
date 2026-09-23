import {Button, DatePicker, Form, Input, InputNumber, message, Radio, Select, Space, Spin} from "antd";
import {useEffect, useState} from "react";
import {connect,history,useNavigate} from "umi";
import {getCurrentDate} from "@/utils/OpenTool";
import * as AccountService from '@/services/account';
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import dayjs from "dayjs";
import {NavBar} from "antd-mobile";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const AddFinancialData=(props:any)=>{
    const navigate=useNavigate();
    const [form] = Form.useForm();
    // 账户列表
    const [accountList,setAccountList]=useState([]);
    const [companyList,setCompanyList]=useState([]);
    const [subjList,setSubjList]=useState([]);
    const [projectlist,setProjectlist]=useState([]);
    // 日期选择
    const [billDate,setBillDate]=useState(getCurrentDate());
    // 公司ID
    const [company_id,setCompany_id]=useState();
    // 项目ID
    const [project_id,setProject_id]=useState();
    // 科目名字
    const [subjectName,setsubjectName]=useState('');
    // 1公账，0私账
    const [accountType,setAccountType]=useState(0);
    // 账号银行号
    const [ccount_card,setAccount_card]=useState(0);
    const [spinning,setspinning]=useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const onFinish=async (values)=>{
        setspinning(true);
        if (!values.account_id){
            message.warning('请选择账户');
            setspinning(false);
        }else {
            let res=await props.dispatch({
                type:'Bill/add',
                payload:{...values,billDate,company_id,project_id,accountType}
            });
            if (res.ErrorCode==0){
                setspinning(false);
                history.push('/enter/financialData');
                message.success('添加成功');
            }else {
                setspinning(false);
                message.error(res.Data);
            }
        }
    };
    useEffect(() => {
        getCompanList();
        getProjectList();
        getSubjectList();
        getAccountList();
        setBillDate(getCurrentDate());
    }, []);

    // 日期选择
    const changeData=(_,item)=>{
        setBillDate(item)
    };
    // 监听下拉账号
    const changeAccount=(e)=>{
        AccountService.one(e).then((res:any)=>{
            setCompany_id(res.Data.company_id);
            setProject_id(res.Data.project_id);
            setAccountType(res.Data.account_type);
            setAccount_card(res.Data.account_card);
        })
    };
    // 获取公司列表
    const getCompanList=()=>{
        props.dispatch({
            type:'Compan/fetch',
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                conterCompay(res.Data)
            }else {
                conterCompay([])
            }
        })
    };
    // 获取项目列表
    const getProjectList=()=>{
        props.dispatch({
            type:'Project/fetch',
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setProjectlist(res.Data);
            }else {
                setProjectlist([]);
            }
        });
    };
    // 获取账户列表
    const getAccountList=()=>{
        props.dispatch({
            type:'Account/fetch',
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setAccountList(res.Data);
            }else {
                setAccountList([]);
            }
        });
    };
    // 获取科目列表
    const getSubjectList=()=>{
        props.dispatch({
            type:'Subject/fetch',
            payload:{name:subjectName}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                contersubj(res.Data);
            }else {
                contersubj([]);
            }
        });
    };
    // 公司拼接
    const conterCompay=(item)=>{
        let newarr=item.map((item:any)=>{
            return {
                label:item.company_name,
                value:item.id
            }
        });
        setCompanyList(newarr);
    };
    // 项目拼接
    const conterproject=(item)=>{
        let newarr=item.map((item:any)=>{
            return {
                label:item.project_name,
                value:item.id
            }
        });
        setProjectlist(newarr);
    };
    // 科目拼接
    const contersubj=(item)=>{
        let newarr=item.map((item:any)=>{
            return {
                label:item.subject_name,
                value:item.id
            }
        });
        setSubjList(newarr);
    };
    const onSearchSbjValue=(value:string)=>{
        setsubjectName(value);
    };
    const getContainerStyle = () => {
        return {
            padding: windowWidth <= 480 ? '12px' : '16px',
            maxWidth: windowWidth <= 480 ? '100%' : '600px',
            margin: '0 auto',
            height: '90vh',
            overflowY: 'auto',
            scrollbarWidth: 'thin',
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
            <NavBar
                onBack={() => navigate(-1)}
                style={getNavBarStyle()}
            >
                添加财务数据
            </NavBar>
            <div style={getContainerStyle()}>
                <Form
                    // labelCol={{ span: 5 }}
                    wrapperCol={{ span: 14 }}
                    form={form}
                    layout="horizontal"
                    size={'large'}
                    initialValues={{number:''}}
                    onFinish={onFinish}
                    style={{ marginTop: '1rem' }}
                >
                    <Form.Item name='number' >
                        <Input addonBefore="编号:"/>
                    </Form.Item>
                    <Form.Item>
                        <DatePicker onChange={changeData} defaultValue={dayjs(billDate)}/>
                    </Form.Item>
                    <Form.Item name='account_id'>
                        <Select
                            placeholder='选择账户'
                            onChange={changeAccount}
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) => {
                                // 假设每个 option 都有一个与数据项对应的 value 属性
                                const item = accountList.find(unit => unit.id == option.value); // 您可能需要优化这个查找过程
                                return item?.account_name?.toLowerCase().includes(input.toLowerCase());
                            }}
                        >
                            {accountList.map((item:any,index:any)=>{
                                return(
                                    <Select.Option value={item.id} key={index}>
                                        {item.account_name}
                                    </Select.Option>
                                )
                            })}
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Radio.Group value={accountType} style={{display:'flex'}}>
                            <Radio value={1} style={{width:'80px'}}>公账</Radio>
                            <Radio value={0} style={{width:'80px'}}>私账</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item name='billMoney' rules={[{required: true,message: '请输入金额'}]}>
                        <InputNumber addonBefore="金额(元):"/>
                    </Form.Item>
                    <Form.Item name='money_type'>
                        <Radio.Group>
                            <Radio value={1}>支出</Radio>
                            <Radio value={0}>收入</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item>
                        <Input addonBefore="账户名:" value={ccount_card} disabled/>
                    </Form.Item>
                    <Form.Item>
                        <Select value={project_id} disabled placeholder='项目'>
                            {projectlist.map((item:any,index:any)=>{
                                return(
                                    <Select.Option value={item.id} key={index}>
                                        {item.project_name}
                                    </Select.Option>
                                )
                            })}
                        </Select>
                    </Form.Item>
                    <Form.Item >
                        <Select value={company_id} disabled placeholder='公司'>
                            {companyList.map((item:any,index:any)=>{
                                return(
                                    <Select.Option value={item.value} key={index}>
                                        {item.label}
                                    </Select.Option>
                                )
                            })}
                        </Select>
                    </Form.Item>
                    <Form.Item name='subject_id'>
                        <Select showSearch
                                placeholder='科目'
                                optionFilterProp="children"
                                onSearch={(value) => {
                                    onSearchSbjValue(value)
                                }}
                                filterOption={(input, option) =>
                                    (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                        >
                            {subjList.map((item:any,index:any)=>{
                                return(
                                    <Select.Option value={item.value} key={index}>
                                        {item.label}
                                    </Select.Option>
                                )
                            })}
                        </Select>
                    </Form.Item>

                    <Form.Item name='billAbstract' rules={[{required: true,message: '请输入摘要'}]}>
                        <Input addonBefore="摘要:"/>
                    </Form.Item>
                    <Form.Item >
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
const mapStateToProps = (state: any) => {
    return {
        SubjectList: state.Subject.list,
        AccountList: state.Account.list,
        CompanList: state.Compan.list,
        ProjectList: state.Project.list,
    }
};
export default connect(mapStateToProps) (AddFinancialData)