import {connect,history} from "umi";
import {Button, Input, List, message, Modal, Space, Table} from "antd";
import {useEffect, useState} from "react";
import {StaticInfo} from "@/StaticInfo";
import {NavBar} from "antd-mobile";

const Grouping=(props)=>{
    const [name,setName]=useState(sessionStorage.getItem('gateManageGroupingName')||'');
    // 用户权限
    const [uqx,setUqx]=useState([]);
    const [uid,setUid]=useState(0);
    const [open,setOpen]=useState(false);
    const [loading,setloading]=useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const columns = [
        {
            title: '分组名称',
            dataIndex: 'groupName',
        },
        {
            title: '操作',//简单常用操作放这里，复杂放详情
            dataIndex: 'operation',
            render: (text: any, record: any) => (
                <Space>
                    {uqx[305]=='1'?<Button type="primary" onClick={()=>toEdit(record.id)}>编辑</Button> :''}
                    {uqx[306]=='1'?<Button type="primary" danger onClick={()=>isdelete(record.id)}>删除</Button> :''}
                </Space>
            ),
        },
    ];
    const toadd=()=>{
        history.push('/gateManage/addGrouping');
    };
    const isdelete=(e)=>{
        setUid(e);
        setOpen(true);
    };
    const toEdit=(e:any)=>{
        history.push(`/gateManage/editGrouping?id=${e}`);
    };
    const sousuo=()=>{
        props.dispatch({
            type:'Grouping/fetch',
            payload:{name}
        })
    };
    useEffect(() => {
        sousuo();
    }, []);
    useEffect(() => {
        let uq=StaticInfo.uqx.split('');
        setUqx(uq);
    }, []);
    const changeName=(e)=>{
        setName(e.target.value);
        sessionStorage.setItem('gateManageGroupingName',e.target.value);
    };
    const onOk=()=>{
        props.dispatch({
            type:'Grouping/remove',
            payload:uid
        }).then((res:any)=>{
            if (res.ErrorCode==0){
                message.success('删除成功');
                setOpen(false);
            }else {
                message.error(res.Data);
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
                onBack={() => history.push('/dashboard/')}
                style={getNavBarStyle()}
            >
                分组列表
            </NavBar>
            <List>
                <List.Item>
                    <Space>
                        {uqx[304]=='1'?<Button type="primary" onClick={toadd}>新增下发分组</Button> :''}
                    </Space>
                    <Space>
                        <Input
                            addonBefore="分组名称:"
                            onChange={changeName}
                            value={name}
                        />
                        <Button type="primary" onClick={sousuo}>
                            搜索
                        </Button>
                    </Space>
                </List.Item>
            </List>
            <Table
                columns={columns}
                rowKey={(columns) => columns.id}
                pagination={false}
                dataSource={props.GroupingList}
                rowClassName={(record, index) =>
                    index % 2 === 1 ? 'tbodd' : 'tbeven'
                }
            />
            <Modal open={open} onOk={onOk} onCancel={()=>setOpen(false)} title='是否要删除' loading={loading}>
                <div>确定要删除?</div>
            </Modal>
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        GroupingList: state.Grouping.list
    }
};
export default connect(mapStateToProps) (Grouping)