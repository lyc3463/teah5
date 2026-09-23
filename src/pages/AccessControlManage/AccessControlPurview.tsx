import {
    Button,
    Form,
    Input,
    Select,
    Upload,
    DatePicker,
    List,
    Space,
    Table,
    Image,
    Tag,
    Pagination,
    Modal,
    message,
    Spin
} from "antd";
import {useEffect, useState} from "react";
import dayjs from "dayjs";
import {connect} from "umi";
import {StaticInfo} from "@/StaticInfo";
import {NavBar} from "antd-mobile";
import {history} from "@@/core/history";

const AccessControlPurview=(props:any)=>{
    // 当前页数
    const [page,setPage]=useState(1);
    const [pageSize,setpageSize]=useState(50);
    const [stutes,setStutes]=useState(2);
    // 姓名
    const [cname,setCname]=useState('');
    // 昵称
    const [nickname,setNickname]=useState('');
    // 手机号
    const [phone,setPhone]=useState('');
    const [companyName,setcompanyName]=useState('');
    // 弹窗状态
    const [isOpen,setOpen]=useState(false);
    // 删除的名字
    const [uname,setUname]=useState('');
    // 删除的ID
    const [uid,setUid]=useState(0);
    // 加载转圈
    const [spinning,setspinning]=useState(false);
    // 用户权限
    const [uqx,setUqx]=useState([]);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    // 搜索
    const sousuo=()=>{
        setPage(1);
        getFenyeInfo();
        logFenye();
    };
    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"CheckEmp/fetch",
            payload:{page,cname,nickname,phone,stutes,companyName,pageSize}
        })
    };
    const getFenyeInfo=()=>{
        props.dispatch({
            type:'CheckEmp/fenye',
            payload:{cname,nickname,phone,stutes,companyName,pageSize}
        });
    };
    // 监听页数
    const onChange=(e:number,pageSize:number)=>{
        setPage(e);
        setpageSize(pageSize);
    };
    useEffect(() => {
        logFenye();
    }, [page,pageSize]);
    // 监听员工姓名
    const changeName=(e)=>{
        setCname(e.target.value);
    };
    // 监听员工昵称
    const changeNickname=(e)=>{
        setNickname(e.target.value);
    };
    // 监听手机号
    const changePhone=(e)=>{
        setPhone(e.target.value);
    };
    // 删除弹窗
    const isDelete=(e:any)=>{
        setOpen(true);
        setUid(e.id);
        setUname(e.name);
    };
    // 确定删除
    const onOk=()=>{
        setspinning(true);
        props.dispatch({
            type:'CheckEmp/checkRemove',
            payload:uid
        }).then((res:any)=>{
            if (res.ErrorCode==0){
                message.success('删除成功');
                setOpen(false);
                setspinning(false);
                logFenye()
            }else {
                message.error(res.Data);
                setOpen(false);
                setspinning(false);
            }
        })
    };
    useEffect(() => {
        let uq=StaticInfo.uqx.split('');
        setUqx(uq);
        getFenyeInfo();
    }, []);
    const changeCompanyName=(e)=>{
        setcompanyName(e.target.value);
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
        <Spin spinning={spinning}>
            <div style={getContainerStyle()}>
                <NavBar
                    onBack={() => history.push('/dashboard/')}
                    style={getNavBarStyle()}
                >
                    人员权限
                </NavBar>
                <List>
                    <List.Item>
                        <Space style={{paddingBottom:'10px'}}>
                            <Button type="primary" onClick={sousuo}>搜索</Button>
                        </Space>
                        <Space>
                            <Input
                                onChange={changeName}
                                addonBefore="姓名:"
                                value={cname}
                            />
                            <Input
                                onChange={changeCompanyName}
                                addonBefore="公司:"
                                value={companyName}
                            />
                        </Space>
                    </List.Item>
                </List>
                <div style={{ display: 'flex', flexDirection: 'column', height: '65vh', overflowY: 'auto' }}>
                    {props.EmpList&&props.EmpList.length>0?props.EmpList.map((item) => (
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
                            <div style={getTextStyle()}>登记时间: {dayjs(item.begintime).format('YYYY-MM-DD')}</div>
                            <div style={getTextStyle()}>到期时间:  {dayjs(item.eendtime).format('YYYY-MM-DD')}</div>
                            <div style={getTextStyle()}>姓名: {item.name}</div>
                            <div style={getTextStyle()}>昵称: {item.nickname}</div>
                            <div style={getTextStyle()}>头像: <Image src={item.avatarBase64} style={{width:"50px",height:'50px'}}/></div>
                            <div style={getTextStyle()}>联系方式: {item.phone}</div>
                            <div style={getTextStyle()}>公司/单元: {item.companyName}</div>
                            <div style={getTextStyle()}>
                                {uqx[264]=='1'?<Button type='primary' onClick={()=>isDelete(item)}>删除</Button>:''}
                            </div>
                        </div>
                    )):''}
                </div>
                <div style={{ marginTop: windowWidth <= 480 ? '1rem' : '2rem', textAlign: 'center' }}>
                    {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
                </div>
                <Modal onOk={onOk} title='删除员工' open={isOpen} onCancel={()=>setOpen(false)}>
                    <div>{`是否要删除${uname}`}</div>
                </Modal>
            </div>
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        EmpList: state.CheckEmp.list,
        count: state.CheckEmp.count,
    }
};
export default connect(mapStateToProps) (AccessControlPurview)