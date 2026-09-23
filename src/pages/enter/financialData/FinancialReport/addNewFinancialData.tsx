import { useEffect, useState } from "react";
import { connect, useNavigate } from "umi";
import {
    List,
    Button,
    Card,
    Toast, TextArea,Popup
} from "antd-mobile";
import {Image, DatePicker, Select, Spin, InputNumber, Input, message,Space,Radio} from "antd";
import dayjs from "dayjs";
import {generate, getCurrentDate, numberToRMB} from "@/utils/OpenTool";
import { StaticInfo } from "@/StaticInfo";
import PageLayout from "@/components/PageLayout ";
import * as AccountService from "@/services/account";
import * as ProjectService from "@/services/project";
import * as BillService from '@/services/bill';
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {ClearOutlined, CloseOutlined, PlusOutlined} from "@ant-design/icons";

const AddNewFinancialData = (props: any) => {
    const [spinning, setSpinning] = useState(false);
    const [prohibit,setProhibit]=useState(false);
    const [billList,setBillList]=useState([]);
    const navigate=useNavigate();
    // 账单日期
    const [orderDate,setOrderDate]=useState(getCurrentDate());
    // 订单号
    const [orderCode,setOrderCode]=useState('');
    // 添加的物品列表
    const [goodsList,setGoodsList]=useState([]);
    // 1公账，0私账
    const [accountType,setAccountType]=useState(0);
    // 总金额
    const [totalAmount, setTotalAmount] = useState(0);
    // 已付金额
    const [paidAmount, setPaidAmount] = useState(0);
    // 公司id
    const [companyId,setCompanyId]=useState(0);
    // 账户id
    const [accountId,setAccountId]=useState(0);
    // 项目id
    const [projectId,setProjectId]=useState(0);
    // 收入支出类型
    const [moneyType,setMoneyType]=useState(1);
    const [supplierId,setSupplierId]=useState(0);
    const [bxId,setBxId]=useState(0);
    const [imgUrl,setImgUrl]=useState('');
    // 备注
    const [remark,setRemark]=useState('');
    const [caigou, setCaigou] = useState<any[]>([]);

    // 获取报销单录入
    const getBillInfo=async()=>{
        BillService.fetch({
            page:1,
            orderCode:'',
            company_name:'',
            account_card:'',
            project_name:'',
            startDate:'2000-01-01',
            endDate:'2099-01-01',
            pageSize:1000,
            orderStatus:12,
            moneyType:0,
            supplierId:0,
            foType:1,
            paidStatus:0,
            expenseCode:'',
            userId:0
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                console.log('查看列表',res)
                setBillList(res.Data.data);
            }else {

            }
        })
    }
    const generateMultipleRecords = (count: number) => {
        // 计算起始ID（当前最大ID + 1，若为空则从1开始）
        const maxId = goodsList.length > 0
            ? Math.max(...goodsList.map(item => item.id))
            : 0;

        // 生成指定数量的新记录
        const newRecords = Array.from({ length: count }, (_, i) => ({
            id: maxId + i + 1,
            subjectName: '', // 科目
            summary: '', // 摘要
            amount: 0,    // 金额
            quantity:0, // 数量
            unit:'', // 单位
            unitPrice:0, // 单价
        }));

        // 添加到现有列表
        setGoodsList(prevGoodsList => [...prevGoodsList, ...newRecords]);
    };
    // 处理科目变更
    const handleSubjectChange = (id: number, value: string, label: string) => {
        setGoodsList(prev =>
            prev.map(item =>
                item.id === id
                    ? {
                        ...item,
                        subjectName: label    // 存储科目名称（label）
                    }
                    : item
            )
        );
    };
    // 处理摘要变更
    const handleSummaryChange = (id: number, value: string) => {
        setGoodsList(prev =>
            prev.map(item =>
                item.id === id ? { ...item, summary: value } : item
            )
        );
    };

    // 处理金额变更
    const handleAmountChange = (id: number, value: number) => {
        setGoodsList(prev =>
            prev.map(item =>
                item.id === id ? { ...item, amount: value } : item
            )
        );
    };
    // 添加清空行处理函数
    const handleClearRow = (id: number) => {
        setGoodsList(prev =>
            prev.map(item =>
                item.id === id
                    ? {
                        ...item,
                        subjectName: '', // 清空科目名称
                        summary: '',     // 清空摘要
                        amount: 0 ,       // 清空金额
                        quantity:0, // 清空数量
                        unit:'', // 单位
                        unitPrice:0, // 单价
                    }
                    : item
            )
        );
    };
    useEffect(() => {
        // 累加所有金额，处理可能的空值
        const sum = goodsList.reduce((acc, item) => acc + (Number(item.amount) || 0), 0);
        // 四舍五入保留两位小数
        setTotalAmount(Number(sum.toFixed(2)));
    }, [goodsList]);
    const changePaidAmount=(e)=>{
        setPaidAmount(e);
    };
    // 收入支出
    const changeMoneyType=(e)=>{
        setMoneyType(e.target.value);
        if (e.target.value==1){
            setProhibit(false);
            setPaidAmount(0);
            setBxId(0);
            getAccountList();
        }
    };
    // 公司id
    const changeCompanyId=(e)=>{
        setCompanyId(e);
        setProjectId(0);
        setAccountId(0);
        getProjectList(e);
    };
    // 日期选择
    const changeData=(_,item)=>{
        setOrderDate(item)
    };
    // 随机获取单号
    const getOrderCode=async ()=>{
        setOrderCode(generate(StaticInfo.park_name));
    };
    // 账户id
    const changeAccountId=(e)=>{
        setAccountId(e);
        AccountService.one(e).then((res:any)=>{
            console.log('账户详情',res.Data);
            setCompanyId(res.Data.company_id);
            setProjectId(res.Data.project_id);
            setAccountType(res.Data.account_type);
        })
    };
    // 项目id
    const changeProjectId=(e)=>{
        setProjectId(e);
        ProjectService.one(e).then((res:any)=>{
            setCompanyId(res.Data.company_id);
            getAccountListInfo(e);
            setAccountId(0);
        })
    };
    // 获取公司列表
    const getCompanList=()=>{
        props.dispatch({
            type:'Compan/fetch',
        })
    };
    // 获取项目列表
    const getProjectList=(e)=>{
        props.dispatch({
            type:'Project/fetch',
            payload:{name:'', companyId:e, pageSize:1000}
        })
    };
    const getAccountListInfo=(e)=>{
        props.dispatch({
            type:'Account/projectOrAccount',
            payload:e,
        }).then((res:TypeErrorCode)=>{
            console.log(res)
        })
    };
    // 获取账户列表
    const getAccountList=()=>{
        props.dispatch({
            type:'Account/fetch',
        })
    };
    // 获取科目列表
    const getSubjectList=()=>{
        props.dispatch({
            type:'Subject/fetch',
        })
    };
    const getSupplierList=()=>{
        props.dispatch({
            type:"Supplier/fetch",
        })
    };
    useEffect(() => {
        getOrderCode();
        getCompanList();
        getProjectList(0);
        getAccountList();
        getSubjectList();
        getBillInfo();
        getSupplierList();
    }, []);
    // 清空重置表单
    const clearForm = () => {
        setOrderCode(generate(StaticInfo.park_name));
        setOrderDate(getCurrentDate());
        setCompanyId(0);
        setAccountId(0);
        setProjectId(0);
        setMoneyType(1);
        setSupplierId(0);
        setBxId(0);
        setImgUrl('');
        setRemark('');
        setPaidAmount(0);
        setTotalAmount(0);
        setGoodsList([]);
        setCaigou([]);
        setProhibit(false);
        getAccountList();
        message.success('已清空所有表单数据');
    };
    const submit = (status: number) => {
        // console.log('供应商',supplierId);
        if (!orderDate) return  message.error('请选择日期');
        if (!accountId) return  message.error('请选择账户');
        if (!companyId) return  message.error('请选择公司');
        if (!projectId) return  message.error('请选择项目');
        const processedList = goodsList.map(item => ({
            ...item,
            unitPrice: !isNaN(Number(item.unitPrice)) ? Number(item.unitPrice) : 0,
            quantity: !isNaN(Number(item.quantity)) ? Number(item.quantity) : 0,
        }));

        const filteredGoodsList = processedList.filter(item =>
            (item.subjectName?.trim() !== '')
            && item.amount > 0
        );
        if (filteredGoodsList.length === 0) return message.error('明细科目不能为空,金额不能为0,请检查!');
        const jsonfd = JSON.stringify(filteredGoodsList);
        const mapCaigou = caigou.map(item => ({ ...item, poId: item.id || 0, number: item.orderCode || '' }));
        const jsonCaigou = JSON.stringify(mapCaigou);
        const jsonData = JSON.stringify({ fd: jsonfd, caigou: jsonCaigou  });
        setSpinning(true);
        props.dispatch({
            type:'NewFinancialData/add',
            payload:{orderCode, orderDate, accountId,projectId, companyId, paidAmount, totalAmount, moneyType, jsonData,remark,supplierId,imgUrl,bxId, status}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode == 0) {
                message.success(status === 100 ? "保存成功" : "提审成功");
                setSpinning(false);
                clearForm();
                navigate(-1);
            } else {
                message.error(res.ErrorCode + res.Data);
                setSpinning(false);
            }
        })
    };
    const changeBillId=(e)=>{
        const result = billList.find(item => item.id === e);
        setGoodsList(result.fdList);
        setCompanyId(result.companyId);
        setProjectId(result.projectId);
        getAccountListInfo(result.projectId);
        setRemark(result.remark);
        setSupplierId(result.supplierId);
        setBxId(result.id);
        setImgUrl(result.foImage);
        setProhibit(true);
    };
    const changeSupplierId=(e)=>{
        setSupplierId(e);
    };
    const handleQuantityChange = (id: number, value: number) => {
        setGoodsList(prev =>
            prev.map(item =>
                item.id === id ? { ...item, quantity: value,amount:((value*item.unitPrice).toFixed(2) *1) } : item
            )
        );
    };
    return (
        <Spin spinning={spinning}>
            <div style={{ paddingBottom: 80 }}>
                <PageLayout
                    title="新增财务单"
                    onBack={()=>navigate(-1)}
                >
                    <div
                        style={{
                            maxHeight: '80vh',
                            overflowY: 'auto',
                            overflowX: 'hidden',
                            padding: '10px',
                            backgroundColor:'#f7f8fa',
                            boxSizing: 'border-box'}}
                    >
                        {/* 基础信息 */}
                        <List header="基础信息">
                            {/* 单号 */}
                            <div style={{ marginBottom: '8px', background: '#f7f8fa', borderRadius: '8px', padding: '0 12px' }}>
                                <List.Item extra={orderCode}>
                                    单号
                                </List.Item>
                            </div>
                            {/* 日期 */}
                            <div style={{ marginBottom: '8px', background: '#f7f8fa', borderRadius: '8px', padding: '0 12px' }}>
                                <List.Item
                                    extra={
                                        <DatePicker placeholder={'请选择日期'} defaultValue={dayjs(orderDate)} onChange={changeData} />
                                    }
                                >
                                    日期
                                </List.Item>
                            </div>
                            {/* 公司 */}
                            <div style={{ marginBottom: '8px', background: '#f7f8fa', borderRadius: '8px', padding: '0 12px' }}>
                                <List.Item
                                    extra={
                                        <Select
                                            style={{ width: '200px' }}
                                            showSearch
                                            value={companyId}
                                            onChange={changeCompanyId}
                                            placeholder='公司'
                                            disabled={prohibit}
                                            filterOption={(input, option) => {
                                                const item = props.CompanList.find(unit => unit.id == option.value);
                                                return item?.company_name?.toLowerCase().includes(input.toLowerCase());
                                            }}
                                            options={Array.isArray(props.CompanList) && props.CompanList.length > 0
                                                ? props.CompanList.map((item: any) => ({
                                                    label: item.company_name,
                                                    value: item.id,
                                                }))
                                                : []}
                                        />
                                    }
                                >
                                    公司
                                </List.Item>
                            </div>
                            {/* 项目 */}
                            <div style={{ marginBottom: '8px', background: '#f7f8fa', borderRadius: '8px', padding: '0 12px' }}>
                                <List.Item
                                    extra={
                                        <Select
                                            style={{ width: '200px' }}
                                            showSearch
                                            onChange={changeProjectId}
                                            value={projectId}
                                            placeholder='项目'
                                            disabled={prohibit}
                                            filterOption={(input, option) => {
                                                const item = props.ProjectList.find(unit => unit.id == option.value);
                                                return item?.project_name?.toLowerCase().includes(input.toLowerCase());
                                            }}
                                            options={Array.isArray(props.ProjectList) && props.ProjectList.length > 0
                                                ? props.ProjectList.map((item: any) => ({
                                                    label: item.project_name,
                                                    value: item.id,
                                                }))
                                                : []}
                                        />
                                    }
                                >
                                    项目
                                </List.Item>
                            </div>
                            <div style={{ marginBottom: '8px', background: '#f7f8fa', borderRadius: '8px', padding: '0 12px' }}>
                                {moneyType==2?
                                        <List.Item
                                            extra={
                                                <Select
                                                    style={{ width: '200px' }}
                                                    showSearch
                                                    onChange={changeBillId}
                                                    placeholder='报销单号'
                                                    filterOption={(input, option) => {
                                                        // 假设每个 option 都有一个与数据项对应的 value 属性
                                                        const item = billList.find(unit => unit.id == option.value); // 您可能需要优化这个查找过程
                                                        return item?.number?.toLowerCase().includes(input.toLowerCase());
                                                    }}
                                                    options={Array.isArray(billList) && billList.length > 0
                                                        ? billList.map((item:any)=>({
                                                            label:item.number+'('+item.project_name+')',
                                                            value:item.id,
                                                        }))
                                                        : []}
                                                />
                                            }
                                        >
                                            报销单号
                                        </List.Item>
                                   :''
                                }
                            </div>
                            {/* 账户 */}
                            <div style={{ marginBottom: '8px', background: '#f7f8fa', borderRadius: '8px', padding: '0 12px' }}>
                                <List.Item
                                    extra={
                                        <Select
                                            style={{width:'200px'}}
                                            showSearch
                                            onChange={changeAccountId}
                                            placeholder='账户'
                                            value={accountId}
                                            filterOption={(input, option) => {
                                                // 假设每个 option 都有一个与数据项对应的 value 属性
                                                const item = props.AccountList.find(unit => unit.id == option.value); // 您可能需要优化这个查找过程
                                                return item?.account_name?.toLowerCase().includes(input.toLowerCase());
                                            }}
                                            options={Array.isArray(props.AccountList) && props.AccountList.length > 0
                                                ? props.AccountList.map((item:any)=>({
                                                    label:item.account_name,
                                                    value:item.id,
                                                }))
                                                : []}
                                        />
                                    }
                                >
                                    账户
                                </List.Item>
                            </div>
                            {/* 供应商 */}
                            <div style={{ marginBottom: '8px', background: '#f7f8fa', borderRadius: '8px', padding: '0 12px' }}>
                                <List.Item
                                    extra={
                                        <Select
                                            style={{ width: '200px' }}
                                            showSearch
                                            onChange={changeSupplierId}
                                            placeholder='供应商'
                                            value={supplierId}
                                            disabled={prohibit}
                                            filterOption={(input, option) => {
                                                const item = props.SupplierList.find(unit => unit.id == option.value);
                                                return item?.supplier_name?.toLowerCase().includes(input.toLowerCase());
                                            }}
                                            options={Array.isArray(props.SupplierList) && props.SupplierList.length > 0
                                                ? props.SupplierList.map((item: any) => ({
                                                    label: item.supplierName,
                                                    value: item.id,
                                                }))
                                                : []}
                                        />
                                    }
                                >
                                    供应商
                                </List.Item>
                            </div>
                            {/* 收入支出 */}
                            <div style={{ marginBottom: '8px', background: '#f7f8fa', borderRadius: '8px', padding: '0 12px' }}>
                                <List.Item
                                    extra={
                                        <Radio.Group value={moneyType} onChange={changeMoneyType}>
                                            <Radio value={1}>收入</Radio>
                                            <Radio value={2}>支出</Radio>
                                        </Radio.Group>
                                    }
                                >
                                    类型
                                </List.Item>
                            </div>
                            <div style={{ marginBottom: '8px', background: '#f7f8fa', borderRadius: '8px', padding: '0 12px' }}>
                                <List.Item
                                    extra={
                                        <Radio.Group value={accountType}  disabled>
                                            <Radio value={1}>公账</Radio>
                                            <Radio value={0}>私账</Radio>
                                        </Radio.Group>
                                    }
                                >
                                    类别
                                </List.Item>
                            </div>
                            {/* 备注 */}
                            <div style={{ background: '#f7f8fa', borderRadius: '8px', padding: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                                    <span style={{ width: '50px', paddingTop: '8px' }}>备注:</span>
                                    <TextArea
                                        placeholder="备注"
                                        value={remark}
                                        onChange={(v) => setRemark(v)}
                                        style={{ flex: 1 }}
                                    />
                                </div>
                            </div>
                        </List>
                        {/* 明细 */}
                        <List header="报销明细">
                            {/* 唯一横向滚动容器：整表共用一条横向滚动条 */}
                            <div style={{
                                width: '100%',
                                overflowX: 'auto',
                                backgroundColor: '#F0F0F0',
                                borderRadius: '8px',
                                padding: '10px',
                            }}>
                                {/* 整表固定总宽度，表头+内容共用 */}
                                <div style={{ width: '900px', minWidth: '900px' }}>
                                    {/* 表头区域（不纵向滚动） */}
                                    <div style={{
                                        display: 'flex',
                                        backgroundColor: '#fff',
                                        padding: '12px 10px',
                                        borderRadius: '8px 8px 0 0',
                                        fontWeight: 500,
                                        fontSize: '13px',
                                        borderBottom: '1px solid #e8e8e8',
                                    }}>
                                        <div style={{ width: '70px', textAlign: 'center', flexShrink: 0 }}>操作</div>
                                        <div style={{ width: '150px', textAlign: 'center', flexShrink: 0 }}>科目</div>
                                        <div style={{ width: '150px', textAlign: 'center', flexShrink: 0 }}>用途</div>
                                        <div style={{ width: '100px', textAlign: 'center', flexShrink: 0 }}>数量</div>
                                        <div style={{ width: '100px', textAlign: 'center', flexShrink: 0 }}>单位</div>
                                        <div style={{ width: '120px', textAlign: 'center', flexShrink: 0 }}>单价</div>
                                        <div style={{ width: '120px', textAlign: 'center', flexShrink: 0 }}>金额</div>
                                    </div>

                                    {/* 内容：仅纵向滚动，无横向滚动 */}
                                    <div style={{
                                        maxHeight: '400px',
                                        overflowY: 'auto',
                                        overflowX: 'hidden', // 关键：禁用内容区横向滚动，消除第二条横向滚动条
                                        backgroundColor: '#fff',
                                        borderRadius: '0 0 8px 8px',
                                    }}>
                                        {(goodsList || []).map((item, index) => (
                                            <Space
                                                key={item.id || index}
                                                style={{
                                                    display: 'flex',
                                                    padding: '12px 10px',
                                                    borderBottom: '1px solid #f0f0f0',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                {/* 删除 */}
                                                <div style={{ width: '70px', textAlign: 'center', flexShrink: 0 }}>
                                                    <Button type="text" onClick={() => handleClearRow(item.id)}>
                                                        <CloseOutlined />
                                                    </Button>
                                                </div>
                                                {/* 科目 */}
                                                <div style={{ width: '150px', flexShrink: 0 }}>
                                                    <Select
                                                        style={{ width: '100%' }}
                                                        onChange={(value, option) => handleSubjectChange(item.id, value, option.label)}
                                                        showSearch
                                                        filterOption={(input, option) => {
                                                            const data = props.SubjectList.find(unit => unit.id == option.value);
                                                            return data?.subject_name?.toLowerCase().includes(input.toLowerCase());
                                                        }}
                                                        options={Array.isArray(props.SubjectList)
                                                            ? props.SubjectList.map((item: any) => ({
                                                                label: item.subject_name,
                                                                value: item.id,
                                                            }))
                                                            : []}
                                                    />
                                                </div>

                                                {/* 用途 */}
                                                <div style={{ width: '150px', flexShrink: 0 }}>
                                                    <Input.TextArea
                                                        placeholder="用途"
                                                        value={item.summary}
                                                        onChange={(e) => handleSummaryChange(item.id, e.target.value)}
                                                        style={{ width: '100%' }}
                                                        rows={1}
                                                    />
                                                </div>

                                                {/* 数量 */}
                                                <div style={{ width: '100px', textAlign: 'center', flexShrink: 0 }}>
                                                    <InputNumber
                                                        value={item.quantity}
                                                        min={0}
                                                        style={{ width: '100%' }}
                                                        onChange={(value) => handleQuantityChange(item.id, value)}
                                                    />
                                                </div>

                                                {/* 单位 */}
                                                <div style={{ width: '100px', textAlign: 'center', flexShrink: 0 }}>
                                                    <Input
                                                        value={item.unit}
                                                        style={{ width: '100%' }}
                                                        onChange={(e) => {
                                                            setGoodsList(prev =>
                                                                prev.map(record =>
                                                                    record.id === item.id
                                                                        ? { ...record, unit: e.target.value }
                                                                        : record
                                                                )
                                                            );
                                                        }}
                                                    />
                                                </div>

                                                {/* 单价 */}
                                                <div style={{ width: '120px', textAlign: 'center', flexShrink: 0 }}>
                                                    <InputNumber
                                                        value={item.unitPrice}
                                                        min={0}
                                                        style={{ width: '100%' }}
                                                        onChange={(value) => {
                                                            setGoodsList(prev =>
                                                                prev.map(record =>
                                                                    record.id === item.id
                                                                        ? {
                                                                            ...record,
                                                                            unitPrice: value,
                                                                            amount: Number((value * (record.quantity || 0)).toFixed(2)),
                                                                        }
                                                                        : record
                                                                )
                                                            );
                                                        }}
                                                    />
                                                </div>
                                                {/* 金额 */}
                                                <div style={{ width: '120px', textAlign: 'center', flexShrink: 0 }}>
                                                    <InputNumber
                                                        value={item.amount}
                                                        min={0}
                                                        style={{ width: '100%' }}
                                                        onChange={(value) => {
                                                            setGoodsList(prev =>
                                                                prev.map(record =>
                                                                    record.id === item.id
                                                                        ? { ...record, amount: value }
                                                                        : record
                                                                )
                                                            );
                                                        }}
                                                    />
                                                </div>
                                            </Space>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </List>
                        {/* 添加按钮 */}
                        <div style={{ padding: '12px', textAlign: 'center' }}>
                            <Button onClick={() => generateMultipleRecords(1)}>
                                <PlusOutlined />添加明细
                            </Button>
                        </div>
                    </div>

                    {/* 底部 */}
                    <div
                        style={{
                            position: "fixed",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            backgroundColor: "#fff",
                            borderTop: "1px solid #eee",
                            padding: 12,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}
                    >
                        <div style={{ marginBottom: 6 }}>
                            总金额：¥{totalAmount}
                        </div>
                        <Space>
                            <Button
                                block
                                color="primary"
                                onClick={() => clearForm()}
                            >
                                清除
                            </Button>
                            <Button
                                block
                                color="primary"
                                onClick={() => submit(100)}
                            >
                                保存
                            </Button>
                            <Button
                                block
                                color="primary"
                                onClick={() => submit(1)}
                            >
                                提审
                            </Button>
                        </Space>
                        
                    </div>
                </PageLayout>
            </div>
        </Spin>
    );
};

const mapStateToProps = (state: any) => ({
    SubjectList: state.Subject.list,
    AccountList: state.Account.list,
    CompanList: state.Compan.list,
    ProjectList: state.Project.list,
    SupplierList: state.Supplier.list,
});

export default connect(mapStateToProps)(AddNewFinancialData);
