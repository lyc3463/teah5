import {useEffect, useRef, useState} from "react";
import {connect,history,useLocation,useNavigate} from "umi";
import * as EmpServer from "@/services/emp";
import {Button, DatePicker, Form, Image, Input, message, Radio, Select, Space, Spin, Upload} from "antd";
import dayjs from "dayjs";
import CmpImageUploader from "@/components/ImageUploadPng";
import * as GroupingServer from "@/services/grouping";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {NavBar} from "antd-mobile";
import DefDateProps from "@/components/defDateProps";

const EditYuangong=(props:any)=>{
    const navigate=useNavigate();
    // 路由参数
    const [uid,setUid]=useState<string|undefined>();
    const formRef=useRef();
    // 开始时间
    const [estarttime,setEstarttime]=useState('2000-01-01');
    // 结束时间
    const [eendtime,seteendtime]=useState('2099-01-01');
    // 图片原本的名字
    const [oldImgName,setOldImgName]=useState('');
    // 转圈
    const [spinning,setspinning]=useState(false);
    // 闸机原始列表列表
    const [gateList,setGateList]=useState([]);
    // 选择闸机列表
    const [obtain,setobtain]=useState([]);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const location=useLocation();
    const getOneEmp=async (id:string)=>{
        let res:any=await  EmpServer.one(id);
        if (res.ErrorCode==0){
            console.log('详情',res)
            formRef.current.setFieldsValue(res.Data);
            setOldImgName(res.Data.avatarBase64);
            let splicegateIds=res.Data.gateIds.split("|").map(Number);
            setobtain(splicegateIds);
            seteendtime(dayjs(res.Data.eendtime).format('YYYY-MM-DD'));
            setEstarttime(dayjs(res.Data.estarttime).format('YYYY-MM-DD'));
        }else {
            message.error(res.Data)
        }
    };
    useEffect(()=>{
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        setUid(id);
        getOneEmp(id);
        getGroupingList();
        getGeteList();
    },[]);
    // 修改上传
    const onFinisn=(values:any)=>{
        setspinning(true);
        let jsonObtain=obtain.join("|");
        props.dispatch({
            type:'Emp/edit',
            payload:{...values,uid,estarttime,eendtime,oldImgName,jsonObtain}
        }).then((res)=>{
            if (res.ErrorCode==0){
                message.success('修改成功');
                setspinning(false);
                history.push('/staff');
            }else {
                message.error(res.Data);
                setspinning(false);
            }
        })
    };
    // 获取图片名字
    const handleImageUpload=(item:string)=>{
        setOldImgName(item);
    };

    // 获取分组
    const getGroupingList=()=>{
        props.dispatch({
            type:'Grouping/fetch'
        })
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
    const changeGate=(e)=>{
        setobtain(e);
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
    const changeData=(start,end)=>{
        setEstarttime(start);
        seteendtime(end);
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
                修改员工
            </NavBar>
            <div style={getContainerStyle()}>
                <Form
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 14 }}
                    ref={formRef}
                    onFinish={onFinisn}
                    layout="horizontal"
                    size={'large'}
                    style={{ marginTop: '1rem' }}
                >
                    <Form.Item>
                        <DefDateProps
                            defaultStart={estarttime}
                            defaultEnd={eendtime}
                            onDateSelected={(start, end) => changeData(start,end)}
                            title="日期"
                        />
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
                    <Form.Item>
                        <Select onChange={changeGate} value={obtain} mode="multiple" placeholder='闸机'>
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
                            <CmpImageUploader onImageUpload={handleImageUpload}/>
                            {oldImgName ? (
                                <Image
                                    src={oldImgName.includes('.png')
                                        ? `${window.ServerConfig.imgServer}${oldImgName}`
                                        : `${window.ServerConfig.imgServer}${oldImgName}.png`
                                    }
                                    style={{width:'80px',height:'80px'}}
                                />
                            ) : ''}
                        </Space>
                    </Form.Item>
                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                编辑
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
    }
};
export default  connect(mapStateToProps)(EditYuangong)