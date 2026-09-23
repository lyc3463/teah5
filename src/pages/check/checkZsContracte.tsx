import {Button, DatePicker, Form, Input, List, message, Modal, Pagination, Select, Space, Spin, Table, Tag} from "antd";
import {history,connect} from "umi";
import {useEffect, useState} from "react";
import dayjs from "dayjs";
import * as StaffServer from "@/services/staff";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {StaticInfo} from "@/StaticInfo";
import DateRangePicker from "@/components/DateRangePickerProps";

const CheckZsContracte=(props:any)=>{
    const [uid,setUid]=useState(0);
    const [isOpen,setIsOpen]=useState(false);
    // 当前页数
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    // 审核状态 0全部  1未审核 2已审核
    const [contractStatus,setContractStatus]=useState(0);
    // 合同编号
    const [identifier,setIdentifier]=useState('');
    // 合同类型ID
    const [contractType,setContractType]=useState(0);
    // 租户姓名
    const [name,setName]=useState('');
    // 开始时间
    const [startDate,setStartDate]=useState('2000-01-01');
    // 结束时间
    const [endDate,setEndDate]=useState('2099-01-01');
    // 发送弹窗
    const [fsOpen,setFsOpen]=useState(false);
    const [templateType,settemplateType]=useState(0);
    const [spinning,setspinning]=useState(false);
    // 发送小程序用户
    const [fId,setfId]=useState(0);
    // 查看续租前合同列表
    const [oldList,setOldList]=useState([]);
    // 续租前合同列表
    const [xuOpen,setxuOpen]=useState(false);
    // 用户权限
    const [uqx,setUqx]=useState([]);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const onSelectWXusetList=(e:any)=>{
        setFsOpen(true);
        setfId(e.id)
    };
    // 审核弹窗
    const isCheck=(e:any)=>{
        settemplateType(e.templateType);
        setUid(e.id);
        setIsOpen(true);
    };
    // 编辑
    const toedit=(e:any)=>{
        if (e.templateType==1){
            history.push(`/enter/editDjContract?id=${e.id}`);
        }else if (e.templateType==2){
            history.push(`/enter/editStaff?id=${e.id}`);
        }
    };
    // 查看以前合同
    const toOldHetongList=(e:any)=>{
        setxuOpen(true);
        StaffServer.getOldList(e.id).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setOldList(res.Data);
            }else {
                setOldList([]);
            }
        })
    };
    // 确定审核通过
    const checkOk=()=>{
        setspinning(true);
        props.dispatch({
            type:'CheckStaff/check',
            payload:{uid,templateType}
        }).then((res)=>{
            if (res.ErrorCode==0){
                message.success('审核通过');
                setspinning(false);
                setIsOpen(false);
            }else {
                message.error(res.Data);
                setspinning(false);
                setIsOpen(false);
            }
        })
    };
    // 去详情页面
    const toInfo=(e:any)=>{
        if (e.templateType==2){
            history.push(`/check/contracteInfo?id=${e.id}`);
        }else {
            history.push(`/check/dingjinInfo?id=${e.id}`);
        }
    };
    // 下载页面
    const toxiazai=(e)=>{
        console.log(e.id)
        if (e.templateType==2){
            history.push(`/check/contractez?id=${e.id}&templateType=${e.templateType}`);
        }else {
            history.push(`/check/checkdingjin?id=${e.id}&templateType=${e.templateType}`);
        }
    };
    // 搜索
    const sousuo=()=>{
        setPage(1);
        getFenyeInfo();
        logFenye();
    };
    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"CheckStaff/fetch",
            payload:{page,identifier,contractType,contractStatus,startDate,endDate,name,pageSize}
        })
    };
    const getFenyeInfo=()=>{
        props.dispatch({
            type:'CheckStaff/fenye',
            payload:{identifier,contractType,contractStatus,startDate,endDate,name,pageSize}
        });
    };
    // 监听页数
    const onChange=(e:number,pageSize:number)=>{
        setPage(e);
        setPageSize(pageSize);
    };
    // 监听状态
    const changeStutes=(e:number)=>{
        setContractStatus(e);
    };
    useEffect(() => {
        logFenye();
    }, [page,pageSize]);
    // 监听合同编号
    const changeIdentifier=(e)=>{
        setIdentifier(e.target.value);
    };
    const changeName=(e)=>{
        setName(e.target.value);
    };
    // 合同类型
    const changeType=(e:number)=>{
        setContractType(e);
    };
    // 监听日期
    const changeDate=(start,end)=>{
        setStartDate(start);
        setEndDate(end);
    };
    const onFsOk=()=>{

    };
    useEffect(() => {
        let uq=StaticInfo.uqx.split('');
        setUqx(uq);
        getFenyeInfo();
    }, []);
    const xucolumns=[
        {
            title: '合同编号',
            dataIndex: 'identifier',
            key: 'identifier',
            render:(text:any,record:any,)=>{
                return(
                    <div style={{width:'100px',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
                        {record.identifier}
                    </div>
                )
            }
        },
        {
            title: '起租日',
            dataIndex: 'beginTime',
            key: 'beginTime',
            render:(text:any,record:any,)=>{
                return(
                    <div>{dayjs(record.beginTime).format('YYYY-MM-DD')}</div>
                )
            }
        },
        {
            title: '结束日',
            dataIndex: 'endTime',
            key: 'endTime',
            render:(text:any,record:any,)=>{
                return(
                    <div>{dayjs(record.endTime).format('YYYY-MM-DD')}</div>
                )
            }
        },
        {
            title: '租户名称',
            dataIndex: 'customName',
            key: 'customName',
            render:(text:any,record:any)=>{
                return (
                    <div style={{width:'100px',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
                        {record.identifier}
                    </div>
                )
            }
        },
        {
            title: '租户手机号',
            dataIndex: 'customPhone',
            key: 'customPhone',
        },
        {
            title: '操作',
            dataIndex: 'x',
            key: 'x',
            render:(text:any,record:any)=>{
                return (
                    <div>
                        <Button type='primary' onClick={()=>tooldHetong(record)}>详情</Button>
                    </div>
                )
            }
        },
    ];
    const tooldHetong=(e)=>{
        history.push(`/check/contractezold?id=${e.id}`);
    };
    const getContainerStyle = () => {
        return {
            padding: windowWidth <= 480 ? '1rem' : '2rem',
            maxWidth: windowWidth <= 480 ? '100%' : '1200px',
            margin: '0 auto',
            backgroundColor: '#f5f6fa',
            minHeight: '90vh'
        };
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
    const getNavBarStyle = () => {
        return {
            '--height': windowWidth <= 480 ? '40px' : '48px',
            '--border-bottom': 'none',
            '--background-color': '#fff',
            '--color': '#333',
            '--font-size': windowWidth <= 480 ? '16px' : '18px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
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
                                    { value:3, label: '已退租' },
                                    { value:4, label: '续租中' },
                                ]}
                            />
                        </Space.Compact>
                        <Input
                            onChange={changeName}
                            addonBefore="租户姓名:"
                            value={name}
                        />
                    </Space>
                    <Space style={{marginBottom:'10px'}}>
                        <DateRangePicker  onDateSelected={changeDate}/>
                        <Button type="primary" onClick={sousuo}>
                            搜索
                        </Button>
                    </Space>
                </List.Item>
            </List>
            <div style={{ display: 'flex', flexDirection: 'column', height: '60vh', overflowY: 'auto' }}>
                {props.StaffList&&props.StaffList.length>0?props.StaffList.map((item)=>(
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
                        <div style={getTextStyle()}>租户: {item.customName}</div>
                        <div style={getTextStyle()}>起租日: {dayjs(item.beginTime).format("YYYY-MM-DD")}</div>
                        <div style={getTextStyle()}>到期日: {dayjs(item.endTime).format("YYYY-MM-DD")}</div>
                        <div style={getTextStyle()}>租金(元): {item.zuMoney}</div>
                        <div style={getTextStyle()}>合同押金(元): {item.deposit}</div>
                        <div style={getTextStyle()}>管理费(元): {item.manageFee}</div>
                        <div style={getTextStyle()}>预付费(元): {item.prepayment}</div>
                        <div style={getTextStyle()}>管理费押金(元): {item.depositFee}</div>
                        <div style={getTextStyle()}>合同类型: {item.templateType==1?<Tag color='cyan'>定金合同</Tag>:<Tag color='purple'>正式合同</Tag>}</div>
                        <div style={getTextStyle()}>状态:  {item.contractStatus === 1 ? (
                            <Tag color='red'>未审核</Tag>
                        ) : item.contractStatus === 2 ? (
                            <Tag color='green'>已审核</Tag>
                        ) : item.contractStatus === 3 ? (
                            <Tag color='orange'>退租</Tag>
                        ) : item.contractStatus === 4 ? (
                            <Tag color='orange'>续租</Tag>
                        ): (
                            <Tag color='grey'>未知状态</Tag>
                        )}</div>
                        <div style={getTextStyle()}>
                            <Space>
                                {item.contractStatus==1||item.contractStatus==4?
                                    <>
                                        {/*<Button type='link' onClick={()=>toedit(record)}>编辑</Button>*/}
                                        {uqx[208]=='1'? <Button type='primary' onClick={()=>isCheck(item)}>审核</Button> :''}
                                    </>:<>
                                    </>
                                }
                            </Space>
                        </div>
                    </div>
                )):''}
            </div>
            <div style={{display:'flex',justifyContent:'space-around',marginTop:'5px',flexWrap:'wrap'}}>
                <div>租金:{props.count?props.count.zuMoney.toFixed(2):''}元</div>
                <div>押金:{props.count?props.count.deposit.toFixed(2):''}元</div>
                <div>管理费:{props.count?props.count.manageFee.toFixed(2):''}元</div>
                <div>预付费:{props.count?props.count.prepayment.toFixed(2):''}元</div>
                <div>管理费押金:{props.count?props.count.depositFee.toFixed(2):''}元</div>
            </div>
            {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
            {/*    审核通过的弹窗*/}
            <Modal title='审核合同' open={isOpen} onCancel={()=>setIsOpen(false)} onOk={checkOk} loading={spinning}>
                <div>是否要审核通过？</div>
            </Modal>
            {/*发送弹窗*/}
            <Modal open={fsOpen} title='选择小程序用户' onCancel={()=>setFsOpen(false)} onOk={onFsOk} loading={spinning}>

            </Modal>
            {/* 续租前合同列表弹窗*/}
            <Modal open={xuOpen} title={'续租前合同列表'} onCancel={()=>setxuOpen(false)} width={800}>
                <Table
                    columns={xucolumns}
                    dataSource={oldList}
                    pagination={false}
                    rowKey={(columns) => columns.id}
                />
            </Modal>
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        StaffList: state.CheckStaff.list,
        count: state.CheckStaff.count,
    }
};
export default connect(mapStateToProps) (CheckZsContracte)