import {Button, DatePicker, Input, InputNumber, message, Radio, Select, Space, Spin, Table} from "antd";
import {useEffect, useState} from "react";
import {connect,history,useNavigate} from "umi";
import dayjs from "dayjs";
import {generate, getCurrentDate} from "@/utils/OpenTool";
import {StaticInfo} from "@/StaticInfo";
import {ClearOutlined, DeleteOutlined, PlusOutlined} from "@ant-design/icons";
import * as AccountService from "@/services/account";
import * as NewFinancialDataService from "@/services/newFinancialData";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import * as BillService from "@/services/bill";
import PageLayout from "@/components/PageLayout ";
import {List, TextArea} from "antd-mobile";

const EditNewFinancialData=(props:any)=>{
    const [spinning, setSpinning] = useState(false);
    const [prohibit,setProhibit]=useState(false);
    const navigate=useNavigate();
    // 账单日期
    const [orderDate,setOrderDate]=useState('2000-01-01');
    // 订单号
    const [orderCode,setOrderCode]=useState('');
    // 添加的物品列表
    const [goodsList,setGoodsList]=useState([]);
    const [billList,setBillList]=useState([]);
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
    // 备注
    const [remark,setRemark]=useState('');
    // 单号id
    const [uid,setUid]=useState(0);
    const [bxId,setBxId]=useState(0);
    const [imgUrl,setImgUrl]=useState('');
    const [supplierId,setSupplierId]=useState(0);
    const [caigou, setCaigou] = useState<any[]>([]);

    useEffect(()=>{
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        getOneInfo(id);
    },[]);
    const getOneInfo=(id:any)=>{
        NewFinancialDataService.one(id).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                console.log('详情',res);
                setGoodsList(res.Data.fdList);
                setUid(res.Data.id);
                setAccountId(res.Data.accountId);
                setOrderDate(res.Data.orderDate);
                setMoneyType(res.Data.moneyType);
                setCompanyId(res.Data.companyId);
                setProjectId(res.Data.projectId);
                getAccountListInfo(res.Data.projectId);
                setOrderCode(res.Data.number);
                setTotalAmount(res.Data.totalAmount);
                setPaidAmount(res.Data.paidAmount);
                setRemark(res.Data.remark);
                setSupplierId(res.Data.supplierId);
                setImgUrl(res.Data.foImage);
            }else {
                message.error(res.Data);
            }
        })
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
            setAccountType(res.Data.account_type);
        })
    };
    // 项目id
    const changeProjectId=(e)=>{
        setProjectId(e);
    };
    // 获取公司列表
    const getCompanList=()=>{
        props.dispatch({
            type:'Compan/fetch',
        })
    };
    // 获取项目列表
    const getProjectList=()=>{
        props.dispatch({
            type:'Project/fetch',
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
    // 获取供应商列表
    const getSupplierList=()=>{
        props.dispatch({
            type:"Supplier/fetch",
        })
    };
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
                console.log('查看列表',res);
                setBillList(res.Data.data);
            }else {

            }
        })
    }
    useEffect(() => {
        getCompanList();
        getProjectList();
        getAccountList();
        getSubjectList();
        getBillInfo();
        getSupplierList();
    }, []);
    const onOK=()=>{
        if (!orderDate) return  message.error('请选择日期');
        if (!accountId) return  message.error('请选择账户');
        if (!companyId) return  message.error('请选择公司');
        if (!projectId) return  message.error('请选择项目');
        // if (moneyType==2&&!supplierId) return  message.error('请选择供应商');
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
            type:'NewFinancialData/edit',
            payload:{uid,orderCode, orderDate, accountId, projectId,companyId, paidAmount, totalAmount, moneyType,remark, jsonData,supplierId,bxId,imgUrl}
        }).then((res:any)=>{
            if (res.ErrorCode == 0) {
                message.success('编辑成功');
                history.push('/enter/financialData');
                setSpinning(false);
            } else {
                message.error(res.ErrorCode + res.Data);
                setSpinning(false);
            }
        })
    };

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
            // image:[], // 图片
        }));

        // 添加到现有列表
        setGoodsList(prevGoodsList => [...prevGoodsList, ...newRecords]);
    };
    useEffect(() => {
        // 仅当现有记录不足7条时才补充生成
        const neededCount = 7 - goodsList.length;
        if (neededCount > 0) {
            generateMultipleRecords(neededCount);
        }
    }, [goodsList]);
    const changeBillId=(e)=>{
        const result = billList.find(item => item.id === e);
        console.log('报销单详情',result);
        setGoodsList(result.fdList);
        setCompanyId(result.companyId);
        setProjectId(result.projectId);
        getAccountListInfo(result.projectId);
        setRemark(result.remark);
        setSupplierId(result.supplierId);
        setBxId(result.id);
        setProhibit(true);
        setImgUrl(result.foImage);
    };
    const getAccountListInfo=(e)=>{
        props.dispatch({
            type:'Account/projectOrAccount',
            payload:e,
        })
    };
    const changeSupplierId=(e)=>{
        setSupplierId(e);
    };
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
    const handleQuantityChange = (id: number, value: number) => {
        setGoodsList(prev =>
            prev.map(item =>
                item.id === id ? { ...item, quantity: value,amount:((value*item.unitPrice).toFixed(2) *1) } : item
            )
        );
    };
    return(
        <Spin spinning={spinning}>
            <div style={{ paddingBottom: 80 }}>
                <PageLayout
                    title="编辑财务单"
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
                                        <DatePicker placeholder={'请选择日期'} value={dayjs(orderDate)} onChange={changeData} />
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
                        <List header="财务明细">
                            <div style={{  height: '100%', overflowY: 'auto', boxSizing: 'border-box',backgroundColor:'#F0F0F0' }}>
                                {(goodsList || []).map((item, index) => (
                                    <List
                                        key={item.id || index}
                                        style={{
                                            borderRadius: '6px',
                                            padding: '10px',
                                            marginBottom: '10px',
                                        }}
                                    >
                                        <List.Item>
                                            <Button
                                                type="text"
                                                onClick={() => handleClearRow(item.id)}
                                            >
                                                <ClearOutlined/>
                                            </Button>
                                        </List.Item>
                                        {/* 下拉科目 */}
                                        <List.Item
                                            style={{margin:'10px',borderRadius:'10px'}}
                                            extra={
                                                <Select
                                                    style={{ width: '200px' }}
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
                                            }
                                        >
                                            科目
                                        </List.Item>
                                        <List.Item
                                            style={{margin:'10px',borderRadius:'10px'}}
                                            extra={
                                                <Input
                                                    disabled
                                                    value={item.subjectName}
                                                    style={{ width: '100%' }}
                                                />
                                            }
                                        >
                                            科目
                                        </List.Item>
                                        {/* 用途 */}
                                        <List.Item
                                            style={{margin:'10px',borderRadius:'10px'}}
                                            extra={
                                                <Input.TextArea
                                                    value={item.summary}
                                                    onChange={(e) => handleSummaryChange(item.id, e.target.value)}
                                                    style={{ width: '100%' }}
                                                />
                                            }
                                        >
                                            摘要
                                        </List.Item>
                                        {/* 数量  */}
                                        <List.Item
                                            style={{margin:'10px',borderRadius:'10px'}}
                                            extra={
                                                <InputNumber
                                                    value={item.quantity}
                                                    min={0}
                                                    style={{ width: '100%' }}
                                                    onChange={(value) => handleQuantityChange(item.id, value)}
                                                />
                                            }
                                        >
                                            数量
                                        </List.Item>
                                        {/* 单位  */}
                                        <List.Item
                                            style={{margin:'10px',borderRadius:'10px'}}
                                            extra={
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
                                            }
                                        >
                                            单位
                                        </List.Item>
                                        {/* 单价 */}
                                        <List.Item
                                            style={{margin:'10px',borderRadius:'10px'}}
                                            extra={
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
                                            }
                                        >
                                            单价
                                        </List.Item>
                                        {/*金额*/}
                                        <List.Item
                                            style={{margin:'10px',borderRadius:'10px'}}
                                            extra={
                                                <InputNumber
                                                    value={item.amount}
                                                    min={0}
                                                    style={{ width: '100%' }}
                                                    onChange={(value) => {
                                                        setGoodsList(prev =>
                                                            prev.map(record =>
                                                                record.id === item.id
                                                                    ? {
                                                                        ...record,
                                                                        amount: value,
                                                                    }
                                                                    : record
                                                            )
                                                        );
                                                    }}
                                                />
                                            }
                                        >
                                            金额
                                        </List.Item>
                                    </List>
                                ))}
                            </div>
                        </List>

                    </div>

                    {/* 底部 */}
                    <div
                        style={{
                            position: "fixed",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            background: "#fff",
                            borderTop: "1px solid #eee",
                            padding: 12
                        }}
                    >
                        <div style={{ marginBottom: 6 }}>
                            总金额：¥{totalAmount}
                        </div>

                        <Button
                            block
                            type="primary"
                            size="large"
                            onClick={onOK}
                        >
                            编辑
                        </Button>
                    </div>
                </PageLayout>
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
        SupplierList: state.Supplier.list,

    }
};
export default connect(mapStateToProps)(EditNewFinancialData);
