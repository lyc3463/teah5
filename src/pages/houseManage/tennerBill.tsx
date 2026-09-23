import {history,connect,useNavigate} from "umi";
import {useEffect, useState} from "react";
import dayjs from "dayjs";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {Button, Input, List, message, Space, Table, Tag} from "antd";
import {NavBar} from "antd-mobile";

const TennerBill=(props:any)=>{
    const navigate=useNavigate();
    // 账单列表
    const [billList,setbillList]=useState([]);
    // 合同编号
    const [identifier,setidentifier]=useState('');
    // 初始租金
    const [rent,setrent]=useState(0);
    // 初始管理费
    const [manageFee,setmanageFee]=useState(0);
    // 管理费递增
    const [manageFeeRent,setmanageFeeRent]=useState(0);
    // 租户姓名
    const [tenant_name,settenant_name]=useState('');
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    // 获取账单列表
    const getbillList=(tenantId)=>{
        props.dispatch({
            type:'HouseBill/fetch',
            payload:{tenantId}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setbillList(res.Data.data);
                setidentifier(res.Data.identifier);
                setrent(res.Data.rent);
                setmanageFee(res.Data.manageFee);
                setmanageFeeRent(res.Data.manageFeeRent);
                settenant_name(res.Data.tenant_name);
            }else {
                message.warning(res.Data);
            }
        })
    };
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        getbillList(id);
    }, []);
    const columns =[
        {
            title: '账单日期',
            dataIndex: 'allDate',
            key: 'allDate',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        {`${dayjs(record.monthBeginDate).format("YYYY-MM-DD")}至${dayjs(record.monthEndDate).format("YYYY-MM-DD")}`}
                    </div>
                )
            }
        },
        {
            title: '租金',
            dataIndex: 'rent',
            key: 'rent',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        {record.rent}元
                    </div>
                )
            }
        },
        {
            title: '管理费',
            dataIndex: 'manageFee',
            key: 'manageFee',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        {record.manageFee}元
                    </div>
                )
            }
        },
        {
            title: '免租天数',
            dataIndex: 'rentFreeDay',
            key: 'rentFreeDay',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        {record.rentFreeDay==0?<Tag color='#999'>{record.rentFreeDay}天</Tag>:<Tag color='magenta'>{record.rentFreeDay}日</Tag>}
                    </div>
                )
            }
        },
        {
            title: '应交租金',
            dataIndex: 'payRent',
            key: 'payRent',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        {record.payRent==0?<Tag color='warning'>{record.payRent}元</Tag>:<Tag color='magenta'>{record.payRent}元</Tag>}
                    </div>
                )
            }
        },
        {
            title: '应缴费用',
            dataIndex: 'payManageFee',
            key: 'payManageFee',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        {record.payManageFee==0?<Tag color='warning'>{record.payManageFee}元</Tag>:<Tag color='magenta'>{record.payManageFee}元</Tag>}
                    </div>
                )
            }
        },
        {
            title: '预付费',
            dataIndex: 'prepayment',
            key: 'prepayment',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        {record.prepayment==0?<Tag color='#999'>{record.prepayment}元</Tag>:<Tag color='magenta'>{record.prepayment}元</Tag>}
                    </div>
                )
            }
        },
        {
            title: '当月账单',
            dataIndex: 'billMoney',
            key: 'billMoney',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        {record.billMoney==0?<Tag color='magenta'>{record.billMoney}元</Tag>:<Tag color='blue'>{record.billMoney}元</Tag>}
                    </div>
                )
            }
        },
        {
            title: '缴费状态',
            dataIndex: 'billStatus',
            key: 'billStatus',
            render:(text:any,record:any)=>{
                let consumptionTypeText;
                switch (record.billStatus) {
                    case 1:
                        consumptionTypeText = <Tag color='blue'>未交</Tag>;
                        break;
                    case 2:
                        consumptionTypeText = <Tag color='green'>已交</Tag>;
                        break;
                    case 3:
                        consumptionTypeText = <Tag color='orange'>已退租</Tag>;
                        break;
                    default:
                        consumptionTypeText = <Tag color='red'>未知类型</Tag>;
                }
                return(
                    <div>
                        {consumptionTypeText}
                    </div>
                )
            }
        },
    ];
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
        <div style={getContainerStyle()}>
            <NavBar
                onBack={() =>navigate(-1)}
                style={{
                    '--height': '48px',
                    '--border-bottom': 'none',
                    '--background-color': '#fff'
                }}
            >
                租户账单
            </NavBar>
            <List>
                <List.Item style={{ padding: '12px 16px' }}>
                    <div style={{ marginBottom: '8px' }}>
                        <Space size='large'>
                            <span style={{
                                fontWeight: '600',
                                width: '120px',
                                display: 'inline-block',
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                textOverflow: 'ellipsis'
                            }}>
                                租户姓名: <span>{tenant_name}</span>
                            </span>
                            <span style={{
                                fontWeight: '600',
                                width: '150px',
                                display: 'inline-block',
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                textOverflow: 'ellipsis'
                            }}>
                            合同编号: {identifier}
                          </span>
                        </Space>
                    </div>
                    <Space size='large'>
                        <span style={{
                            fontWeight: '600',
                            width: '120px',
                            display: 'inline-block',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis'
                        }}>
                          初始租金: {`${rent}元`}
                        </span>
                        <span style={{
                            fontWeight: '600',
                            width: '150px',
                            display: 'inline-block',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis'
                        }}>
                          初始管理费: {`${manageFee}元`}
                        </span>
                    </Space>
                    <span style={{
                        fontWeight: '600',
                        width: '120px',
                        display: 'inline-block',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis'
                    }}>
                          管理费递增: {`${manageFeeRent}%`}
                        </span>
                </List.Item>
            </List>
            <div style={{ display: 'flex', flexDirection: 'column', height: '65vh', overflowY: 'auto' }}>
                {billList.map((item:any)=>(
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
                        <div style={getTextStyle()}>账单周期:{`${dayjs(item.monthBeginDate).format("YYYY-MM-DD")}至${dayjs(item.monthEndDate).format("YYYY-MM-DD")}`}</div>
                        <div style={getTextStyle()}>租金: {item.rent.toFixed(2)}元</div>
                        <div style={getTextStyle()}>管理费: {item.manageFee.toFixed(2)}元</div>
                        <div style={getTextStyle()}>免租天数: {item.rentFreeDay==0?<Tag color='#999'>{item.rentFreeDay}天</Tag>:<Tag color='magenta'>{item.rentFreeDay}日</Tag>}</div>
                        <div style={getTextStyle()}>应交租金:{item.payRent==0?<Tag color='warning'>{item.payRent}元</Tag>:<Tag color='magenta'>{item.payRent}元</Tag>}</div>
                        <div style={getTextStyle()}>应缴费用:{item.payManageFee==0?<Tag color='warning'>{item.payManageFee}元</Tag>:<Tag color='magenta'>{item.payManageFee}元</Tag>}</div>
                        <div style={getTextStyle()}>预付费:{item.prepayment==0?<Tag color='#999'>{item.prepayment}元</Tag>:<Tag color='magenta'>{item.prepayment}元</Tag>}</div>
                        <div style={getTextStyle()}>当月账单:{item.billMoney==0?<Tag color='magenta'>{item.billMoney}元</Tag>:<Tag color='blue'>{item.billMoney}元</Tag>}</div>
                        <div style={getTextStyle()}>缴费状态: {item.billStatus === 1 ? (<Tag color='red'>未交</Tag>) : item.billStatus === 2 ? (<Tag color='blue'>已交</Tag>) : item.billStatus === 3 ? (<Tag color='orange'>已退租</Tag>) : (<Tag color='grey'>未知状态</Tag>)}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}
export default connect() (TennerBill)