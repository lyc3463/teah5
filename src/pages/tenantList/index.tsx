import {Button, Input, Table, Form, List, Space, Pagination, Image, InputNumber} from "antd";
import {connect} from "umi";
import {useEffect, useState} from "react";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {calculateSums, fuzzySearch} from "@/utils/OpenTool";
import {NavBar, Popup} from "antd-mobile";
import {history} from "@@/core/history";
import PageLayout from "@/components/PageLayout ";

const TenantList=(props:any)=>{
    const [name,setName]=useState('');
    const [phone,setPhone]=useState('');
    const [page,setPage]=useState(1);
    // 页数
    const [pagecount,setpagecount]=useState(50);
    const [filterOpen,setFilterOpen]=useState(false);

    useEffect(() => {
        logFenye();
    }, [page,pagecount]);
    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"Zuhu/fetch",
            payload:{page,name,phone,pagecount}
        })
    };
    // 搜索按钮
    const shousuo=()=>{
        setPage(1);
        logFenye()
    };
    const onChange=(val:number,pageSize:number)=>{
        setPage(val);
        setpagecount(pageSize);
    };

    const changeName=(e)=>{
        setName(e.target.value);
    };
    const changePhone=(e)=>{
        setPhone(e.target.value);
    };

    return(
        <PageLayout
            title="租户列表"
            onBack={()=>history.push('/dashboard/')}
        >
            <List style={{padding:'0 10px'}}>
                <List.Item>
                    <Space style={{paddingBottom:'10px'}}>
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
                    <div style={{ marginTop: 15 }}>手机号</div>
                    <Input
                        onChange={changePhone}
                        value={phone}
                    />
                    <div style={{ marginTop: 15 }}>姓名</div>
                    <Input
                        onChange={changeName}
                        value={name}
                    />
                    <Button
                        block
                        color="primary"
                        style={{ marginTop: 20 }}
                        onClick={shousuo}
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
                {
                    props.ZuhuList&&props.ZuhuList.length>0?props.ZuhuList.map((item:any,index)=>{
                        return (
                            <List.Item
                                key={index}
                                style={{
                                    border: '1px solid #e5e6eb',
                                    borderRadius: '8px',
                                    padding: '16px',
                                    marginBottom: '12px',
                                    backgroundColor: '#fff',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                                }}
                            >
                                <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}>租户姓名: {item.tenant_name}</div>
                                <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}>联系方式: {item.tenant_phone}</div>
                                <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}>身份证: {item.tenant_card}</div>
                                <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}>余额(元): {item.balance.toFixed(2)}</div>
                                <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}>账单(元): {item.billMoney.toFixed(2)}</div>
                                <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}>积分(分): {item.integral.toFixed(2)}</div>
                                <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}>公共押金(元): {item.deposit.toFixed(2)}</div>
                            </List.Item>
                        )
                    }):''
                }
            </div>
            {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pagecount} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
        </PageLayout>
    )
}
const mapStateToProps = (state: any) => {
    return {
        ZuhuList: state.Zuhu.list,
        count: state.Zuhu.count,
    }
};
export default connect(mapStateToProps) (TenantList)