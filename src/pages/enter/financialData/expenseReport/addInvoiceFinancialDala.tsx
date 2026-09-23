import { useEffect, useState } from "react";
import { connect, useNavigate } from "umi";
import { List, Button, Toast, TextArea } from "antd-mobile";
import { Image, DatePicker, Select, Spin, InputNumber, Input, message, Space } from "antd";
import dayjs from "dayjs";
import {generate, getCurrentDate, getImgSrc, numberToRMB} from "@/utils/OpenTool";
import { StaticInfo } from "@/StaticInfo";
import ImageUploadPng from "@/components/ImageUploadPng";
import * as ProjectService from "@/services/project";
import PageLayout from "@/components/PageLayout ";
import { ClearOutlined, CloseOutlined, PlusOutlined } from "@ant-design/icons";

// 缓存唯一key
const STORAGE_KEY = "invoice_financial_temp";

// 读取缓存公共方法
const getCacheData = () => {
    const cacheStr = sessionStorage.getItem(STORAGE_KEY);
    if (!cacheStr) return null;
    try {
        return JSON.parse(cacheStr);
    } catch (err) {
        sessionStorage.removeItem(STORAGE_KEY);
        return null;
    }
};

// 写入缓存公共方法
const setCacheData = (data: Record<string, any>) => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

