import dayjs from "dayjs";
import {Button, Input, List, message, Modal, Pagination, Space, Spin, Tag} from "antd";
import {connect,history} from "umi";
import {useEffect, useState} from "react";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";

const ChangePreferential=(props)=>{
    // 当前页数
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    // 手机号
    const [phone,setPhone]=useState('');
    // 状态 0全部，1未审核，2审核通过
    const [stutes,setStutes]=useState(1);
    // 开始时间
    const [startDate,setStartDate]=useState('2000-01-01');
    // 结束时间
    const [endDate,setEndDate]=useState('2099-01-01');
    // 审核弹窗
    const [isOpen,setIsOpen]=useState(false);
    const [uid,setUid]=useState(0);
    // 加载
    const [spinning,setspinning]=useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const [list,setList]=useState([]);
    const toInfo=(e:number)=>{
        history.push(`/check/preFerentialInfo?id=${e}`);
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
            type:"Preferential/fetch",
            payload:{page,phone,stutes,startDate,endDate,pageSize}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setList(res.Data?.data)
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
            type:'Preferential/fenye',
            payload:{phone,stutes,startDate,endDate,pageSize}
        })
    };
    // 审核弹窗
    const checkOp=(e)=>{
        setIsOpen(true);
        setUid(e);
    };
    useEffect(() => {
        fenyeinfo();
    }, []);
    const onOk=()=>{
        setspinning(true);
        props.dispatch({
            type:'Preferential/check',
            payload:uid
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('审核通过');
                setspinning(false);
                setIsOpen(false);
                logFenye();
            }else {
                message.error(res.Data);
                setspinning(false);
                setIsOpen(false);
                logFenye();
            }
        })
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
    const getSearchContainerStyle = () => {
        return {
            marginBottom: windowWidth <= 480 ? '1rem' : '2rem',
            padding: windowWidth <= 480 ? '0.8rem' : '1.6rem',
            backgroundColor: '#fff',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
            display: 'flex',
            flexDirection: windowWidth <= 480 ? 'column' : 'row',
            gap: windowWidth <= 480 ? '1rem' : '2rem'
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
    const getButtonStyle = () => {
        return {
            marginTop: windowWidth <= 480 ? '0.6rem' : '1.2rem',
            borderRadius: '8px',
            textTransform: 'capitalize'
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
    const getInputStyle = () => {
        return {
            width: windowWidth <= 480 ? '100%' : 'auto',
            borderRadius: '8px',
            borderColor: '#e0e0e0'
        };
    };
    const getSearchButtonStyle = () => {
        return {
            borderRadius: '8px',
            backgroundColor: '#1890ff',
            color: '#fff',
            transition: 'background-color 0.3s ease',
            '&:hover': {
                backgroundColor: '#40a9ff'
            }
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
        history.push('/enter/addPreferential');
    };
    const toedit=(e:number)=>{
        history.push(`/enter/editPreferential?id=${e}`);
    };
    return(
        <Spin spinning={spinning}>
            <div>
                <List>
                    <List.Item>
                        <Button type='primary' onClick={toadd}>优惠录入</Button>
                        <Space style={{marginTop:'10px'}}>
                            <Button type="primary" onClick={suosou}>
                                搜索
                            </Button>
                            <Input
                                addonBefore="手机号:"
                                onChange={changePhone}
                                value={phone}
                            />
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
                            <p style={getTextStyle()}>优惠周期:{dayjs(item.preBeginTime).format("YYYY-MM")}至{dayjs(item.preEndTime).format("YYYY-MM")}</p>
                            <p style={getTextStyle()}>申请优惠租金:{item.preRen.toFixed(2)}元</p>
                            <p style={getTextStyle()}>状态:{item.renameStatus==1?<Tag color='red'>未审核</Tag>:<Tag color='green'>已审核</Tag>}</p>
                            <Space>
                                {item.renameStatus==2?'':<Button type='primary' onClick={()=>toedit(item.id)}>编辑</Button>}
                            </Space>
                        </div>
                    ))}
                </div>
                {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
                <Modal title={'审核'} onCancel={()=>setIsOpen(false)} loading={spinning} open={isOpen} onOk={onOk}>
                    <div>是否要审核?</div>
                </Modal>
            </div>
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        PreferentialList: state.Preferential.list,
        count: state.Preferential.count,
    }
};
export default connect(mapStateToProps) (ChangePreferential)