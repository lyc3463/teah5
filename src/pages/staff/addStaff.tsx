import {Button, Form, Input, message, Select, Upload, Radio, Image, Space, Spin} from "antd";
import {DatePicker, NavBar} from 'antd-mobile'
import {useEffect, useState} from "react";
import {connect,history,useNavigate} from "umi";
import CmpImageUploader from "@/components/ImageUploader";
import * as GroupingServer from "@/services/grouping";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import DateRangePicker from "@/components/DateRangePickerProps";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const AddYuangonglData=(props:any)=>{
    const navigate=useNavigate();
    const [form] = Form.useForm();
    // 开始时间
    const [estarttime,setEstarttime]=useState('');
    // 结束时间
    const [eendtime,seteendtime]=useState('');
    // base64 用来显示图片
    const [fileBase64,setFileBase64]=useState('');
    // 图片原本的名字
    const [oldImgName,setOldImgName]=useState('');
    // 闸机列表
    const [gateList,setGateList]=useState([]);
    // 选择闸机列表
    const [obtain,setobtain]=useState([]);
    // 转圈
    const [spinning,setspinning]=useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const onFinish= (values)=>{
        let jsonObtain=obtain.join("|");
        setspinning(true);
        props.dispatch({
            type:'Emp/add',
            payload:{...values,estarttime,eendtime,oldImgName,jsonObtain}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0||res.ErrorCode==9038){
                message.success('添加成功');
                setspinning(false);
                history.push('/staff');
            }else {
                setspinning(false);
                message.error(res.Data);
            }
        });
    };
    const changeData=(start,end)=>{
        setEstarttime(start);
        seteendtime(end);
    };
    // 获取图片名字
    const handleImageUpload=(item:string)=>{
        setOldImgName(item);
    };
    // 获取图片base64
    const getImgBase64=(item:any)=>{
        setFileBase64(item);
    };
    // 获取闸机列表
    const getGeteList=()=>{
        props.dispatch({
            type:'Gate/fetch',
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setGateList(res.Data);
            }else {
                message.error(res.Data);
            }
        })
    };
    // 分组列表
    const getGroupingList=()=>{
        props.dispatch({
            type:'Grouping/fetch',
        })
    };
    useEffect(() => {
        getGeteList();
        getGroupingList();
    }, []);
    const changeGate=(e)=>{
        setobtain(e);
    };
    // 选择闸机
    const changeGrouping=(e:number)=>{
        GroupingServer.one(e).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                let newArr :any[]=mapArrList(res.Data[1]);
                setobtain(newArr);
            }
        })
    };
    // 遍历数组
    const mapArrList=(item:any[])=>{
        let arr=item.map((item:any)=>{
            return item.id
        })
        return arr
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
            '--font-size': windowWidth <= 480 ? '16px' : '18px',
            padding: windowWidth <= 480 ? '12px' : '16px',
            maxWidth: windowWidth <= 480 ? '100%' : '600px',
            margin: '0 auto',
        };
    };
    const getNavStyle = () => {
        return {
            padding: windowWidth <= 480 ? '12px' : '16px',
            maxWidth: windowWidth <= 480 ? '100%' : '600px',
            margin: '0 auto',
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
                添加员工
            </NavBar>
            <div style={getContainerStyle()}>
                <Form
                    form={form}
                    initialValues={{custom:''}}
                    layout="horizontal"
                    size={'large'}
                    onFinish={onFinish}
                >
                    <Form.Item>
                        <DateRangePicker onDateSelected={changeData}/>
                    </Form.Item>
                    <Form.Item name='name'>
                        <Input addonBefore="姓名:" placeholder='员工姓名'/>
                    </Form.Item>
                    <Form.Item name='nickname'>
                        <Input addonBefore="昵称:" placeholder='员工昵称'/>
                    </Form.Item>
                    <Form.Item name='phone'>
                        <Input addonBefore="联系方式:" placeholder='员工联系方式'/>
                    </Form.Item>
                    <Form.Item name='companyName'>
                        <Input addonBefore="所在公司:" placeholder='员工所在公司'/>
                    </Form.Item>
                    <Form.Item>
                        <Select onChange={changeGrouping} placeholder='闸机分组'>
                            {props.GroupingList&&props.GroupingList.length>0?props.GroupingList.map((item:any,index:any)=>{
                                return(
                                    <Select.Option value={item.id} key={index}>
                                        {item.groupName}
                                    </Select.Option>
                                )
                            }):''}
                        </Select>
                    </Form.Item>
                    <Form.Item label='闸机列表'>
                        <Select onChange={changeGate} value={obtain} mode="multiple">
                            {gateList.map((item:any,index:any)=>{
                                return(
                                    <Select.Option value={item.id} key={index}>
                                        {item.position}
                                    </Select.Option>
                                )
                            })}
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Space style={{display:'flex'}}>
                            <Space style={{display:'flex'}}>
                                <CmpImageUploader onImageUpload={handleImageUpload} oldBase64={getImgBase64}/>
                                {fileBase64?<Image src={fileBase64} style={{width:'80px',height:'80px'}}/>:''}
                            </Space>
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
const mapStateToProps = (state: any) => {
    return {
        GroupingList:state.Grouping.list,
        GateList: state.Gate.list,
    }
};
export default connect(mapStateToProps) (AddYuangonglData)