const AddInvoiceFinancialDala = (props: any) => {
    const navigate = useNavigate();
    const [orderCode, setOrderCode] = useState("");
    const [orderDate, setOrderDate] = useState(getCurrentDate());
    const [companyId, setCompanyId] = useState<number | 0>(0);
    const [projectId, setProjectId] = useState<number | 0>(0);
    const [supplierId, setSupplierId] = useState<number | 0>(0);
    const [remark, setRemark] = useState("");
    const [goodsList, setGoodsList] = useState<any[]>([]);
    const [imgList, setImgList] = useState<string[]>([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [accountId, setAccountId] = useState(0);
    const [paidAmount, setPaidAmount] = useState(0);
    const [moneyType, setMoneyType] = useState(3);
    const [spinning, setSpinning] = useState(false);
    const [caigou, setCaigou] = useState<any[]>([]);

    // ===================== 初始化：读取缓存回填表单 =====================
    useEffect(() => {
        const cache = getCacheData();
        // 首次进入无缓存则生成单号
        if (!cache) {
            const code = generate(StaticInfo.park_name);
            setOrderCode(code);
        } else {
            // 有缓存，回填所有状态
            setOrderCode(generate(StaticInfo.park_name));
            setOrderDate(cache.orderDate || getCurrentDate());
            setCompanyId(cache.companyId ?? 0);
            setProjectId(cache.projectId ?? 0);
            setSupplierId(cache.supplierId ?? 0);
            setRemark(cache.remark || "");
            setGoodsList(Array.isArray(cache.goodsList) ? cache.goodsList : []);
            setImgList(Array.isArray(cache.imgList) ? cache.imgList : []);
            setAccountId(cache.accountId ?? 0);
            setPaidAmount(cache.paidAmount ?? 0);
            setMoneyType(cache.moneyType ?? 3);
        }

        // 加载下拉数据源
        getCompanList();
        getProjectList(cache?.companyId ?? 0);
        getSupplierList();
        getSubjectList();
    }, []);

    // ===================== 任意表单变更自动写入缓存 =====================
    useEffect(() => {
        const cacheObj = {
            orderCode,
            orderDate,
            companyId,
            projectId,
            supplierId,
            remark,
            goodsList,
            imgList,
            accountId,
            paidAmount,
            moneyType,
        };
        setCacheData(cacheObj);
    }, [
        orderCode, orderDate, companyId, projectId, supplierId, remark,
        goodsList, imgList, accountId, paidAmount, moneyType
    ]);

    // 获取公司列表
    const getCompanList = () => {
        props.dispatch({
            type: 'Compan/fetch',
        })
    };
    const getSupplierList = () => {
        props.dispatch({
            type: "Supplier/fetch",
        })
    };
    // 获取科目列表
    const getSubjectList = () => {
        props.dispatch({
            type: 'Subject/fetch',
        })
    };
    // 计算总金额
    useEffect(() => {
        const sum = goodsList.reduce(
            (acc, item) => acc + Number(item.amount || 0),
            0
        );
        setTotalAmount(Number(sum.toFixed(2)));
    }, [goodsList]);

    const onImageUpload = (img: string) => {
        setImgList((prev) => [...prev, img]);
    };
    // 清空缓存（提交成功调用）
    const clearCacheData = () => {
        sessionStorage.removeItem(STORAGE_KEY);
        setOrderCode(generate(StaticInfo.park_name));
        setOrderDate(getCurrentDate());
        setCompanyId(0);
        setProjectId(0);
        setSupplierId(0);
        setRemark("");
        setGoodsList([]);
        setImgList([]);
        setTotalAmount(0);
        setAccountId(0);
        setPaidAmount(0);
        setMoneyType(3);
        message.success("已清空所有表单数据");
    };
    const submit = (status: number) => {
        if (!orderDate) return message.error('请选择日期');
        // if (!accountId) return  message.error('请选择账户');
        if (!companyId) return message.error('请选择公司');
        if (!projectId) return message.error('请选择项目');
        if (!supplierId) return message.error('请选择供应商');
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
        let imgUrl = imgList.join("|");
        setSpinning(true);
        props.dispatch({
            type: 'Bill/add',
            payload: { orderCode, orderDate, accountId, projectId, companyId, paidAmount, totalAmount, moneyType, jsonData, remark, supplierId, imgUrl, bxId: 0, status }
        }).then((res: any) => {
            setSpinning(false);
            if (res.ErrorCode === 0) {
                Toast.show(status === 100 ? "保存成功" : "提审成功");
                clearCacheData();
                navigate(-1);
            } else {
                Toast.show(res.Data);
            }
        });
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
            quantity: 0, // 数量
            unit: '', // 单位
            unitPrice: 0, // 单价
            // image:[], // 图片
        }));

        // 添加到现有列表
        setGoodsList(prevGoodsList => [...prevGoodsList, ...newRecords]);
    };
    // 公司id
    const changeCompanyId = (e) => {
        setCompanyId(e);
        setProjectId(0);
        getProjectList(e);
    };
    // 获取项目列表
    const getProjectList = (e) => {
        props.dispatch({
            type: 'Project/fetch',
            payload: { name: '', companyId: e, pageSize: 1000 }
        })
    };
    // 选择科目
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
    const changeData = (_, item) => {
        setOrderDate(item);
    };
    // 项目id
    const changeProjectId = (e) => {
        setProjectId(e);
        ProjectService.one(e).then((res: any) => {
            setCompanyId(res.Data.company_id);
        })
    };
    //选择供应商id
    const changePSupplierd = (e) => {
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
                item.id === id ? { ...item, quantity: value, amount: ((value * item.unitPrice).toFixed(2) * 1) } : item
            )
        );
    };
    const handleClearRow = (id: number) => {
        setGoodsList(prev => prev.filter(item => item.id !== id));
    };

    return (
        <Spin spinning={spinning}>
            <div style={{ paddingBottom: 80, backgroundColor: '#F0F0F0' }}>
                <PageLayout
                    title="新增报销单"
                    onBack={() => navigate(-1)}
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
                                    style={{ margin: '10px 0', borderRadius: '10px' }}
                                    extra={
                                        <span>{orderCode}</span>
                                    }
                                >
                                    单号
                                </List.Item>
                                {/* 日期 */}
                                <List.Item
                                    style={{ margin: '10px 0', borderRadius: '10px' }}
                                    extra={
                                        <DatePicker
                                            placeholder="请选择日期"
                                            value={dayjs(orderDate)}
                                            onChange={changeData}
                                            style={{ '--text-align': 'right', width: '200px' }}
                                        />
                                    }
                                >
                                    日期
                                </List.Item>
                                <List.Item
                                    style={{ margin: '10px 0', borderRadius: '10px' }}
                                    extra={
                                        <Input
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
                                    style={{ margin: '10px 0', borderRadius: '10px' }}
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
                                    style={{ margin: '10px 0', borderRadius: '10px' }}
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
                                    style={{ margin: '10px 0', borderRadius: '10px' }}
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
                                    <TextArea placeholder="备注" style={{ width: '100%' }} value={remark} onChange={(e) => setRemark(e)} />
                                </List.Item>
                            </div>
                        </List>
                        <div style={{ padding: 10 }}>
                            <ImageUploadPng onImageUpload={onImageUpload} />
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '10px' }}>
                            {imgList.length > 0 ? (
                                <Space style={{ marginLeft: '20px' }} wrap>
                                    {/* 预览组：点击任意图片 → 弹出大图轮播 */}
                                    <Image.PreviewGroup>
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
                                    </Image.PreviewGroup>
                                </Space>
                            ) : (
                                <div style={{ marginLeft: '20px', color: '#999' }}>暂无图片</div>
                            )}
                        </div>
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
                            // style={{ width: "100px" }}
                            block
                            color="primary"
                            onClick={()=>clearCacheData()}
                        >
                            清除
                        </Button>
                        <Button
                            // style={{ width: "100px" }}
                            block
                            color="primary"
                            onClick={() => submit(100)}
                        >
                            保存
                        </Button>
                        <Button
                            // style={{ width: "100px" }}
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
    CompanList: state.Compan.list,
    ProjectList: state.Project.list,
    SupplierList: state.Supplier.list
});

export default connect(mapStateToProps)(AddInvoiceFinancialDala);