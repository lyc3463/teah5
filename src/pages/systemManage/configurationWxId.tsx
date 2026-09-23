import {Button, Form, Input, List, message, Modal, Radio, Space, Spin, Table, Tabs, Tag, Tooltip} from "antd";
import {useEffect, useState} from "react";
import * as AppPzService from '@/services/appPz';
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {history} from "@@/core/history";
import {NavBar} from "antd-mobile";
const ConfigurationWxId=()=>{
    const [spinning,setspinning]=useState(false);
    const [dataSource,setdataSource]=useState([]);
    const [name,setname]=useState('');
    const [uid,setUid]=useState(0);
    const [open,setopen]=useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const columns =[
        {
            title: '企业名称',
            dataIndex: 'qyName',
            key: 'qyName',
        },
        {
            title: '企业ID',
            dataIndex: 'authCorpId',
            key: 'authCorpId',
        },
        {
            title: '操作',
            dataIndex: 'xx',
            key: 'xx',
            render:(text:any,record:any)=>{
                return(
                    <Space>
                        <Button type='primary' danger onClick={()=>isDelete(record.id)} >删除</Button>
                        <Button type='primary' onClick={()=>toEdit(record.id)}>编辑</Button>
                    </Space>
                )
            }
        },
    ];
    const toadd=()=>{
        history.push('/systemManage/addConfigurationWxId/');
    };
    const toEdit=(e)=>{
        history.push(`/systemManage/editConfigurationWxId?id=${e}`);
    };
    const isDelete=(e)=>{
        setUid(e);
        setopen(true);
    };
    const getlist=()=>{
        setspinning(true);
        AppPzService.getWxInfoList(name).then((res:TypeErrorCode)=>{
            try {
                if(res.ErrorCode===0){
                    setdataSource(res.Data);
                    setspinning(false);
                }else {
                    message.error(res.Data);
                    setspinning(false);
                }
            }catch (e) {
                message.error(e);
                setspinning(false);
            }
        })
    };
    useEffect(()=>{
        getlist();
    },[]);
    const sousuo=()=>{
        getlist();
    };
    const onOk=()=>{
        setspinning(true);
        AppPzService.deleteWxInfo(uid).then((res:TypeErrorCode)=>{
            try {
                if(res.ErrorCode===0){
                    setspinning(false);
                    message.success('删除成功')
                    getlist();
                    setopen(false);
                }else {
                    message.error(res.Data);
                    setspinning(false);
                    setopen(false);
                }
            }catch (e) {
                message.error(e);
                setspinning(false);
                setopen(false);
            }
        })
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
        <div>
            <Spin spinning={spinning}>
                <List>
                    <List.Item>
                        <div>
                            <Button type="primary" onClick={toadd}>添加企业</Button>
                        </div>
                        <Space>
                            <Input
                                addonBefore="企业名称:"
                                onChange={(e)=>{
                                    setname(e.target.value);
                                }}
                            />
                            <Button type="primary" onClick={sousuo}>
                                搜索
                            </Button>
                        </Space>
                    </List.Item>
                </List>
                <div style={{ display: 'flex', flexDirection: 'column', height: '60vh', overflowY: 'auto' }}>
                    {dataSource&&dataSource.length>0?dataSource.map((item) => (
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
                            <div style={getTextStyle()}>企业名称: {item.qyName}</div>
                            <div style={getTextStyle()}>企业ID: {item.authCorpId}</div>
                            <div style={getTextStyle()}>操作:
                                <Space>
                                    <Button type='primary' danger onClick={()=>isDelete(item.id)} >删除</Button>
                                    <Button type='primary' onClick={()=>toEdit(item.id)}>编辑</Button>
                                </Space>
                            </div>
                        </div>
                    )):''}
                </div>
                <Modal open={open} loading={spinning} onCancel={()=>setopen(false)} onOk={onOk}>
                    <div>确定要删除吗？</div>
                </Modal>
            </Spin>
        </div>
    )
}
export default ConfigurationWxId