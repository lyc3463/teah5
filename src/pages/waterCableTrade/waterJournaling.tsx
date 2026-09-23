import {Button, DatePicker, Input, List, message, Modal, Pagination, Space, Spin, Table, Tag} from "antd";
import {connect} from "umi";
import {useEffect, useState} from "react";
import dayjs from "dayjs";
import * as CableService from '@/services/cable';
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {NavBar} from "antd-mobile";
import {history} from "@@/core/history";
interface PayInfo {
    address: string;
    remark: string;
    tenant_name: string;
    eleNumSum: number;
    lossTotal: number;
    c0: number;
    lossSum: number;
    loss: number;
    lossCycleOut: number;
    // 其他支付相关字段
}
const initialPayInfo: PayInfo = {
    address: '',
    remark: '',
    tenant_name: '',
    c0: 0,
    eleNumSum: 0,
    lossTotal: 0,
    lossSum: 0,
    loss: 0,
    lossCycleOut: 0,
};
const WaterJournaling=(props)=>{
    const [page,setpage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    const [collectorId,setcollectorId]=useState('');
    // 列表
    const [dataSource,setdataSource]=useState([]);
    // 租户名称
    const [name,setName]=useState('');
    // 电表描述
    const [remark,setremark]=useState('');
    // 页码
    const [count,setcount]=useState(0);
    // 当前电量统计
    const [c0Sum,setc0Sum]=useState(0);
    //  积累用电量统计
    const [eleNumSum,seteleNumSum]=useState(0);
    // 总累计消耗金额统计
    const [lossTotal,setlossTotal]=useState(0);
    // 租户累计损耗统计
    const [lossSum,setlossSum]=useState(0);
    // 租户当前损耗金额统计
    const [lossCycleOut,setlossCycleOut]=useState(0);
    const [spinning,setspinning]=useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [payInfo, setPayInfo] = useState<PayInfo>(initialPayInfo);
    const [open,setOpen]=useState(false);
    // 获取电表报表列表
    const getCableList=()=>{
        setspinning(true);
        CableService.fetch({page,collectorId,name,remark,pageSize}).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setdataSource(res.Data);
                setspinning(false);
            }else {
                message.error(res.Data);
                setspinning(false);
            }
        })
    };
    // 获取分页信息
    const getCableListFenye=()=>{
        CableService.fenye({collectorId,name,remark,pageSize}).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setc0Sum(res.Data.c0Sum);
                setcount(res.Data.count);
                seteleNumSum(res.Data.eleNumSum);
                setlossTotal(res.Data.lossTotal);
                setlossSum(res.Data.lossSum);
                setlossCycleOut(res.Data.lossCycleOut);
            }else {
                message.error(res.Data);
            }
        })
    };
    const sousuo=()=>{
        setpage(1);
        getCableListFenye();
        getCableList();
    };
    const onChange=(e,pageSizz)=>{
        setpage(e);
        setPageSize(pageSizz);
    };
    useEffect(() => {
        getCableListFenye();
    }, []);
    useEffect(() => {
        getCableList();
    }, [page,pageSize]);
    const changeRemark=(e)=>{
        setremark(e.target.value);
    };
    const changeName=(e)=>{
        setName(e.target.value);
    };
    const changeCollectorId=(e)=>{
        setcollectorId(e.target.value);
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
    const toinfo=(e:PayInfo)=>{
        setPayInfo(e);
        setOpen(true);
    };
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
                    电表服务费统计
                </NavBar>
                <List>
                    <List.Item>
                        <Space>
                            <Input
                                addonBefore="电表地址:"
                                onChange={changeCollectorId}
                                value={collectorId}
                            />
                            <Input
                                addonBefore="电表描述:"
                                onChange={changeRemark}
                                value={remark}
                            />
                        </Space>
                    </List.Item>
                    <List.Item>
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
                    </List.Item>
                </List>
                <div style={{ display: 'flex', flexDirection: 'column', height: '65vh', overflowY: 'auto' }}>
                    {dataSource.map((item:any)=>(
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
                            {/*<div style={getTextStyle()}>电表地址: {item.address}</div>*/}
                            <div style={getTextStyle()}>电表描述: {item.remark}</div>
                            <div style={getTextStyle()}>租户: {item.tenant_name}</div>
                            {/*<div style={getTextStyle()}>积累用电量: {item.eleNumSum}kWh</div>*/}
                            <div style={getTextStyle()}>当前用电量: {item.c0}kWh</div>
                            {/*<div style={getTextStyle()}>总累计消耗金额: {(item.lossTotal).toFixed(2)}元</div>*/}
                            <div style={getTextStyle()}>租户累计损耗: {(item.lossSum).toFixed(2)}元</div>
                            {/*<div style={getTextStyle()}>损耗: {item.loss}元每度</div>*/}
                            <div style={getTextStyle()}>未交损耗度数: {item.lossCycleOut.toFixed(2)}kWh</div>
                            <div style={getTextStyle()}>租户当前损耗金额: {(item.lossCycleOut*item.loss).toFixed(2)}元</div>
                            <div style={getTextStyle()}>操作:<Button type='primary' onClick={()=>toinfo(item)} >详情</Button></div>
                        </div>
                    ))}
                </div>
                <div style={{display:'flex',justifyContent:'space-around',marginTop:'5px'}}>
                    <div>未交损耗：{lossCycleOut.toFixed(2)}元</div>
                    <div>累计损耗：{lossSum.toFixed(2)}元</div>
                </div>
                <Modal open={open} title='详情' onCancel={()=>setOpen(false)} onOk={()=>setOpen(false)}>
                    <div style={getTextStyle()}>电表地址: {payInfo.address}</div>
                    <div style={getTextStyle()}>电表描述: {payInfo.remark}</div>
                    <div style={getTextStyle()}>租户: {payInfo.tenant_name}</div>
                    <div style={getTextStyle()}>积累用电量: {payInfo.eleNumSum}kWh</div>
                    <div style={getTextStyle()}>当前用电量: {payInfo.c0}kWh</div>
                    <div style={getTextStyle()}>总累计消耗金额: {(payInfo.lossTotal).toFixed(2)}元</div>
                    <div style={getTextStyle()}>租户累计损耗: {(payInfo.lossSum).toFixed(2)}元</div>
                    <div style={getTextStyle()}>损耗: {payInfo.loss}元每度</div>
                    <div style={getTextStyle()}>未交损耗度数: {payInfo.lossCycleOut.toFixed(2)}kWh</div>
                    <div style={getTextStyle()}>租户当前损耗金额: {(payInfo.lossCycleOut*payInfo.loss).toFixed(2)}元</div>
                </Modal>
                <div style={{ marginTop: windowWidth <= 480 ? '1rem' : '2rem', textAlign: 'center' }}>
                    <Pagination total={count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>
                </div>
            </div>
        </Spin>
    )
}

export default connect() (WaterJournaling)