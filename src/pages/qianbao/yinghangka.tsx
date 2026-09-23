import {Button, Input, List, message, Modal, Select, Space, Table, Tag} from "antd";
import {history,connect} from "umi";
import {useEffect, useState} from "react";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {StaticInfo} from "@/StaticInfo";
import dayjs from "dayjs";
import {NavBar} from "antd-mobile";

const Yinghangka=(props:any)=>{
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    const [name,setName]=useState('');
    const [phone,setPhone]=useState('');
    const [uid,setUid]=useState(0);
    const [isOpen,setOpen]=useState(false);
    const [yhk,setYhk]=useState('');
    const [did,setDid]=useState(0);
    const [isOffOpen,setisOffOpen]=useState(false);
    const [isONOpen,setisONOpen]=useState(false);
    const [dataSource,setdataSource]=useState([]);

    // 用户权限
    const [uqx,setUqx]=useState([]);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const columns =[
        {
            title: '户名',
            dataIndex: 'accountName',
            key: 'accountName',
        },
        {
            title: '银行卡号',
            dataIndex: 'cardNum',
            key: 'cardNum',
        },
        {
            title: '预留手机号',
            dataIndex: 'bankPhone',
            key: 'bankPhone',
        },
        {
            title: '开户行',
            dataIndex: 'bankName',
            key: 'bankName',
        },
        {
            title: '是否为默认卡',
            dataIndex: 'isDefault',
            key: 'isDefault',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        {record.isDefault==1?<Tag color='green'>是</Tag>:<Tag color='red'>否</Tag>}
                    </div>
                )
            }
        },
        {
            title: '切换默认卡号',
            dataIndex: 'offon',
            key: 'offon',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        {record.isDefault==1?<Button onClick={()=>offOpen(record.id)} type='primary' danger >关闭默认</Button>:<Button type='primary' onClick={()=>onOpen(record.id)}>开启默认</Button>}
                    </div>
                )
            }
        },
        {
            title: '操作',
            dataIndex: 'caozuo',
            key: 'caozuo',
            render:(text:any,record:any)=>{
                return(
                    <Space>
                        {uqx[301]=='1'?<Button type='primary' onClick={()=>toedit(record.id)}>编辑</Button> :''}
                        {uqx[171]=='1'?<Button type='primary' danger onClick={()=>isdelete(record)}>删除</Button> :''}
                    </Space>
                )
            }
        },
    ];
    const toadd=()=>{
        history.push('/qianbao/addYinghangka')
    };
    const toedit=(e)=>{
        history.push(`/qianbao/editYinghangka?id=${e}`)
    };
    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"Yinghangka/fetch",
            payload:{page,name,phone,pageSize}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setdataSource(res.Data);
            }
        })
    };
    useEffect(() => {
        logFenye();
    }, [page,pageSize]);
    const sousuo=()=>{
        setPage(1);
        logFenye();
    };
    // 删除的弹窗
    const isdelete=(e:any)=>{
        setUid(e.id);
        setYhk(e.cardNum);
        setOpen(true);
    };
    const onOk=()=>{
        props.dispatch({
            type:"Yinghangka/remove",
            payload:uid
        }).then((res:any)=>{
            if (res.ErrorCode==0){
                message.success('删除成功');
                setOpen(false);
                logFenye();
            }else {
                message.error(res.Data)
            }
        })
    };
    // 关闭默认
    const offOpen=(e:number)=>{
        setDid(e);
        setisOffOpen(true)
    };
    // 关闭默认OK
    const onOffOK=()=>{
        props.dispatch({
            type:'Yinghangka/onisoff',
            payload:{did,stutes:0}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('关闭成功');
                setisOffOpen(false);
                logFenye();
            }else {
                message.error(res.Data);
                setisOffOpen(false);
            }
        })
    };
    // 开启是弹窗
    const onOpen=(e)=>{
        setDid(e);
        setisONOpen(true);
    };
    const onOnOK=()=>{
        props.dispatch({
            type:'Yinghangka/onisoff',
            payload:{did,stutes:1}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('开启成功');
                setisONOpen(false);
                logFenye();
            }else {
                message.error(res.Data);
                setisONOpen(false);
            }
        })
    };
    useEffect(() => {
        let uq=StaticInfo.uqx.split('');
        setUqx(uq);
    }, []);
    const changeName=(e)=>{
        setName(e.target.value);
    };
    const changePhone=(e)=>{
        setPhone(e.target.value);
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
        <div style={getContainerStyle()}>
            <NavBar
                onBack={() => history.back()}
                style={getNavBarStyle()}
            >
                银行卡列表
            </NavBar>
            <List>
                <List.Item>
                    <Space style={{marginBottom:'10px'}}>
                        {uqx[300]=='1'? <Button type="primary" onClick={toadd}>新增银行卡</Button>:''}
                        <Button type="primary" onClick={sousuo}>
                            搜索
                        </Button>
                    </Space>
                    <Space>
                        <Input
                            addonBefore="卡号:"
                            onChange={changeName}
                            value={name}
                        />
                        <Input
                            addonBefore="手机号:"
                            onChange={changePhone}
                            value={phone}
                        />

                    </Space>
                </List.Item>
            </List>
            <div style={{ display: 'flex', flexDirection: 'column', height: '65vh', overflowY: 'auto' }}>
                {dataSource.map((item) => (
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
                        <div style={getTextStyle()}>户名: {item.accountName}</div>
                        <div style={getTextStyle()}>银行卡号: {item.cardNum}</div>
                        <div style={getTextStyle()}>预留手机号: {item.bankPhone}</div>
                        <div style={getTextStyle()}>开户行: {item.bankName}</div>
                        <div style={getTextStyle()}>是否为默认卡: {item.isDefault==1?<Tag color='green'>是</Tag>:<Tag color='red'>否</Tag>}</div>
                        <div style={getTextStyle()}>切换默认卡号:{item.isDefault==1?<Button onClick={()=>offOpen(item.id)} type='primary' danger >关闭默认</Button>:<Button type='primary' onClick={()=>onOpen(item.id)}>开启默认</Button>}</div>
                        <div style={getTextStyle()}>操作:<Space>
                                {uqx[301]=='1'?<Button type='primary' onClick={()=>toedit(item.id)}>编辑</Button> :''}
                                {uqx[171]=='1'?<Button type='primary' danger onClick={()=>isdelete(item)}>删除</Button> :''}
                            </Space>
                        </div>

                    </div>
                ))}
            </div>
            {/*    删除弹窗*/}
            <Modal open={isOpen} onOk={onOk} title='删除' onCancel={()=>setOpen(false)}>
                <div>是否要删除银行卡:<span style={{color:'red'}}>{yhk}</span></div>
            </Modal>
            {/*关闭默认是弹窗*/}
            <Modal open={isOffOpen} onOk={onOffOK} onCancel={()=>setisOffOpen(false)}>
                <div>是否要关闭默认?</div>
            </Modal>
            {/*关闭默认是弹窗*/}
            <Modal open={isONOpen} onOk={onOnOK} onCancel={()=>setisONOpen(false)}>
                <div>是否要关闭默认?</div>
            </Modal>
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        YinghangkaList: state.Yinghangka.list
    }
};
export default connect(mapStateToProps) (Yinghangka)