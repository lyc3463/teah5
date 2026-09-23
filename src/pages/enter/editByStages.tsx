import {connect,useNavigate,history} from "umi";
import {useEffect, useState} from "react";
import * as byStages from "@/services/byStages";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {Button, Form, Input, InputNumber, message, Spin} from "antd";
import dayjs from "dayjs";
import {NavBar} from "antd-mobile";
import DefMonthRangePicker from "@/components/DefMonthRangePicker";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const EditByStages=(props)=>{
    const navigate=useNavigate();
    const [uid,setUid]=useState<string|undefined>('0');
    // 分期金额
    const [staRent,setstaRent]=useState(0);
    // 分期类型
    const [preType,setpreType]=useState(0);
    const [spinning,setspinning]=useState(false);
    // 租户姓名
    const [tenant_name,settenant_name]=useState('');
    // 租户手机号
    const [tenant_phone,settenant_phone]=useState('');
    // 分期开始月份
    const [fqStartDate,setStartDate]=useState('2000-01-01');
    // 分期结束月份
    const [fqEndDate,setEndDate]=useState('2000-02-01');
    // 还款开始月份
    const [hkStartDate,setStartDate1]=useState('2000-01-01');
    // 还款结束月份
    const [hkEndDate,setEndDate1]=useState('2000-02-01');
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        setUid(id);
        getInfo(id);
    }, []);
    const getInfo=(id:string)=>{
        setspinning(true);
        byStages.one(id).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setspinning(false);
                setstaRent(res.Data.staRent);
                setUid(res.Data.id);
                // setpreType(res.Data.preType);
                settenant_name(res.Data.tenant_name);
                settenant_phone(res.Data.tenant_phone);
                setStartDate(res.Data.staBeginTime);
                setEndDate(res.Data.staEndTime);
                setStartDate1(res.Data.staBeginTime2);
                setEndDate1(res.Data.staEndTime2);
            }else {
                setspinning(false);
                message.error(res.Data);
            }
        });
    };
    const onOK=()=>{
        setspinning(true);
        props.dispatch({
            type:'ByStages/edit',
            payload:{uid,staRent,fqStartDate,fqEndDate,hkEndDate,hkStartDate}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('修改成功');
                history.push('/enter/afterSales/');
                setspinning(false);
            }else {
                setspinning(false);
                message.error(res.Data);
            }
        })
    };
    const  changeDate=(start,end)=>{
        if (start&&end) {
            setStartDate(dayjs(fqStartDate).format('YYYY-MM-DD'));
            setEndDate(dayjs(fqEndDate).format('YYYY-MM-DD'));
        } else {
            setStartDate(dayjs(start).format('YYYY-MM-DD'));
            setEndDate(dayjs(end).format('YYYY-MM-DD'));
        }
    };
    const  changeDate1=(start,end)=>{
        if (start&&end) {
            setStartDate1(dayjs(hkStartDate).format('YYYY-MM-DD'));
            setEndDate1(dayjs(hkEndDate).format('YYYY-MM-DD'));
        } else {
            setStartDate1(dayjs(start).format('YYYY-MM-DD'));
            setEndDate1(dayjs(end).format('YYYY-MM-DD'));
        }
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
                    onBack={() => navigate(-1)}
                    style={getNavBarStyle()}
                >
                    编辑分期
                </NavBar>
                <Form
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 14 }}
                    layout="horizontal"
                    size={'large'}
                    style={{ marginTop: '1rem' }}
                >

                    <Form.Item>
                        <Input addonBefore="租户名字:" value={tenant_name}/>
                    </Form.Item>
                    <Form.Item>
                        <Input addonBefore="租户手机号:" value={tenant_phone}/>
                    </Form.Item>
                    <Form.Item>
                        分期开始-结束月份<DefMonthRangePicker onMonthSelected={changeDate} defaultStart={dayjs(fqStartDate).format("YYYY-MM")} defaultEnd={dayjs(fqEndDate).format("YYYY-MM")}/>
                    </Form.Item>
                    <Form.Item>
                        还款开始-结束月份<DefMonthRangePicker onMonthSelected={changeDate1} defaultStart={dayjs(hkStartDate).format("YYYY-MM")} defaultEnd={dayjs(hkEndDate).format("YYYY-MM")}/>
                    </Form.Item>
                    {/*<Form.Item label='优惠结束月份'>*/}
                    {/*    <DatePicker picker="month" value={dayjs(endDate)}/>*/}
                    {/*</Form.Item>*/}
                    <Form.Item >
                        <InputNumber addonBefore="分期金额(元):" value={staRent} onChange={(e)=>setstaRent(e)}/>
                    </Form.Item>
                    <Form.Item>
                        <span style={{fontSize:'12px',color:"#555"}}>如果选择分期开始月份为租金账单已出的，并不会计算到分期月份</span>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" onClick={onOK}>
                            确定修改
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </Spin>
    )
}
export default connect()(EditByStages)