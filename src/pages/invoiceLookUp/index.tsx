import {
    Button,
    DatePicker,
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
import dayjs from "dayjs";
import {history,connect} from "umi";
import {useEffect, useState} from "react";
import {StaticInfo} from "@/StaticInfo";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {NavBar} from "antd-mobile";
import {joinUnitNames} from "@/utils/OpenTool";
const InvoiceLookUp=(props:any)=>{
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    // 状态 0全部，1未审核，2审核通过
    const [stutes,setStutes]=useState(0);
    const [openID,setOpenID]=useState(0);
    const [name,setName]=useState('');
    const [checkOpen,setCheckOpen]=useState(false);
    // 审核id
    const [uid,setUid]=useState(0);
    // 删除id
    const [did,setDid]=useState(0);
    // 删除的弹窗
    const [deleteOpen,setDeleteOpen]=useState(false);
    // 删除的弹窗
    const [spinning,setspinning]=useState(false);
    const [list,setList]=useState([]);
    // 用户权限
    const [uqx,setUqx]=useState([]);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
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
    const onChange=(e:number,pageSize:number)=>{
        setPage(e);
        setPageSize(pageSize);
    };
    // 监听状态
    const changeStutes=(e:number)=>{
        setStutes(e);
    };
    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"InvoiceLookUp/fetch",
            payload:{page,name,stutes,openID,pageSize}
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
        getFenyeInfo();
        logFenye();
    };
    const getFenyeInfo=()=>{
        props.dispatch({
            type:'InvoiceLookUp/fenye',
            payload:{name,stutes,openID,pageSize}
        })
    };
    // 审核通过的弹窗
    const check=(e)=>{
        setUid(e.id);
        setCheckOpen(true);
    };
    // 确定审核通过
    const onCheckOK=()=>{
        setspinning(true);
        props.dispatch({
            type:'InvoiceLookUp/check',
            payload:{uid}
        }).then((res:any)=>{
            if (res.ErrorCode==0){
                message.success('审核通过');
                setCheckOpen(false);
                setspinning(false);
            }else {
                message.error(res.Data);
                setCheckOpen(false);
                setspinning(false);
            }
        })
    };
    // 删除的弹窗
    const deleteClick=(e)=>{
        setDid(e.id);
        setDeleteOpen(true);
    };
    const onDeleteOk=()=>{
        setspinning(true);
        props.dispatch({
            type:'InvoiceLookUp/remove',
            payload:did
        }).then((res:any)=>{
            if (res.ErrorCode==0){
                message.success('删除成功');
                setDeleteOpen(false);
                setspinning(false);
            }else {
                message.error(res.Data);
                setDeleteOpen(false);
                setspinning(false);
            }
        })
    };
    const toedit=(e)=>{
        history.push(`/enter/editInvoiceLookUp?id=${e.id}`);
    };
    useEffect(() => {
        let uq=StaticInfo.uqx.split('');
        setUqx(uq);
        getFenyeInfo();
    }, []);
    const changeName=(e)=>{
        setName(e.target.value);
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

    const getInputStyle = () => {
        return {
            width: windowWidth <= 480 ? '100%' : 'auto',
            borderRadius: '8px',
            borderColor: '#e0e0e0'
        };
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
                        <Space>
                            <Button type="primary" onClick={suosou}>
                                搜索
                            </Button>
                            <Input
                                addonBefore="抬头名称:"
                                onChange={changeName}
                                value={name}
                            />
                        </Space>
                        <Space style={{paddingTop:'10px'}}>
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
                                    value={stutes}
                                    style={{ width: 120 }}
                                    options={[
                                        { value:0, label: '全部' },
                                        { value:1, label: '未审核' },
                                        { value:2, label: '已审核' },
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
                            <div style={getTextStyle()}>抬头类型:{item.rise_type==1?<Tag color='green'>企业</Tag>:<Tag color='red'>个人</Tag>}</div>
                            <div style={getTextStyle()}>抬头名称:{item.rise_name}</div>
                            <p style={getTextStyle()}>单元:{joinUnitNames(item.unitList)}</p>
                            <div style={getTextStyle()}>租户姓名:{item.tenant_name}</div>
                            <div style={getTextStyle()}>联系方式: {item.tenant_phone}</div>
                            <div style={getTextStyle()}>状态:{item.riseStatus==2?<Tag color='green'>已审核</Tag>:<Tag color='red'>未审核</Tag>}</div>
                            <div style={getTextStyle()}>
                                {
                                    item.riseStatus==1?<Space>
                                        {/*{uqx[189]=='1'?<Button type='primary' danger onClick={()=>isDelete(item)}>删除</Button>:''}*/}
                                        {uqx[187]=='1'? <Button type='primary' onClick={()=>check(item)}>审核通过</Button> :''}
                                    </Space>:''
                                }
                            </div>
                        </div>
                    ))}
                </div>
                {/*<Table*/}
                {/*    columns={columns}*/}
                {/*    rowKey={(columns) => columns.id}*/}
                {/*    pagination={false}*/}
                {/*    size='small'*/}
                {/*    dataSource={props.InvoiceLookUpList}*/}
                {/*    rowClassName={(record, index) =>*/}
                {/*        index % 2 === 1 ? 'tbodd' : 'tbeven'*/}
                {/*    }*/}
                {/*/>*/}

                {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
            </div>
            {/*    审核的弹窗*/}
            <Modal onOk={onCheckOK} open={checkOpen} title={'审核通过'} onCancel={()=>setCheckOpen(false)} loading={spinning}>
                <div>确定审核通过吗?</div>
            </Modal>
            {/*    删除的弹窗*/}
            <Modal onOk={onDeleteOk} open={deleteOpen} title={'删除抬头'} onCancel={()=>setDeleteOpen(false)} loading={spinning}>
                <div>确定要删除吗?</div>
            </Modal>
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        InvoiceLookUpList: state.InvoiceLookUp.list,
        count: state.InvoiceLookUp.count,
    }
};
export default connect(mapStateToProps) (InvoiceLookUp)