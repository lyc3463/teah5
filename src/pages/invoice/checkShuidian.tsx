import {connect, history} from 'umi'
import {useEffect, useState} from "react";
import dayjs from "dayjs";
import {
    Button,
    DatePicker,
    Form,
    Image,
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
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {joinUnitNames} from "@/utils/OpenTool";

const CheckShuidian=(props)=>{
    const [isLoading,setIsLoading]=useState(false);
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    const [openId,setOpenId]=useState(0);
    const [stutes,setStutes]=useState(0);
    const [uid,setUid]=useState(0);
    const [checkOpen,setCheckOpen]=useState(false);
    // 开始时间
    const [startDate,setStartDate]=useState('2000-01-01');
    // 结束时间
    const [endDate,setEndDate]=useState('2099-01-01');
    //抬头名称
    const [riseName,setriseName]=useState('');
    // 租户名称
    const [tenantName,settenantName]=useState('');
    const [phone,setPhone]=useState('');
    const [type,setType]=useState(0);
    const [list,setList]=useState([]);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    // 去编辑页面
    const toedit=(e)=>{
        history.push(`/check/editCheckFpSD?id=${e.id}`);
    };
    // 监听页码
    const onChange=(e:number,pageSize:number)=>{
        setPage(e);
        setPageSize(pageSize);
    };
    // 分页
    const getfenyeInfo=()=>{
        props.dispatch({
            type:'CheckFpSD/fenye',
            payload:{startDate,endDate,openId,stutes,pageSize,riseName,tenantName,type,phone}
        });
    };
    // 列表
    const logFenye=()=>{
        props.dispatch({
            type:"CheckFpSD/fetch",
            payload:{page,startDate,endDate,openId,stutes,pageSize,riseName,tenantName,type,phone}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setList(res.Data);
            }
        })
    };
    useEffect(() => {
        logFenye();
    }, [page,pageSize]);
    useEffect(() => {
        getfenyeInfo();
        console.log('props',props);
        // getKuHuList();
    }, []);
    // 审核通过弹窗
    const onTongguo=(e)=>{
        setUid(e.id);
        setCheckOpen(true);
    };
    // 审核通过弹窗按钮
    const onOk=()=>{
        setIsLoading(true);
        props.dispatch({
            type:"CheckFpSD/check",
            payload:{uid}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('审核通过');
                setCheckOpen(false);
                setIsLoading(false);
                getfenyeInfo();
                logFenye();
            }else {
                message.error(res.Data);
                setIsLoading(false);
            }
        })
    };
    // 状态
    const changeStutes=(e)=>{
        setStutes(e);
    };
    const sousuo=()=>{
        setPage(1);
        getfenyeInfo();
        logFenye();
    };
    const changeriseName=(e)=>{
        setriseName(e.target.value);
    };
    const changPhone=(e)=>{
        setPhone(e.target.value);
    };
    const changetenantName=(e)=>{
        settenantName(e.target.value);
    };
    const changeType=(e)=>{
        setType(e);
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
        <Spin spinning={isLoading}>
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
                                }}
                            >
                                类型:
                            </div>
                            <Select
                                onChange={changeType}
                                value={type}
                                options={[
                                    { value: 0, label: '全部' },
                                    { value: 1, label: '电费' },
                                    { value: 2, label: '水费' },
                                ]}
                            />
                        </Space.Compact>
                        <Button type="primary" onClick={sousuo}>
                            搜索
                        </Button>
                        {/*{props.count?<span>共{props.count.moneySum.toFixed(2)}元</span>:''}*/}
                    </Space>
                    <List.Item>
                        <Space>
                            <Input
                                addonBefore="名称:"
                                value={tenantName}
                                onChange={changetenantName}
                            />
                            <Input
                                addonBefore="手机:"
                                value={phone}
                                onChange={changPhone}
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
                            <div style={getTextStyle()}><Tag color="blue">申请日期</Tag>:{dayjs(item.created).format('YYYY-MM-DD')}</div>
                            <div style={getTextStyle()}><Tag color="blue">姓名</Tag>: {item.tenant_name}</div>
                            <div style={getTextStyle()}><Tag color="green">联系方式</Tag>: {item.appUser_phone}</div>
                            <div style={getTextStyle()}><Tag color="orange">单元</Tag>: {joinUnitNames(item.unitList)}</div>
                            <div style={getTextStyle()}><Tag color="orange">抬头名称</Tag>: {item.rise_name}</div>
                            <div style={getTextStyle()}><Tag color="orange">账单类型</Tag>: {item.consumptionType==1?'电费':'水费'}</div>
                            <div style={getTextStyle()}><Tag color="orange">发票类型</Tag>: {item.invoiceType==1?'普票':'专票'}</div>
                            <div style={getTextStyle()}><Tag color="orange">开票金额</Tag>: {item.consumptionMoney.toFixed(2)}元</div>
                            <div style={getTextStyle()}><Tag color="orange">邮箱</Tag>: {item.email}</div>
                            <div style={getTextStyle()}><Tag color="orange">审核状态</Tag>: {item.invoiceStatus==2?<Tag color='green'>已审核</Tag>:<Tag color='red'>未审核</Tag>}</div>
                            <Space>
                                {item.invoiceStatus==1?<Button type='primary' onClick={()=>onTongguo(item)}>审核</Button>:''}
                                {/*<Button type='primary'>详情</Button>*/}
                            </Space>
                        </div>
                    ))}
                </div>
                {props.count?<Pagination
                    total={props.count.count}
                    showSizeChanger
                    pageSize={pageSize}
                    current={page}
                    onChange={onChange}
                    pageSizeOptions={[50,100,500,1000,10000]}
                    style={{ backgroundColor: '#fff', padding: '1rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}
                />:''}
            </div>
            {/*审核的弹窗*/}
            <Modal open={checkOpen} onOk={onOk} onCancel={()=>setCheckOpen(false)} title='审核发票'>
                <div>确定审核通过吗?</div>
            </Modal>
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        CheckFpList: state.CheckFpSD.list,
        count:state.CheckFpSD.count
    }
};
export default connect(mapStateToProps) (CheckShuidian)