import {Button, DatePicker, Form, Input, List, message, Modal, Pagination, Select, Space, Spin, Table, Tag} from 'antd';
import dayjs from "dayjs";
import {useEffect, useState} from "react";
import {connect} from "umi";
import * as CheckDeeptService from '@/services/checkDeept';
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
const CheckDeept = (props) => {
    // 当前页数
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    const [name,setName]=useState('');
    const [phone,setPhone]=useState('');
    // 开始时间
    const [startDate,setStartDate]=useState('2000-01-01');
    // 结束时间
    const [endDate,setEndDate]=useState('2099-01-01');
    const [stutes,setStutes]=useState(0);
    const [tenantId,setTenantId]=useState(0);
    const [uid,setUid]=useState(0);
    const [delOpen,setDelOpen]=useState(false);
    const [checkOpen,setCheckOpen]=useState(false);
    const [revokeOpen,setRevokeOpen]=useState(false);
    const [spinning,setspinning]=useState(false);
    const [drId,setDrID]=useState(0);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    // 驳回
    const isRevoke=(e)=>{
        setUid(e.id);
        setDrID(e.drId);
        setRevokeOpen(true);
    };
    // 驳回确定
    const revokeOk=()=>{
        setspinning(true);
        props.dispatch({
            type:'CheckDeept/check',
            payload:{
                uid:uid,
                status:3,
            },
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setRevokeOpen(false);
                setspinning(false);
                message.success('驳回成功');
                changeStatus(3)
            }else {
                message.error(res.ErrorCode + res.Data);
                setspinning(false);
                setRevokeOpen(false);
            }
        })
    };
    // 审核
    const isCheck=(e)=>{
        setUid(e.id);
        setDrID(e.drId);
        setCheckOpen(true);
    };
    // 审核确定
    const checkOk=()=>{
        setspinning(true);
        props.dispatch({
            type:'CheckDeept/check',
            payload:{
                uid:uid,
                status:2,
            },
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setCheckOpen(false);
                setspinning(false);
                message.success('审核成功');
                changeStatus(4)
            }else {
                message.error(res.ErrorCode + res.Data);
                setspinning(false);
                setCheckOpen(false);
            }
        })
    };
    // 修改账单状态
    const changeStatus=(e)=>{
        CheckDeeptService.reject(drId,e)
    };
    // 删除弹窗
    const isDel=(e)=>{
        setUid(e.id);
        setDelOpen(true);
    };
    // 删除确定
    const delOk=()=>{
        setspinning(true);
        props.dispatch({
            type:'CheckDeept/remove',
            payload:uid,
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('删除成功');
                setDelOpen(false);
                setspinning(false);
            }else {
                message.error(res.ErrorCode + res.Data);
                setDelOpen(false);
                setspinning(false);
            }
        })
    };
    // 监听姓名
    const changeName=(e)=>{
        setName(e.target.value);
    };
    // 监听手机号
    const changePhone=(e)=>{
        setPhone(e.target.value);
    };
    // 时间选择
    const changeDate=(_:any,data:string[])=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setStartDate('2000-01-01');
            setEndDate('2099-01-01');
        } else {
            setStartDate(data[0]);
            setEndDate(data[1]);
        }
    };
    // 监听状态
    const changeStutes=(e:number)=>{
        setStutes(e);
    };
    // 监听页数
    const onChange=(e:number,pageSize:number)=>{
        setPage(e);
        setPageSize(pageSize);
    };
    const getList=()=>{
        props.dispatch({
            type:'CheckDeept/fetch',
            payload:{page,pageSize,name,phone,startDate,endDate,tenantId,stutes}
        })
    };
    const getFenye=()=>{
        props.dispatch({
            type:'CheckDeept/fenye',
            payload:{pageSize,name,phone,startDate,endDate,tenantId,stutes}
        })
    };
    useEffect(() => {
        getList();
    }, [page,pageSize]);
    useEffect(() => {
        getFenye();
    }, []);
    const sousuo=()=>{
        setPage(1);
        getList();
        getFenye();
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
    return (
        <Spin spinning={spinning}>
            <List>
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
                            }}
                        >
                            状态:
                        </div>
                        <Select
                            onChange={changeStutes}
                            defaultValue={stutes}
                            style={{ width: 120 }}
                            options={[
                                { value:0, label: '全部' },
                                { value:1, label: '未审核' },
                                { value:2, label: '已审核' },
                            ]}
                        />
                    </Space.Compact>
                    <Button type="primary" onClick={sousuo}>
                        搜索
                    </Button>
                </Space>
                <List.Item>
                    <Space>
                        <Input
                            addonBefore="姓名:"
                            onChange={changeName}
                            value={name}
                        />
                        <Input
                            addonBefore="手机号:"
                            onChange={changePhone}
                            value={phone}
                        />
                    </Space>
                </List.Item>
            </List>
            <div style={{ display: 'flex', flexDirection: 'column', height: '65vh', overflowY: 'auto' }}>
                {props.CheckDeeptList&&props.CheckDeeptList.length>0?props.CheckDeeptList.map((item) => (
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
                        <p style={getTextStyle()}>申请日期: {dayjs(item.created).format('YYYY-MM-DD')}</p>
                        <p style={getTextStyle()}>押金名称: {item.depositName}</p>
                        <div style={getTextStyle()}>押金类型: {
                            // 修复：使用立即执行函数表达式(IIFE)并优化条件判断
                            (()=>{
                                if (item.depositType === 1) {
                                    return <Tag color='green'>公共押金</Tag>;
                                }
                                if (item.depositType === 2) {
                                    return <Tag color='orange'>装修押金</Tag>;
                                }
                                if (item.depositType === 3) {
                                    return <Tag color='red'>合同押金</Tag>;
                                }
                                // 添加默认情况，避免undefined
                                return <Tag color='gray'>未知类型</Tag>;
                            })()
                        }</div>
                        <p style={getTextStyle()}>姓名: {item.tenant_name}</p>
                        <p style={getTextStyle()}>手机号: {item.tenant_phone}</p>
                        <p style={getTextStyle()}>金额(元): {item.price}</p>
                        <p style={getTextStyle()}>状态: {
                            // 修复：使用立即执行函数表达式(IIFE)
                            (()=>{
                                if (item.depositStatus === 1){
                                    return <Tag color='warning'>未审核</Tag>;
                                }
                                if (item.depositStatus === 2){
                                    return <Tag color='green'>已审核</Tag>;
                                }
                                if (item.depositStatus === 3){
                                    return <Tag color='red'>已驳回</Tag>;
                                }
                                // 添加默认情况，避免undefined
                                return <Tag color='gray'>未知状态</Tag>;
                            })()
                        }</p>
                        <Space>
                            {
                                item.depositStatus==1?<>
                                    <Button onClick={()=>{isDel(item)}} danger type='primary'>删除</Button>
                                    <Button onClick={()=>{isCheck(item)}} type='primary'>审核</Button>
                                    <Button type='primary' onClick={()=>{isRevoke(item)}}>驳回</Button>
                                </>:''
                            }
                            {
                                item.depositStatus==3?<Button type='primary' onClick={()=>{isDel(item)}} danger>删除</Button>:''
                            }
                        </Space>
                    </div>
                )):''}
            </div>
            {/*<Table*/}
            {/*    columns={columns}*/}
            {/*    rowKey={(columns) => columns.id}*/}
            {/*    pagination={false}*/}
            {/*    dataSource={props.CheckDeeptList}*/}
            {/*    size='small'*/}
            {/*    scroll={{y:'60vh',x:1500}}*/}
            {/*    rowClassName={(record, index) =>*/}
            {/*        index % 2 === 1 ? 'tbodd' : 'tbeven'*/}
            {/*    }*/}
            {/*/>*/}
            {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
            {/*删除弹窗*/}
            <Modal open={delOpen} onCancel={()=>setDelOpen(false)} onOk={delOk} loading={spinning}>
                <div>
                    <p>确定删除吗？</p>
                </div>
            </Modal>
            {/*审核弹窗*/}
            <Modal open={checkOpen} onCancel={()=>setCheckOpen(false)} onOk={checkOk} loading={spinning}>
                <div>
                    <p>确定审核吗？</p>
                </div>
            </Modal>
            {/*驳回弹窗*/}
            <Modal open={revokeOpen} onCancel={()=>setRevokeOpen(false)} onOk={revokeOk} loading={spinning}>
                <div>
                    <p>确定驳回吗？</p>
                </div>
            </Modal>
        </Spin>
    )
};
const mapStateToProps = (state: any) => {
    return {
        CheckDeeptList: state.CheckDeept.list,
        count: state.CheckDeept.count
    }
};

export default  connect(mapStateToProps)(CheckDeept)
