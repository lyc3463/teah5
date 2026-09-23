import { history, connect } from "umi";
import { useEffect, useState } from "react";
import { List, Tag, Popup , Selector } from "antd-mobile";
import dayjs from "dayjs";
import {Form, Input, message, Modal, Pagination, Select, Spin, Space, Tooltip, Dropdown, Button} from "antd";
import DateRangePicker from "@/components/DateRangePickerProps";
import * as processConfiguration from "@/services/processConfiguration";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {StaticInfo} from "@/StaticInfo";
import {QuestionCircleOutlined} from "@ant-design/icons";
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
}
const OldCheckFinance = (props) => {
    // 页码
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(50);
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
    const [uid,setUid]=useState(0);
    // UI
    const [isOpen, setIsOpen] = useState(false);
    const [spinning, setspinning] = useState(false);
    const [filterOpen, setFilterOpen] = useState(false);
    // 终止弹窗
    const [terminateOpen,setTerminateOpen]=useState(false);
    // 缴费的弹窗
    const [paymentOpen,setPaymentOpen]=useState(false);
    const [rejectOpen,setRejectOpen]=useState(false);
    // 审核状态
    const [status,setStatus]=useState(0);
    // 报销单明细
    const [fdList,setFdList]=useState([]);
    const [billList,setBillList]=useState([]);
    // 账户名称
    const [accountName,setAccountName]=useState('');
    // 账户余额
    const [accountBalance,setAccountBalance]=useState(0);
    // 备注
    const [remark,setRemark]=useState('');
    const [checkUser,setCheckUser]=useState('');
    const [paidStatus,setPaidStatus]=useState(0);
    const [expenseCode,setExpenseCode]=useState('');
    // 终止描述
    const [terminateTxt,setTerminateTxt]=useState('');
    // 驳回描述
    const [rejectTxt,setRejectTxt]=useState('');
    // 获取列表
    const getList = () => {
        props.dispatch({
            type: "Bill/fetch",
            payload:{page, pageSize, orderCode, company_name, account_card, startDate, endDate, orderStatus, moneyType,project_name,supplierId,foType,paidStatus,expenseCode,userId:0}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                console.log('原始数组',res)
                setBillList(res.Data.data);
            }else {
                message.error(res.Data);
            }
        });
    };
    // 初始化
    useEffect(() => {
        getList();
    }, [page, pageSize]);

    useEffect(() => {
        getAccountList();
        getSupplierList();
        getReviewer();
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

            // ✅ 自动拼接：待xx审核
            statusMap[status].text = `待${rpName}审核`;

            // 按钮文字 = 下一个审核名称
            const nextRpName = data[`rpName${reviewIndex + 1}`];
            if (nextRpName) {
                statusMap[status].btnText = nextRpName;
            }
        }
        return statusMap
    };
    // 审核按钮
    const onOK=()=>{
        setspinning(true);
        props.dispatch({
            type:'Bill/check',
            payload:{uid,status}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode == 0||res.ErrorCode == 9038) {
                message.success(status==6?'中止成功':'审核成功');
                setspinning(false);
                setIsOpen(false);
                getList();
            }else {
                message.error(res.ErrorCode + res.Data);
                setspinning(false);
            }
        })
    };
    // 3-4-5审核，6中止
    const handleUpdateStatus = (record: any, status: number) => {
        setUid(record.id);
        setStatus(status);
        setIsOpen(true);
    };
    // 驳回弹窗
    const handleReject=(record:any)=>{
        setUid(record.id);
        setRejectOpen(true);
    };
    // 驳回按钮
    const rejectOK=()=>{
        setspinning(true);
        props.dispatch({
            type:'Bill/reject',
            payload:{uid,rejectTxt}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode == 0||res.ErrorCode == 9038) {
                message.success('驳回成功');
                setspinning(false);
                setRejectOpen(false);
                getList();
            }else {
                message.error(res.ErrorCode + res.Data);
                setspinning(false);
            }
        })
    };
    // 获取账户列表
    const getAccountList=()=>{
        props.dispatch({
            type:'Account/fetch',
        })
    };
    // 终止弹窗
    const handleTerminateStatus=(e)=>{
        setUid(e.id);
        setTerminateOpen(true);
    };
    // 终止按钮
    const onTerminateOK=()=>{
        setspinning(true);
        props.dispatch({
            type:'Bill/terminate',
            payload:{uid,terminateTxt}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode == 0||res.ErrorCode == 9038) {
                message.success('终止成功')
                setspinning(false);
                setTerminateOpen(false);
                getList();
            }else {
                message.error(res.ErrorCode + res.Data);
                setspinning(false);
            }
        })
    };
    const checkAuditPermission = (status, auditObj) => {
        const statusMap = {
            1: 1,
            3: 2,
            4: 3,
            5: 4,
            6: 5,
            7: 6,
            8: 7,
            9: 8,
            10: 9,
            11: 10,
        };
        // 2. 获取当前状态对应的审核人索引，不存在则直接无权限
        const reviewerIndex = statusMap[status];
        if (!reviewerIndex) return false;

        // 3. 拼接对应的字段名 reviewer1 ~ reviewer11
        const reviewerKey = `reviewer${reviewerIndex}`;

        // 4. 获取该字段的值
        const reviewerValue = auditObj[reviewerKey];

        // 5. 校验：字段为空 → 无权限
        if (!reviewerValue) return false;

        // 6. 把用户ID转为字符串，兼容数字/字符串类型
        const targetId = String(StaticInfo.userId);

        // 7. 判断用户ID是否在审核人列表中（用|分隔）
        const userList = reviewerValue.split('|');
        return userList.includes(targetId);
    };
    const changeStutes=(e:any)=>{
        setOrderStatus(e);
    };
    const getAuditSelectOptions = () => {
        // 你要的顺序（固定不变）
        const keys = [1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,15];

        const options = keys.map(key => ({
            label: statusMap[key].text,
            value: key,
        })).filter(item => item.label);

        // ✅ 在最前面插入一行：全部（value=0）
        return [
            { label: '全部', value: 0 },
            { label: '待提交', value: 100 },
            ...options
        ];
    };
    const changeSupplierId=(e:any)=>{
        setsupplierId(e);
    };
    const getSupplierList=()=>{
        props.dispatch({
            type:"Supplier/fetch",
        })
    };
    const getReviewer=()=>{
        processConfiguration.one().then((res:TypeErrorCode)=>{
            updateStatusMap(res.Data);
            setCheckUser(res.Data);
        })
    };
    return (
        <Spin spinning={spinning}>
            {/* 筛选按钮 */}
            <Space style={{ padding: 10 }}>
                <Button size="small" type="primary" onClick={() => setFilterOpen(true)}>
                    筛选
                </Button>
            </Space>
            {/* 筛选弹窗 */}
            <Popup
                visible={filterOpen}
                onMaskClick={() => setFilterOpen(false)}
                bodyStyle={{ height: "60vh" }}
            >
                <div style={{ padding: 16 }}>
                    <DateRangePicker  onDateSelected={changeDate}/>
                    <div style={{ marginTop: 15 }}>公司名称</div>
                    <Input
                        placeholder="请输入公司"
                        value={company_name}
                        onChange={(e) => setCompany_name(e.target.value)}
                    />
                    <div style={{ marginTop: 15 }}>供应商</div>
                    <Select
                        style={{width:'100%'}}
                        showSearch
                        onChange={changeSupplierId}
                        placeholder='供应商'
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
                    <div style={{ marginTop: 15 }}>项目</div>
                    <Input
                        placeholder="请输入项目"
                        value={project_name}
                        onChange={(e) => setProject_name(e.target.value)}
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
                    height: 'calc(100vh - 230px)', // 根据你页面结构调整
                    overflowY: 'auto',
                    padding: '0 12px'
                }}
            >
                {Array.isArray(billList) && billList.length > 0 ? (
                    billList.map((item) => {
                        const typeMap = {
                            1: { color: "success", label: "收入" },
                            2: { color: "danger", label: "支出" },
                            3: { color: "primary", label: "报销" }
                        };
                        let isCok=checkAuditPermission(item.orderStatus,checkUser);
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
                                onClick={()=>history.push(`/enter/invoiceFinancialDalaInfo?id=${item.id}&orderStatus=${item.orderStatus}`)}
                            >
                                <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 6 }}>
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

                                <div style={{ fontSize: 16, color: "#666" }}>
                                    日期：{dayjs(item.orderDate).format("YYYY-MM-DD")}
                                </div>

                                <div style={{ fontSize: 16, color: "#666" }}>
                                    公司：{item.company_name}
                                </div>

                                <div style={{ fontSize: 16, color: "#666" }}>
                                    项目：{item.project_name}
                                </div>

                                <div style={{ fontSize: 16, color: "#666" }}>
                                    供应商：{item.supplierName}
                                </div>

                                <div style={{ marginTop: 4 }}>
                                    类型：
                                    <Tag color={type.color}>{type.label}</Tag>
                                </div>
                                <div style={{ marginTop: 4 , fontSize: 16}}>
                                    金额：¥{item.totalAmount}
                                </div>

                                <div style={{ marginTop: 4, fontSize: 16, color: "#999" }}>
                                    提交人：{item.createUserName}
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
            {/*审核流程*/}
            <Modal open={isOpen} onCancel={()=>setIsOpen(false)} onOk={onOK} loading={spinning}>
                <div>是否要审核</div>
            </Modal>
            {/*终止流程*/}
            <Modal open={terminateOpen} onCancel={()=>setTerminateOpen(false)} onOk={onTerminateOK} loading={spinning} title={'终止'}>
                <Form>
                    <Form.Item label={'终止描述'}>
                        <Input.TextArea value={terminateTxt} onChange={(e)=>setTerminateTxt(e.target.value)}/>
                    </Form.Item>
                </Form>
            </Modal>
            {/*驳回弹窗*/}
            <Modal open={rejectOpen} onCancel={()=>setRejectOpen(false)} onOk={rejectOK} loading={spinning} title={'驳回'}>
                <Form>
                    <Form.Item label={'驳回描述'}>
                        <Input.TextArea value={rejectTxt} onChange={(e)=>setRejectTxt(e.target.value)}/>
                    </Form.Item>
                </Form>
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

export default connect(mapStateToProps)(OldCheckFinance);
