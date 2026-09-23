import {useEffect, useState} from "react";
import * as StaffService from '@/services/staff';
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import dayjs from "dayjs";
import {Button, DatePicker, Input, List, message, Modal, Pagination, Select, Space, Spin, Table, Tag} from "antd";
import {history} from "umi";
import DateRangePicker from "@/components/DateRangePickerProps";

const CheckDjContracte=()=>{
    const [isCheckOpen,setIsCheckOpen]=useState(false);
    const [isCancelOpen,setIsCancelOpen]=useState(false);
    const [uid,setUid]=useState(0);
    // 当前页数
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    // 审核状态 0全部  1未审核 2已审核
    const [contractStatus,setContractStatus]=useState(0);
    // 开始时间
    const [startDate,setStartDate]=useState('2000-01-01');
    // 结束时间
    const [endDate,setEndDate]=useState('2099-01-01');
    // 租户姓名
    const [name,setName]=useState('');
    // 列表
    const [staffList,setStaffList]=useState([]);
    // 转圈
    const [spinning,setspinning]=useState(false);
    // 总页码
    const [count,setcount]=useState(0);
    // 租金总数
    const [zuMoney,setzuMoney]=useState(0);
    // 合同押金
    const [deposit,setdeposit]=useState(0);
    // 用户权限
    const [uqx,setUqx]=useState([]);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    // 详情
    const toInfo=(e)=>{
        history.push(`/check/dingjinInfo?id=${e.id}`);
    };
    // 打印合同
    const toxiazai=(e)=>{
        history.push(`/check/nocheckDJcontractez?id=${e.id}`);
    };
    const checkdj=(e)=>{
        history.push(`/check/checkdingjin?id=${e.id}`);
    };
    const isCheck=(e)=>{
        setUid(e);
        setIsCheckOpen(true);
    };
    const iscancel=(e)=>{
        setUid(e);
        setIsCancelOpen(true);
    };
    // 获取列表
    const getList=()=>{
        StaffService.getdJContractList({page,pageSize,contractStatus,name,startDate,endDate}).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setStaffList(res.Data);
            }else {
                message.error(res.Data);
            }
        })
    };
    // 获取分页信息
    const getListfenye=()=>{
        StaffService.getdJContractListfy({pageSize,contractStatus,name,startDate,endDate}).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setcount(res.Data.count);
                setzuMoney(res.Data.zuMoney);
                setdeposit(res.Data.deposit);
            }else {
                message.error(res.Data);
            }
        })
    };
    const onChange=(e:number,pageSize:number)=>{
        setPage(e);
        setPageSize(pageSize);
    };
    // 监听日期
    const changeDate=(start,end)=>{
        setStartDate(start);
        setEndDate(end);
    };
    const sousuo=()=>{
        setPage(1);
        getList();
        getListfenye();
    };
    useEffect(() => {
        getList();
    }, [page,pageSize]);
    useEffect(() => {
        getListfenye();
    }, []);
    const onOK=()=>{
        StaffService.checkDjContract(uid,2).then((res:TypeErrorCode)=>{
            setspinning(true);
            if (res.ErrorCode==0){
                message.success('审核成功');
                getList();
                setspinning(false);
                setIsCheckOpen(false);
            }else {
                message.error(res.Data);
                getList();
                setspinning(false);
                setIsCheckOpen(false);
            }
        })
    };
    const onCancel=()=>{
        StaffService.checkDjContract(uid,3).then((res:TypeErrorCode)=>{
            setspinning(true);
            if (res.ErrorCode==0){
                message.success('取消成功');
                getList();
                setspinning(false);
                setIsCancelOpen(false);
            }else {
                message.error(res.Data);
                getList();
                setspinning(false);
                setIsCancelOpen(false);
            }
        })
    };
    const isdelete=(e)=>{
        setUid(e);
        setIsCancelOpen(true);
    };
    const onDelete=()=>{
        StaffService.removedj(uid).then((res:TypeErrorCode)=>{
            setspinning(true);
            if (res.ErrorCode==0){
                message.success('删除成功');
                getList();
                setspinning(false);
                setIsCancelOpen(false);
            }else {
                message.error(res.Data);
                getList();
                setspinning(false);
                setIsCancelOpen(false);
            }
        })
    };
    const changeStutes=(e)=>{
        setContractStatus(e);
    };
    const changeName=(e)=>{
        setName(e.target.value);
    };
    const getCardStyle = () => {
        return {
            marginBottom: windowWidth <= 480 ? '0.8rem' : '1.6rem',
            borderRadius: '12px',
            backgroundColor: '#fff',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
            padding: windowWidth <= 480 ? '1rem' : '1.5rem',
            transition: 'all 0.3s ease',
            position: 'relative'
        };
    };
    const getCardHoverStyle = () => {
        return {
            transform: 'translateY(-3px)',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)'
        };
    };

    const getTextStyle = () => {
        return {
            fontSize: windowWidth <= 480 ? '0.9rem' : '1rem',
            color: '#333',
            marginBottom: windowWidth <= 480 ? '0.4rem' : '0.8rem',
            display: 'flex',
            alignItems: 'center'
        };
    };
    // 监听窗口大小变化
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    return(
        <Spin spinning={spinning}>
            <List>
                <List.Item>

                    <Space>
                        <Input
                            onChange={changeName}
                            addonBefore="租户姓名:"
                            value={name}
                        />
                        <Space.Compact>
                            <div
                                style={{
                                    borderRadius: '6px',
                                    borderStartEndRadius: 0,
                                    borderEndEndRadius: 0,
                                    padding: '0 11px',
                                    border: '1px solid #d9d9d9',
                                    display: 'flex',
                                    alignItems: 'center',
                                    borderInlineEnd: 0,
                                    width:'40px'
                                }}
                            >
                                状态:
                            </div>
                            <Select
                                onChange={changeStutes}
                                value={contractStatus}
                                options={[
                                    { value:0, label: '全部' },
                                    { value:1, label: '未审核' },
                                    { value:2, label: '已审核' },
                                    { value:3, label: '已取消' },
                                ]}
                            />
                        </Space.Compact>
                    </Space>
                    <Space>
                        <DateRangePicker  onDateSelected={changeDate}/>
                        <Button type="primary" onClick={sousuo}>
                            搜索
                        </Button>
                    </Space>
                </List.Item>
            </List>
            <div style={{ display: 'flex', flexDirection: 'column', height: '65vh', overflowY: 'auto' }}>
                {staffList&&staffList.length>0?staffList.map((item)=>(
                    <div
                        key={item.id}
                        style={{ ...getCardStyle(), ...getCardHoverStyle() }}
                        onMouseEnter={(e) => {
                            const target = e.currentTarget as HTMLElement;
                            Object.assign(target.style, getCardHoverStyle());
                        }}
                        onMouseLeave={(e) => {
                            const target = e.currentTarget as HTMLElement;
                            Object.assign(target.style, getCardStyle());
                        }}
                    >
                        <div style={getTextStyle()}>合同编号: {item.identifier}</div>
                        <div style={getTextStyle()}>租户: {item.tenant_name}</div>
                        <div style={getTextStyle()}>签订日期: {dayjs(item.beginTime).format("YYYY-MM-DD")}</div>
                        <div style={getTextStyle()}>租金(元): {item.zuMoney}</div>
                        <div style={getTextStyle()}>租金押金(元): {item.deposit}</div>
                        <div style={getTextStyle()}>状态:  {item.contractStatus === 1 ? (
                            <Tag color='red'>未审核</Tag>
                        ) : item.contractStatus === 2 ? (
                            <Tag color='green'>已审核</Tag>
                        ) : item.contractStatus === 3 ? (
                            <Tag color='orange'>已取消</Tag>
                        ) : (
                            <Tag color='grey'>未知状态</Tag>
                        )}</div>
                        <div style={getTextStyle()}>
                            <Space>
                                {item.contractStatus==1?
                                    <>
                                        <Button type='primary' onClick={()=>isCheck(item.id)}>审核</Button>
                                    </>:''
                                }
                                {
                                    item.contractStatus==2?  <Button type='primary' danger onClick={()=>iscancel(item.id)}>取消</Button>:''
                                }
                                {
                                    item.contractStatus==3?<Button type='primary' danger onClick={()=>isdelete(item.id)}>删除</Button>:''
                                }
                            </Space>
                        </div>
                    </div>
                )):''}
            </div>
            <Pagination total={count} pageSize={50} current={page} onChange={onChange}  pageSizeOptions={[50]}/>
            <Modal open={isCheckOpen} onOk={onOK} onCancel={()=>setIsCheckOpen(false)} loading={spinning} title={'审核'}>
                <div>是否要审核?</div>
            </Modal>
            <Modal open={isCancelOpen} onOk={onCancel} onCancel={()=>setIsCancelOpen(false)} loading={spinning} title={'取消'}>
                <div>是否取消?</div>
            </Modal>
            <Modal open={isCancelOpen} onOk={onDelete} onCancel={()=>setIsCancelOpen(false)} loading={spinning} title={'删除'}>
                <div>是否删除?</div>
            </Modal>
        </Spin>
    )
}
export default CheckDjContracte