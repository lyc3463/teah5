import {connect, history} from 'umi'
import {useEffect, useState} from "react";
import {Button, Input, List, message, Modal, Select, Space, Spin, Table, Tag} from "antd";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {StaticInfo} from "@/StaticInfo";
import {NavBar} from "antd-mobile";
const WaterAndElectricityPrices=(props:any)=>{
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [loading, setLoading] = useState(false);
    // 删除的弹窗
    const [isOpen,setIsOpen]=useState(false);
    const [uid,setUid]=useState(0);
    // 参数名称
    const [cname,setCname]=useState('');
    // 收费类型
    const [priceType,setPriceType]=useState(0);
    // 1水价 2电价 0全部
    const [we_type,setwe_type]=useState(0);
    // 用户权限
    const [uqx,setUqx]=useState([]);
    const columns = [
        {
            title: '名称',
            dataIndex: 'price_name',
        },
        {
            title: '类型',
            dataIndex: 'price_type',
            render: (text: any, record: any) =>{
                let displayText;
                switch (record.price_type) {
                    case 1:
                        displayText = <Tag color='green'>水价</Tag>;
                        break;
                    case 2:
                        displayText =  <Tag color='lime'>阶梯水价</Tag>;
                        break;
                    case 3:
                        displayText = <Tag color='cyan'>单费率电价</Tag>;
                        break;
                    case 4:
                        displayText = <Tag color='red'>多费率电价</Tag>;
                        break;
                    case 5:
                        displayText = <Tag color='blue'>阶梯电价</Tag>;
                        break;
                    default:
                        displayText = text || <Tag color='red'>未知类型</Tag>;
                }
                return displayText;
            }
        },
        {
            title: '操作',//简单常用操作放这里，复杂放详情
            dataIndex: 'operation',
            render: (_: any, record: any) => (
                <Space>
                    {uqx[183]=='1'?<Button type="primary" danger onClick={()=>isDelete(record)}>删除</Button> :''}
                    {/*{uqx[181]=='1'?<Button type="primary" onClick={()=>toedit(record.we_type,record.id)}>编辑</Button> :''}*/}

                </Space>

            ),
        },
    ];
    const toaddshui=()=>{
        history.push('/waterAndElectricityPrices/addWacthItem');
    };
    const toadddian=()=>{
        history.push('/waterAndElectricityPrices/addEleItem');
    };
    // 去编辑页面
    const toedit=(we_type:number,id:number)=>{
        if (we_type==2){
            history.push(`/waterCableManage/editCableParameter?id=${id}`);
        }else {
            history.push(`/waterCableManage/editWaterParameter?id=${id}`);
        }
    };
    // 监听参数名称
    const changeName=(e)=>{
        setCname(e.target.value);

    };
    // 监听价钱类型
    const changeType=(e)=>{
        setPriceType(e);
    };
    // 搜索
    const sousuo= ()=>{
        props.dispatch({
            type:'CableParameter/sousuo',
            payload:{cname,priceType,we_type}
        })
    };
    // 删除弹窗
    const isDelete=(e:any)=>{
        setUid(e.id);
        setIsOpen(true);
    };
    // 确定删除按钮
    const onOk=()=>{
        setLoading(true);
        props.dispatch({
            type:'CableParameter/remove',
            payload:uid
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('删除成功');
                setLoading(false);
                setIsOpen(false);
                sousuo();
            }else {
                message.error(res.Data);
                setLoading(false);
                setIsOpen(false);
                sousuo();
            }
        })
    };
    useEffect(() => {
        sousuo();
    }, []);
    const changeWeType=(e)=>{
        setwe_type(e);
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
                水电价参数列表
            </NavBar>
            <Spin spinning={loading}>

                <List>
                    <List.Item>
                        <div>
                            {uqx[182]=='1'?<Space>
                                    <Button type="primary" onClick={toaddshui}>添加水价参数</Button>
                                    <Button type="primary" onClick={toadddian}>添加电价参数</Button>
                                </Space>
                                :''
                            }
                        </div>
                        <Space style={{marginTop:'10px'}}>
                            <Input
                                addonBefore="参数名称:"
                                onChange={changeName}
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
                    dataSource={props.CableParameterList}
                    pagination={false}
                    size='small'
                    rowClassName={(record, index) =>
                        index % 2 === 1 ? 'tbodd' : 'tbeven'
                    }
                />
                <Modal open={isOpen} onCancel={()=>setIsOpen(false)} onOk={onOk}>
                    <div>确定要删除吗?</div>
                </Modal>
            </Spin>
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        CableParameterList: state.CableParameter.list
    }
};

export default connect(mapStateToProps) (WaterAndElectricityPrices)