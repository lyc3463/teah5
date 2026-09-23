import {Button, DatePicker, Form, Input, List, message, Modal, Pagination, Select, Space, Spin, Table, Tag} from "antd";
import {connect, history} from "umi";
import dayjs from "dayjs";
import {useEffect, useState} from "react";
import {StaticInfo} from "@/StaticInfo";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {NavBar} from "antd-mobile";

const Custom=(props)=>{
    // 当前页数
    const [page,setPage]=useState(1);
    const [pageSize,setpageSize]=useState(50);
    // 客户名称
    const [customName,setCustomName]=useState('');
    // 开始时间
    const [customBeginTime,setCustomBeginTime]=useState('2000-01-01');
    // 结束时间
    const [customEndTime,setCustomEndTime]=useState('2099-01-01');
    // 审核状态  2全部，0未审核，1已审核
    const [customStatus,setCustomStatus]=useState(0);
    // 增加次数的id
    const [aid,setAid]=useState(0);
    // 增加到访次的弹窗
    const [aOpen,setAOpen]=useState(false);
    // 备注
    const [remark,setRemark]=useState('');
    // 删除的id
    const [did,setDid]=useState(0);
    const [dopen,setDopen]=useState(false);
    const [spinning,setspinning]=useState(false);
    // 用户权限
    const [uqx,setUqx]=useState([]);
    const [list,setList]=useState([]);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const toEdit=(e:number)=>{
        history.push(`/tenantList/editTenant?id=${e}`)
    };
    // 删除的弹窗
    const isdel=(e)=>{
        setDid(e);
        setDopen(true);
    };
    // 搜索
    const suosou=()=>{
        setPage(1);
        getFenyeInfo();
        logFenye();
    };
    const getFenyeInfo=()=>{
        props.dispatch({
            type:'Custom/fenye',
            payload:{customName,customBeginTime,customEndTime,customStatus,userId:StaticInfo.userId,pageSize}
        })
    };
    // 监听名字
    const changeName=(e)=>{
        setCustomName(e.target.value);
    };
    // 监听页数
    const onChange=(page:number,pageSize:number)=>{
        setPage(page);
        setpageSize(pageSize);
    };
    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"Custom/fetch",
            payload:{page,customName,customBeginTime,customEndTime,customStatus,userId:StaticInfo.userId,pageSize}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setList(res.Data);
            }
        })
    };
    // 时间选择
    const changeDate=(_:any,data:string[])=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setCustomBeginTime('2000-01-01');
            setCustomEndTime('2099-01-01');
        } else {
            setCustomBeginTime(data[0]);
            setCustomEndTime(data[1]);
        }
    };
    // 监听状态
    const changeStutes=(e:number)=>{
        setCustomStatus(e);
    };
    useEffect(() => {
        logFenye();
    }, [page]);
    useEffect(() => {
        let uq=StaticInfo.uqx.split('');
        setUqx(uq);
        getFenyeInfo();
    }, []);
    // 确定删除按钮
    const dopenOk=()=>{
        setspinning(true);
        props.dispatch({
            type:'Custom/remove',
            payload:did
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setspinning(false);
                setDopen(false);
                getFenyeInfo();
                logFenye();
                message.success('删除成功');
            }else{
                setspinning(false);
                setDopen(false);
                message.success(res.Data);
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
    // 来访渠道渲染
    const renderVisitor=(visitor_channels)=>{
        let consumptionTypeText;
        switch (visitor_channels) {
            case 1:
                consumptionTypeText = <Tag color='cyan'>中介</Tag>;
                break;
            case 2:
                consumptionTypeText = <Tag color='green'>自来</Tag>;
                break;
            case 3:
                consumptionTypeText = <Tag color='gold'>全民营销</Tag>;
                break;
            case 4:
                consumptionTypeText = <Tag color='geekblue'>线上</Tag>;
                break;
            default:
                consumptionTypeText = <Tag color='red'>未知类型</Tag>;
        }
        return (
            consumptionTypeText
        );
    };
    // 租赁原因渲染
    const renderReason_lease=(reason_lease)=>{
        let consumptionTypeText;
        switch (reason_lease) {
            case 1:
                consumptionTypeText = <Tag color='gold'>首次经营</Tag>;
                break;
            case 2:
                consumptionTypeText = <Tag color='lime'>平迁</Tag>;
                break;
            case 3:
                consumptionTypeText = <Tag color='green'>合同到期</Tag>;
                break;
            case 4:
                consumptionTypeText = <Tag color='cyan'>扩大</Tag>;
                break;
            case 5:
                consumptionTypeText = <Tag color='magenta'>缩小</Tag>;
                break;
            case 6:
                consumptionTypeText = <Tag color='gold'>开设分点</Tag>;
                break;
            default:
                consumptionTypeText = <Tag color='red'>未知类型</Tag>;
        }
        return (
            consumptionTypeText
        );
    };
    // 产品需求渲染
    const renderDemands=(demands)=>{
        let consumptionTypeText;
        switch (demands) {
            case 1:
                consumptionTypeText = <Tag color='gold'>精装修</Tag>;
                break;
            case 2:
                consumptionTypeText = <Tag color='lime'>简装</Tag>;
                break;
            case 3:
                consumptionTypeText = <Tag color='green'>毛坯</Tag>;
                break;
            default:
                consumptionTypeText = <Tag color='red'>未知类型</Tag>;
        }
        return (
            consumptionTypeText
        );
    };
    // 需求面积渲染
    const renderArea=(demands)=>{
        let consumptionTypeText;
        switch (demands) {
            case 1:
                consumptionTypeText = <Tag color='magenta'>100以下</Tag>;
                break;
            case 2:
                consumptionTypeText = <Tag color='volcano'>101-200</Tag>;
                break;
            case 3:
                consumptionTypeText = <Tag color='orange'>201-350</Tag>;
                break;
            case 4:
                consumptionTypeText = <Tag color='gold'>351-500</Tag>;
                break;
            case 5:
                consumptionTypeText = <Tag color='lime'>501-1000</Tag>;
                break;
            case 6:
                consumptionTypeText = <Tag color='green'>1000以上</Tag>;
                break;
            default:
                consumptionTypeText = <Tag color='red'>未知类型</Tag>;
        }
        return (
            consumptionTypeText
        );
    };
    const toadd=()=>{
        history.push('/tenantList/addtenant');
    };
    return(
        <Spin spinning={spinning}>
            <div style={getContainerStyle()}>
                <NavBar
                    onBack={() => history.back()}
                    style={getNavBarStyle()}
                />
                <List>
                    <List.Item>
                        <Space style={{marginBottom:'10px'}}>
                            <Button type="primary" onClick={toadd}>
                                录入客户
                            </Button>
                        </Space>
                        <Space>
                            <Input
                                addonBefore="客户姓名:"
                                onChange={changeName}
                                value={customName}
                            />
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
                            <p style={getTextStyle()}>日期: {dayjs(item.custom_date).format('YYYY-MM-DD')}</p>
                            {item.remark?<p style={getTextStyle()}>备注: {item.remark}</p>:''}
                            <p style={getTextStyle()}>姓名: {item.custom_name}</p>
                            <p style={getTextStyle()}>联系方式: {item.custom_phone}</p>
                            <p style={getTextStyle()}>来访渠道: {renderVisitor(item.visitor_channels)}</p>
                            <p style={getTextStyle()}>租赁原因: {renderReason_lease(item.reason_lease)}</p>
                            <p style={getTextStyle()}>产品需求: {renderDemands(item.demands)}</p>
                            <p style={getTextStyle()}>需求面积: {renderArea(item.required_area)}</p>
                            {item.visitor_position? <p style={getTextStyle()}>访客职位: {item.visitor_position}</p>:''}
                            {item.industry?<p style={getTextStyle()}>行业: {item.industry}</p>:''}
                            {item.office_area?<p style={getTextStyle()}>目前办公区域: {item.office_area}</p>:''}
                            {item.company_name?<p style={getTextStyle()}>公司名称: {item.company_name}</p>:''}
                            <p style={getTextStyle()}>来访次数: {item.visitor_number}次</p>
                            <p style={getTextStyle()}>状态:{item.custom_sattus==0?<Tag color="red">未审核</Tag>:<Tag color="green">已审核</Tag>}</p>
                            <Space>
                                {
                                    item.custom_sattus==0?
                                        <Space>
                                            {uqx[156]=='1'?<Button type='primary' danger onClick={()=>isdel(item.id)}>删除</Button>:''}
                                            {uqx[155]=='1'?<Button type='primary' onClick={()=>toEdit(item.id)}>编辑</Button>:''}
                                        </Space>:<></>
                                }
                            </Space>
                        </div>
                    ))}
                </div>
            </div>
            {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
            {/*    删除的弹窗*/}
            <Modal open={dopen} onOk={dopenOk} onCancel={()=>setDopen(false)} loading={spinning}>
                是否要删除?
            </Modal>
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        CustomList: state.Custom.list,
        count: state.Custom.count
    }
};

export default connect(mapStateToProps) (Custom)
