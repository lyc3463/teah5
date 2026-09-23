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
import {Image, DatePicker, Select, Spin, InputNumber, message, Input, Modal, Form, Dropdown} from "antd";
import dayjs from "dayjs";
import ImageUploadPng from "@/components/ImageUploadPng";
import * as ProjectService from "@/services/project";
import * as NewFinancialDataService from "@/services/newFinancialData";
import PageLayout from "@/components/PageLayout ";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {ClearOutlined, CloseOutlined} from "@ant-design/icons";
import * as processConfiguration from "@/services/processConfiguration";
import {StaticInfo} from "@/StaticInfo";
import {getImgSrc} from "@/utils/OpenTool";
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
}
const InvoiceFinancialDalaInfo = (props: any) => {
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
    const [isCok,setIsCok]=useState(false);
    // 审核弹出
    const [checkOkVisibl,setCheckOkVisible]=useState(false);
    // 审核状态
    const [status,setStatus]=useState(0);
    // 当前订单状态
    const [orderStatus,setOrderStatus]=useState(0);
    // 终止弹窗
    const [terminateOpen,setTerminateOpen]=useState(false);
    // 终止描述
    const [terminateTxt,setTerminateTxt]=useState('');
    // 驳回描述
    const [rejectTxt,setRejectTxt]=useState('');
    // 驳回弹窗
    const [rejectOpen,setRejectOpen]=useState(false);

    useEffect(() => {
        getCompanList();
        getProjectList(0);
        getSupplierList();
        getSubjectList();
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        const orderStatus = Number(searchParams.get('orderStatus'));
        setOrderStatus(orderStatus);
        getOneInfo(id)
        getReviewer(orderStatus);
    }, []);
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
    // 获取项目列表
    const getProjectList=(e)=>{
        props.dispatch({
            type:'Project/fetch',
            payload:{name:'', companyId:e, pageSize:1000}
        })
    };
    const getReviewer=(e)=>{
        processConfiguration.one().then((res:TypeErrorCode)=>{
            updateStatusMap(res.Data);
            let isCok=checkAuditPermission(e,res.Data);
            console.log('isCok',isCok)
            setIsCok(isCok);
        })
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
    const handleUpdateStatus = ( status: number) => {
        const current = statusMap[orderStatus];
        setStatus(current.next);
        setCheckOkVisible(true);
    };
    // 审核按钮
    const onOK=()=>{
        setSpinning(true);
        props.dispatch({
            type:'Bill/check',
            payload:{uid,status}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode == 0||res.ErrorCode == 9038) {
                message.success('审核成功');
                setSpinning(false);
                setCheckOkVisible(false);
                navigate(-1);
            }else {
                message.error(res.ErrorCode + res.Data);
                setSpinning(false);
            }
        })
    };
    // 终止按钮
    const onTerminateOK=()=>{
        setSpinning(true);
        props.dispatch({
            type:'Bill/terminate',
            payload:{uid,terminateTxt}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode == 0||res.ErrorCode == 9038) {
                message.success('终止成功')
                setSpinning(false);
                setTerminateOpen(false);
                navigate(-1);
            }else {
                message.error(res.ErrorCode + res.Data);
                setSpinning(false);
            }
        })
    };
    // 驳回按钮
    const rejectOK=()=>{
        setSpinning(true);
        props.dispatch({
            type:'Bill/reject',
            payload:{uid,rejectTxt}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode == 0||res.ErrorCode == 9038) {
                message.success('驳回成功');
                setSpinning(false);
                setRejectOpen(false);
                navigate(-1);
            }else {
                message.error(res.ErrorCode + res.Data);
                setSpinning(false);
            }
        })
    };
    // 终止弹窗
    const handleTerminateStatus=()=>{
        setTerminateOpen(true);
    };
    // 驳回弹窗
    const handleReject=()=>{
        setRejectOpen(true);
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
                                            disabled
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
                                            disabled
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
                                    <TextArea placeholder="备注" style={{ width: '100%' }} value={remark}/>
                                </List.Item>
                            </div>
                        </List>
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
                                                    />
                                                </div>
                                            );
                                        })}
                                    </Image.PreviewGroup>
                                </Space>
                            ) : ''}
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
                                                {/* 科目 */}
                                                <div style={{ width: '150px',flexShrink: 0 }}>
                                                    <Select
                                                        style={{ width: '100%' }}
                                                        disabled
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
                                                        disabled
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
                                                        disabled
                                                    />
                                                </div>
                                                {/* 单位 */}
                                                <div style={{ width: '100px', textAlign: 'center', flexShrink: 0 }}>
                                                    <Input
                                                        value={item.unit}
                                                        style={{ width: '100%' }}
                                                        disabled
                                                    />
                                                </div>
                                                {/* 单价 */}
                                                <div style={{ width: '120px', textAlign: 'center', flexShrink: 0 }}>
                                                    <InputNumber
                                                        value={item.unitPrice}
                                                        min={0}
                                                        style={{ width: '100%' }}
                                                        disabled
                                                    />
                                                </div>
                                                {/* 金额 */}
                                                <div style={{ width: '120px', textAlign: 'center', flexShrink: 0 }}>
                                                    <InputNumber
                                                        value={item.amount}
                                                        min={0}
                                                        style={{ width: '100%' }}
                                                        disabled
                                                    />
                                                </div>
                                            </Space>
                                        ))}
                                    </div>
                                </div>
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
                        {
                            orderStatus!== 15 && [1,2,3,4,5,6,7,8,9,10,11].includes(orderStatus)?  <Button
                                style={{width:"100px"}}
                                block
                                color="primary"
                                onClick={()=>handleUpdateStatus(orderStatus)}
                            >
                                审核
                            </Button>:''
                        }
                        {
                            (orderStatus !== 15 && isCok) &&
                            ([1,2,3,4,5,6,7,8,9,10,11].includes(orderStatus) || ![12,13,14].includes(orderStatus))
                                ? (
                                    <Dropdown
                                        menu={{
                                            items: [
                                                ...(orderStatus !== 15 && isCok && [1,2,3,4,5,6,7,8,9,10,11].includes(orderStatus)
                                                    ? [{ label: '终止', key: 'terminate', style: { color: 'red' } }]
                                                    : []),
                                                ...(orderStatus !== 15 && isCok && ![12,13,14].includes(orderStatus)
                                                    ? [{ label: '驳回', key: 'reject' }]
                                                    : []),
                                            ],
                                            onClick: ({ key }) => {
                                                switch (key) {
                                                    case 'terminate':
                                                        handleTerminateStatus();
                                                        break;
                                                    case 'reject':
                                                        handleReject();
                                                        break;
                                                    default:
                                                        break;
                                                }
                                            },
                                        }}
                                    >
                                        <Button color="primary" style={{ width: "100px" }}>
                                            更多
                                        </Button>
                                    </Dropdown>
                                ) : null
                        }
                    </div>
                </PageLayout>
            </div>
            {/*审核流程*/}
            <Modal open={checkOkVisibl} onCancel={()=>setCheckOkVisible(false)} onOk={onOK} loading={spinning}>
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

const mapStateToProps = (state: any) => ({
    SubjectList: state.Subject.list,
    CompanList: state.Compan.list,
    ProjectList: state.Project.list,
    SupplierList: state.Supplier.list
});

export default connect(mapStateToProps)(InvoiceFinancialDalaInfo);
