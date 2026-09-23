import {Button, Card, Form, Input, List, Pagination, Select, Space, Table, Tag, Tooltip} from "antd";
import {connect,history,useLocation} from "umi";
import {useEffect, useState} from "react";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {NavBar, Popup} from "antd-mobile";
import {joinUnitNames} from "@/utils/OpenTool";
import PageLayout from "@/components/PageLayout ";
import DateRangePicker from "@/components/DateRangePickerProps";

const Customer=(props:any)=>{
    const location=useLocation();
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    // 姓名
    const [name,setName]=useState('');
    // 手机号
    const [phone,setPhone]=useState('');
    // 页数
    const [page,setPage]=useState(1);
    // 每页数量
    const [pagecount,setpagecount]=useState(50);
    // 单元名称
    const [unitName,setunitName]=useState('');
    // 展示的数据
    const [ZuhuList,setZuhuList]=useState([]);
    // 原数组
    const [oldZuhuList,setOldZuhuList]=useState([]);
    // 总条数
    const [count,setcount]=useState(0);
    // 公共押金
    const [depositSum,setdepositSum]=useState(0);
    // 账单金额
    const [billMoneySum,setbillMoneySum]=useState(0);
    // 积分
    const [integralSum,setintegralSum]=useState(0);
    // 余额
    const [balanceSum,setbalanceSum]=useState(0);
    const [filterOpen, setFilterOpen] = useState(false);

    // 去关联页面
    const toguanlian=(e:number)=>{
        history.push(`/customer/byzhuhu?id=${e}`);
    };
    useEffect(() => {
        logFenye();
    }, [page,pagecount]);

    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"BYZhuhu/fetch",
            payload:{page,name,phone,pagecount}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                console.log('res',res)
                setZuhuList(res.Data.data);
                setOldZuhuList(res.Data.data);
                setcount(res.Data.count);
                setbalanceSum(res.Data.balanceSum);
                setbillMoneySum(res.Data.billMoneySum);
                setdepositSum(res.Data.depositSum);
                setintegralSum(res.Data.integralSum);
            }
        })
    };
    // 搜索按钮
    const shousuo=()=>{
        setPage(1);
        logFenye();
        setFilterOpen(false);
    };

    const onChange=(val:number,pageSize:number)=>{
        setPage(val);
        setpagecount(pageSize);
    };

    const changeName=(e:any)=>{
        setName(e.target.value);
    };
    const changePhone=(e:any)=>{
        setPhone(e.target.value);
    };

    return(
        <div>
            <PageLayout
                title="客户管理"
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

                        <div style={{ marginTop: 15 }}>姓名</div>
                        <Input
                            onChange={changeName}
                            value={name}
                        />
                        <div style={{ marginTop: 15 }}>手机号</div>
                        <Input
                            onChange={changePhone}
                            value={phone}
                        />
                        <Button
                            block
                            color="primary"
                            style={{ marginTop: 20 }}
                            onClick={shousuo}
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
                    {ZuhuList.map((item) => (
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
                            <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}><Tag color="blue">姓名</Tag>: {item.tenant_name}</div>
                            <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}><Tag color="green">联系方式</Tag>: {item.tenant_phone}</div>
                            <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}><Tag color="orange">单元</Tag>: {joinUnitNames(item.unitList)}</div>
                            <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}><Tag color="purple">余额(元)</Tag>: {item.balance.toFixed(2)}</div>
                            <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}><Tag color="red">全部账单(元)</Tag>: {item.billMoney.toFixed(2)}</div>
                            <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}><Tag color="cyan">公共押金(元)</Tag>: {item.deposit.toFixed(2)}</div>
                            <Button type="primary" onClick={() => toguanlian(item.id)} style={{ fontSize: 16,  marginTop: 4 }}>
                                关联
                            </Button>
                        </List.Item>
                    ))}
                </div>
                <div style={{display:'flex',justifyContent:'space-around',marginTop:'5px'}}>
                    <div>总余额：{balanceSum?balanceSum:0}元</div>
                    <div>总账单：{billMoneySum?billMoneySum:0}元</div>
                </div>
                <div style={{ marginTop: windowWidth <= 480 ? '1rem' : '2rem', textAlign: 'center' }}>
                    <Pagination
                        showSizeChanger
                        total={count}
                        pageSize={pagecount}
                        current={page}
                        onChange={onChange}
                        pageSizeOptions={[50, 100, 500, 1000]}
                        style={{ backgroundColor: '#fff', padding: '1rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}
                    />
                </div>
            </PageLayout>
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        ZuhuList: state.BYZhuhu.list,
        count: state.BYZhuhu.count,
    }
};
export default connect(mapStateToProps) (Customer)