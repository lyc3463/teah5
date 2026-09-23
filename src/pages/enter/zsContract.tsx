import {
    Button,
    DatePicker,
    Form,
    Input,
    List,
    message,
    Modal,
    Pagination,
    Select,
    Space,
    Spin,
    Table,
    Tag,
    Tooltip
} from "antd";
import {history,connect} from "umi";
import {useEffect, useState} from "react";
import dayjs from "dayjs";
import * as StaffService from '@/services/staff';
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {StaticInfo} from "@/StaticInfo";
import {NavBar} from "antd-mobile";
import DateRangePicker from "@/components/DateRangePickerProps";

const ZsContract=(props:any)=>{
    const [isDeltOpen,setIsDeleteOpen]=useState(false);
    const [uid,setUid]=useState(0);
    // 当前页数
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    // 审核状态 0全部  1未审核 2已审核
    const [contractStatus,setContractStatus]=useState(0);
    // 合同编号
    const [identifier,setIdentifier]=useState('');
    // 合同类型
    const [contractType,setContractType]=useState(0);
    // 开始时间
    const [startDate,setStartDate]=useState('2000-01-01');
    // 结束时间
    const [endDate,setEndDate]=useState('2099-01-01');
    // 租户姓名
    const [name,setName]=useState('');
    // 列表
    const [staffList,setStaffList]=useState([]);
    // 转圈
    const [spinning,setspinning]=useState(false);
    // 总页码
    const [count,setcount]=useState(0);
    // 租金总数
    const [zuMoney,setzuMoney]=useState(0);
    // 合同押金
    const [deposit,setdeposit]=useState(0);
    // 预付费
    const [prepayment,setprepayment]=useState(0);
    // 管理费押金
    const [depositFee,setdepositFee]=useState(0);
    // 管理费
    const [manageFee,setmanageFee]=useState(0);
    // 用户权限
    const [uqx,setUqx]=useState([]);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const toadd=()=>{
        history.push('/enter/addStaff/');
    };
    // 去详情页面
    const toInfo=(e:any)=>{
        if (e.templateType==1){
            history.push(`/check/dingjinInfo?id=${e.id}`);
        }else if (e.templateType==2){
            history.push(`/enter/contracteInfo?id=${e.id}`);
        }
    };
    // 编辑
    const toedit=(e:any)=>{
        if (e.templateType==1){
            history.push(`/enter/editDjContract?id=${e.id}`);
        }else if (e.templateType==2){
            history.push(`/enter/editStaff?id=${e.id}`);
        }
    };
    // 删除弹窗
    const isdelete=(e:number)=>{
        setUid(e);
        setIsDeleteOpen(true);
    };
    // 确定删除按钮
    const onOk=()=>{
        setspinning(true);
        props.dispatch({
            type:'Staff/remove',
            payload:uid
        }).then((res)=>{
            if (res.ErrorCode==0){
                message.success('删除成功');
                setIsDeleteOpen(false);
                setspinning(false);
                logFenye();
                getListFenye();
            }else {
                message.error(res.Data);
                setIsDeleteOpen(false);
                setspinning(false);
            }
        })
    };
    // 分页信息
    const getListFenye=()=>{
        setspinning(true);
        StaffService.getHTfFy({identifier,contractType,contractStatus,startDate,endDate,name,pageSize}).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setcount(res.Data.count);
                setzuMoney(res.Data.zuMoney);
                setdeposit(res.Data.deposit);
                setprepayment(res.Data.prepayment);
                setdepositFee(res.Data.depositFee);
                setmanageFee(res.Data.manageFee);
                setspinning(false);
            }else {
                setspinning(false);
                message.error(res.Data);
            }
        })
    };
    // 搜索
    const sousuo=()=>{
        setPage(1);
        getListFenye();
        logFenye();
    };
    // 分页
    const logFenye=()=>{
        setspinning(true);
        StaffService.getHT({page,identifier,contractType,contractStatus,startDate,endDate,name,pageSize}).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setStaffList(res.Data);
                setspinning(false);
            }else {
                setspinning(false);
                message.error(res.Data);
            }
        })
    };
    // 监听页数
    const onChange=(e:number,pageSize:number)=>{
        setPage(e);
        setPageSize(pageSize);
    };
    useEffect(() => {
        getListFenye();
    }, []);
    useEffect(() => {
        logFenye();
    }, [page]);
    // 监听合同编号
    const changeIdentifier=(e)=>{
        setIdentifier(e.target.value);
    };
    // 合同类型
    const changeType=(e:any)=>{
        setContractType(e);
    };
    // 监听日期
    const changeDate=(start,end)=>{
        setStartDate(start);
        setEndDate(end);
    };
    useEffect(() => {
        let uq=StaticInfo.uqx.split('');
        setUqx(uq);
    }, []);
    const changeName=(e)=>{
        setName(e.target.value);
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
            <List>
                <List.Item>
                    <Space style={{marginBottom:'10px'}}>
                        {uqx[204]=='1'?<Button type="primary" onClick={toadd}>录入</Button>:''}
                        <DateRangePicker  onDateSelected={changeDate}/>
                    </Space>
                    <Space>
                        <Input
                            onChange={changeName}
                            addonBefore="租户姓名:"
                            value={name}
                        />
                        <Button type="primary" onClick={sousuo}>
                            搜索
                        </Button>
                    </Space>
                </List.Item>
            </List>
            <div style={{ display: 'flex', flexDirection: 'column', height: '60vh', overflowY: 'auto' }}>
                {staffList&&staffList.length>0?staffList.map((item)=>(
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
                        <div style={getTextStyle()}>合同编号: {item.identifier}</div>
                        <div style={getTextStyle()}>租户: {item.customName}</div>
                        <div style={getTextStyle()}>起租日: {dayjs(item.beginTime).format("YYYY-MM-DD")}</div>
                        <div style={getTextStyle()}>到期日: {dayjs(item.endTime).format("YYYY-MM-DD")}</div>
                        <div style={getTextStyle()}>租金(元): {item.zuMoney}</div>
                        <div style={getTextStyle()}>合同押金(元): {item.deposit}</div>
                        <div style={getTextStyle()}>管理费(元): {item.manageFee}</div>
                        <div style={getTextStyle()}>预付费(元): {item.prepayment}</div>
                        <div style={getTextStyle()}>管理费押金(元): {item.depositFee}</div>
                        <div style={getTextStyle()}>合同类型: {item.templateType==1?<Tag color='cyan'>定金合同</Tag>:<Tag color='purple'>正式合同</Tag>}</div>
                        <div style={getTextStyle()}>状态:  {item.contractStatus === 1 ? (
                            <Tag color='red'>未审核</Tag>
                        ) : item.contractStatus === 2 ? (
                            <Tag color='green'>已审核</Tag>
                        ) : item.contractStatus === 3 ? (
                            <Tag color='orange'>退租</Tag>
                        ) : item.contractStatus === 4 ? (
                            <Tag color='orange'>续租</Tag>
                        ): (
                            <Tag color='grey'>未知状态</Tag>
                        )}</div>
                        <div style={getTextStyle()}> <Space>
                            {item.contractStatus==1||item.contractStatus==4?
                                <>
                                    {uqx[205]=='1'?<Button type='primary' onClick={()=>toedit(item)}>编辑</Button> :''}
                                    {uqx[207]=='1'?<Button type='primary' danger onClick={()=>isdelete(item.id)}>删除</Button>:''}
                                    <Button type='primary' onClick={()=>toInfo(item)}>详情</Button>
                                </>:''
                            }
                        </Space></div>
                    </div>
                )):''}
            </div>
            {/*<Table*/}
            {/*    style={{border:'1px solid #ddd',borderRadius:'4px'}}*/}
            {/*    columns={columns}*/}
            {/*    size='small'*/}
            {/*    scroll={{y:'60vh'}}*/}
            {/*    pagination={false}*/}
            {/*    rowKey={(columns) => columns.id}*/}
            {/*    dataSource={staffList}*/}
            {/*    summary={(columns) => (*/}
            {/*        <Table.Summary >*/}
            {/*            <Table.Summary.Row>*/}
            {/*                <Table.Summary.Cell index={1}>统计</Table.Summary.Cell>*/}
            {/*                <Table.Summary.Cell index={2}></Table.Summary.Cell>*/}
            {/*                <Table.Summary.Cell index={2}></Table.Summary.Cell>*/}
            {/*                <Table.Summary.Cell index={3}></Table.Summary.Cell>*/}
            {/*                <Table.Summary.Cell index={4}>{zuMoney.toFixed(2)}元</Table.Summary.Cell>*/}
            {/*                <Table.Summary.Cell index={5}>{deposit.toFixed(2)}元</Table.Summary.Cell>*/}
            {/*                <Table.Summary.Cell index={6}>{manageFee.toFixed(2)}元</Table.Summary.Cell>*/}
            {/*                <Table.Summary.Cell index={7}>{prepayment.toFixed(2)}元</Table.Summary.Cell>*/}
            {/*                <Table.Summary.Cell index={8}>{depositFee.toFixed(2)}元</Table.Summary.Cell>*/}
            {/*            </Table.Summary.Row>*/}
            {/*        </Table.Summary>*/}
            {/*    )}*/}
            {/*/>*/}
            <div style={{display:'flex',justifyContent:'space-around',marginTop:'5px',flexWrap:'wrap'}}>
                <div>租金:{zuMoney.toFixed(2)}元</div>
                <div>押金:{deposit.toFixed(2)}元</div>
                <div>管理费:{manageFee.toFixed(2)}元</div>
                <div>预付费:{prepayment.toFixed(2)}元</div>
                <div>管理费押金:{depositFee.toFixed(2)}元</div>
            </div>
            <Pagination total={count} pageSize={50} current={page}  onChange={onChange} pageSizeOptions={[50]}/>
            <Modal open={isDeltOpen} onCancel={()=>setIsDeleteOpen(false)} title='删除合同' onOk={onOk}>
                <div>确定要删除吗？</div>
            </Modal>
        </Spin>
    )
}
export default connect() (ZsContract)