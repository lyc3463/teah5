import {Button, Input, Table, Form, List, Space, Pagination, Image} from "antd";
import {connect} from "umi";
import {useEffect, useState} from "react";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {calculateSums, fuzzySearch} from "@/utils/OpenTool";
import {NavBar} from "antd-mobile";
import {history} from "@@/core/history";

const TenantList=(props:any)=>{
    const [name,setName]=useState('');
    const [phone,setPhone]=useState('');
    const [page,setPage]=useState(1);
    // 页数
    const [pagecount,setpagecount]=useState(50);
    // 单元名称
    const [unitName,setunitName]=useState('');
    // 展示的数据
    const [ZuhuList,setZuhuList]=useState([]);
    // 原数组
    const [oldZuhuList,setOldZuhuList]=useState([]);
    // 总条数
    const [count,setcount]=useState(0);
    // 公共押金
    const [depositSum,setdepositSum]=useState(0);
    // 账单金额
    const [billMoneySum,setbillMoneySum]=useState(0);
    // 积分
    const [integralSum,setintegralSum]=useState(0);
    // 余额
    const [balanceSum,setbalanceSum]=useState(0);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const columns =[
        {
            title: '单元名称',
            dataIndex: 'unitList',
            key: 'unitList',
            sorter: {
                compare: (a, b) => {
                    // 获取 a 和 b 的 unitList 中第一个 unit_name
                    const aUnitName = a.unitList[0]?.unit_name || '';
                    const bUnitName = b.unitList[0]?.unit_name || '';

                    // 比较 unit_name
                    if (aUnitName < bUnitName) return -1;
                    if (aUnitName > bUnitName) return 1;
                    return 0;
                },
                multiple: 1,
            },
            width:200,
            render: (text:any, record:any) => {
                const limitedUnitList = record.unitList.slice(0, 2);
                return(
                    <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>
                        {limitedUnitList.map((item, index) => (
                            <span key={index}>{item.unit_name}{index < limitedUnitList.length - 1 ? ',' : ''}</span>
                        ))}
                        {/* 如果 unitList 数组长度大于 2，则显示省略号或其他提示 */}
                        {record.unitList.length > 2 && <span>...</span>}
                    </div>
                )
            }
        },
        {
            title: '租户姓名',
            dataIndex: 'tenant_name',
            key: 'tenant_name',
        },
        {
            title: '联系方式',
            dataIndex: 'tenant_phone',
            key: 'tenant_phone',
        },
        {
            title: '身份证',
            dataIndex: 'tenant_card',
            key: 'tenant_card',
        },
        {
            title: '积分(分)',
            dataIndex: 'integral',
            key: 'integral',
            render:(text:any,record:any,)=>{
                return(
                    <div>
                        {record.integral.toFixed(2)}元
                    </div>
                )
            }
        },
        {
            title: '余额(元)',
            dataIndex: 'balance',
            key: 'balance',
            render:(text:any,record:any,)=>{
                return(
                    <div>
                        {record.balance.toFixed(2)}元
                    </div>
                )
            }
        },
        {
            title: '全部账单(元)',
            dataIndex: 'billMoney',
            key: 'billMoney',
            render:(text:any,record:any,)=>{
                return(
                    <div>
                        {record.billMoney.toFixed(2)}元
                    </div>
                )
            }
        },
        {
            title: '公共押金(元)',
            dataIndex: 'deposit',
            key: 'deposit',
            render:(text:any,record:any,)=>{
                return(
                    <div>
                        {record.deposit.toFixed(2)}元
                    </div>
                )
            }
        },
    ];
    useEffect(() => {
        logFenye();
    }, [page,pagecount]);
    useEffect(() => {
        logFenyeInfo();
    }, []);
    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"Zuhu/fetch",
            payload:{page,name,phone,pagecount}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setZuhuList(res.Data);
                setOldZuhuList(res.Data);
            }
        })
    };
    // 搜索按钮
    const shousuo=()=>{
        setPage(1);
        logFenyeInfo();
        logFenye()
    };
    const onChange=(val:number,pageSize:number)=>{
        setPage(val);
        setpagecount(pageSize);
    };
    // 查看分页记录
    const logFenyeInfo=()=>{
        props.dispatch({
            type:'Zuhu/fenye',
            payload:{name,phone,pagecount}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setcount(res.Data.count);
                setbalanceSum(res.Data.balanceSum);
                setbillMoneySum(res.Data.billMoneySum);
                setdepositSum(res.Data.depositSum);
                setintegralSum(res.Data.integralSum);
            }
        });
    };
    const chaxundanyuan=()=>{
        let a=fuzzySearch(oldZuhuList,unitName);
        setZuhuList(a);
        let b=calculateSums(a);
        setcount(a.length);
        setbalanceSum(b.balanceSum);
        setbillMoneySum(b.billMoneySum);
        setdepositSum(b.depositSum);
        setintegralSum(b.integralSum);
    };
    const changeName=(e)=>{
        setName(e.target.value);
    };
    const changePhone=(e)=>{
        setPhone(e.target.value);
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
        <div style={getContainerStyle()}>
            <NavBar
                onBack={() => history.back()}
                style={getNavBarStyle()}
            />
            <List>
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
                    <Space>
                        <Button type="primary" onClick={shousuo}>
                            搜索
                        </Button>
                    </Space>
                </List.Item>
            </List>
            <div style={{ display: 'flex', flexDirection: 'column', height: '65vh', overflowY: 'auto',marginBottom:'10px'}}>
                {
                    props.ZuhuList&&props.ZuhuList.length>0?props.ZuhuList.map((item:any)=>{
                        return (
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
                                <div style={getTextStyle()}>租户姓名: {item.tenant_name}</div>
                                <div style={getTextStyle()}>联系方式: {item.tenant_phone}</div>
                                <div style={getTextStyle()}>身份证: {item.tenant_card}</div>
                                <div style={getTextStyle()}>余额(元): {item.balance.toFixed(2)}</div>
                                <div style={getTextStyle()}>账单(元): {item.billMoney.toFixed(2)}</div>
                                <div style={getTextStyle()}>积分(分): {item.integral.toFixed(2)}</div>
                                <div style={getTextStyle()}>公告押金(元): {item.deposit.toFixed(2)}</div>
                            </div>
                        )
                    }):''
                }
            </div>
            <Pagination showSizeChanger total={count} pageSize={pagecount} current={page}  onChange={onChange} pageSizeOptions={[50, 100, 500, 1000,10000]}/>
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        ZuhuList: state.Zuhu.list,
        count: state.Zuhu.count,
    }
};
export default connect(mapStateToProps) (TenantList)