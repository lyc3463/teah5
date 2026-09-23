import {Button, DatePicker, Image, Input, List, message, Modal, Space, Spin, Table, Tag} from "antd";
import {history,connect} from "umi";
import {useEffect, useState} from "react";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {StaticInfo} from "@/StaticInfo";
import {NavBar} from "antd-mobile";

const Role=(props)=>{
    const [uid,setUid]=useState(0);
    const [isOpen,setIsopen]=useState(false);
    const [isspinning,setisspinning]=useState(false);
    const [name,setName]=useState('');
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    // 用户权限
    const [uqx,setUqx]=useState([]);
    const columns =[
        {
            title: '角色名称',
            dataIndex: 'role_name',
            key: 'role_name',
        },
        {
            title: '操作',
            dataIndex: 'caozuo',
            key: 'caozuo',
            render:(text:any,record:any,)=>{
                return(
                    <Space>
                        {uqx[293]=='1'?<Button type='primary' onClick={()=>toedit(record.id)}>编辑</Button>:''}
                        {uqx[294]=='1'?<Button type='primary' danger onClick={()=>isdelete(record.id)}>删除</Button>:''}
                    </Space>
                )
            }
        },
    ];
    const toadd=()=>{
        history.push('/systemManage/addRole')
    };
    const toedit=(e)=>{
        history.push(`/systemManage/editRole?id=${e}`)
    };
    // 删除弹窗
    const isdelete=(e:number)=>{
        setUid(e);
        setIsopen(true);
    };
    const onOK=()=>{
        setisspinning(true);
        props.dispatch({
            type:'Role/remove',
            payload:uid
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('删除成功');
                setIsopen(false);
                setisspinning(false);
            }else {
                message.error(res.Data);
                setIsopen(false);
                setisspinning(false);
            }
        })
    };
    const sousuo=()=>{
        logfenye();
    };
    const logfenye=()=>{
        props.dispatch({
            type:"Role/fetch",
            payload:{name}
        })
    };
    useEffect(() => {
        let uq=StaticInfo.uqx.split('');
        setUqx(uq);
        logfenye();
    }, []);
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
                        {uqx[292]=='1'?<Button type="primary" onClick={toadd}>添加角色</Button>:''}
                    </div>
                    <List.Item>
                        <Space>
                            <Input
                                addonBefore="角色名称:"
                                onChange={(e)=>setName(e.target.value)}
                            />
                            <Button type="primary" onClick={sousuo}>
                                搜索
                            </Button>
                        </Space>
                    </List.Item>
                </List>
                <Table
                    rowKey={(columns) => columns.id}
                    columns={columns}
                    size='small'
                    style={{border:'1px solid #ddd',borderRadius:'4px'}}
                    pagination={false}
                    dataSource={props.RoleList}
                />
            </div>
            <Modal open={isOpen} onOk={onOK} onCancel={()=>setIsopen(false)} title='删除角色'>
                <div>
                    是否要删除角色
                </div>
            </Modal>
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        RoleList: state.Role.list,
    }
};
export default connect(mapStateToProps) (Role)