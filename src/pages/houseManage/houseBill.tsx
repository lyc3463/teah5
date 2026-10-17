import {Button, Input, InputNumber, List, message, Modal, Pagination, Space, Spin, Table, Tag} from "antd";
import {connect,history} from "umi";
import {useEffect, useState} from "react";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import dayjs from "dayjs";
import {filterItemsWithUnitList, fuzzySearch} from "@/utils/OpenTool";
import {NavBar} from "antd-mobile";
import * as HouseBillService from "@/services/houseBill";
import TenantBill from "@/pages/houseManage/tennerBill";

const HouseBill=(props:any)=>{
    const [name,setName]=useState('');
    const [phone,setPhone]=useState('');
    const [page,setPage]=useState(1);
    const [count,setcount]=useState(1);
    const [pagecount,setpagecount]=useState(10000);
    const [zuhuList,setZuhuList]=useState([]);
    const [unitName,setunitName]=useState('');
    const [oldList,setOldList]=useState([]);
    const [spinning,setspinning]=useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [tenantBillList,setTenantBillList]=useState([]);
        const [openTenantBillModal,setOpenTenantBillModal]=useState(false);
        const [expandContractId, setExpandContractId] = useState<number | null>(null);

    useEffect(() => {
        // getFenye();
    }, []);
    useEffect(() => {
        logFenye();
    }, [page,pagecount]);
    // 分页
    const logFenye=()=>{
        if (name==''&&phone==''){
            props.dispatch({
                type:"BYZhuhu/fetch",
                payload:{page,name,phone,pagecount}
            }).then((res:TypeErrorCode)=>{
                if (res.ErrorCode==0){
                    let newArr= filterItemsWithUnitList(res.Data?.data);
                    setZuhuList(newArr);
                    setOldList(newArr);
                }else {
                    message.error(res.Data);
                }
            })
        }else {
            props.dispatch({
                type:"BYZhuhu/fetch",
                payload:{page,name,phone,pagecount}
            }).then((res:TypeErrorCode)=>{
                if (res.ErrorCode==0){
                    setZuhuList(res.Data?.data);
                    setOldList(res.Data?.data);
                }else {
                    message.error(res.Data);
                }
            })
        }
    };
    // 搜索按钮
    const shousuo=()=>{
        setPage(1);
        // getFenye();
        logFenye();
    };
    const onChange=(val:number,pageSize:number)=>{
        setPage(val);
        setpagecount(pageSize);
    };
    // const getFenye=()=>{
    //     props.dispatch({
    //         type:'BYZhuhu/fenye',
    //         payload:{name,phone,pagecount}
    //     }).then((res:TypeErrorCode)=>{
    //         if (res.ErrorCode==0){
    //             setcount(res.Data.count);
    //         }
    //     });
    // };
    const toinfo=(e)=>{
        //history.push(`/houseManage/tennerBill?id=${e}`)
        getbillList(e);
    };
    const getbillList=(tenantId)=>{
        HouseBillService.fetch(tenantId).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                const data = res.Data;
                if (!Array.isArray(data) || data.length === 0) {
                    message.warning("该租户暂无账单数据！");
                    return;
                }
                setTenantBillList(res.Data);
                setOpenTenantBillModal(true);
            }else {
                message.warning(res.Data);
            }
        })
    };
    const changeName=(e)=>{
        setName(e.target.value);
    };
    const changePhone=(e)=>{
        setPhone(e.target.value);
    };
    const chaxundanyuan=()=>{
        let a=fuzzySearch(oldList,unitName);
        setZuhuList(a);
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
            <div style={getContainerStyle()}>
                <NavBar
                    onBack={() => history.push('/dashboard/')}
                    style={{
                        '--height': '48px',
                        '--border-bottom': 'none',
                        '--background-color': '#fff'
                    }}
                >
                    房屋账单
                </NavBar>
                <List>
                    <List.Item>
                        <Input
                            addonBefore="姓名:"
                            onChange={changeName}
                            value={name}
                        />
                    </List.Item>
                    <List.Item>
                        <Space>
                            <Input
                                addonBefore="手机号:"
                                onChange={changePhone}
                                value={phone}
                            />
                            <Button type="primary" onClick={shousuo}>
                                搜索
                            </Button>
                        </Space>
                    </List.Item>
                </List>
                <div style={{ display: 'flex', flexDirection: 'column', height: '65vh', overflowY: 'auto' }}>
                    {zuhuList.map((item:any)=>(
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
                            <div style={getTextStyle()}><Button type='primary' onClick={()=>toinfo(item.id)}>详情</Button></div>
                        </div>
                    ))}
                </div>
                <Pagination total={count} pageSize={pagecount} current={page}  onChange={onChange}  showSizeChanger  />
                {/*点击详情弹窗*/}
                <Modal
                    open={openTenantBillModal}
                    footer={null}
                    onCancel={() => {
                        setOpenTenantBillModal(false);
                        setExpandContractId(null); // 关闭弹窗时收起
                    }}
                    width={900}
                >
                    <List
                        dataSource={tenantBillList}
                        renderItem={(item: any, index) => {
                            // 判断当前项是否展开
                            const isExpanded = expandContractId === item.contractId;
    
                            return (
                                <div
                                    style={{
                                        border: '1px solid #e8e8e8',
                                        borderRadius: 8,
                                        marginBottom: 12,
                                        overflow: 'hidden',
                                    }}
                                >
                                    {/* ========== 可点击的标题行（高亮+可点击样式） ========== */}
                                    <List.Item
                                        onClick={() => {
                                            // 点击切换展开/收起
                                            setExpandContractId(isExpanded ? null : item.contractId);
                                        }}
                                        style={{
                                            backgroundColor: '#f7f8fa',
                                            cursor: 'pointer',
                                            padding: '12px 16px',
                                        }}
                                    >
                                        <Space size="large" wrap>
                                            {/* 合同编号：高亮样式 */}
                                            <span style={{ fontWeight: 600, color: '#222', fontSize: 14 }}>
                                                合同编号：{item.identifier}
                                            </span>
                                            <span style={{ color: '#666' }}>
                                                {dayjs(item.beginTime).format('YYYY-MM-DD')} 至 {dayjs(item.endTime).format('YYYY-MM-DD')}
                                            </span>
                                            <span style={{ color: '#1890ff', fontSize: 12 }}>
                                                {isExpanded ? '▼ 点击收起' : '▶ 点击查看账单'}
                                            </span>
                                        </Space>
                                    </List.Item>
                                    {/* ========== 展开时才显示账单组件 ========== */}
                                    {isExpanded && (
                                        <div style={{ padding: 16, backgroundColor: '#fff' }}>
                                            <TenantBill contractInfo={item} />
                                        </div>
                                    )}
                                </div>
                            );
                        }}
                    />
                </Modal>
            </div>
        </Spin>
    )
};
const mapStateToProps = (state: any) => {
    return {
        ZuhuList: state.BYZhuhu.list,
    }
};
export default connect(mapStateToProps) (HouseBill)