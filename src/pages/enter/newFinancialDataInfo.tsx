import {Button, DatePicker, Input, InputNumber, message, Radio, Select, Space, Spin, Table} from "antd";
import {useEffect, useState} from "react";
import {connect,history,useNavigate} from "umi";
import dayjs from "dayjs";
import * as NewFinancialDataService from "@/services/newFinancialData";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import PageLayout from "@/components/PageLayout ";
import {List, TextArea} from "antd-mobile";

const NewFinancialDataInfo=(props:any)=>{
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
    // 公司
    const [company_name,setCompanyName]=useState('');
    // 账户id
    const [accountId,setAccountId]=useState(0);
    // 项目
    const [project_name,setProjectName]=useState('');
    // 收入支出类型
    const [moneyType,setMoneyType]=useState(1);
    // 备注
    const [remark,setRemark]=useState('');
    // 单号id
    const [uid,setUid]=useState(0);
    const [bxId,setBxId]=useState(0);
    const [imgUrl,setImgUrl]=useState('');
    const [supplierName,setSupplierName]=useState('');
    useEffect(()=>{
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        getOneInfo(id);
        getAccountListInfo();
    },[]);
    const getOneInfo=(id:any)=>{
        NewFinancialDataService.one(id).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                console.log('详情',res)
                setGoodsList(res.Data.fdList);
                setUid(res.Data.id);
                setAccountId(res.Data.accountId);
                setOrderDate(res.Data.orderDate);
                setMoneyType(res.Data.moneyType);
                setCompanyName(res.Data.company_name);
                setProjectName(res.Data.project_name);
                setOrderCode(res.Data.number);
                setTotalAmount(res.Data.totalAmount);
                setPaidAmount(res.Data.paidAmount);
                setRemark(res.Data.remark);
                setSupplierName(res.Data.supplierName);
            }else {
                message.error(res.Data);
            }
        })
    };
    const getAccountListInfo=()=>{
        props.dispatch({
            type:'Account/fetch',
        })
    };
    return(
        <Spin spinning={spinning}>
            <div style={{ paddingBottom: 80 }}>
                <PageLayout
                    title="财务单详情"
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
                                        <DatePicker placeholder={'请选择日期'} value={dayjs(orderDate)} />
                                    }
                                >
                                    日期
                                </List.Item>
                            </div>
                            {/* 公司 */}
                            <div style={{ marginBottom: '8px', background: '#f7f8fa', borderRadius: '8px', padding: '0 12px' }}>
                                <List.Item
                                    extra={
                                        <Input value={company_name}/>
                                    }
                                >
                                    公司
                                </List.Item>
                            </div>
                            {/* 项目 */}
                            <div style={{ marginBottom: '8px', background: '#f7f8fa', borderRadius: '8px', padding: '0 12px' }}>
                                <List.Item
                                    extra={
                                        <Input value={project_name}/>
                                    }
                                >
                                    项目
                                </List.Item>
                            </div>
                            {/* 账户 */}
                            <div style={{ marginBottom: '8px', background: '#f7f8fa', borderRadius: '8px', padding: '0 12px' }}>
                                <List.Item
                                    extra={
                                        <Select
                                            style={{width:'200px'}}
                                            showSearch
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
                                        <Input value={supplierName}/>
                                    }
                                >
                                    供应商
                                </List.Item>
                            </div>
                            {/* 收入支出 */}
                            <div style={{ marginBottom: '8px', background: '#f7f8fa', borderRadius: '8px', padding: '0 12px' }}>
                                <List.Item
                                    extra={
                                        <Radio.Group value={moneyType} >
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
                            <div style={{ padding: '10px', height: '100%', overflowY: 'auto', boxSizing: 'border-box' }}>
                                {/* 安全渲染：防止 goodsList 为 undefined */}
                                {(goodsList || []).map((item, index) => (
                                    <div
                                        key={item.id || index}
                                        style={{
                                            border: '1px solid #4d85ff',
                                            borderRadius: '6px',
                                            padding: '10px',
                                            marginBottom: '10px',
                                        }}
                                    >
                                        {/* 下拉科目 */}
                                        <div style={{ marginBottom: '8px' }}>
                                            <Select
                                                disabled={prohibit}
                                                style={{ width: '100%' }}
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

                                        {/* 明细科目 */}
                                        <div style={{ marginBottom: '8px' }}>
                                            <div style={{ fontSize: '12px', color: '#4d85ff', marginBottom: '4px' }}>明细科目</div>
                                            <Input value={item.subjectName} disabled={prohibit} style={{ width: '100%' }} />
                                        </div>

                                        {/* 摘要 */}
                                        <div style={{ marginBottom: '8px' }}>
                                            <div style={{ fontSize: '12px', color: '#4d85ff', marginBottom: '4px' }}>摘要</div>
                                            <TextArea
                                                value={item.summary}
                                                style={{ width: '100%' }}
                                                disabled={prohibit}
                                            />
                                        </div>

                                        {/* 数量 + 单位 */}
                                        <div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontSize: '12px', color: '#4d85ff', marginBottom: '4px' }}>数量</div>
                                                <InputNumber
                                                    value={item.quantity}
                                                    min={0}
                                                    style={{ width: '100%' }}
                                                    disabled={prohibit}
                                                />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontSize: '12px', color: '#4d85ff', marginBottom: '4px' }}>单位</div>
                                                <Input
                                                    value={item.unit}
                                                    style={{ width: '100%' }}
                                                    disabled={prohibit}
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
                                        </div>
                                        {/* 单价 + 金额 */}
                                        <div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontSize: '12px', color: '#4d85ff', marginBottom: '4px' }}>单价</div>
                                                <InputNumber
                                                    value={item.unitPrice}
                                                    min={0}
                                                    disabled={prohibit}
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
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontSize: '12px', color: '#4d85ff', marginBottom: '4px' }}>金额</div>
                                                <InputNumber
                                                    value={item.amount}
                                                    min={0}
                                                    disabled={prohibit}
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
                                            </div>
                                        </div>
                                    </div>
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
export default connect(mapStateToProps)(NewFinancialDataInfo);
