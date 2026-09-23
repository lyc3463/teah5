import {Button, Form, Input, List, message, Modal, Pagination, Space, Spin, Table, Tag} from "antd";
import {connect,history} from 'umi'
import {useEffect, useState} from "react";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {StaticInfo} from "@/StaticInfo";
import {NavBar, Popup} from "antd-mobile";
import PageLayout from "@/components/PageLayout ";

const Water=(props:any)=>{
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    const [waterAddress,setwaterAddress]=useState('');
    const [name,setName]=useState('');
    const [remark,setremark]=useState('');
    const [uid,setUid]=useState(0);
    const [open,setOpne]=useState(false);
    const [isSpinning,setIsSpinning]=useState(false);
    // 用户权限
    const [uqx,setUqx]=useState([]);
    const [waterList,setWaterList]=useState([]);
    const [filterOpen,setFilterOpen]=useState(false);

    const toadd=()=>{
        history.push('/water/addWater')
    };
    const toedit=(e:any)=>{
        history.push(`/water/editWater?id=${e}`)
    };
    const onChange=(e,pageSizz)=>{
        setPage(e);
        setPageSize(pageSizz)
    };
    const tojiben=(e)=>{
        history.push(`/water/waterjiben?id=${e.id}`)
    };
    const onOk=()=>{
        setIsSpinning(true);
        props.dispatch({
            type:'Watert/remove',
            payload:uid
        }).then((res:any)=>{
            if (res.ErrorCode==0){
                setIsSpinning(false);
                message.success('删除成功');
                setOpne(false);
                getWater();
            }else {
                setIsSpinning(false);
                setOpne(false);
                message.error(res.Data);
                getWater();
            }
        })
    };
    // 获取水表列表
    const getWater=()=>{
        props.dispatch({
            type:'Watert/fetch',
            payload:{page,waterAddress,name,remark,pageSize}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setWaterList(res.Data.data);
            }else {
                message.error(res.Data);
            }
        })
    };
    const sousuo=()=>{
        setPage(1);
        getWater();
        setFilterOpen(false);
    };

    useEffect(() => {
        getWater();
    }, [page,pageSize]);
    useEffect(() => {
        let uq=StaticInfo.uqx.split('');
        setUqx(uq);
    }, []);
    const changeWaterAddress=(e)=>{
        setwaterAddress(e.target.value);
    };
    const changeName=(e)=>{
        setName(e.target.value);
    };
    const changeRemark=(e)=>{
        setremark(e.target.value);
    };
    const isdelete=(e)=>{
        setUid(e.id);
        setOpne(true);
    };
    return(
        <Spin spinning={isSpinning}>
            <PageLayout
                title="水表列表"
                onBack={()=>history.push('/dashboard/')}
            >
                <List style={{padding:'0 10px'}}>
                    <List.Item>
                        <Space style={{paddingBottom:'10px'}}>
                            <Button type="primary" onClick={toadd}>添加水表</Button>
                            <Button type="primary" onClick={() => setFilterOpen(true)}>
                                筛选
                            </Button>
                        </Space>
                    </List.Item>
                </List>
                <Popup
                    visible={filterOpen}
                    onMaskClick={() => setFilterOpen(false)}
                >
                    <div style={{ padding: 16 }}>
                        <div style={{ marginTop: 15 }}>水表描述</div>
                        <Input
                            onChange={changeRemark}
                            value={remark}
                        />
                        <div style={{ marginTop: 15 }}>水表地址</div>
                        <Input
                            onChange={changeWaterAddress}
                            value={waterAddress}
                        />
                        <div style={{ marginTop: 15 }}>租户姓名</div>
                        <Input
                            onChange={changeName}
                            value={name}
                        />
                        <Button
                            block
                            color="primary"
                            style={{ marginTop: 20 }}
                            onClick={sousuo}
                        >
                            搜索
                        </Button>
                    </div>
                </Popup>
                <div style={{
                    height: 'calc(100vh - 230px)',
                    overflowY: 'auto',
                    padding: '0 12px'
                }}>
                    {waterList.map((item) => (
                        <List.Item
                            key={item.id}
                            style={{
                                border: '1px solid #e5e6eb',
                                borderRadius: '8px',
                                padding: '16px',
                                marginBottom: '12px',
                                backgroundColor: '#fff',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                            }}
                        >
                            <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}>租户名称: {item.tenant_name}</div>
                            <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}>描述: {item.remark}</div>
                            <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}>水价: {item.price_name}</div>
                            <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}>采集器: {item.collectorid}</div>
                            <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}>通讯地址: {item.address}</div>
                            <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}>单元: {item.unit_name}</div>
                            <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}>当前水量m³: {item.total_used_amount}</div>
                            <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}>积累水量m³: {item.waterNumSum}</div>
                            <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}>状态:{item.relay_state==1?<Tag color='green'>合闸</Tag>:<Tag color='red'>拉闸</Tag>}</div>
                            <Space style={{marginTop:'10px'}}>
                                <Button type='primary' onClick={()=>tojiben(item)}>基本业务</Button>
                                {uqx[177]=='1'?<Button type='primary' onClick={(e)=>toedit(item.id)}>编辑</Button> :''}
                                {uqx[252]=='1'?<Button type='primary' danger onClick={()=>isdelete(item)}>删除</Button> :''}
                            </Space>
                        </List.Item>
                    ))}
                </div>
                <div style={{display:'flex',justifyContent:'space-around',marginTop:'5px'}}>
                    <div>积累用水：{props.count?props.count.waterNumSum:''}m³</div>
                    <div>总用水：{props.count?props.count.total_used_amount:''}m³</div>
                </div>
                <div style={{ marginTop:'1rem', textAlign: 'center' }}>
                    {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
                </div>
                <Modal onOk={onOk} onCancel={()=>setOpne(false)} title='删除' open={open}>
                    <div>确定删除吗?</div>
                </Modal>
            </PageLayout>
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        WatertList: state.Watert.list,
        count: state.Watert.count,
    }
};
export default  connect(mapStateToProps)(Water)