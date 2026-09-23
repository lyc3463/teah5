import {Button, DatePicker, Input, List, message, Modal, Pagination, Select, Space, Spin, Table, Tag} from "antd";
import {history,connect} from "umi";
import dayjs from "dayjs";
import {useEffect, useState} from "react";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {NavBar} from "antd-mobile";

const CheckByStages=(props)=>{
    // 当前页数
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    // 手机号
    const [phone,setPhone]=useState('');
    // 状态 0全部，1未审核，2审核通过
    const [stutes,setStutes]=useState(0);
    // 开始时间
    const [startDate,setStartDate]=useState('2000-01-01');
    // 结束时间
    const [endDate,setEndDate]=useState('2099-01-01');
    // 审核弹窗open
    const [open,setOpen]=useState(false);
    // 删除的弹窗
    const [dopen,setdOpen]=useState(false);
    // 审核的id
    const [uid,setUid]=useState(0);
    // 删除的id
    const [did,setdUid]=useState(0);
    const [spinning,setspinning]=useState(false);
    const [list,setList]=useState([]);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    // 审核弹窗
    const checkOpen=(e)=>{
        setUid(e);
        setOpen(true);
    }
    const toedit=(e)=>{
        history.push(`/enter/editByStages?id=${e}`);
    };
    // 审核确定按钮
    const onOK=()=>{
        setspinning(true);
        props.dispatch({
            type:"ByStages/check",
            payload:uid
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('审核成功');
                setspinning(false);
                setOpen(false);
                logFenye();
            }else {
                message.error(res.Data);
                setspinning(false);
                setOpen(false);
            }
        })
    };
    // 监听页数
    const onChange=(e:number,pageSize:number)=>{
        setPage(e);
        setPageSize(pageSize);
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
    // 监听姓名
    const changePhone=(e)=>{
        setPhone(e.target.value);
    };
    // 监听状态
    const changeStutes=(e:number)=>{
        setStutes(e);
    };
    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"ByStages/fetch",
            payload:{page,phone,stutes,startDate,endDate,pageSize}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setList(res.Data);
            }
        })
    };
    useEffect(() => {
        logFenye();
    }, [page,pageSize]);
    // 搜索
    const suosou=()=>{
        setPage(1);
        fenyeinfo();
        logFenye();
    };
    const fenyeinfo=()=>{
        props.dispatch({
            type:'ByStages/fenye',
            payload:{phone,stutes,startDate,endDate,pageSize}
        })
    };
    useEffect(() => {
        fenyeinfo();
    }, []);
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
    const toadd=()=>{
        history.push('/enter/addByStages')
    };
    const IsDelOpen=(e)=>{
        setdUid(e);
        setdOpen(true);
    };
    const ondOk=()=>{
        setspinning(true);
        props.dispatch({
            type:'ByStages/remove',
            payload:did
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('删除成功');
                setspinning(false);
                setdOpen(false);
                logFenye();
            }else {
                message.error(res.Data);
                setspinning(false);
                setdOpen(false);
            }
        })
    };
    return(
        <Spin spinning={spinning}>
            <div>
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
                                    width:'40px'
                                }}
                            >
                                状态:
                            </div>
                            <Select
                                onChange={changeStutes}
                                defaultValue={stutes}
                                options={[
                                    { value:0, label: '全部' },
                                    { value:1, label: '未审核' },
                                    { value:2, label: '已审核' },
                                ]}
                            />
                        </Space.Compact>
                        <Input
                            addonBefore="手机号:"
                            onChange={changePhone}
                            value={phone}
                        />
                    </Space>
                    <List.Item>
                        <Space style={{marginTop:'10px'}}>

                            <Button type="primary" onClick={suosou}>
                                搜索
                            </Button>
                        </Space>
                    </List.Item>
                </List>
                <div style={{ display: 'flex', flexDirection: 'column', height: '65vh', overflowY: 'auto' }}>
                    {list.map((item) => (
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
                            <p style={getTextStyle()}>合同编号: {item.identifier}</p>
                            <p style={getTextStyle()}>租户名称: {item.tenant_name}</p>
                            <p style={getTextStyle()}>租户手机号: {item.tenant_phone}</p>
                            <p style={getTextStyle()}>分期周期:{dayjs(item.staBeginTime).format("YYYY-MM")}至{dayjs(item.staEndTime).format("YYYY-MM")}</p>
                            <p style={getTextStyle()}>还款周期:{dayjs(item.staBeginTime2).format("YYYY-MM")}至{dayjs(item.staEndTime2).format("YYYY-MM")}</p>
                            <p style={getTextStyle()}>租金分期金额:{item.staRent.toFixed(2)}元</p>
                            <p style={getTextStyle()}>状态:{item.renameStatus==1?<Tag color='red'>未审核</Tag>:<Tag color='green'>已审核</Tag>}</p>
                            <Space>
                                {item.renameStatus==2?'':
                                    <>
                                        <Button type='primary' onClick={()=>checkOpen(item.id)}>审核</Button>
                                        <Button type='primary' danger onClick={()=>IsDelOpen(item.id)}>删除</Button>
                                    </>
                                }
                            </Space>
                        </div>
                    ))}
                </div>
                {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
                {/*    审核弹窗*/}
                <Modal title={'审核'} loading={spinning} onOk={onOK} onCancel={()=>setOpen(false)} open={open}>
                    <div>确定要审核吗?</div>
                </Modal>
                <Modal onOk={ondOk} onCancel={()=>setdOpen(false)} loading={spinning} open={dopen} title='是否要删除?'>
                    <div>
                        是否要删除?
                    </div>
                </Modal>
            </div>
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        ByStagesList: state.ByStages.list,
        count: state.ByStages.count,
    }
};
export default connect(mapStateToProps) (CheckByStages)