import { history, connect } from "umi";
import { useEffect, useState } from "react";
import { List, Tag, Space, Popup , Selector } from "antd-mobile";
import dayjs from "dayjs";
import {Input, message, Modal, Pagination, Spin, Button, Select, Dropdown, Tooltip} from "antd";
import DateRangePicker from "@/components/DateRangePickerProps";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {newprocessBills} from "@/utils/OpenTool";
import * as BillService from '@/services/bill';

const FinancialReport = (props) => {
    // 页码
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(50);
    // 账单列表
    const [billList, setBillList] = useState([]);
    // 时间
    const [startDate, setStartDate] = useState("2000-01-01");
    const [endDate, setEndDate] = useState("2099-01-01");
    // 状态
    const [orderStatus, setOrderStatus] = useState(0);
    // 输入条件
    const [account_card, setaccount_card] = useState("");
    const [company_name, setCompany_name] = useState("");
    const [orderCode, setOrderCode] = useState("");
    // 类型
    const [moneyType, setMoneyType] = useState(0);
    const [project_name, setProject_name] = useState("");
    const [supplierId, setsupplierId] = useState(0);
    const [foType, setFoType] = useState(2);
    // UI
    const [isOpen, setIsOpen] = useState(false);
    const [spinning, setspinning] = useState(false);
    const [filterOpen, setFilterOpen] = useState(false);
    const [uid,setUid]=useState(0);
    const [paidStatus,setPaidStatus]=useState(0);
    const [expenseCode,setExpenseCode]=useState('');
    // 送审
    const [reviewOpen, setReviewOpen] = useState(false);
    const [reviewRecord, setReviewRecord] = useState<any>(null);

    // 获取列表
    const getList = () => {
        props.dispatch({
            type: "NewFinancialData/fetch",
            payload:{page, pageSize, orderCode, company_name, account_card, startDate, endDate, orderStatus, moneyType,project_name,supplierId,foType,paidStatus,expenseCode,userId:0}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                let newArr=newprocessBills(res.Data.data);
                setBillList(newArr.Data);
            }else {
                message.error(res.Data);
            }
        });
    };
    const getSupplierList=()=>{
        props.dispatch({
            type:"Supplier/fetch",
        })
    };
    // 初始化
    useEffect(() => {
        getList();
    }, [page, pageSize]);

    useEffect(() => {
        getSupplierList();
    }, []);
    // 搜索
    const handleSearch = () => {
        setPage(1);
        getList();
        setFilterOpen(false);
    };
    const changeDate=(start,end)=>{
        setStartDate(start);
        setEndDate(end);
    };
    // 分页
    const onChange = (page,pageSize) => {
        setPage(page);
        setPageSize(pageSize);
    };
    const toadd=()=>{
        history.push('/enter/financialData/FinancialReport/addNewFinancialData');
    };
    const deleteItem=(e)=>{
        setUid(e);
        setIsOpen(true);
    };
    // 删除确定按钮
    const onOK=()=>{
        setspinning(true);
        props.dispatch({
            type:'NewFinancialData/remove',
            payload:uid
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode == 0||res.ErrorCode == 9038) {
                message.success('删除成功');
                setspinning(false);
                setIsOpen(false);
                getList();
            }else {
                message.error(res.ErrorCode + res.Data);
                setspinning(false);
            }
        })
    };
    const changeSupplierId=(e:any)=>{
        setsupplierId(e);
    };
    const changeOrderCode = (e:any) => {
        setOrderCode(e.target.value);
    };
    const changeStutes=(e:any)=>{
        setOrderStatus(e);
    };
    const submitForReview=(record: any)=>{
        if(record.orderStatus !== 100){
            message.warning('只有待提交状态才能提审');
            return;
        }
        setReviewRecord(record);
        setReviewOpen(true);
    };
    // 送审：确认提交
    const onReviewOK=()=>{
        if(!reviewRecord) return;
        setspinning(true);
        BillService.submitForReview(reviewRecord.id).then((res:TypeErrorCode)=>{
            if(res.ErrorCode==0){
                message.success('送审成功');
                setReviewOpen(false);
                setReviewRecord(null);
                getList();
            }else{
                message.error(res.ErrorCode + res.Data);
            }
            setspinning(false);
        })
    };
    return (
        <Spin spinning={spinning}>
            {/* 筛选按钮 */}
            <Space style={{ padding: 10 }}>
                <Button size="small" type="primary" onClick={() => setFilterOpen(true)}>
                    筛选
                </Button>
                <Button size="small" type="primary" onClick={toadd}>
                    添加财务单
                </Button>
            </Space>
            {/* 筛选弹窗 */}
            <Popup
                visible={filterOpen}
                onMaskClick={() => setFilterOpen(false)}
                // bodyStyle={{ height: "80vh" }}
            >
                <div style={{ padding: 16 }}>
                    <DateRangePicker  onDateSelected={changeDate}/>
                    <div style={{ marginTop: 15 }}>单号</div>
                    <Input
                        placeholder="单号"
                        value={orderCode}
                        onChange={changeOrderCode}
                    />
                    <div style={{ marginTop: 15 }}>公司名称</div>
                    <Input
                        placeholder="请输入公司"
                        value={company_name}
                        onChange={(e) => setCompany_name(e.target.value)}
                    />
                    <div style={{ marginTop: 15 }}>项目</div>
                    <Input
                        placeholder="请输入项目"
                        value={project_name}
                        onChange={(e) => setProject_name(e.target.value)}
                    />
                    <div style={{ marginTop: 15 }}>供应商</div>
                    <Select
                        style={{width:'100%'}}
                        showSearch
                        onChange={changeSupplierId}
                        placeholder='供应商'
                        value={supplierId}
                        filterOption={(input, option) => {
                            // 假设每个 option 都有一个与数据项对应的 value 属性
                            const item = props.SupplierList.find(unit => unit.id == option.value); // 您可能需要优化这个查找过程
                            return item?.supplierName?.toLowerCase().includes(input.toLowerCase());
                        }}
                        options={
                            [
                                { label: '全部', value: 0 },
                                ...(Array.isArray(props.SupplierList) && props.SupplierList.length > 0
                                        ? props.SupplierList.map((item:any)=>({
                                            label: item.supplierName,
                                            value: item.id,
                                        }))
                                        : []
                                )
                            ]
                        }
                    />
                    <div style={{ marginTop: 15 }}>状态</div>
                    <Select
                        style={{ width: '100%' }}
                        value={orderStatus}
                        onChange={changeStutes}
                        options={[
                            { value: 0, label: '全部' },
                            { value: 1, label: '未审核' },
                            { value: 2, label: '已审核' },
                            { value: 100, label: '待提交' },
                        ]}
                    />
                    <div style={{ marginTop: 15 }}>类型</div>
                    <Selector
                        columns={3}
                        options={[
                            { label: "全部", value: 0 },
                            { label: "收入", value: 1 },
                            { label: "支出", value: 2 }
                        ]}
                        value={[moneyType]}
                        onChange={(arr) => {
                            setMoneyType(arr[0]);
                        }}
                    />
                    <Button
                        block
                        color="primary"
                        style={{ marginTop: 20 }}
                        onClick={handleSearch}
                    >
                        搜索
                    </Button>
                </div>
            </Popup>
            {/* 列表 */}
            <div style={{height: 'calc(100vh - 230px)', overflowY: 'auto', padding: '0 12px'}}>
                {Array.isArray(billList) && billList.length > 0 ? (
                    billList.map((item) => {
                        const typeMap = {
                            1: { color: "#1890ff", label: "收入" },
                            2: { color: "#52c41a", label: "支出" },
                            3: { color: "#faad14", label: "报销" }
                        };
                        const type = typeMap[item.moneyType] || {};
                        return (
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
                                <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 6 }}>
                                    {item.number}
                                    {(() => {
                                        const statusMap = {
                                            1: { text: '未审核', color: 'blue' },
                                            2: { text: '已审核', color: 'green' },
                                            100: { text: '待提交', color: 'orange' },
                                        };
                                        const status = statusMap[item.orderStatus] || { text: '未知', color: 'default' };

                                        return (
                                            <Tag
                                                color={status.color}
                                                style={{ marginLeft: 8 }}
                                            >
                                                {status.text}
                                            </Tag>
                                        )
                                    })()}
                                </div>
                                <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}>
                                    日期：{dayjs(item.orderDate).format("YYYY-MM-DD")}
                                </div>
                                <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}>
                                    公司：{item.company_name}
                                </div>
                                <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}>
                                    项目：{item.project_name}
                                </div>
                                <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}>
                                    账户卡号：{item.account_card}
                                </div>
                                <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}>
                                    供应商：{item.supplierName}
                                </div>
                                <div style={{ marginTop: 8 }}>
                                    类型：
                                    <Tag color={type.color}>{type.label}</Tag>
                                </div>
                                {
                                    item.moneyType==1? <div style={{ marginTop: 4, fontSize: 16 }}>
                                        收入总金额：¥ {item.moneyType==1?item.totalAmount:0}
                                    </div>:''
                                }
                                <div style={{ marginTop: 4, fontSize: 16 }}>
                                    已付金额：¥ {item.paidAmount}
                                </div>
                                {
                                    item.moneyType==2? <div style={{ marginTop: 4, fontSize: 16 }}>
                                        支出总金额：¥ {item.totalAmount}
                                    </div>:''
                                }
                                <div style={{ marginTop: 4, fontSize: 16 }}>
                                    余额：¥ {(item.balance2).toFixed(2)}
                                </div>
                                <div style={{ marginTop: 4, fontSize: 16, color: "#999" }}>
                                    提交人：{item.createUserName}
                                </div>
                                <div style={{ marginTop: 4, fontSize: 16, color: "#999" }}>
                                    审核人： <Tag color={item.orderStatus==2?'green':'blue'}>
                                    {item.orderStatus==2?item.reviewerName:null}
                                </Tag>
                                </div>
                                <div style={{ marginTop: 4, fontSize: 16, color: "#999" }}>
                                    {item.orderStatus === 100 && (
                                        <Button type='link' danger onClick={() => submitForReview(item)}>提审</Button>
                                    )}
                                </div>
                                <Space style={{ marginTop: 12 }}>
                                    <Dropdown
                                        menu={{
                                            items: [
                                                ...(item.orderStatus !== 2 ? [
                                                    { label: '编辑', key: 'edit' },
                                                    { label: '删除', key: 'delete', danger: true },
                                                ] : []),
                                                { label: '详情', key: 'info' },
                                            ],
                                            onClick: ({ key }) => {
                                                switch (key) {
                                                    case 'edit':
                                                        history.push(`/enter/editNewFinancialData?id=${item.id}`);
                                                        break;
                                                    case 'delete':
                                                        deleteItem(item.id);
                                                        break;
                                                    case 'info':
                                                        history.push(`/enter/newFinancialDataInfo?id=${item.id}`);
                                                        break;
                                                    default:
                                                        break;
                                                }
                                            },
                                        }}
                                    >
                                        <Button size="small" type="primary">
                                            操作
                                        </Button>
                                    </Dropdown>
                                </Space>
                            </List.Item>
                        );
                    })
                ) : (
                    <div style={{ textAlign: "center", padding: "40px 0", color: "#999" }}>
                        暂无数据
                    </div>
                )}
            </div>
            <div style={{marginTop:"10px"}}>
                {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
            </div>
            <Modal open={isOpen} onCancel={()=>setIsOpen(false)} onOk={onOK} loading={spinning}>
                <div>是否要删除？</div>
            </Modal>
            <Modal
                open={reviewOpen}
                title="提审确认"
                onCancel={() => {
                    setReviewOpen(false);
                    setReviewRecord(null);
                }}
                onOk={onReviewOK}
                loading={spinning}
                okText="确认提审"
                cancelText="取消"
            >
                <div>
                    确定要将单号 <b>{reviewRecord?.number}</b> 提交审核吗？
                </div>
            </Modal>
        </Spin>
    );
};

const mapStateToProps = (state) => {
    return {
        list: state.NewFinancialData.list,
        count: state.NewFinancialData.count,
        SupplierList: state.Supplier.list,
    };
};

export default connect(mapStateToProps)(FinancialReport);
