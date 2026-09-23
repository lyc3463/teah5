import {Button, Form, Input, List, message, Modal, Pagination, Select, Space, Spin, Table, Tag} from "antd";
import  {history,connect} from 'umi'
import {NavBar} from 'antd-mobile'
import {useEffect, useState} from "react";
import dayjs from "dayjs";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {StaticInfo} from "@/StaticInfo";
const Collector=(props:any)=>{
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    const [collector_number,setCollector_number]=useState('');
    const [stutes,setStutes]=useState(2);
    const [uid,setUid]=useState(0);
    const [isOpen,setIsOpen]=useState(false);
    const [spinning,setspinning]=useState(false);
    // 用户权限
    const [uqx,setUqx]=useState([]);
    const toedit=(e)=>{
        history.push(`/waterCableManage/editCollector?id=${e}`);
    };
    const columns =[
        {
            title: '采集器ID',
            dataIndex: 'collectorid',
            key: 'collectorid',
            align:'center'
        },
        {
            title: '备注',
            dataIndex: 'remark',
            key: 'remark',
            align:'center'

        },
        {
            title: '操作',
            dataIndex: 'cao',
            key: 'cao',
            align:'center',
            render:(text:any,record:any)=>{
                return(
                    <Space>
                        {/*{uqx[173]=='1'? <Button type='primary' onClick={()=>toedit(record.id)}>编辑</Button> :''}*/}
                        {uqx[175]=='1'? <Button type='primary' danger onClick={()=>isdelete(record.id)}>删除</Button>:''}
                    </Space>
                )
            }
        },
    ];
    const toadd=()=>{
        history.push('/collector/addCollector')
    };
    const isdelete=(e)=>{
        setUid(e);
        setIsOpen(true);
    };
    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"Collector/fetch",
            payload:{page,collector_number,stutes,pageSize}
        })
    };
    // 监听页数
    const onChange=(page:number,pageSize:number)=>{
        setPage(page);
        setPageSize(pageSize);
    };
    useEffect(() => {
        logFenye();
    }, [page]);
    const changeStutes=(e:number)=>{
        setStutes(e);
    };
    const changeName=(e:any)=>{
        setCollector_number(e.target.value);
    };
    const sousuo=()=>{
        setPage(1);
        logFenye();
        getFyInfo();
    };
    const getFyInfo=()=>{
        props.dispatch({
            type:"Collector/fenye",
            payload:{collector_number,stutes,pageSize}
        })
    };
    // 删除确定按钮
    const onOk=()=>{
        setspinning(true);
        props.dispatch({
            type:"Collector/remove",
            payload:uid
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setspinning(false);
                setIsOpen(false);
                message.success('删除成功');
            }else {
                setspinning(false);
                setIsOpen(false);
                message.error(res.Data);
            }
        })
    };
    useEffect(() => {
        let uq=StaticInfo.uqx.split('');
        setUqx(uq);
        getFyInfo();
    }, []);
    return(
        <Spin spinning={spinning}>
            <NavBar
                onBack={() => history.push('/dashboard/')}
                style={{
                    '--height': '48px',
                    '--border-bottom': 'none',
                    '--background-color': '#fff'
                }}
            >
                采集器列表
            </NavBar>
            <div style={{padding:'0 20px 20px 20px'}}>
                <List>
                    <List.Item>
                        <div style={{paddingBottom:'10px'}}>
                            {uqx[174]=='1'? <Button type="primary" onClick={toadd}>添加采集器</Button>:''}
                        </div>
                        <Space>
                            <Input
                                onChange={changeName}
                                addonBefore="采集器ID:"
                                value={collector_number}
                            />
                            <Button type="primary" onClick={sousuo}>
                                搜索
                            </Button>
                        </Space>
                    </List.Item>
                </List>
                <Table
                    columns={columns}
                    style={{border:'1px solid #ddd',borderRadius:'4px'}}
                    pagination={false}
                    size='small'
                    scroll={{y:'80vh' }}
                    dataSource={props.CollectorList}
                    rowKey={(columns) => columns.id}
                />
                {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
                <Modal onOk={onOk} open={isOpen} onCancel={()=>setIsOpen(false)} loading={spinning}>
                    <div>是否要删除该采集器</div>
                </Modal>
            </div>
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        CollectorList: state.Collector.list,
        count: state.Collector.count
    }
};
export default connect(mapStateToProps) (Collector)