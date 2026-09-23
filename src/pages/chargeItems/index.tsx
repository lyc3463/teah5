import {connect,history} from 'umi';
import {Button, Input, List, message, Modal, Pagination, Select, Space, Spin, Table, Tag} from "antd";
import {useEffect, useState} from "react";
import {StaticInfo} from "@/StaticInfo";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {NavBar} from "antd-mobile";
function ChargeItems(props: any) {
    const [loading, setLoading] = useState(false);
    // 当前页数
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    // 参数名称
    const [cname,setCname]=useState('');
    // 收费类型
    const [feetype,setFeetype]=useState(0);
    // 删除的弹窗
    const [open,setOpen]=useState(false);
    // ID
    const [uid,setUid]=useState(0);
    // 删除的名字
    const [uname,setUname]=useState('');
    // 用户权限
    const [uqx,setUqx]=useState([]);
    const [list,setList]=useState([]);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const tianjia = () => {
        history.push('/chargeItems/addChargeItems/');
    };
    const toedit=(e:number)=>{
        history.push(`/chargeItems/editShoufei?id=${e}`);
    };
    // 监听收费项目名称
    const changeName=(e)=>{
        setCname(e.target.value);
    };
    // 监听收费类型
    const changeType=(e)=>{
        setFeetype(e)
    };
    // 搜索
    const sousuo=()=>{
        setPage(1);
        getFyInfo();
        logFenye();
    };
    const getFyInfo=()=>{
        props.dispatch({
            type:'Gongsi/fenye',
            payload:{cname,feetype,pageSize}
        });
    };
    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"Gongsi/fetch",
            payload:{page,cname,feetype,pageSize}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setList(res.Data);
            }
        })
    };
    // 监听页数
    const onChange=(e:number,pageSize:number)=>{
        setPage(e);
        setPageSize(pageSize);
    };
    useEffect(() => {
        logFenye();
    }, [page]);
    useEffect(() => {
        getFyInfo();
    }, []);
    const deteleOpen=(e)=>{
        setUid(e.id);
        setUname(e.item_name);
        setOpen(true);
    };
    const onOk=()=>{
        props.dispatch({
            type:"Gongsi/remove",
            payload:uid
        }).then((res:any)=>{
            if (res.ErrorCode==0){
                message.success('删除成功');
                setOpen(false);
                logFenye();
            }else {
                message.error(res.Data);
            }
        })
    };
    useEffect(() => {
        let uq=StaticInfo.uqx.split('');
        setUqx(uq);
    }, []);
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
    // 渲染周期性收费
    const renderChargeType = (itemType) => {
        let displayText;
        switch (itemType) {
            case 1:
                displayText = <Tag color='green'>周期性收费</Tag>;
                break;
            case 2:
                displayText =  <Tag color='blue'>一次性收费</Tag>;
                break;
            case 3:
                displayText = <Tag color='cyan'>押金类收费</Tag>;
                break;
            default:
                displayText = <Tag color='red'>未知类型</Tag>;
        }
        return displayText;
    };
    // 渲染金额计算方式
    const renderMonthly_amount = (itemType) => {
        let displayText;
        switch (itemType) {
            case 1:
                displayText = <Tag color='pink'>固定金额</Tag>;
                break;
            case 2:
                displayText =  <Tag color='blue'>按单价收费</Tag>;
                break;
            case 3:
                displayText = <Tag color='cyan'>每户手动输入</Tag>;
                break;
            default:
                displayText = <Tag color='red'>未知类型</Tag>;
        }
        return displayText;
    };
    return (
        <Spin spinning={loading}>
            <div style={getContainerStyle()}>
                <NavBar
                    onBack={() => history.push('/dashboard')}
                    style={{
                        '--height': '48px',
                        '--border-bottom': 'none',
                        '--background-color': '#fff'
                    }}
                >
                    收费项目
                </NavBar>
                <List>
                    <List.Item>
                       <Space>
                           <div>
                               {uqx[169]=='1'?<Button type="primary" onClick={tianjia}>创建收费项目</Button>:''}
                           </div>
                           <Button type="primary" onClick={sousuo}>
                               搜索
                           </Button>
                       </Space>
                        <Space style={{marginTop:'10px'}}>
                            <Input
                                onChange={changeName}
                                addonBefore="名称:"
                                value={cname}
                            />
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
                                    类型:
                                </div>
                                <Select
                                    onChange={changeType}
                                    defaultValue={0}
                                    style={{ width: 120 }}
                                    options={[
                                        { value: 0, label: '全部' },
                                        { value: 1, label: '周期收费' },
                                        { value: 2, label: '一次性收费' },
                                        { value: 3, label: '押金类收费' },
                                    ]}
                                />
                            </Space.Compact>
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
                            <p style={getTextStyle()}>名称: {item.item_name}</p>
                            <p style={getTextStyle()}>收费类型: {renderChargeType(item.itemType)}</p>
                            <p style={getTextStyle()}>月金额计算方式: {renderChargeType(item.monthly_amount)}</p>
                            <Space>
                                {uqx[171]=='1'?<Button type="primary" danger onClick={()=>deteleOpen(item)}>删除</Button>:''}
                                {uqx[170]=='1'?<Button type="primary" onClick={()=>toedit(item.id)}>编辑</Button>:''}
                            </Space>
                        </div>
                    ))}
                </div>
                {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
            </div>
            {/*删除的弹窗*/}
            <Modal open={open} onCancel={()=>setOpen(false)} title='删除收费项目' onOk={onOk}>
                <div>
                    <span>是否要删除：<span style={{color:'red'}}>{uname}</span></span>
                </div>
            </Modal>
        </Spin>
    );
}


const mapStateToProps = (state: any) => {
    return {
        GongsiList: state.Gongsi.list,
        count: state.Gongsi.count
    }
};

export default connect(mapStateToProps)(ChargeItems);

