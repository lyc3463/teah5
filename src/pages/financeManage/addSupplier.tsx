import PageLayout from "@/components/PageLayout ";
import {Button, List, TextArea} from "antd-mobile";
import {Input, InputNumber, message, Spin} from "antd";
import {useState} from "react";
import { connect, useNavigate,history } from "umi";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";


const AddSupplier=(props)=>{
    const navigate=useNavigate();
    const [spinning,setSpinning]=useState(false);
    const [supplierName,setSupplierName]=useState('');
    const [supplierAddress,setSupplierAddress]=useState('');
    const [personName,setPersonName]=useState('');
    const [personPhone,setPersonPhone]=useState('');
    const [remark,setRemark]=useState('');

    const onFinish=()=>{
        if (!supplierName) return message.warning('供应商名称必填');
        setSpinning(true);
        props.dispatch({
            type:'Supplier/add',
            payload:{supplierName, supplierAddress, personName, personPhone, remark},
        }).then((res:TypeErrorCode)=>{
            setSpinning(false);
            if(res.ErrorCode===0){
                message.success('添加成功');
                setSpinning(false);
                navigate(-1)
            }else{
                message.error(res.Data);
                setSpinning(false);
            }
        })
    };
    return(
        <Spin spinning={spinning}>
            <PageLayout
                title="添加供应商"
                onBack={()=>navigate(-1)}
            >
                <div
                    style={{
                        maxHeight: '80vh',
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        boxSizing: 'border-box',
                    }}
                >
                    <List header="基础信息">
                        <div style={{
                            backgroundColor: '#F0F0F0',
                        }}>
                            <List.Item
                                style={{margin:'10px 0',borderRadius:'10px'}}
                                extra={
                                    <Input
                                        value={supplierName}
                                        onChange={(e)=>setSupplierName(e.target.value)}
                                    />
                                }
                            >
                                供应商名称
                            </List.Item>
                            <List.Item
                                style={{margin:'10px 0',borderRadius:'10px'}}
                                extra={
                                    <Input
                                        value={supplierAddress}
                                        onChange={(e)=>setSupplierAddress(e.target.value)}
                                    />
                                }
                            >
                                开户行
                            </List.Item>
                            <List.Item
                                style={{margin:'10px 0',borderRadius:'10px'}}
                                extra={
                                    <Input
                                        value={personName}
                                        onChange={(e)=>setPersonName(e.target.value)}
                                    />
                                }
                            >
                                账号
                            </List.Item>
                            <List.Item
                                style={{margin:'10px 0',borderRadius:'10px'}}
                                extra={
                                    <Input
                                        value={personPhone}
                                        onChange={(e)=>setPersonPhone(e.target.value)}
                                    />
                                }
                            >
                                账户名
                            </List.Item>
                            <List.Item
                                style={{margin:'10px 0',borderRadius:'10px'}}
                                extra={
                                    <Input.TextArea
                                        value={remark}
                                        onChange={(e)=>setRemark(e.target.value)}
                                    />
                                }
                            >
                                备注
                            </List.Item>
                        </div>
                    </List>
                    <div
                        style={{
                            position: "fixed",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            background: "#fff",
                            borderTop: "1px solid #eee",
                            padding: 12
                        }}
                    >
                        <Button
                            block
                            color="primary"
                            size="large"
                            onClick={onFinish}
                        >
                            添加
                        </Button>
                    </div>
                </div>
            </PageLayout>
        </Spin>
    )
}
export default connect()(AddSupplier);
