import { useEffect, useState } from "react";
import { connect, useNavigate,history } from "umi";
import {
    List,
    Button,
    Space,
    Card,
    Toast,
    Picker, TextArea
} from "antd-mobile";
import {Image, DatePicker, Select, Spin, InputNumber, message, Input, Modal} from "antd";
import dayjs from "dayjs";
import ImageUploadPng from "@/components/ImageUploadPng";
import * as ProjectService from "@/services/project";
import * as NewFinancialDataService from "@/services/newFinancialData";
import PageLayout from "@/components/PageLayout ";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {ClearOutlined, CloseOutlined, PlusOutlined} from "@ant-design/icons";
import {getImgSrc} from "@/utils/OpenTool";

const EditInvoiceFinancialDalaInfo = (props: any) => {
    const [spinning, setSpinning] = useState(false);
    const navigate=useNavigate();
    // 账单日期
    const [orderDate,setOrderDate]=useState('2002-01-01');
    const [uid,setUid]=useState(0);
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
    const [moneyType,setMoneyType]=useState(3);
    // 供应商id
    const [supplierId,setSupplierId]=useState(0);
    // 备注
    const [remark,setRemark]=useState('');
    // 图片列表
    const [imgList,setImgList]=useState([]);
    const [bxId,setBxId]=useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [orderStatus, setoOrderStatus] = useState(0);
    const [caigou, setCaigou] = useState<any[]>([]);
    const [pdfFileName, setPdfFileName] = useState([]);


    useEffect(() => {
        getCompanList();
        getProjectList(0);
        getSupplierList();
        getSubjectList();
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        const orderStatus = searchParams.get('orderStatus');
        setoOrderStatus(Number(orderStatus));
        getOneInfo(id)
    }, []);
    const getOneInfo=(id:any)=>{
        NewFinancialDataService.one(id).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                console.log('Yms!1234',res)
                setGoodsList(res.Data.fdList);
                setUid(res.Data.id);
                setAccountId(res.Data.accountId);
                setOrderDate(res.Data.orderDate);
                setMoneyType(res.Data.moneyType);
                setCompanyId(res.Data.companyId);
                setProjectId(res.Data.projectId);
                setOrderCode(res.Data.number);
                setTotalAmount(res.Data.totalAmount);
                setPaidAmount(res.Data.paidAmount);
                setRemark(res.Data.remark);
                setSupplierId(res.Data.supplierId);
                setBxId(res.Data.bxId);
                setImgList(res.Data.foImage.split("|"));
            }else {
                message.error(res.Data);
            }
        })
    };
    // 获取公司列表
    const getCompanList=()=>{
        props.dispatch({
            type:'Compan/fetch',
        })
    };
    const getSupplierList=()=>{
        props.dispatch({
            type:"Supplier/fetch",
        })
    };
    // 获取科目列表
    const getSubjectList=()=>{
        props.dispatch({
            type:'Subject/fetch',
        })
    };
    useEffect(() => {
        const sum = goodsList.reduce(
            (acc, item) => acc + Number(item.amount || 0),
            0
        );
        setTotalAmount(sum);
    }, [goodsList]);
    const onImageUpload = (img: string) => {
        setImgList((prev) => [...prev, img]);
    };

    const submit = () => {
        if (!companyId) return Toast.show("请选择公司");
        if (!projectId) return Toast.show("请选择项目");
        if (goodsList.length === 0) return Toast.show("请填写报销明细");
        if (!supplierId) return  Toast.show('请选择供应商');
        const processedList = goodsList.map(item => ({
            ...item,
            unitPrice: !isNaN(Number(item.unitPrice)) ? Number(item.unitPrice) : 0,
            quantity: !isNaN(Number(item.quantity)) ? Number(item.quantity) : 0,
        }));

        const filteredGoodsList = processedList.filter(item =>
             item.amount > 0
        );
        if (filteredGoodsList.length === 0) return message.error('报销明细科目不能为空,金额不能为0,请检查!');
        const jsonfd = JSON.stringify(filteredGoodsList);
        const mapCaigou = caigou.map(item => ({ ...item, poId: item.id || 0, number: item.orderCode || '' }));
        const jsonCaigou = JSON.stringify(mapCaigou);
        const jsonData = JSON.stringify({ fd: jsonfd, caigou: jsonCaigou  });
        let imgUrl=imgList.join("|");
        setSpinning(true);
        props.dispatch({
            type:'Bill/edit',
            payload:{uid,orderCode, orderDate, bxId,accountId,projectId, companyId, paidAmount, totalAmount, moneyType, jsonData,remark,supplierId,imgUrl}
        }).then((res: any) => {
            if (res.ErrorCode === 0) {
                Toast.show("提交成功");
                navigate(-1);
            } else {
                Toast.show(res.Data);
            }
            setSpinning(false);
        });
    };
    // 公司id
    const changeCompanyId=(e)=>{
        setCompanyId(e);
        setProjectId(0);
        getProjectList(e);
    };
    // 获取项目列表
    const getProjectList=(e)=>{
        props.dispatch({
            type:'Project/fetch',
            payload:{name:'', companyId:e, pageSize:1000}
        })
    };
    const handleSubjectChange = (id: number, value: string, label: string) => {
        setGoodsList(prev =>
            prev.map(item =>
                item.id === id
                    ? {
                        ...item,
                        subjectName: label
                    }
                    : item
            )
        );
    };
    // 日期选择
    const changeData=(_,item)=>{
        setOrderDate(item)
    };
    // 项目id
    const changeProjectId=(e)=>{
        setProjectId(e);
        ProjectService.one(e).then((res:any)=>{
            setCompanyId(res.Data.company_id);
        })
    };
    //选择供应商id
    const changePSupplierd=(e)=>{
        setSupplierId(e);
    };
    const handleDeleteunitImg = (index: number) => {
        setImgList((prev: any[]) =>
            prev.filter((_, i) => i !== index)
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
    // 处理数量变更
    const handleQuantityChange = (id: number, value: number) => {
        setGoodsList(prev =>
            prev.map(item =>
                item.id === id ? { ...item, quantity: value,amount:((value*item.unitPrice).toFixed(2) *1) } : item
            )
        );
    };
    const generateMultipleRecords = (count: number) => {
        // 最多添加7条
        const maxCount = 7;
        const canAdd = maxCount - goodsList.length;
        if (canAdd <= 0) {
            message.warning('最多只能添加7条明细');
            return;
        }
        const actualCount = Math.min(count, canAdd);

        // 计算起始ID（当前最大ID + 1，若为空则从1开始）
        const maxId = goodsList.length > 0
            ? Math.max(...goodsList.map(item => item.id))
            : 0;

        // 生成指定数量的新记录
        const newRecords = Array.from({ length: actualCount }, (_, i) => ({
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
                        // image:[], // 图片
                    }
                    : item
            )
        );
    };
    // 删除弹出
    const deleteItem=()=>{
        setIsOpen(true);
    };
    // 删除确定按钮
    const onOK=()=>{
        setSpinning(true);
        props.dispatch({
            type:'Bill/remove',
            payload:uid
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode == 0||res.ErrorCode == 9038) {
                message.success('删除成功');
                setSpinning(false);
                setIsOpen(false);
                navigate(-1);
            }else {
                message.error(res.ErrorCode + res.Data);
                setSpinning(false);
            }
        })
    };
    return (
        <Spin spinning={spinning}>
            <div style={{ paddingBottom: 80 }}>
                <PageLayout
                    title="报销单详情"
                    onBack={()=>navigate(-1)}
                >
                    <div
                        style={{
                            maxHeight: '80vh',
                            overflowY: 'auto',
                            overflowX: 'hidden',
                            boxSizing: 'border-box',
                        }}
                    >
                        {/* 基础信息 */}
                        <List header="基础信息">
                            <div style={{
                                backgroundColor: '#F0F0F0',
                            }}>
                                {/* 单号 */}
                                <List.Item
                                    style={{margin:'10px 0',borderRadius:'10px'}}
                                    extra={
                                        <span>{orderCode}</span>
                                    }
                                >
                                    单号
                                </List.Item>
                                {/* 日期 */}
                                <List.Item
                                    style={{margin:'10px 0',borderRadius:'10px'}}
                                    extra={
                                        <DatePicker
                                            placeholder="请选择日期"
                                            value={dayjs(orderDate)}
                                            style={{ '--text-align': 'right',width: '200px'  }}
                                        />
                                    }
                                >
                                    日期
                                </List.Item>
                                <List.Item
                                    style={{margin:'10px 0',borderRadius:'10px'}}
                                    extra={
                                        <InputNumber
                                            placeholder="0"
                                            style={{ '--text-align': 'right', width: '200px' }}
                                            value={totalAmount}
                                            disabled
                                        />
                                    }
                                >
                                    总金额
                                </List.Item>
                                {/* 公司 */}
                                <List.Item
                                    style={{margin:'10px 0',borderRadius:'10px'}}
                                    extra={
                                        <Select
                                            style={{ width: '200px' }}
                                            showSearch
                                            value={companyId}
                                            onChange={changeCompanyId}
                                            placeholder='公司'
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
                                {/* 项目 */}
                                <List.Item
                                    style={{margin:'10px 0',borderRadius:'10px'}}
                                    extra={
                                        <Select
                                            style={{ width: '200px' }}
                                            showSearch
                                            value={projectId}
                                            onChange={changeProjectId}
                                            placeholder='项目'
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
                                {/* 供应商 */}
                                <List.Item
                                    style={{margin:'10px 0',borderRadius:'10px'}}
                                    extra={
                                        <Select
                                            style={{ width: '200px' }}
                                            showSearch
                                            onChange={changePSupplierd}
                                            placeholder='供应商'
                                            value={supplierId}
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
                                {/* 备注 */}
                                <List.Item>
                                    <TextArea placeholder="备注" style={{ width: '100%' }} value={remark} onChange={(e)=>setRemark(e)} />
                                </List.Item>
                            </div>
                        </List>
                        {/* 图片 */}
                        <div style={{ padding: 10 }}>
                            <ImageUploadPng onImageUpload={onImageUpload}/>
                        </div>
                        <div style={{display:'flex',flexWrap:'wrap',marginTop:'10px'}}>
                           {imgList.length > 0 ? (
                               <Space style={{ marginLeft: '20px' }} wrap>
                                   {/* 预览组：点击任意图片 → 弹出大图轮播 */}
                                   <Image.PreviewGroup>
                                       {imgList.map((item: any, index: number) => {
                                           // 内部调用拼接方法
                                           const imgUrl = getImgSrc(item);
                                           return (
                                               <div
                                                   key={index}
                                                   style={{
                                                       display: 'inline-block',
                                                       position: 'relative',
                                                       margin: '5px',
                                                   }}
                                               >
                                                   {/* 小图（点击放大预览） */}
                                                   <Image
                                                       width={50}
                                                       height={50}
                                                       style={{ objectFit: 'cover' }}
                                                       src={imgUrl}
                                                       preview={{
                                                           toolbarRender: (_, { onClose }) => (
                                                               <Button
                                                                   danger
                                                                   size="small"
                                                                   onClick={() => {
                                                                       handleDeleteunitImg(index); // 删除
                                                                       onClose(); // 删除后关闭预览
                                                                   }}
                                                               >
                                                                   删除此图
                                                               </Button>
                                                           ),
                                                       }}
                                                   />

                                                   {/* 小图右上角删除按钮 */}
                                                   <Button
                                                       danger
                                                       type="primary"
                                                       size="small"
                                                       onClick={() => handleDeleteunitImg(index)}
                                                       style={{
                                                           position: 'absolute',
                                                           top: 0,
                                                           right: 0,
                                                           zIndex: 1,
                                                           padding: '0 4px',
                                                           fontSize: '10px',
                                                       }}
                                                   >
                                                       ×
                                                   </Button>
                                               </div>
                                           );
                                       })}
                                   </Image.PreviewGroup>
                               </Space>
                           ) : ''}
                        </div>
                        {/* 明细 */}
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
                                <div style={{ width: '1050px', minWidth: '1050px' }}>
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
                                                <div style={{ width: '150px',flexShrink: 0 }}>
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
                                                {/* 科目 */}
                                                <div style={{ width: '150px',flexShrink: 0 }}>
                                                    <Input
                                                        // placeholder="科目"
                                                        value={item.subjectName}
                                                        style={{ width: '100%' }}
                                                        disabled
                                                        rows={1}
                                                    />
                                                </div>

                                                {/* 用途 */}
                                                <div style={{ width: '150px',  flexShrink: 0 }}>
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
                            <Button
                                onClick={() => generateMultipleRecords(1)}
                                disabled={goodsList.length >= 7}
                            >
                                <PlusOutlined />添加明细{goodsList.length >= 7 ? '(已达上限7条)' : ''}
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
                            display:'flex',
                            justifyContent:'space-between',
                            alignItems:'center'
                        }}
                    >
                        <div style={{ marginBottom: 6 }}>
                            总金额：¥{totalAmount}
                        </div>
                        {orderStatus == 15 ||orderStatus==100?<>
                            <Button
                                block
                                style={{width:"100px"}}
                                color="primary"
                                danger
                                onClick={deleteItem}
                            >
                                删除
                            </Button>
                            <Button
                                style={{width:"100px"}}
                                block
                                color="primary"
                                onClick={submit}
                            >
                                编辑
                            </Button>
                        </>:""}
                    </div>
                </PageLayout>
            </div>
            <Modal open={isOpen} onCancel={()=>setIsOpen(false)} onOk={onOK} loading={spinning}>
                <div>是否要删除？</div>
            </Modal>
        </Spin>
    );
};

const mapStateToProps = (state: any) => ({
    SubjectList: state.Subject.list,
    CompanList: state.Compan.list,
    ProjectList: state.Project.list,
    SupplierList: state.Supplier.list
});

export default connect(mapStateToProps)(EditInvoiceFinancialDalaInfo);
