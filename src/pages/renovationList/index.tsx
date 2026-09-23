import React, {useEffect, useState} from "react";
import {
    Button,
    Input,
    InputNumber,
    List,
    message,
    Modal,
    Pagination,
    Select,
    Space,
    Spin,
    Table,
    Tag
} from "antd";
import {history,connect} from "umi";
import dayjs from "dayjs";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import * as ApplyRenovationServer from "@/services/applyRenovation";
import {NavBar} from "antd-mobile";
import {joinUnitNames} from "@/utils/OpenTool";

const RenovationList=(props)=>{
    const [spinning,setspinning]=useState(false);
    const [startDate,setStartDate]=useState('2000-01-01');
    const [endDate,setEndDate]=useState( '2099-01-01');
    const [name,setName]=useState( '');
    const [phone,setPhone]=useState( '');
    const [stutes,setStutes]=useState( 0);
    const [userID,setUserID]=useState( 0);
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    const [uid,setUid]=useState(0);
    const [applyMoney,setApplyMoney]=useState(0);
    const [delVisible,setDelVisible]=useState(false);
    const [editDepositOpen,setEditDepositOpen]=useState(false);
    const [checkOpen,setCheckOpen]=useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [acceptanceOpen,setAcceptanceOpen]=useState(false);

    const suosou=()=>{
        setPage(1);
        getList();
        getListFenye();
    };
    const toadd=()=>{
        history.push('/propertyServerManage/addRenovation/');
    };
    // 监听手机号
    const changePhone=(e)=>{
        setPhone(e.target.value);
    };
    // 监听名字
    const changeName=(e)=>{
        setName(e.target.value);
    };
    // 监听状态
    const changeState=(e)=>{
        setStutes(e);
    };
    const onChange=(e:number,pageSize:number)=>{
        setPage(e);
        setPageSize(pageSize);
    };
    // 修改押金
    const changeDeposit=(record)=>{
        setUid(record.id);
        setEditDepositOpen(true);
        setApplyMoney(record.applyMoney);
    };
    // 删除
    const del=(e)=>{
        setUid(e.id);
        setDelVisible(true);
    };
    // 审核
    const onCheck=(e)=>{
        setUid(e.id);
        setCheckOpen(true);
    };
    // 下载
    const toDol= async (record)=>{
        setspinning(true);
        getOne(record.pdfName);
    };
    const getOne=(e)=>{
        ApplyRenovationServer.getPDFBase64(e).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                downloadPdf(res.Data,'document.pdf');
                setspinning(false);
            }else {
                message.error(res.Data);
                setspinning(false);
            }
        })
    };
    // 下载
    const downloadPdf = (base64String,fileName) => {
        if (!base64String) {
            console.error('Base64字符串为空');
            return;
        }
        let cleanBase64 = base64String;
        if (base64String.includes('base64,')) {
            cleanBase64 = base64String.split('base64,')[1];
        }

        try {
            const byteCharacters = atob(cleanBase64);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/pdf' });

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error('下载失败:', error);
            alert('文件下载失败');
        }
    };
    const getList=()=>{
        props.dispatch({
            type:'ApplyRenovation/fetch',
            payload:{page, pageSize, name, phone, stutes, userID}
        })
    };
    const getListFenye=()=>{
        props.dispatch({
            type:'ApplyRenovation/fenye',
            payload:{pageSize, name, phone, stutes,userID}
        })
    };
    useEffect(() => {
        getList();
    }, [page,pageSize]);
    useEffect(() => {
        getListFenye();
    }, []);
    // 删除的确定
    const onDelOk=()=>{
        setspinning(true);
        props.dispatch({
            type:'ApplyRenovation/remove',
            payload:uid
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('删除成功');
                setDelVisible(false);
                setspinning(false);
            }else {
                message.error(res.Data);
                setDelVisible(false);
                setspinning(false);
            }
        })
    };
    const onEditDepositOk=()=>{
        setspinning(true);
        props.dispatch({
            type:'ApplyRenovation/editDeposit',
            payload:{uid,applyMoney}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('修改押金成功');
                setEditDepositOpen(false);
                setspinning(false);
            }else {
                message.error(res.Data);
                setEditDepositOpen(false);
                setspinning(false);
            }
        })
    };
    const onCheckOk=()=>{
        setspinning(true);
        props.dispatch({
            type:'ApplyRenovation/check',
            payload:{uid,stutes:2}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('审核成功');
                setCheckOpen(false);
                setspinning(false);
            }else {
                message.error(res.Data);
                setCheckOpen(false);
                setspinning(false);
            }
        })
    };
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
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
    // 验收完成
    const onAcceptanceOk=()=>{
        setspinning(true);
        props.dispatch({
            type:'ApplyRenovation/check',
            payload:{uid,stutes:5}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('验收成功');
                setAcceptanceOpen(false);
                setspinning(false);
            }else {
                message.error(res.Data);
                setAcceptanceOpen(false);
                setspinning(false);
            }
        })
    };
    // 验收
    const acceptance=(e)=>{
        setUid(e.id);
        setAcceptanceOpen(true);
    };
    return(
        <Spin spinning={spinning}>
            <div style={getContainerStyle()}>
                <NavBar
                    onBack={() => history.push('/dashboard')}
                    style={{
                        '--height': '48px',
                        '--border-bottom': 'none',
                        '--background-color': '#fff'
                    }}
                >
                    装修申请
                </NavBar>
                <List>
                    {/*<div>*/}
                    {/*    <Button type="primary" onClick={toadd}>添加装修申请</Button>*/}
                    {/*</div>*/}
                    <List.Item>
                        <Space>
                            <Space.Compact>
                                <div
                                    style={{
                                        borderRadius: '6px',
                                        borderStartEndRadius: 0,
                                        borderEndEndRadius: 0,
                                        padding: '0 11px',
                                        border: '1px solid #d9d9d9',
                                        display: 'flex',
                                        alignItems: 'center',
                                        borderInlineEnd: 0,
                                    }}
                                >
                                    状态:
                                </div>
                                <Select value={stutes} onChange={changeState}  style={{ width: 120 }}>
                                    <Select.Option value={0}>
                                        全部
                                    </Select.Option>
                                    <Select.Option value={1}>
                                        待审核
                                    </Select.Option>
                                    <Select.Option value={2}>
                                        待交押金
                                    </Select.Option>
                                    <Select.Option value={3}>
                                        可装修
                                    </Select.Option>
                                    <Select.Option value={4}>
                                        申请验收
                                    </Select.Option>
                                    <Select.Option value={5}>
                                        验收完成
                                    </Select.Option>
                                </Select>
                            </Space.Compact>
                            <Button type="primary" onClick={suosou}>
                                搜索
                            </Button>
                        </Space>
                    </List.Item>
                    <Space>
                        <Input
                            addonBefore="手机号:"
                            onChange={changePhone}
                            value={phone}
                        />
                        <Input
                            addonBefore="姓名:"
                            onChange={changeName}
                            value={name}
                        />
                    </Space>
                </List>
                <div style={{ display: 'flex', flexDirection: 'column', height: '70vh', overflowY: 'auto' }}>
                    {props.ReportList&&props.ReportList.length>0?props.ReportList.map((item) => (
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
                            <p style={getTextStyle()}>
                                <Tag color="blue">装修开始时间:</Tag> {dayjs(item.applyTime).format('YYYY-MM-DD')}
                            </p>
                            <p style={getTextStyle()}>
                                <Tag color="blue">装修结束时间:</Tag> {dayjs(item.endTime).format('YYYY-MM-DD')}
                            </p>
                            <p style={getTextStyle()}>
                                <Tag color="geekblue">姓名:</Tag> {item.tenant_name}
                            </p>
                            <p style={getTextStyle()}>
                                <Tag color="purple">手机号:</Tag> {item.tenant_phone}
                            </p>
                            <p style={getTextStyle()}>
                                <Tag color="cyan">押金(元):</Tag> {item.applyMoney}
                            </p>
                            <p style={getTextStyle()}>
                                <Tag color="green">装修类型:</Tag>
                                {(() => {
                                    // 定义状态映射关系
                                    const applyType = {
                                        1: { text: '公司装修', color: 'red' },
                                        2: { text: '自装', color: 'blue' },
                                        3: { text: '高危作业', color: 'orange' },
                                    };
                                    const status = applyType[item.applyType] || { text: '未知状态', color: 'default' };
                                    return <Tag color={status.applyType}>{status.text}</Tag>;
                                })()}
                            </p>
                            <p style={getTextStyle()}>
                                <Tag color="gray">状态:</Tag>
                                {(() => {
                                    // 定义状态映射关系
                                    const statusMap = {
                                        1: { text: '待审核', color: 'red' },
                                        2: { text: '待交押金', color: 'blue' },
                                        3: { text: '可装修', color: 'orange' },
                                        4: { text: '申请验收', color: 'purple' },
                                        5: { text: '验收完成', color: 'green' }
                                        // 可以继续添加更多状态
                                    };
                                    const status = statusMap[item.applyStatus] || { text: '未知状态', color: 'default' };
                                    return <Tag color={status.color}>{status.text}</Tag>;
                                })()}
                            </p>
                            <p style={getTextStyle()}>
                                <Space>
                                    {item.applyStatus==1?<>
                                        <Button type="primary" onClick={()=>onCheck(item)}>审核</Button>
                                        <Button type="primary" onClick={()=>changeDeposit(item)}>修改押金</Button>
                                        <Button type="primary" danger onClick={()=>del(item)}>删除</Button>
                                        {/*<Button type="primary" onClick={()=>toEdit(record)}>编辑</Button>*/}
                                    </>:''}
                                    {item.applyStatus==4?<>
                                        <Button type="primary" onClick={()=>acceptance(item)}>验收完成</Button>
                                    </>:''}
                                    {/*<Button type="primary" onClick={()=>toDol(item)}>下载</Button>*/}
                                </Space>
                            </p>
                        </div>
                    )):''}
                </div>
                <Modal open={delVisible} onCancel={()=>setDelVisible(false)} onOk={onDelOk} loading={spinning}>
                    <div>
                        确定删除吗？
                    </div>
                </Modal>
                {/*修改金额弹窗*/}
                <Modal open={editDepositOpen} onCancel={()=>setEditDepositOpen(false)} onOk={onEditDepositOk} loading={spinning}>
                    <div>
                        <div>
                            请输入新的押金金额：
                        </div>
                        <InputNumber value={applyMoney} onChange={(val)=>setApplyMoney(val)} min={0}/>
                    </div>
                </Modal>
                {/*审核弹窗*/}
                <Modal open={checkOpen} onCancel={()=>setCheckOpen(false)} onOk={onCheckOk} loading={spinning}>
                    <div>是否要审核?</div>
                </Modal>
                {/*验收弹窗*/}
                <Modal open={acceptanceOpen} onCancel={()=>setAcceptanceOpen(false)} onOk={onAcceptanceOk} loading={spinning}>
                    <div>是否要验收?</div>
                </Modal>
                {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
            </div>
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        ReportList: state.ApplyRenovation.list,
        count: state.ApplyRenovation.count,
    };
};
export default connect(mapStateToProps) (RenovationList);
