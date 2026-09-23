import {Button, DatePicker, Input, List, message, Pagination, Space, Spin, Table, Tag} from "antd";
import {connect} from "umi";
import dayjs from "dayjs";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import * as WatertService from '@/services/watert';
import {useEffect, useState} from "react";
import {NavBar} from "antd-mobile";
import {history} from "@@/core/history";

const CableJournaling=(props)=>{
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    const [count,setcount]=useState(0);
    const [waterList,setwaterList]=useState([]);
    // 水表地址
    const [waterAddress,setwaterAddress]=useState('');
    // 租户名称
    const [name,setName]=useState('');
    // 水表备注
    const [remark,setremark]=useState('');
    // 当前水量统计
    const [total_used_amount,settotal_used_amount]=useState(0);
    // 积累用水
    const [waterNumSum,setwaterNumSum]=useState(0);
    const [spinning,setspinning]=useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    // 获取水表报表
    const getWaterList=()=>{
        setspinning(true);
        WatertService.fetch({page,name,waterAddress,remark,pageSize}).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setwaterList(res.Data);
                setspinning(false);
            }else {
                message.error(res.Data);
                setspinning(false);
            }
        })
    };
    // 获取水表分页
    const getWaterListfenye=()=>{
        WatertService.fenye({name,waterAddress,remark,pageSize}).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                settotal_used_amount(res.Data.total_used_amount);
                setwaterNumSum(res.Data.waterNumSum);
                setcount(res.Data.count)
            }else {
                message.error(res.Data)
            }
        })
    };
    const sousuo=()=>{
        setPage(1);
        getWaterListfenye();
        getWaterList();
    };
    useEffect(() => {
        getWaterList()
    }, [page,pageSize]);
    useEffect(() => {
        getWaterListfenye();
    }, []);
    const onChange=(e,pageSize)=>{
        setPage(e);
        setPageSize(pageSize);
    };
    const changeRemark=(e)=>{
        setremark(e.target.value);
    };
    const changeName=(e)=>{
        setName(e.target.value);
    };
    const changeWaterAddress=(e)=>{
        setwaterAddress(e.target.value);
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
                    style={{
                        '--height': '48px',
                        '--border-bottom': 'none',
                        '--background-color': '#fff'
                    }}
                >
                    水表统计
                </NavBar>
                <List>
                    <List.Item>
                        <Space>
                            <Input
                                addonBefore="水表编号:"
                                onChange={changeWaterAddress}
                                value={waterAddress}
                            />
                            <Input
                                addonBefore="水表备注:"
                                onChange={changeRemark}
                                value={remark}
                            />
                        </Space>
                    </List.Item>
                    <Space>
                        <Input
                            addonBefore="租户名称:"
                            onChange={changeName}
                            value={name}
                        />
                        <Button type="primary" onClick={sousuo}>
                            搜索
                        </Button>
                    </Space>
                </List>
                <div style={{ display: 'flex', flexDirection: 'column', height: '65vh', overflowY: 'auto' }}>
                    {waterList.map((item:any)=>(
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
                            <div style={getTextStyle()}>电表地址: {item.address}</div>
                            <div style={getTextStyle()}>电表描述: {item.remark}</div>
                            <div style={getTextStyle()}>租户: {item.tenant_name}</div>
                            <div style={getTextStyle()}>积累用水量: {item.waterNumSum}m³</div>
                            <div style={getTextStyle()}>当前用水量: {item.total_used_amount}m³</div>

                        </div>
                    ))}
                </div>
                <Pagination total={count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>
            </div>
        </Spin>
    )
}

export default connect() (CableJournaling)