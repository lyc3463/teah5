import {Button, DatePicker, Input, List, message, Modal, Pagination, Select, Space, Spin, Table} from "antd";
import dayjs from "dayjs";
import {connect, history} from "umi";
import {useEffect, useState} from "react";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import DateRangePicker from "@/components/DateRangePickerProps";
import {Popup, Selector} from "antd-mobile";

const Supplier=(props)=>{
    const [spinning, setSpinning] = useState(false);
    const [page,setPage]=useState(1);
    const [supplierName,setSupplierName]=useState( '');
    const [personName,setPersonName]=useState( '');
    const [personPhone,setPersonPhone]=useState( '');
    const [pageSize,setPageSize]=useState(50);
    const [uid,setUid]=useState(0);
    const [dopen,setDopen]=useState(false);
    const [filterOpen, setFilterOpen] = useState(false);

    const toadd=()=>{
        history.push('/financeManage/addSupplier');
    };
    const isDel=(record:any)=>{
        setUid(record.id);
        setDopen(true);
    };
    // 获取列表
    const getList=()=>{
        props.dispatch({
            type:"Supplier/fetch",
            payload:{page, supplierName, personName, personPhone, pageSize}
        })
    };
    // 分页信息
    const getFenye=()=>{
        props.dispatch({
            type:"Supplier/fenye",
            payload:{supplierName, personName, personPhone, pageSize}
        })
    };
    useEffect(() => {
        getList();
    }, [page,pageSize]);
    useEffect(() => {
        getFenye();
    }, []);
    const onChange=(page:number,pageSize:number)=>{
        setPage(page);
        setPageSize(pageSize);
    };
    const sousuo=()=>{
        setPage(1);
        getList();
    };
    const changeSupplierName=(e)=>{
        setSupplierName(e.target.value);
    };
    const changePersonName=(e)=>{
        setPersonName(e.target.value);
    };
    const changePersonPhone=(e)=>{
        setPersonPhone(e.target.value);
    };
    const onOK=()=>{
        setSpinning(true);
        props.dispatch({
            type:"Supplier/remove",
            payload:uid
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode == 0) {
                message.success('删除成功');
                setDopen(false);
                setSpinning(false);
            } else {
                message.error(res.ErrorCode + res.Data);
                setSpinning(false);
            }
        })
    };

    return(
        <Spin spinning={spinning}>
            <List>
                <List.Item>
                    <Space>
                        <Button type="primary" onClick={toadd}>
                            新增供应商
                        </Button>
                        <Button type="primary" onClick={() => setFilterOpen(true)}>
                            筛选
                        </Button>
                    </Space>
                    <Popup
                        visible={filterOpen}
                        onMaskClick={() => setFilterOpen(false)}
                    >
                        <div style={{ padding: 16 }}>
                            <div style={{ marginTop: 15 }}>供应商名称</div>
                            <Input
                                value={supplierName}
                                onChange={changeSupplierName}
                            />
                            <div style={{ marginTop: 15 }}>账户名</div>
                            <Input
                                value={personPhone}
                                onChange={changePersonPhone}
                            />
                            <div style={{ marginTop: 15 }}>账户</div>
                            <Input
                                value={personName}
                                onChange={changePersonName}
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
                </List.Item>
            </List>

            {Array.isArray(props.list) && props.list.length > 0 ? (
                props.list.map((item) => {
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
                            <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}>
                                供应商名称:{item.supplierName}
                            </div>

                            <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}>
                                开户行：{item.supplierAddress}
                            </div>

                            <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}>
                                账号：{item.personName}
                            </div>

                            <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}>
                                账户名：{item.personPhone}
                            </div>

                            <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}>
                                备注：{item.remark}
                            </div>

                            <Space size="small">
                                <Button type="primary" onClick={()=>{history.push(`/financeManage/editSupplier?id=${item.id}`)}}>编辑</Button>
                                <Button type="primary" danger onClick={()=>isDel(item)}>删除</Button>
                            </Space>

                        </List.Item>
                    );
                })
            ) : (
                <div style={{ textAlign: "center", padding: "40px 0", color: "#999" }}>
                    暂无数据
                </div>
            )}
            <Modal open={dopen} loading={spinning} title='确认删除吗？' onOk={onOK} onCancel={()=>setDopen(false)}>
            </Modal>
            {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
        </Spin>
    )
}
const mapStateToProps = (state: any) => ({
    list: state.Supplier.list,
    count: state.Supplier.count,
});

export default connect(mapStateToProps)(Supplier);
