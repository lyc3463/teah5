import {connect} from "umi";
import {
    Button,
    DatePicker,
    Image,
    Input,
    List,
    message,
    Modal,
    Pagination, Select,
    Space,
    Spin,

} from "antd";
import dayjs from "dayjs";
import {useEffect, useState} from "react";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {StaticInfo} from "@/StaticInfo";
import {NavBar, Popup} from "antd-mobile";
import {history} from "@@/core/history";
import DateRangePicker from "@/components/DateRangePickerProps";
import PageLayout from "@/components/PageLayout ";
interface PayInfo {
    consumptionDate: string;
    house_name: string;
    user_name: string;
    phone: string;
    consumptionMoney: number;
    consumptionType: number;
}
const initialPayInfo: PayInfo = {
    consumptionDate: '',
    house_name: '',
    user_name: '',
    phone: '',
    consumptionMoney: 0,
    consumptionType: 0,
};
const Alljiaoyi=(props)=>{
    // 当前页数
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    const [name,setName]=useState('');
    const [phone,setPhone]=useState('');
    const [type,setType]=useState(0);
    const [startDate,setStartDate]=useState('2000-01-01');
    const [endDate,setEndDate]=useState('2099-01-01');
    const [userID,setuserID]=useState(0);
    const [spinning,setspinning]=useState(false);
    const [dataSource,setdataSource]=useState([]);
    // 单元名称
    const [unitName,setunitName]=useState('');
    const [moneySum,setmoneySum]=useState(0);
    const [uqx,setUqx]=useState([]);
    const [payInfo, setPayInfo] = useState<PayInfo>(initialPayInfo);
    const [open, setOpen] = useState(false);
    const [filterOpen,setFilterOpen]=useState(false);

    // 搜索
    const sousuo=()=>{
        setPage(1);
        logFenye();
    };

    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"Alljiaoyi/fetch",
            payload:{page,name,phone,type,startDate,endDate,userID,pageSize}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setdataSource(res.Data.data);
                setmoneySum(res.Data.moneySum);
            }else {
                message.error(res.Data);
            }
        })
    };
    // 监听页数
    const onChange=(e:number,pageSize:number)=>{
        setPage(e);
        setPageSize(pageSize);
    };
    useEffect(() => {
        let uq=StaticInfo.uqx.split('');
        setUqx(uq);
    }, []);
    useEffect(() => {
        logFenye();
    }, [page]);
    // 监听日期
    const changeDate=(start:any,end:any)=>{
        setStartDate(start);
        setEndDate(end);
    };
    // 监听输入的姓名
    const changeName=(e)=>{
        setName(e.target.value);
    };
    const toinfo=(e:PayInfo)=>{
        setPayInfo(e);
        setOpen(true);
    };
    const changeType=(e)=>{
        setType(e);
    };
    return(
        <Spin spinning={spinning}>
            <PageLayout
                title="线上交易"
                onBack={()=>history.push('/dashboard/')}
            >
                <List style={{padding:'0 10px'}}>
                    <List.Item>
                        <Space style={{paddingBottom:'10px'}}>
                            <Button type="primary" onClick={() => setFilterOpen(true)}>
                                筛选
                            </Button>
                        </Space>
                    </List.Item>
                </List>
                <Popup
                    visible={filterOpen}
                    onMaskClick={() => setFilterOpen(false)}
                >
                    <div style={{ padding: 16 }}>
                        <DateRangePicker  onDateSelected={changeDate}/>
                        <div style={{ marginTop: 15 }}>姓名</div>
                        <Input
                            onChange={changeName}
                            value={name}
                        />
                        <div style={{ marginTop: 15 }}>手机号</div>
                        <Input
                            onChange={(e)=>setPhone(e.target.value)}
                            addonBefore="手机号:"
                            value={phone}
                        />

                        <div style={{ marginTop: 15 }}>类型</div>
                        <Select
                            onChange={changeType}
                            defaultValue={type}
                            style={{ width: 120 }}
                            options={[
                                { value:0, label: '全部' },
                                { value:1, label: '微信充值' },
                                { value:10, label: '大额转账' },
                            ]}
                        />
                        <Button
                            block
                            color="primary"
                            style={{ marginTop: 20 }}
                            onClick={sousuo}
                        >
                            搜索
                        </Button>
                    </div>
                </Popup>
                <div style={{
                    height: 'calc(100vh - 230px)',
                    overflowY: 'auto',
                    padding: '0 12px'
                }}>
                    {dataSource.map((item) => (
                        <List.Item
                            key={item.id}
                            style={{
                                border: '1px solid #e5e6eb',
                                borderRadius: '8px',
                                padding: '16px',
                                marginBottom: '12px',
                                backgroundColor: '#fff',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                            }}
                        >
                            <div>日期: {dayjs(item.consumptionDate).format('YYYY-MM-DD')}</div>
                            <div>姓名: {item.user_name}</div>
                            <div>类型: {item.consumptionType==1?'微信充值':'大额转账'}</div>
                            <div>金额(元): {item.consumptionMoney.toFixed(2)}</div>
                            <Button type='primary' onClick={()=>toinfo(item)}>详情</Button>
                        </List.Item>
                    ))}
                </div>
                <div style={{marginTop:'5px'}}>总金额:{(moneySum).toFixed(2)}元</div>
                <Modal open={open} title='详情' onCancel={()=>setOpen(false)} onOk={()=>setOpen(false)}>
                    <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}>日期: {dayjs(payInfo.consumptionDate).format('YYYY-MM-DD')}</div>
                    <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}>房屋: {payInfo.house_name}</div>
                    <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}>姓名: {payInfo.user_name}</div>
                    <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}>手机号: {payInfo.phone}</div>
                    <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}>类型: {payInfo.consumptionType==1?'微信充值':'大额转账'}</div>
                    <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}>金额(元): {payInfo.consumptionMoney.toFixed(2)}</div>
                </Modal>
                <div style={{ marginTop:'1rem', textAlign: 'center' }}>
                    {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
                </div>
            </PageLayout>
        </Spin>
    )
};
const mapStateToProps = (state: any) => {
    return {
        RechargeRateList: state.Alljiaoyi.list,
        count: state.Alljiaoyi.count,
    }
};
export default connect(mapStateToProps) (Alljiaoyi)