import {
    Button,
    DatePicker,
    Input,
    List,
    message,
    Modal,
    Pagination,
    Select,
    Space,
    Spin,
    Table,
    Tag,
    Tooltip
} from "antd";
import {useEffect, useState} from "react";
import {history,connect} from "umi";
import dayjs from "dayjs";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {StaticInfo} from "@/StaticInfo";
import {NavBar} from "antd-mobile";

const TenantNotification=(props:any)=>{
    const [loading,setLoading]=useState(false)
    // 开始时间
    const [startDate,setStartDate]=useState('2000-01-01');
    // 结束时间
    const [endDate,setEndDate]=useState('2099-01-01');
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    const [stutes,setStutes]=useState(0);
    const [openid,setOpenid]=useState(0);
    // 租户手机号
    const [phone,setPhone]=useState('');
    // 发送内容
    const [content,setContent]=useState('');
    const [uid,setUid]=useState(0);
    const [dopen,setdopen]=useState(false);
    // 用户权限
    const [uqx,setUqx]=useState([]);
    const [list,setList]=useState([]);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const toadd=()=>{
        history.push('/tenantNotification/addTenantNotification')
    };
    useEffect(() => {
        logFenye();
    }, [page,pageSize]);
    // 删除的弹窗
    const onDelete=(record:any)=>{
        setUid(record.id);
        setdopen(true);
    };
    const logFenye=()=>{
        props.dispatch({
            type:"TenantInfo/fetch",
            payload:{page,content,phone,startDate,endDate,stutes,openid,pageSize}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setList(res.Data);
            }
        })
    };
    const sousuo=()=>{
        setPage(1);
        getFenye();
        logFenye();
    };
    const getFenye=()=>{
        props.dispatch({
            type:"TenantInfo/fenye",
            payload:{content,phone,startDate,endDate,stutes,openid,pageSize}
        });
    };
    const onChange=(e:number,pageSize:number)=>{
        setPage(e);
        setPageSize(pageSize);
    };
    // 确定删除
    const onOk=()=>{
        setLoading(true);
        props.dispatch({
            type:"TenantInfo/remove",
            payload:uid
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('删除成功');
                setLoading(false);
                setdopen(false);
            }else {
                message.error(res.Data);
                setLoading(false);
                setdopen(false);
            }
        });
    };
    useEffect(() => {
        let uq=StaticInfo.uqx.split('');
        setUqx(uq);
        getFenye();
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
            alignItems: 'center',
            whiteSpace: 'nowrap',    // 禁止文本换行
            overflow: 'hidden',      // 隐藏溢出内容
            textOverflow: 'ellipsis'
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
    const changeName=(e)=>{
        setContent(e.target.value);
    };
    return(
        <Spin spinning={loading}>
            <div style={getContainerStyle()}>
                <NavBar
                    onBack={() => history.back()}
                    style={{
                        '--height': '48px',
                        '--border-bottom': 'none',
                        '--background-color': '#fff'
                    }}
                >
                    租户通知
                </NavBar>
                <List>
                    <List.Item>
                        <div>
                            <div>
                                {uqx[260]=='1'?<Button type="primary" onClick={toadd}>通知用户</Button> :''}
                            </div>
                        </div>
                        {/*<Space>*/}
                        {/*    <Input*/}
                        {/*        onChange={changeName}*/}
                        {/*        addonBefore="消息内容:"*/}
                        {/*    />*/}
                        {/*    <Button type="primary" onClick={sousuo}>*/}
                        {/*        搜索*/}
                        {/*    </Button>*/}
                        {/*</Space>*/}
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
                            <p style={getTextStyle()}>日期: {dayjs(item.messageTime).format('YYYY-MM-DD')}</p>
                            <p style={getTextStyle()}>租户名称: {item.tenant_name}</p>
                            <p style={getTextStyle()}>标题: {item.messageTitle}</p>
                            <p style={getTextStyle()}>消息内容: {item.message_content}</p>
                        </div>
                    ))}
                </div>
            </div>
            {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
            <Modal title='删除租户消息' open={dopen} loading={loading} onOk={onOk} onCancel={()=>setdopen(false)}>
                <div>是否要删除</div>
            </Modal>
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        TenantInfoList: state.TenantInfo.list,
        count: state.TenantInfo.count
    }
};
export default connect(mapStateToProps) (TenantNotification)