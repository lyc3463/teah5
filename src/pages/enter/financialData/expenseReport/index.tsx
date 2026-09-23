import { history, connect } from "umi";
import { useEffect, useState } from "react";
import { List, Tag, Space, Popup , Selector } from "antd-mobile";
import dayjs from "dayjs";
import {Input, message, Modal, Pagination, Spin, Button, Select, Dropdown, Tooltip} from "antd";
import DateRangePicker from "@/components/DateRangePickerProps";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import * as processConfiguration from '@/services/processConfiguration';
import {StaticInfo} from "@/StaticInfo";
import {QuestionCircleOutlined} from "@ant-design/icons";
import * as BillService from '@/services/bill';

const statusMap: any = {
    1: { text: '', color: 'orange',next: 3,btnText:'会计审核' },
    // 2: { text: '已入账', color: 'green'  },
    3: { text: '', color: 'blue' ,next: 4,btnText:''},
    4: { text: '', color: 'purple',next: 5 ,btnText:''},
    5: { text: '', color: 'purple',next: 6 ,btnText:''},
    6: { text: '', color: 'purple',next: 7 ,btnText:''},
    7: { text: '', color: 'purple',next: 8 ,btnText:''},
    8: { text: '', color: 'purple',next: 9 ,btnText:''},
    9: { text: '', color: 'purple',next: 10 ,btnText:''},
    10: { text: '', color: 'purple',next: 11 ,btnText:''},
    11: { text: '', color: 'purple',next: 12 ,btnText:''},
    12: { text: '已审核,未入账', color: 'purple'},
    13: { text: '终止', color: 'purple'},
    14: { text: '已入账', color: 'purple'},
    15: { text: '驳回', color: 'red'},
    100: { text: '待提交', color: 'orange'},

};
const ExpenseReport = (props) => {
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
    const [moneyType, setMoneyType] = useState(3);
    const [project_name, setProject_name] = useState("");
    const [supplierId, setsupplierId] = useState(0);
    const [foType, setFoType] = useState(1);
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
            type: "Bill/fetch",
            payload:{page, pageSize, orderCode, company_name, account_card, startDate, endDate, orderStatus, moneyType,project_name,supplierId,foType,paidStatus,expenseCode,userId:StaticInfo.userId}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setBillList(res.Data.data);
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
    const getReviewer=()=>{
        processConfiguration.one().then((res:TypeErrorCode)=>{
            updateStatusMap(res.Data);
        });
    };
    const updateStatusMap=(data)=> {
        const statusKeys = [1,3,4,5,6,7,8,9,10,11];
        // 先清空
        statusKeys.forEach(key => {
            statusMap[key].text = '';
            statusMap[key].btnText = '';
        });
        for (let i = 0; i < statusKeys.length; i++) {
            const reviewIndex = i + 1;
            const status = statusKeys[i];
            const reviewer = data[`reviewer${reviewIndex}`];
            const rpName = data[`rpName${reviewIndex}`];

            // 没有审核人 → 后面不显示按钮
            if (!reviewer || reviewer.trim() === '') {
                if (rpName) {
                    // 自动加：待xx审核
                    statusMap[status].text = `待${rpName}审核`;
                }
                for (let j = i; j < statusKeys.length; j++) {
                    statusMap[statusKeys[j]].btnText = '';
                }
                break;
            }

            // 自动拼接：待xx审核
            statusMap[status].text = `待${rpName}审核`;

            // 按钮文字 = 下一个审核名称
            const nextRpName = data[`rpName${reviewIndex + 1}`];
            if (nextRpName) {
                statusMap[status].btnText = nextRpName;
            }
        }
        return statusMap
    };
    const getAuditSelectOptions = () => {
        const keys = [1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,15];
        const options = keys.map(key => ({
            label: statusMap[key].text,
            value: key,
        })).filter(item => item.label);
        return [
            { label: '全部', value: 0 },
            { label: '待提交', value: 100 },
            ...options
        ];
    };
    // 初始化
    useEffect(() => {
        getList();
    }, [page, pageSize]);

    useEffect(() => {
        getReviewer();
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
        history.push('/enter/financialData/expenseReport/addInvoiceFinancialDala');
    };
    const deleteItem=(e)=>{
        setUid(e);
        setIsOpen(true);
    };
    // 删除确定按钮
    const onOK=()=>{
        setspinning(true);
        props.dispatch({
            type:'Bill/remove',
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
                    添加报销单
                </Button>
            </Space>
            {/* 筛选弹窗 */}
            <Popup
                visible={filterOpen}
                onMaskClick={() => setFilterOpen(false)}
                // bodyStyle={{ height: "60vh" }}
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
                        options={getAuditSelectOptions()}
                    />
                    <div style={{ marginTop: 15 }}>类型</div>
                    <Selector
                        columns={3}
                        options={[
                            { label: "全部", value: 0 },
                            { label: "报销", value: 3 }
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
            <div
                style={{
                    height: 'calc(100vh - 230px)',
                    overflowY: 'auto',
                    padding: '0 12px'
                }}
            >
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
                                <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 6 }}
                                    onClick={()=>history.push(`/enter/financialData/expenseReport/editInvoiceFinancialDala?id=${item.id}&orderStatus=${item.orderStatus}`)}
                                >
                                    {item.number}
                                    {(() => {
                                        const status = statusMap[item.orderStatus] || { text: '未知', color: 'default' }
                                        return (
                                            <>
                                                <Tag
                                                    color={status.color}
                                                    style={{ marginLeft: 8 }}
                                                >
                                                    {status.text}
                                                </Tag>
                                                {item.orderStatus === 15 && (
                                                    <Tooltip title={item.rejectReason} placement="right">
                                                        <QuestionCircleOutlined style={{ marginLeft: 4, color: '#999', cursor: 'pointer' }} />
                                                    </Tooltip>
                                                )}
                                                {item.orderStatus === 13 && (
                                                    <Tooltip title={item.terminateReason} placement="right">
                                                        <QuestionCircleOutlined style={{ marginLeft: 4, color: '#999', cursor: 'pointer' }} />
                                                    </Tooltip>
                                                )}
                                            </>
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
                                    供应商：{item.supplierName}
                                </div>

                                <div style={{ marginTop: 8 }}>
                                    类型：
                                    <Tag color={type.color}>{type.label}</Tag>
                                </div>
                                <div style={{ marginTop: 4, fontSize: 16 }}>
                                    金额：¥{item.totalAmount}
                                </div>

                                <div style={{ marginTop: 4, fontSize: 16, color: "#999" }}>
                                    提交人：{item.createUserName}
                                </div>
                                 <div style={{ marginTop: 4, fontSize: 16, color: "#999" }}>
                                    {item.orderStatus === 100 && (
                                        <Button type='primary' danger onClick={() => submitForReview(item)}>提审</Button>
                                    )}
                                </div>
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
        list: state.Bill.list,
        count: state.Bill.count,
        SupplierList: state.Supplier.list,
    };
};

export default connect(mapStateToProps)(ExpenseReport);