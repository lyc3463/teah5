import {useEffect, useState} from "react";
import * as StaffService from '@/services/staff';
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import dayjs from "dayjs";
import {Button, DatePicker, Input, List, message, Modal, Pagination, Select, Space, Spin, Table, Tag} from "antd";
import {history} from "umi";
import DateRangePicker from "@/components/DateRangePickerProps";

const DjContract=()=>{
    const [isDeltOpen,setIsDeleteOpen]=useState(false);
    const [uid,setUid]=useState(0);
    // 当前页数
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    // 审核状态 0全部  1未审核 2已审核
    const [contractStatus,setContractStatus]=useState(1);
    // 开始时间
    const [startDate,setStartDate]=useState(sessionStorage.getItem('enterStaffDjContractStartDate')||'2000-01-01');
    // 结束时间
    const [endDate,setEndDate]=useState(sessionStorage.getItem('enterStaffDjContractEndDate')||'2099-01-01');
    // 租户姓名
    const [name,setName]=useState(sessionStorage.getItem('enterStaffDjContractName')||'');
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
    // 预付费
    const [prepayment,setprepayment]=useState(0);
    // 管理费押金
    const [depositFee,setdepositFee]=useState(0);
    // 管理费
    const [manageFee,setmanageFee]=useState(0);
    // 用户权限
    const [uqx,setUqx]=useState([]);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    // 修改定金合同
    const toedit=(e)=>{
        history.push(`/enter/editDjContract?id=${e.id}`);
    };
    // 删除定金合同
    const isdelete=(e)=>{
        setUid(e);
        setIsDeleteOpen(true);
    };
    // 详情
    const toInfo=(e)=>{
        history.push(`/enter/dingjinInfo?id=${e.id}`);
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
        StaffService.removedj(uid).then((res:TypeErrorCode)=>{
            setspinning(true);
            if (res.ErrorCode==0){
                message.success('删除成功');
                getList();
                setspinning(false);
                setIsDeleteOpen(false);
            }else {
                message.error(res.Data);
                getList();
                setspinning(false);
                setIsDeleteOpen(false);
            }
        })
    };
    const changeName=(e)=>{
        setName(e.target.value);
        sessionStorage.setItem('enterStaffDjContractName',e.target.value);
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
                        ): (
                            <Tag color='grey'>未知状态</Tag>
                        )}</div>
                        <div style={getTextStyle()}>
                            <Space>
                                {item.contractStatus==1?
                                    <>
                                        <Button type='primary' onClick={()=>toedit(item)}>编辑</Button>
                                        <Button type='primary' danger onClick={()=>isdelete(item.id)}>删除</Button>
                                        <Button type='primary' onClick={()=>toInfo(item)}>详情</Button>
                                    </>:''
                                }
                            </Space>
                        </div>
                    </div>
                )):''}
            </div>
            <div style={{display:'flex',justifyContent:'space-around',marginTop:'5px',flexWrap:'wrap'}}>
                <div>租金:{zuMoney.toFixed(2)}元</div>
            </div>
            <Pagination total={count} pageSize={50} current={page} onChange={onChange}  pageSizeOptions={[50]}/>
            <Modal open={isDeltOpen} onOk={onOK} onCancel={()=>setIsDeleteOpen(false)} loading={spinning} title={'删除'}>
                <div>是否要删除?</div>
            </Modal>
        </Spin>
    )
}
export default DjContract