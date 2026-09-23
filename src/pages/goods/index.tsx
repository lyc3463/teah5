import {Button, DatePicker, Input, List, message, Modal, Space, Spin, Table, Tag, Tooltip} from "antd";
import {useEffect, useState} from "react";
import {history,connect} from "umi";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {NavBar} from "antd-mobile";

const Goods=(props)=>{
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [spinning,setspinning]=useState(false);
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    const [tenantName,settenantName]=useState('');
    const [goodsName,setgoodsName]=useState('');
    const [userId,setuserId]=useState(0);
    const [uid,setUid]=useState(0);
    const [dOpen,setDoepn]=useState(false);

    const toadd=()=>{
        history.push('/goods/addGoods');
    };
    const toedit=(record)=>{
        history.push(`/goods/editGoods?id=${record}`);
    };
    const isdelete=(e)=>{
        setUid(e);
        setDoepn(true);
    };
    const getGoodsList=()=>{
        props.dispatch({
            type:'Goods/fetch',
            payload:{userId,page,pageSize,tenantName,goodsName}
        })
    };
    const getGoodsFY=()=>{
        props.dispatch({
            type:'Goods/fenye',
            payload:{userId,pageSize,tenantName,goodsName}
        })
    };
    const onOK=()=>{
        setspinning(true);
        props.dispatch({
            type:'Goods/remove',
            payload:uid,
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('删除成功');
                setspinning(false);
                setDoepn(false);
            }else {
                message.error(res.Data);
                setspinning(false);
            }
        })
    }
    useEffect(() => {
        getGoodsList();
    }, [page,pageSize]);
    useEffect(() => {
        getGoodsFY();
    }, []);
    const sousuo=()=>{
        setPage(1);
        getGoodsList();
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
    const getInputStyle = () => {
        return {
            width: windowWidth <= 480 ? '100%' : 'auto',
            borderRadius: '8px',
            borderColor: '#e0e0e0'
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
                    物品列表
                </NavBar>
                <List>
                    <List.Item>
                        <div>
                            <Button type="primary" onClick={toadd}>添加物品</Button>
                        </div>
                        <Space>
                            <Input
                                addonBefore="物品名称:"
                                value={goodsName}
                                onChange={(e)=>setgoodsName(e.target.value)}
                            />
                            <Button type="primary" onClick={sousuo}>
                                搜索
                            </Button>
                        </Space>
                    </List.Item>
                </List>
                <div style={{ display: 'flex', flexDirection: 'column', height: '65vh', overflowY: 'auto' }}>
                    {props.GoodsList&&props.GoodsList.length>0?props.GoodsList.map((item) => (
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
                            <p style={getTextStyle()}>物品名称: {item.goodName}</p>
                            <p style={getTextStyle()}>金额: {item.goodMoney}</p>
                            <p style={getTextStyle()}>金额类型:{item.goodType==2?<Tag color='green'>自定义金额</Tag>:<Tag color='blue'>固定金额</Tag>}</p>
                            <p style={getTextStyle()}>  <Space>
                                    <Button onClick={()=>toedit(item.id)} type='primary'>编辑</Button>
                                    <Button onClick={()=>isdelete(item.id)} type='primary' danger>删除</Button>
                                </Space>
                            </p>
                        </div>
                    )):''}
                </div>
                <Modal open={dOpen} loading={spinning} onCancel={()=>setDoepn(false)} onOk={onOK}>
                    <div>
                        确定删除吗？
                    </div>
                </Modal>
            </div>
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        GoodsList: state.Goods.list,
        count: state.Goods.count
    }
};
export default connect(mapStateToProps) (Goods)