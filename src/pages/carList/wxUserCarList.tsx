import {connect, history} from 'umi';
import {useEffect, useState} from "react";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {Button, Input, List, message, Modal, Pagination, Select, Space, Spin, Table, Tag} from "antd";
import {joinUnitNames} from "@/utils/OpenTool";
import dayjs from "dayjs";
import * as UserCarServer from "@/services/userCar";
import PageLayout from "@/components/PageLayout ";
import {Popup} from "antd-mobile";
import DateRangePicker from "@/components/DateRangePickerProps";

const WxUserCarList=(props)=>{
    const [page,setPage]=useState(1);// 页码
    const [pageSize,setPageSize]=useState(10);// 页数
    const [carNo,setCarNo]=useState('');//车牌号
    const [appId,setAppid]=useState(0);
    const [stutes,setStutes]=useState(0);
    const [uid,setUid]=useState(0);
    const [spinning,setspinning]=useState(false);
    const [isCheckOpen,setIsChengckOpen]=useState(false);
    const [carList,setCarList]=useState([]);
    const [isDeactivateOpen,setIsDeactivateOpen]=useState(false);
    const [isDeleOpen,setIsDeleOpen]=useState(false);
    const [deeleId,setDeleId]=useState(0);
    const [detailOpen, setDetailOpen] = useState(false);
    const [mountCarList, setMountCarList] = useState([]);
    const [uName,setUName]=useState('');// 用户名
    const [uPhone,setUPhone]=useState('');// 手机号
    const [filterOpen, setFilterOpen] = useState(false);

    // 获取列表
    const getCarList=()=>{
        props.dispatch({
            type:'CarManage/fetch',
            payload:{page,carNo,userId:0,stutes,pageSize,userType:1,uName,uPhone}
        })
    };

    useEffect(() => {
        getCarList();
    }, [page,pageSize]);

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
            type:'CarManage/check',
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
        history.push(`/carList/carInfo?id=${e}`);
    };
    const changeCarNo=(e)=>{
        setCarNo(e.target.value);
    };
    const changeStutes=(e)=>{
        setStutes(e);
    };
    // 停用按钮
    const isDeactivate=(e)=>{
        setUid(e);
        setIsDeactivateOpen(true);
    };
    // 停用确定
    const onDeactivateOk=()=>{
        setspinning(true);
        props.dispatch({
            type:'CarManage/check',
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
    // 删除
    const isDele=(e)=>{
        setDeleId(e);
        setIsDeleOpen(true);
    };
    // 删除确定
    const onDeleOk=()=>{
        setspinning(true);
        props.dispatch({
            type:'CarManage/remove',
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
    // 月卡详情
    const isInfo=(e,type)=>{
        getCarInfo(e.carNo,type);
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
                        <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}>单元: {joinUnitNames(item.unitList)}</div>
                        <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}>用户姓名: {item.user_name}</div>
                        <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}>用户手机号: {item.phone}</div>
                        <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}>车牌: {item.carNo}</div>
                        <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}>开始时间:
                            {(() => {
                                const defaultTime = dayjs(item.beginTime).format('YYYY-MM-DD');
                                if (defaultTime === '1901-01-01 00:00:00' || !item.beginTime) {
                                    return '等待用户开通';
                                }
                                return dayjs(item.beginTime).format('YYYY-MM-DD');
                            })()}
                        </div>
                        {/* 新增：结束时间 */}
                        <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}>结束时间:
                            {(() => {
                                const defaultTime = dayjs(item.endTime).format('YYYY-MM-DD');
                                if (defaultTime === '1901-01-01 00:00:00' || !item.endTime) {
                                    return '等待用户开通';
                                }
                                return dayjs(item.endTime).format('YYYY-MM-DD');
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
                        <Space style={{ marginTop: 4 }}>
                            {item.carStatus==2?<><Button danger type='primary' onClick={() => isDeactivate(item.id)}>停用</Button><Button type='primary'  onClick={() => isInfo(item,4)}>月保详情</Button></>:''}
                            {item.carStatus==1?<><Button type='primary' onClick={()=>isCheck(item.id)}>审核</Button></>:''}
                            <Button type='primary' danger onClick={() => isDele(item.id)}>删除</Button>
                            <Button type='primary' onClick={()=>toInfo(item.id)}>详情</Button>
                        </Space>
                    </List.Item>
                )):''}
            </div>
            {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
            {/*审核弹窗*/}
            <Modal open={isCheckOpen} onCancel={()=>setIsChengckOpen(false)} onOk={onOk} loading={spinning}>
                <div>是否要审核车辆</div>
            </Modal>
            {/*停用弹窗*/}
            <Modal open={isDeactivateOpen} onCancel={()=>setIsDeactivateOpen(false)} onOk={onDeactivateOk} loading={spinning}>
                <div>是否停用?</div>
            </Modal>
            {/*删除弹窗*/}
            <Modal open={isDeleOpen} onCancel={()=>setIsDeleOpen(false)} onOk={onDeleOk} loading={spinning}>
                <div>是否删除?</div>
            </Modal>
            {/*开通月保后的车辆详情*/}
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
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        list: state.CarManage.list,
        count: state.CarManage.count,
    }
};
export default connect(mapStateToProps) (WxUserCarList)