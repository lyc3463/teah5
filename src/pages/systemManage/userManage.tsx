import {Button, Form, Image, Input, List, message, Modal, Select, Space, Spin, Table, Tag} from "antd";
import {history,connect} from 'umi'
import {useEffect, useState} from "react";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {StaticInfo} from "@/StaticInfo";
import {NavBar} from "antd-mobile";
import dayjs from "dayjs";
const UserManage=(props:any)=>{
    const [did,setDid]=useState(0);
    const [isspinning,setisspinning]=useState(false);
    const [isopen,setisopen]=useState(false);
    const [page,setPage]=useState(1);
    const [name,setName]=useState('');
    const [phone,setPhone]=useState('');
    const [tid,setTid]=useState(0);
    const [isEnable,setisEnable]=useState(1);
    const [isEnableOpen,setisEnableOpen]=useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    // 用户权限
    const [uqx,setUqx]=useState([]);
    const isTingyong=(e)=>{
        setTid(e.id);
        if (e.isEnable==1){
            setisEnable(0);
        }else {
            setisEnable(1);
        }
        setisEnableOpen(true);
    };
    const toadd=()=>{
        history.push('/systemManage/addUser/')
    };
    const toEdit=(e:number)=>{
        history.push(`/systemManage/editUser?id=${e}`)
    };
    useEffect(() => {
        let uq=StaticInfo.uqx.split('');
        setUqx(uq);
    }, []);
    const isDelete=(e:number)=>{
        setisopen(true);
        setDid(e);
    };
    // 获取用户列表
    const getUserList=()=>{
        props.dispatch({
            type:"Users/fetch",
            payload:{phone,is_zb:1}
        })
    };
    const onOk=()=>{
        setisspinning(true);
        props.dispatch({
            type:'Users/remove',
            payload:did
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('删除成功');
                setisopen(false);
                setisspinning(false);
            }else {
                message.error(res.Data);
                setisopen(false);
                setisspinning(false);
            }
        })
    };
    const sousuo=()=>{
        getUserList();
    };
    // 停用启用账号
    const deactivateOrEnable=()=>{
        setisspinning(true);
        props.dispatch({
            type:"Users/deactivate",
            payload:{tid,isEnable}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('修改成功');
                setisspinning(false);
                setisEnableOpen(false);
            }else {
                message.error(res.Data);
                setisspinning(false);
                setisEnableOpen(false);
            }
        })
    };
    useEffect(() => {
        getUserList();
    }, []);
    const onEnableOk=()=>{
        deactivateOrEnable();
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
    const getContainerStyle = () => {
        return {
            padding: windowWidth <= 480 ? '1rem' : '2rem',
            maxWidth: windowWidth <= 480 ? '100%' : '1200px',
            margin: '0 auto',
            backgroundColor: '#f5f6fa',
            minHeight: '90vh'
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
        <Spin spinning={isspinning}>
            <div style={getContainerStyle()}>
                <NavBar
                    onBack={() => history.push('/dashboard/')}
                    style={getNavBarStyle()}
                >
                    管理员列表
                </NavBar>
                <List>
                    <div>
                        {uqx[215]=='1'?<Button type="primary" onClick={toadd}>添加管理员</Button>:''}
                    </div>
                    <List.Item>
                        <Space>
                            <Input
                                addonBefore="手机号码:"
                                onChange={(e)=>setPhone(e.target.value)}
                            />
                            <Button type="primary" onClick={sousuo}>
                                搜索
                            </Button>
                        </Space>
                    </List.Item>
                </List>
                <div style={{ display: 'flex', flexDirection: 'column', height: '60vh', overflowY: 'auto' }}>
                    {props.UsersList&&props.UsersList.length>0?props.UsersList.map((item) => (
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
                            <div style={getTextStyle()}>用户姓名: {item.user_name}</div>
                            <div style={getTextStyle()}>联系方式: {item.phone}</div>
                            <div style={getTextStyle()}>状态: {item.isEnable==1?<Tag color='blue'>启用</Tag>:<Tag color='red'>停用</Tag>}</div>
                            <div style={getTextStyle()}>操作:
                                <Space>
                                    {uqx[217]=='1'?<Button type='primary' danger onClick={()=>isDelete(item.id)} >删除</Button>:''}
                                    {uqx[216]=='1'?<Button type='primary' onClick={()=>toEdit(item.id)}>编辑</Button>:''}
                                    <Button type='primary' danger onClick={()=>isTingyong(item)}>{item.isEnable==1?'停用':'启用'}</Button>
                                </Space>
                            </div>

                        </div>
                    )):''}
                </div>
            </div>
            <Modal open={isopen} onOk={onOk} onCancel={()=>setisopen(false)} loading={isspinning}>
                <div>是否要删除?</div>
            </Modal>
            <Modal open={isEnableOpen} onOk={onEnableOk} onCancel={()=>setisEnableOpen(false)} loading={isspinning}>
                <div>是否要停用该账号?</div>
            </Modal>
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        UsersList: state.Users.list,
    }
};
export default connect(mapStateToProps) (UserManage)