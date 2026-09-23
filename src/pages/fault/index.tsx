import {useEffect, useState} from "react";
import {Button, Form, Input, InputNumber, List, message, Modal, Pagination, Select, Space, Tag} from "antd";
import {joinUnitNames} from "@/utils/OpenTool";
import {NavBar, Popup} from "antd-mobile";
import dayjs from "dayjs";
import {connect,history} from "umi";
import {StaticInfo} from "@/StaticInfo";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import PageLayout from "@/components/PageLayout ";
import DateRangePicker from "@/components/DateRangePickerProps";

const Fault = (props) => {
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    const [name,setname]=useState('');
    const [state,setstate]=useState(0);
    const [phone,setPhone]=useState('');
    const [openID,setopenID]=useState(0); // 租户id
    const [startDate,setstartDate]=useState('2000-01-01');
    const [endDate,setendDate]=useState('2099-01-01');
    const [loading, setLoading] = useState(false);
    const [isOpen,setIsOpen]=useState(false); // 分配弹窗
    const [acceptOrdersOpen,setAcceptOrdersOpen]=useState(false); // 自行接单弹窗
    const [uid,setUid]=useState(0); // 列表id
    const [step,setStep]=useState(0); // 步骤列表
    const [userID,setUserID]=useState(0); // 跟进人ID
    const [OnId,setOnId]=useState(0);// 修理成功的id
    const [onOpen,setOnOpen]=useState(false);// 修理成功的弹窗
    const [amount,setamount]=useState(0);// 修改金额
    const [repairType,setrepairType]=useState(0);// 账单类型
    const [dOpen,setDopen]=useState(false); // 删除报修
    const [rejectStatus,setRejectStatus]=useState(0);// 驳回状态 终止状态
    const [remark,setRemark]=useState('');// 驳回、终止描述
    const [rejectOpen,setRejectOpen]=useState(false);// 驳回弹窗
    const [filterOpen, setFilterOpen] = useState(false);

    const getList=()=>{
        props.dispatch({
            type:'Report/fetch',
            payload:{page,name,phone,state,openID,startDate,endDate,pageSize}
        })
    };

    // 确定分配跟进人按钮
    const onOk=()=>{
        if (!userID){
            message.error('请选择跟进人');
            return;
        }
        setLoading(true);
        props.dispatch({
            type:'Report/fenpei',
            payload:{OnId,userID}
        }).then((res:any)=>{
            if (res.ErrorCode==0||res.ErrorCode==9038){
                props.dispatch({
                    type:'Report/edit',
                    payload:{OnId,step:2,amount}
                })
                setLoading(false);
                message.success('分配成功');
                setIsOpen(false);
            }else {
                message.error(res.Data);
                setLoading(false);
                setIsOpen(false);
            }
        })
    }
    useEffect(() => {
        getUserList();
    }, []);
    useEffect(() => {
        getList();
    }, [page,pageSize]);
    const onChange=(e,pageSize)=>{
        setPage(e);
        setPageSize(pageSize);
    };
    // 选择跟进人
    const changeSelect=(e)=>{
        setUserID(e);
    };
    // 重新分配跟进人
    const onhandleEditUser=()=>{
        props.dispatch({
            type:'Report/fenpei',
            payload:{OnId,userID}
        }).then((res:any)=>{
            if (res.ErrorCode==0||res.ErrorCode==9038){
                message.success('更换成功');
            }else {
                message.error(res.Data);
            }
        })
    };
    const modifyAmount=()=>{
        return(
            <div style={{ padding: '16px' }}>
                {step==1?<>
                    <h2>分配跟进人</h2>
                    <Select
                        style={{width:'100%'}}
                        onChange={changeSelect}
                        showSearch
                        value={userID}
                        optionFilterProp="children"
                        filterOption={(input, option) => {
                            // 假设每个 option 都有一个与数据项对应的 value 属性
                            const item =props.UsersList.find(hetongID => hetongID.id == option?.value); // 您可能需要优化这个查找过程
                            return item?.user_name?.toLowerCase().includes(input.toLowerCase());
                        }}
                    >
                        {props.UsersList&&props.UsersList.length>0?props.UsersList.map((item:any,index:any)=>{
                            return(
                                <Select.Option value={item.id} key={index}>
                                    {item.user_name}
                                </Select.Option>
                            )
                        }):''}
                    </Select>
                    <Button onClick={onhandleEditUser} style={{width:'100%',marginTop:'16px'}} type='primary'>确定修改</Button>
                </>:null}
                {step==2? <>
                    <h2 style={{textAlign:'center'}}>修改金额</h2>
                    <InputNumber
                        disabled={repairType==1}
                        placeholder="请输入金额"
                        value={amount}
                        onChange={(e) => setamount(e)}
                        style={{ marginBottom: '16px',width:'100%'}}
                        prefix="¥"
                        type="number"
                        step="0.01"
                        precision={2}
                        min={0}
                    />
                    {/*<Button style={{width:'100%'}} type='primary' onClick={onhandleEditAmount}>确定</Button>*/}
                </>:null}
                {step==3? <>
                    <h2 style={{textAlign:'center'}}>物品采购</h2>
                </>:null}
                {step==4? <>
                    <h2 style={{textAlign:'center'}}>修理完成</h2>
                </>:null}
            </div>
        )
    };
    // 自行接单确认按钮
    const ordersOpenOnOk=()=>{
        setLoading(true);
        props.dispatch({
            type:'Report/fenpei',
            payload:{OnId,userID:StaticInfo.userId}
        }).then((res:any)=>{
            if (res.ErrorCode==0||res.ErrorCode==9038){
                setLoading(false);
                message.success('自行接单成功');
                setAcceptOrdersOpen(false);
                props.dispatch({
                    type:'Report/edit',
                    payload:{OnId,step:2,amount}
                })
            }else {
                message.error(res.Data);
                setAcceptOrdersOpen(false);
                setLoading(false);
            }
        })
    };
    const handlePrevious = () => {
        // 上一步逻辑：step减1
        setStep(prev => prev - 1);
    };
    const handleNext=()=>{
        props.dispatch({
            type:'Report/edit',
            payload:{OnId,step:step+1,amount}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setStep(prev => prev+1);
                // message.success('修改金额完成');
            }else {
                message.error(res.Data);
            }
        })
    };
    // 处理完成确定
    const onhandleOk=()=>{
        setLoading(true);
        props.dispatch({
            type:'Report/edit',
            payload:{OnId,step:5,amount}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setLoading(false);
                setOnOpen(false);
                message.success('处理完成');
            }else {
                setOnOpen(false);
                setLoading(false);
                message.error(res.Data);
            }
        })
    };
    // 修理完成弹窗
    const onokOpen=(e:any)=>{
        setOnId(e.id);
        setUserID(e.userId);
        setOnOpen(true);
        setStep(e.repair_status);
        setamount(e.repairMoney);
        setrepairType(e.repairType);
    };
    // 分配跟进人弹窗
    const genjin=(e)=>{
        setIsOpen(true);
        setOnId(e.id);
        setamount(e.repairMoney);
    };
    // 自行接单按钮
    const jiedan=(e)=>{
        setAcceptOrdersOpen(true);
        setOnId(e.id);
        setamount(e.repairMoney);
    };
    const getUserList=()=>{
        props.dispatch({
            type:"Users/fetch",
        })
    };
    const changeName=(e)=>{
        setname(e.target.value);
    };
    const changePhone=(e)=>{
        setPhone(e.target.value);
    };
    const sousuo=()=>{
        setPage(1);
        getList();
        // getcount();
    };
    const del=(e)=>{
        setUid(e.id);
        setDopen(true);
    };
    const delOk=()=>{
        setLoading(true);
        props.dispatch({
            type:'Report/remove',
            payload:uid
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('删除成功');
                setDopen(false);
                setLoading(false);
            }else {
                message.error(res.Data);
                setDopen(false);
                setLoading(false);
            }
        })
    }
    useEffect(() => {
    }, [step]);
    const editStutesOk=()=>{
        rejectOk();
    };
    const rejectOk=()=>{
        setLoading(true);
        try {
            props.dispatch({
                type:'Report/reject',
                payload:{uid,rejectStatus,remark}
            }).then((res:TypeErrorCode)=>{
                if (res.ErrorCode==0){
                    message.success('操作成功！');
                    getList();
                }
            })
        }catch (err){
            message.error(err);
        }finally {
            // 关闭弹窗
            setLoading(false);
            setRejectOpen(false);
        }
    };
    const changeDate=(start,end)=>{
        setstartDate(start);
        setendDate(end);
    };
    const changeState=(e)=>{
        setstate(e);
    };
    // 驳回弹窗
    const isReject=(e:any)=>{
        setUid(e.id);
        setRejectStatus(6);
        setRejectOpen(true);
    };
    // 终止
    const isTerminate=(e:any)=>{
        setUid(e.id);
        setRejectStatus(7);
        setRejectOpen(true);
    };
    return (
        <div>
            <PageLayout
                title="报修记录"
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
                        <DateRangePicker  onDateSelected={changeDate}/>

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
                        <div style={{ marginTop: 15 }}>状态</div>
                        <Select value={state} onChange={changeState}  style={{ width: 120 }}>
                            <Select.Option value={0}>
                                全部
                            </Select.Option>
                            <Select.Option value={1}>
                                待接单
                            </Select.Option>
                            <Select.Option value={2}>
                                上门查看
                            </Select.Option>
                            <Select.Option value={3}>
                                待确定
                            </Select.Option>
                            <Select.Option value={4}>
                                物品采购
                            </Select.Option>
                            <Select.Option value={5}>
                                修理完成
                            </Select.Option>
                            <Select.Option value={6}>
                                驳回
                            </Select.Option>
                            <Select.Option value={7}>
                                终止
                            </Select.Option>
                        </Select>
                        <Button
                            block
                            color="primary"
                            style={{ marginTop: 20 }}
                            onClick={sousuo}
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
                    {props.ReportList&&props.ReportList.length>0?props.ReportList.map((item) => (
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
                            <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}>
                                <Tag color="blue">日期:</Tag> {dayjs(item.created).format('YYYY-MM-DD')}
                            </div>
                            <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}>
                                <Tag color="geekblue">房屋:</Tag> {item.house_name}
                            </div>
                            <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}>
                                <Tag color="purple">单元:</Tag> {joinUnitNames(item.unitList)}
                            </div>
                            <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}>
                                <Tag color="magenta">租户名称:</Tag> {item.tenant_name}
                            </div>
                            <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}>
                                <Tag color="orange">租户手机号:</Tag> {item.tenant_phone}
                            </div>
                            <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}>
                                <Tag color="cyan">报修物品:</Tag> {item.repairGood}
                            </div>
                            <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}>
                                <Tag color="green">报修内容:</Tag> {item.repair_content}
                            </div>
                            <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}>
                                <Tag color="green">报修金额:</Tag> {item.repairMoney}元
                            </div>
                            {
                                item.repair_status==5?<>
                                    <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}>
                                        <Tag color="orange">打分内容:</Tag> {item.ratingCount}
                                    </div>
                                    <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}>
                                        <Tag color="orange">分数:</Tag> {item.rating}
                                    </div>
                                </>:''
                            }
                            <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}>
                                <Tag color="magenta">跟进人:</Tag> {item.userName?item.userName:'未分配跟进人'}
                            </div>
                            <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}>
                                <Tag color="gray">状态:</Tag>
                                {/* 使用对象映射多种状态 */}
                                {(() => {
                                    // 定义状态映射关系
                                    const statusMap = {
                                        1: { text: '未接单', color: 'red' },
                                        2: { text: '上门查看', color: 'blue' },
                                        3: { text: '待确定', color: 'orange' },
                                        4: { text: '物品采购', color: 'purple' },
                                        5: { text: '完成', color: 'green' },
                                        6: { text: '驳回', color: 'red' },
                                        7: { text: '终止', color: 'orange' }
                                    };
                                    const status = statusMap[item.repair_status] || { text: '未知状态', color: 'default' };
                                    return <Tag color={status.color}>{status.text}</Tag>;
                                })()}
                            </div>
                            {
                                item.repair_status==6||item.repair_status==7?<>
                                    <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}>
                                        <Tag color="orange">原因:</Tag> {item.rejectReason}
                                    </div>
                                </>:''
                            }
                            <div>
                                <Space>
                                    {(() => {
                                        const menuItems: any[] = [];
                                        const repair_status = item.repair_status;
                                        // 原逻辑：repair_status !==5 && !==1 显示【步骤】按钮
                                        if (repair_status !== 1 && repair_status !== 5 && repair_status !== 6 && repair_status !== 7) {
                                            menuItems.push({
                                                key: 'step',
                                                label: '步骤',
                                                onClick: () => onokOpen(item),
                                                type: 'primary'
                                            });
                                        }
                                        // 原逻辑：repair_status ===1 显示分配、接单
                                        if (repair_status === 1) {
                                            menuItems.push(
                                                { key: 'assign', label: '分配', onClick: () => genjin(item), type: 'primary' },
                                                { key: 'receive', label: '接单', onClick: () => jiedan(item), type: 'primary' }
                                            );
                                        }
                                        // 原逻辑：repair_status !=5 显示删除 danger按钮
                                        if (repair_status == 1||repair_status !== 5) {
                                            menuItems.push({
                                                key: 'del',
                                                label: '删除',
                                                danger: true,
                                                onClick: () => del(item),
                                                type: 'primary'
                                            });
                                        }
                                        // 状态=1 展示分配、接单
                                        if (repair_status!==5&&repair_status!==7) {
                                            menuItems.push(
                                                { key: 'reject', label: '驳回', onClick: () => isReject(item) },
                                                { key: 'terminate', label: '终止', onClick: () => isTerminate(item) }
                                            );
                                        }
                                        // 循环渲染所有按钮
                                        return menuItems.map(item => (
                                            <Button
                                                key={item.key}
                                                type={item.type}
                                                danger={item.danger}
                                                onClick={item.onClick}
                                            >
                                                {item.label}
                                            </Button>
                                        ));
                                    })()}
                                </Space>
                            </div>
                        </List.Item>
                    )):''}
                </div>
                {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
                {/* 分配跟进人弹窗*/}
                <Modal title='分配跟进人' open={isOpen} onCancel={()=>setIsOpen(false)} onOk={onOk} loading={loading}>
                    <Select
                        style={{width:'100%'}}
                        onChange={changeSelect}
                        showSearch
                        value={userID}
                        optionFilterProp="children"
                        filterOption={(input, option) => {
                            // 假设每个 option 都有一个与数据项对应的 value 属性
                            const item =props.UsersList.find(hetongID => hetongID.id == option?.value); // 您可能需要优化这个查找过程
                            return item?.user_name?.toLowerCase().includes(input.toLowerCase());
                        }}
                    >
                        {props.UsersList&&props.UsersList.length>0?props.UsersList.map((item:any,index:any)=>{
                            return(
                                <Select.Option value={item.id} key={index}>
                                    {item.user_name}
                                </Select.Option>
                            )
                        }):''}
                    </Select>
                </Modal>
                {/* 自行接单弹窗*/}
                <Modal title='自行接单' open={acceptOrdersOpen} onCancel={()=>setAcceptOrdersOpen(false)} onOk={ordersOpenOnOk} loading={loading}>
                    <div>是否要自行接单?</div>
                </Modal>
                {/* 步骤弹窗*/}
                <Modal open={onOpen} loading={loading} onCancel={()=>setOnOpen(false)} footer={null}>
                    {modifyAmount()}
                    <div style={{
                        display: 'flex',
                        gap: '12px',
                        marginTop: '24px',
                        justifyContent: 'flex-start'
                    }}>
                        {/* 上一步按钮：仅当step > 1时显示 */}
                        {step > 1 && (
                            <Button
                                onClick={handlePrevious}
                                style={{
                                    padding: '8px 16px',
                                    backgroundColor: '#f5f5f5',
                                    color: '#333',
                                    border: '1px solid #d9d9d9',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                上一步
                            </Button>
                        )}
                        {/* 下一步按钮：仅当step < 5时显示 */}
                        {step < 4 && (
                            <Button
                                onClick={handleNext}
                                style={{
                                    padding: '8px 16px',
                                    backgroundColor: '#1890ff',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                下一步
                            </Button>
                        )}
                        {step == 4 && (
                            <Button
                                onClick={onhandleOk}
                                type='primary'
                                style={{
                                    padding: '8px 16px',
                                    backgroundColor: '#1890ff',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                确定完成
                            </Button>
                        )}
                    </div>
                </Modal>
                <Modal title='删除' open={dOpen} onCancel={()=>setDopen(false)} onOk={delOk} loading={loading}>
                    <div>确定要删除吗?</div>
                </Modal>
                {/*驳回弹窗*/}
                <Modal title={rejectStatus==6?'驳回':'终止'} open={rejectOpen} onCancel={() => setRejectOpen(false)} onOk={editStutesOk} loading={loading}>
                    <Form>
                        <Form.Item label="原因">
                            <Input.TextArea value={remark} onChange={(e) => setRemark(e.target.value)} />
                        </Form.Item>
                    </Form>
                </Modal>
            </PageLayout>
        </div>
    );
}
const mapStateToProps = (state: any) => {
    return {
        ReportList: state.Report.list,
        count: state.Report.count,
        UsersList: state.Users.list,
    }
};
export default connect(mapStateToProps) (Fault)