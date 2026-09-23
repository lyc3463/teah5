import {connect} from "umi";
import {useEffect, useState} from "react";
import {Button, Form, Input, InputNumber, List, message, Modal, Pagination, Space, Spin, Table} from "antd";
import dayjs from "dayjs";
import {NavBar} from "antd-mobile";
import {history} from "@@/core/history";
const InputPerHousehold=(props)=>{
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    const [name,setName]=useState('');
    const [open,setOpen]=useState(false);
    const [tenantId,settenantId]=useState(0);
    const [spinning,setspinning]=useState(false);
    const [itemId,setitemId]=useState(0);
    const [itemType,setitemType]=useState(0);
    const [tenantAmount,settenantAmount]=useState(0);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const columns =[
        {
            title: '租户姓名',
            dataIndex: 'tenant_name',
            key: 'tenant_name',
            render: (text:any, record:any) => {
                return(
                    <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100px' }}>
                        {record.tenant_name}
                    </div>
                )
            }
        },
        {
            title: '收费名称',
            dataIndex: 'item_name',
            key: 'item_name',
        },
        {
            title: '金额(元)',
            dataIndex: 'tenantAmount',
            key: 'tenantAmount',
        },
        {
            title: '操作',
            dataIndex: 'cao',
            key: 'cao',
            render: (text:any, record:any) => {
                return(
                    <Button type='primary' onClick={()=>shuru(record)}>
                        输入
                    </Button>
                )
            }
        },
    ];
    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"EnterAmount/fetch",
            payload:{page,name,pageSize}
        })
    };
    useEffect(() => {
        logFenye();
    }, [page,pageSize]);
    const sousuo=()=>{
        setPage(1);
        fenyeInfo();
        logFenye();
    };
    const fenyeInfo=()=>{
        props.dispatch({
            type:"EnterAmount/fenye",
            payload:{name,pageSize}
        });
    };
    useEffect(() => {
        fenyeInfo();
    }, []);
    const onChange=(e,pageSize)=>{
        setPage(e);
        setPageSize(pageSize);
    };
    const shuru=(item:any)=>{
        setOpen(true);
        settenantId(item.tenantId);
        setitemType(item.itemType);
        setitemId(item.id);
        settenantAmount(item.tenantAmount);
    };
    const onOk=()=>{
        setspinning(true);
        props.dispatch({
            type:'EnterAmount/edit',
            payload:{tenantId,tenantAmount}
        }).then((res:any)=>{
            if (res.ErrorCode==0){
                setspinning(false);
                setOpen(false);
                message.success('添加成功');
            }else {
                setspinning(false);
                setOpen(false);
                message.error(res.Data);
            }
        })
    };
    const changeName=(e)=>{
        setName(e.target.value);
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
        <Spin spinning={spinning}>
            <div style={getContainerStyle()}>
                <NavBar
                    onBack={() => history.back()}
                    style={getNavBarStyle()}
                />
                <List>
                    <List.Item>
                        <Space>
                            <Input
                                addonBefore="租户姓名:"
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
                    rowKey={(columns) => columns.tenantId}
                    pagination={false}
                    size='small'
                    dataSource={props.EnterAmountList}
                    rowClassName={(record, index) =>
                        index % 2 === 1 ? 'tbodd' : 'tbeven'
                    }
                />
            </div>
            {props.count?<Pagination total={props.count.count} pageSize={50} current={page}  onChange={onChange} pageSizeOptions={[50]}/>:''}
            <Modal open={open} onOk={onOk} onCancel={()=>setOpen(false)} title='输入金额' loading={spinning}>
                <Form>
                    <Form.Item label='金额(元)'>
                        <InputNumber min={0} onChange={(e:any)=>settenantAmount(e)} value={tenantAmount}/>
                    </Form.Item>
                </Form>
            </Modal>
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        EnterAmountList: state.EnterAmount.list,
        count: state.EnterAmount.count,
    }
};
export default connect(mapStateToProps) (InputPerHousehold)