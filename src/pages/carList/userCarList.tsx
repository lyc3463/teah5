import {connect, history} from 'umi';
import {useEffect, useState} from "react";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import dayjs from "dayjs";
import {
    Button, DatePicker,
    Dropdown, Form,
    Input,
    List,
    message,
    Modal,
    Pagination,
    Select,
    Space,
    Spin,
    Table,
    Tag
} from "antd";
import {addMonthsToDate, getTimeRangeByMonths, joinUnitNames} from "@/utils/OpenTool";
import * as UserCarServer from "@/services/userCar";
import CryptoUtils from "@/utils/Crypto";
import AddMonthlyInsurance from "@/pages/carList/addMonthlyInsurance";
import EditMonthlyInsurance from "@/pages/carList/editMonthlyInsurance";
import {Popup} from "antd-mobile";
const UserCarList=(props)=>{
    const [startDate,setStartDate]=useState('2025-01-01');
    const [endDate,setEndDate]=useState('2025-01-01');
    const [form] = Form.useForm();
    const [appId,setAppId]=useState(0);
    const [tenant_phone,settenant_phone]=useState('');
    const [tenant_name,settenant_name]=useState('');
    const [page,setPage]=useState(1);// 页码
    const [pageSize,setPageSize]=useState(50);// 页数
    const [carNo,setCarNo]=useState('');//车牌号
    const [name,setName]=useState('');//姓名
    const [stutes,setStutes]=useState(0);
    const [uid,setUid]=useState(0);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [spinning,setspinning]=useState(false);
    const [isCheckOpen,setIsChengckOpen]=useState(false);
    const [deeleId,setDeleId]=useState(0);
    const [isDeleOpen,setIsDeleOpen]=useState(false);
    const [isDeactivateOpen,setIsDeactivateOpen]=useState(false);
    const [activateOpen,setActivateOpen]=useState(false);
    const [carInfo,setCarInfo]=useState('');
    const [tId,setTid]=useState(0);
    const [item,setItem]=useState([]);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [monthOptions, setMonthOptions] = useState([]);
    const [month, setMonth] = useState(0);// 月份
    const [fee, setFee] = useState(0);// 费用
    const [tcID,setTcid]=useState('');// 套餐id
    const [detailOpen, setDetailOpen] = useState(false);
    const [mountCarList, setMountCarList] = useState([]); // 存储详情数据
    const [postponementData,setPostponementData]=useState([]);
    const [postponementOpen, setPostponementOpen] = useState(false);// 月卡延期
    const [changeOpen, setChangeOpen] = useState(false);// 月卡变更
    const [uName,setUName]=useState('');// 用户名
    const [uPhone,setUPhone]=useState('');// 手机号
    const [filterOpen, setFilterOpen] = useState(false);
    // 获取列表
    const getCarList=()=>{
        props.dispatch({
            type:'UserCar/fetch',
            payload:{page,carNo,userId:0,stutes,pageSize,userType:2,uName,uPhone}
        })
    };
    // 根据车牌获取车辆信息
    const getCarInfo=(e:string,type)=>{
        UserCarServer.reactCarNo(e).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                if (res.Data.length>0){
                    res.Data.forEach(user => {
                        user.parkServiceList.forEach(service => {
                            // 新增：计算剩余天数
                            const now = dayjs();
                            const endTime = dayjs(service.endTime);

                            // 如果结束时间已过期，剩余天数为0
                            if (endTime.isBefore(now)) {
                                service.remainingDays = 0;
                            } else {
                                // 计算整天差值，不足1天按0处理
                                const diffDays = endTime.diff(now, 'day', true); // true表示返回浮点数
                                service.remainingDays = diffDays < 1 ? 0 : Math.floor(diffDays);
                            }
                            service.carList.forEach(car => {
                                car.carNo = decodeURIComponent(car.carNo);
                            });
                        });
                    });
                    setMountCarList(res.Data);
                    if (type==4){
                        setDetailOpen(true);
                    }
                }else {
                    message.error('该车辆不存在');
                    setMountCarList([]);
                }
            }else {
                message.error(res.Data);
                setMountCarList([])
            }
        })
    };
    // 开通
    const isActivate=(e,type)=>{
        setCarInfo(e.carNo);
        setTid(e.id);
        setAppId(e.appId);
        settenant_phone(e.tenant_phone);
        settenant_name(e.tenant_name);
        setActivateOpen(true);
    };
    //延期
    const isPostponement=(e,type)=>{
        setAppId(e.appId);
        UserCarServer.reactCarNo(e.carNo).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                if (res.Data.length==0){
                    message.warning('该车未开通月保');
                }else {
                    setPostponementData(res.Data);
                    setPostponementOpen(true);
                }
            }else {
                message.error(res.Data)
            }
        })
    };
    // 变更
    const isChange=(e,type)=>{
        UserCarServer.reactCarNo(e.carNo).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                if (res.Data.length==0){
                    message.warning('该车未开通月保');
                }else {
                    setPostponementData(res.Data);
                    setChangeOpen(true);
                }
            }else {
                message.error(res.Data)
            }
        })    };
    // 月卡详情
    const isInfo=(e,type)=>{
        getCarInfo(e.carNo,type);
    };
    const isDeactivate=(e)=>{
        setUid(e);
        setIsDeactivateOpen(true);
    };
    useEffect(() => {
        getCarList();
    }, [page,pageSize]);
    useEffect(() => {
        getPackageList();
    }, []);
    const sousuo=()=>{
        setPage(1);
        getCarList();
        setFilterOpen(false);
    };
    const onChange=(e,pageSize)=>{
        setPage(e);
        setPageSize(pageSize);
    };
    const isCheck=(e)=>{
        setUid(e);
        setIsChengckOpen(true);
    };
    const onOk=()=>{
        setspinning(true);
        props.dispatch({
            type:'UserCar/check',
            payload:{uid,status:2}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('审核成功');
                setspinning(false);
                setIsChengckOpen(false);
            }else {
                message.error(res.Data);
                setIsChengckOpen(false);
                setspinning(false);
            }
        })
    };
    const toInfo=(e:number)=>{
        history.push(`/carList/carInfo?id=${e}`)
    };
    const changeCarNo=(e)=>{
        setCarNo(e.target.value);
    };
    const changeStutes=(e)=>{
        setStutes(e);
    };
    const isDele=(e)=>{
        setDeleId(e);
        setIsDeleOpen(true);
    };
    // 删除成功
    const onDeleOk=()=>{
        setspinning(true);
        props.dispatch({
            type:'UserCar/remove',
            payload:deeleId
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('删除成功');
                setIsDeleOpen(false);
                setspinning(false);
            }else {
                message.error(res.Data);
                setIsDeleOpen(false);
                setspinning(false);
            }
        })
    };
    // 停用成功
    const onDeactivateOk=()=>{
        setspinning(true);
        props.dispatch({
            type:'UserCar/check',
            payload:{uid,status:3}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('停用成功');
                setspinning(false);
                setIsDeactivateOpen(false);
            }else {
                message.error(res.Data);
                setIsDeactivateOpen(false);
                setspinning(false);
            }
        })
    };
    const toAdd=()=>{
        history.push('/wisdomStop/addCar');
    };
    // 获取套餐列表
    const getPackageList=()=>{
        UserCarServer.getItemList().then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setItem(res.Data);
            }
        })
    };
    // 监听时间
    const changeDate=(_:any,item:any)=>{
        if (item){
            setStartDate(item+' 00:00:00');
            let date=addMonthsToDate(item,month);
            setEndDate(date+' 23:59:59');
        }
    };
    // 开通成功确定
    const onActivateOk=()=>{
        let userId=CryptoUtils.md5(appId.toString());
        UserCarServer.adyuebao(appId,tcID,tenant_name,userId,1,tenant_phone,fee,month,startDate,endDate,tId).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('开通成功');
                setActivateOpen(false);
                setspinning(false);
            }else {
                message.error(res.Data);
                setActivateOpen(false);
                setspinning(false);
            }
        })
    };
    const changeUName=(e)=>{
        setUName(e.target.value);
    };
    const changeUPhone=(e)=>{
        setUPhone(e.target.value);
    };
    return(
        <Spin spinning={spinning}>
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
                    <div style={{ marginTop: 15 }}>车牌号</div>
                    <Input
                        onChange={changeCarNo}
                        value={carNo}
                    />

                    <div style={{ marginTop: 15 }}>用户名</div>
                    <Input
                        onChange={changeUName}
                        value={uName}
                    />

                    <div style={{ marginTop: 15 }}>手机号</div>
                    <Input
                        onChange={changeUPhone}
                        value={uPhone}
                    />
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
                {props.list&&props.list.length>0?props.list.map((item) => (
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
                        <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}>姓名: {item.tenant_name}</div>
                        <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}>手机号: {item.tenant_phone}</div>
                        <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}>车牌: {item.carNo}</div>
                        <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}>开始时间:
                            {(() => {
                                const defaultTime = dayjs(item.beginTime).format('YYYY-MM-DD HH:mm:ss');
                                if (defaultTime === '1901-01-01 00:00:00' || !item.beginTime) {
                                    return '等待用户开通';
                                }
                                return dayjs(item.beginTime).format('YYYY-MM-DD HH:mm:ss');
                            })()}
                        </div>
                        {/* 新增：结束时间 */}
                        <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}>结束时间:
                            {(() => {
                                const defaultTime = dayjs(item.endTime).format('YYYY-MM-DD HH:mm:ss');
                                if (defaultTime === '1901-01-01 00:00:00' || !item.endTime) {
                                    return '等待用户开通';
                                }
                                return dayjs(item.endTime).format('YYYY-MM-DD HH:mm:ss');
                            })()}
                        </div>
                        {/* 新增：剩余天数 */}
                        <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}>剩余天数:
                            {(() => {
                                const defaultTime = "0001-01-01T00:00:00";
                                if ((!item.beginTime || item.beginTime === defaultTime) || (!item.endTime || item.endTime === defaultTime)) {
                                    return '等待用户开通';
                                }
                                const now = dayjs();
                                const endTime = dayjs(item.endTime);

                                if (endTime.isBefore(now)) {
                                    return '已过期';
                                }

                                const diffDays = endTime.diff(now, 'day', true);
                                return diffDays < 1 ? '不足一天' : `${Math.floor(diffDays)}天`;
                            })()}
                        </div>
                        <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}>状态:
                            {item.carStatus === 1 ? <Tag color='red'>未审核</Tag> :
                                item.carStatus === 2 ? <Tag color='green'>已审核</Tag> :
                                    <Tag color='orange'>已停用</Tag>}
                        </div>
                        <Space style={{ fontSize: 16, color: "#666", marginTop: 4 }}>
                            <Dropdown
                                menu={{
                                    items: [
                                        // 根据车辆状态添加对应操作项
                                        ...(item.carStatus === 2
                                                ? [
                                                    {
                                                        key: 'stop',
                                                        label: '停用',
                                                        onClick: () => isDeactivate(item.id)
                                                    },
                                                    {
                                                        key: 'monthlyDetail',
                                                        label: '月保详情',
                                                        onClick: () => isInfo(item, 4)
                                                    }
                                                ]
                                                : []
                                        ),
                                        ...(item.carStatus === 1
                                                ? [
                                                    {
                                                        key: 'delete',
                                                        label: '删除',
                                                        onClick: () => isDele(item.id)
                                                    },
                                                    {
                                                        key: 'check',
                                                        label: '审核',
                                                        onClick: () => isCheck(item.id)
                                                    }
                                                ]
                                                : []
                                        ),
                                        // 始终显示详情项
                                        {
                                            key: 'detail',
                                            label: '详情',
                                            onClick: () => toInfo(item.id)
                                        }
                                    ]
                                }}
                                placement="bottomRight"
                            >
                                <Button type="primary">操作</Button>
                            </Dropdown>
                            <Dropdown
                                menu={{
                                    items: [
                                        {
                                            key: 'kt',
                                            label: '开通',
                                            onClick: () => isActivate(item,1)
                                        },
                                        {
                                            key: 'yq',
                                            label: '延期',
                                            onClick: () => isPostponement(item,2)
                                        },

                                        {
                                            key: 'bg',
                                            label: '变更',
                                            onClick: () => isChange(item,3)
                                        },
                                        {
                                            key: 'info',
                                            label: '详情',
                                            onClick: () => isInfo(item,4)
                                        },
                                    ]
                                }}
                                placement="bottomRight"
                            >
                                <Button type="primary">服务</Button>
                            </Dropdown>
                        </Space>
                    </List.Item>
                )):''}
            </div>
            {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
            <Modal open={isCheckOpen} onCancel={()=>setIsChengckOpen(false)} onOk={onOk} loading={spinning}>
                <div>是否要审核车辆</div>
            </Modal>
            <Modal open={isDeleOpen} onCancel={()=>setIsDeleOpen(false)} onOk={onDeleOk} loading={spinning}>
                <div>是否删除?</div>
            </Modal>
            <Modal open={isDeactivateOpen} onCancel={()=>setIsDeactivateOpen(false)} onOk={onDeactivateOk} loading={spinning}>
                <div>是否停用?</div>
            </Modal>
            {/*开通月保*/}
            <Modal title='开通月保'  open={activateOpen} loading={spinning} onOk={onActivateOk} onCancel={()=>setActivateOpen(false)}>
                <Form
                    form={form}
                    onValuesChange={(changedValues, allValues) => {
                        // 当套餐变化时，更新月份选项
                        if (changedValues.packageId) {
                            const packageItem = item.find(item => item.itemId === changedValues.packageId);
                            setSelectedPackage(packageItem);
                            // 生成月份选项
                            if (packageItem && packageItem.chargeStand) {
                                const options = packageItem.chargeStand.map(stand => ({
                                    value: stand.months,
                                    label: `${stand.months}个月 (${stand.totalFee}元)`,
                                    fee: stand.totalFee
                                }));
                                setMonthOptions(options);
                                setTcid(packageItem.itemId);
                            } else {
                                setMonthOptions([]);
                                setTcid('');
                            }
                            form.setFieldsValue({ month: undefined, fee: undefined });
                        }
                        // 当月份变化时，更新费用显示及状态变量
                        if (changedValues.month && selectedPackage) {
                            const selectedMonth = monthOptions.find(option => option.value === changedValues.month);
                            if (selectedMonth) {
                                form.setFieldsValue({ fee: selectedMonth.fee });
                                // 存储月份和金额到状态变量，供后续使用
                                setMonth(changedValues.month); // 更新月份状态
                                setFee(selectedMonth.fee);     // 更新金额状态
                                setTcid(allValues.packageId);  // 存储选中的套餐ID
                                let dataTime=getTimeRangeByMonths(changedValues.month);
                                setStartDate(dataTime.startTime+' 00:00:00');
                                setEndDate(dataTime.endTime+' 23:59:59');
                            }else {
                                setMonth(0);
                                setFee(0);
                                setTcid('');
                            }
                        }
                    }}
                >
                    <Form.Item label="车牌号" >
                        <Input value={carInfo}/>
                    </Form.Item>
                    <Form.Item label="选择套餐" name="packageId">
                        <Select
                            placeholder="请选择套餐类型"
                            style={{ width: 300 }}
                            onChange={(value) => {
                                form.setFieldsValue({ month: undefined });
                            }}
                        >
                            {item.map(packageItem => (
                                <Select.Option key={packageItem.itemId} value={packageItem.itemId}>
                                    {packageItem.tcName}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label="选择月份" name="month">
                        <Select placeholder="请先选择套餐" style={{ width: 300 }}>
                            {monthOptions.map(option => (
                                <Select.Option key={option.value} value={option.value}>
                                    {option.label}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    {month==0?'':
                        <>
                            <Form.Item label="开始时间">
                                <DatePicker onChange={changeDate} value={dayjs(startDate)}/>
                            </Form.Item>
                            <Form.Item label="结束时间">
                                <DatePicker value={dayjs(endDate)} disabled/>
                            </Form.Item>
                        </>
                    }
                    <Form.Item label="费用" name="fee">
                        <Input disabled placeholder="选择月份后显示" />
                    </Form.Item>
                </Form>
            </Modal>
            {/*详情弹窗*/}
            <Modal
                title="车辆详情"
                open={detailOpen}
                onCancel={() => setDetailOpen(false)}
                footer={[
                    <Button key="close" onClick={() => setDetailOpen(false)}>关闭</Button>
                ]}
            >
                <div style={{ maxHeight: '55vh', overflowY: 'auto', padding: '0 16px' }}>
                    {mountCarList.map((item, index) => (
                        <div key={index} style={{ border: '1px solid #f0f0f0', borderRadius: 8, padding: 16, marginBottom: 16 }}>
                            {/* 用户基本信息 */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                                <div>
                                    <div style={{ color: '#999', fontSize: 14 }}>姓名</div>
                                    <div>{item.userName}</div>
                                </div>
                                <div>
                                    <div style={{ color: '#999', fontSize: 14 }}>手机号</div>
                                    <div>{item.mobile}</div>
                                </div>
                            </div>

                            {/* 套餐信息列表 */}
                            {item.parkServiceList.map((val, serviceIndex) => (
                                <div key={serviceIndex} style={{ marginTop: 16, paddingTop: 16, borderTop: '1px dashed #eee' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                                        <div>
                                            <div style={{ color: '#999', fontSize: 14 }}>园区名字</div>
                                            <div>{val.parkName}</div>
                                        </div>
                                        <div>
                                            <div style={{ color: '#999', fontSize: 14 }}>套餐类型</div>
                                            <div>{val.tcName}</div>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                                        <div>
                                            <div style={{ color: '#999', fontSize: 14 }}>开始时间</div>
                                            <div>{val.beginTime}</div>
                                        </div>
                                        <div>
                                            <div style={{ color: '#999', fontSize: 14 }}>到期时间</div>
                                            <div>{val.endTime}</div>
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: 12 }}>
                                        <div style={{ color: '#999', fontSize: 14 }}>剩余日期</div>
                                        <div>{val.remainingDays < 1 ? '不足一天' : `${val.remainingDays}天`}</div>
                                    </div>

                                    {/* 车辆信息列表 */}
                                    {val.carList.map((car, carIndex) => (
                                        <div key={carIndex} style={{ marginTop: 16, padding: 12, backgroundColor: '#fafafa', borderRadius: 4 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                                <div>
                                                    <div style={{ color: '#999', fontSize: 14 }}>车牌</div>
                                                    <div>{car.carNo}</div>
                                                </div>
                                                <div>
                                                    <div style={{ color: '#999', fontSize: 14 }}>颜色</div>
                                                    <div>
                                                        {car.carNoColor === 'BLUE' && '蓝色'}
                                                        {car.carNoColor === 'GREEN' && '绿色'}
                                                        {car.carNoColor === 'WHITE' && '白色'}
                                                        {car.carNoColor === 'YELLOW' && '黄色'}
                                                        {car.carNoColor === 'BLACK' && '黑色'}
                                                        {!['BLUE', 'GREEN', 'WHITE', 'YELLOW', 'BLACK'].includes(car.carNoColor) && '其余颜色'}
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <div style={{ color: '#999', fontSize: 14 }}>车辆类型</div>
                                                <div>
                                                    {car.carType === 'CAR' && '小车'}
                                                    {car.carType === 'LARGE' && '大车'}
                                                    {car.carType === 'EXTRA_LARGE' && '超大车'}
                                                    {!['CAR', 'LARGE', 'EXTRA_LARGE'].includes(car.carType) && '其他类型'}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </Modal>
            {/*月卡延期*/}
            <Modal title={'月卡延期'} open={postponementOpen} onCancel={() => setPostponementOpen(false)} footer={null} onOk={() => setPostponementOpen(false)}>
                <AddMonthlyInsurance data={postponementData} appId={appId}  onSuccess={() => setPostponementOpen(false)}/>
            </Modal>
            {/*月卡变更*/}
            <Modal title={'月卡变更'} open={changeOpen} onCancel={() => setChangeOpen(false)} footer={null} onOk={() => setChangeOpen(false)}>
                <EditMonthlyInsurance data={postponementData} onSuccess={() => setChangeOpen(false)}/>
            </Modal>
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        list: state.UserCar.list,
        count: state.UserCar.count,
    }
};
export default connect(mapStateToProps) (UserCarList)