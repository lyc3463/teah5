import {Button, Input, List, message, Modal, Pagination, Space, Spin, Tag} from "antd";
import {history,connect} from "umi";
import {useEffect, useState} from "react";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {StaticInfo} from "@/StaticInfo";
import {Popup} from "antd-mobile";
import PageLayout from "@/components/PageLayout ";

const Cable=(props:any)=>{
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    const [collectorId,setCollectorId]=useState('');
    const [did,setDid]=useState(0);
    const [open,setOpen]=useState(false);
    const [isSpinning,setIsSpinning]=useState(false);
    const [name,setNmae]=useState('');
    const [remark,setremark]=useState('');
    const [cableList,setCableList]=useState([]);
    const [filterOpen,setFilterOpen]=useState(false);

    // 用户权限
    const [uqx,setUqx]=useState([]);
    useEffect(() => {
        logFenye();
    }, [page,pageSize]);
    const  toAdd=()=>{
        history.push('/ele/addCable')
    }
    const tojiben=(e)=>{
        history.push(`/ele/ElectricityBasicBusiness?id=${e.id}`)
    };
    const toedit=(e)=>{
        history.push(`/ele/editCable?id=${e}`);
    };
    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"Cable/fetch",
            payload:{page,collectorId,name,remark,pageSize}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setCableList(res.Data.data);
            }else {
                message.error(res.Data);
            }
        })
    };
    // 监听页数
    const onChange=(page,pageSizz)=>{
        setPage(page);
        setPageSize(pageSizz);
        logFenye();
    };
    // 搜索
    const sousuo=()=>{
        setPage(1);
        logFenye();
        setFilterOpen(false);
    };
    // 确定删除
    const onOk=()=>{
        setIsSpinning(true)
        props.dispatch({
            type:'Cable/remove',
            payload:did
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('删除成功');
                setOpen(false);
                logFenye();
                setIsSpinning(false);
            }else {
                message.error(res.Data);
                setIsSpinning(false);
            }
        })
    };
    // 删除弹窗
    const onDeleteOpen=(e)=>{
        setDid(e);
        setOpen(true);
    };
    useEffect(() => {
        let uq=StaticInfo.uqx.split('');
        setUqx(uq);
    }, []);
    const changeRemark=(e)=>{
        setremark(e.target.value);
    };
    const changeName=(e)=>{
        setNmae(e.target.value);
    };
    const changeCollectorId=(e)=>{
        setCollectorId(e.target.value);
    };
    return(
        <Spin spinning={isSpinning}>
            <PageLayout
                title="电表列表"
                onBack={()=>history.push('/dashboard/')}
            >
                <List style={{padding:'0 10px'}}>
                    <List.Item>
                        <Space style={{paddingBottom:'10px'}}>
                            <Button type="primary" onClick={toAdd}>添加电表</Button>
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
                        <div style={{ marginTop: 15 }}>电表描述</div>
                        <Input
                            onChange={changeRemark}
                            value={remark}
                        />
                        <div style={{ marginTop: 15 }}>电表地址</div>
                        <Input
                            onChange={changeCollectorId}
                            value={collectorId}
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
                    {cableList && cableList.length > 0
                        ? cableList.map((item: any, index: number) => {
                            return (
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
                                    <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}>电价: {item.price_name}</div>
                                    <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}>采集器: {item.collectorid}</div>
                                    <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}>通讯地址: {item.address}</div>
                                    <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}>单元: {item.unit_name}</div>
                                    <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}>积累电量kwh: {item.eleNumSum}</div>
                                    <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}>当前电量kwh: {item.c0}</div>
                                    <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}>
                                        状态:
                                        {item.relay_state === 1
                                            ? <Tag color='green'>合闸</Tag>
                                            : <Tag color='red'>拉闸</Tag>
                                        }
                                    </div>
                                    <Space style={{ marginTop: 8 }}>
                                        <Button type='primary' onClick={() => tojiben(item)}>基本业务</Button>
                                        {uqx[177] === '1' ? <Button type='primary' onClick={() => toedit(item.id)}>编辑</Button> : null}
                                        {uqx[179] === '1' ? <Button type='primary' danger onClick={() => onDeleteOpen(item.id)}>删除</Button> : null}
                                    </Space>
                                </List.Item>
                            );
                        })
                        : null
                    }
                </div>
                <div style={{display:'flex',justifyContent:'space-around',marginTop:'5px'}}>
                    <div>积累用电：{props.count?props.count.eleNumSum:''}kwh</div>
                    <div>总用电：{props.count?props.count.c0Sum:''}kwh</div>
                </div>
                <div style={{ marginTop:'1rem', textAlign: 'center' }}>
                    {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
                </div>
                {/*    删除的弹窗*/}
                <Modal open={open} title='删除的弹窗' onOk={onOk} onCancel={()=>setOpen(false)}>
                    <div>确定要删除电表吗?</div>
                </Modal>
            </PageLayout>
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        CableList: state.Cable.list,
        count: state.Cable.count
    }
};
export default connect(mapStateToProps) (Cable)