import {useEffect, useState} from "react";
import * as RechargeRateService from "@/services/rechargeRate";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {Button, DatePicker, Input, List, message, Modal, Pagination, Space, Spin, Table, Tag} from "antd";
import dayjs from "dayjs";
import * as ArrearsBillService from "@/services/ArrearsBill";
import {QuestionCircleOutlined} from "@ant-design/icons";
import {StaticInfo} from "@/StaticInfo";
import {NavBar} from "antd-mobile";
import {history} from "@@/core/history";
import DateRangePicker from "@/components/DateRangePickerProps";

const WyList=()=>{
    // 当前页数
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    const [name,setName]=useState('');
    const [startDate,setStartDate]=useState('2000-01-01');
    const [endDate,setEndDate]=useState('2099-01-01');
    const [tenandId,settenandId]=useState(0);
    const [count,setcount]=useState(0);
    const [dataSource,setdataSource]=useState([]);
    const [moneySum,setmoneySum]=useState(0);
    const [spinning,setspinning]=useState(false);
    const [weiyueListInfo,setweiyueListInfo]=useState([]);
    const [open,setOpen]=useState(false);
    const [sumweiyue,setsumweiyue]=useState(0);
    const [uqx,setUqx]=useState([]);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    // 搜索
    const sousuo=()=>{
        setPage(1);
        getAllRate();
        getAllRatefenye();
    };
    // 违约金缴费成功记录
    const getAllRate=()=>{
        setspinning(true);
        RechargeRateService.wyList({page,name,startDate,endDate,tenandId,pageSize}).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setdataSource(res.Data);
                setspinning(false);
            }else {
                message.error(res.Data);
                setspinning(false);
            }
        })
    };
    // 违约金缴费成功分页
    const getAllRatefenye=()=>{
        RechargeRateService.wyListfenye({name,startDate,endDate,tenandId,pageSize}).then((res:TypeErrorCode)=>{
            setspinning(true);
            if (res.ErrorCode==0){
                setcount(res.Data.count);
                setmoneySum(res.Data.moneySum);
                setspinning(false);
            }else {
                message.error(res.Data);
                setspinning(false);
            }
        })
    };
    // 监听页数
    const onChange=(e:number,pageSize:number)=>{
        setPage(e);
        setPageSize(pageSize);
    };
    useEffect(() => {
        getAllRate()
    }, [page,pageSize]);
    useEffect(() => {
        getAllRatefenye();
        let uq=StaticInfo.uqx.split('');
        setUqx(uq);
    }, []);
    // 监听日期
    const changeDate=(start:any,end:any)=>{
        setStartDate(start);
        setEndDate(end);
    };
    const columnsz=[
        {
            title: '日期',
            dataIndex: 'created',
            key: 'created',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        {dayjs(record.created).format("YYYY-MM-DD")}
                    </div>
                )
            }
        },
        {
            title: '租金(元)',
            dataIndex: 'rentAmount',
            key: 'rentAmount',
        },
        {
            title: '天数(天)',
            dataIndex: 'defaultNum',
            key: 'defaultNum',
        },
        {
            title: '金额(元)',
            dataIndex: 'defaultAmount',
            key: 'defaultAmount',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        {record.defaultAmount.toFixed(2)}
                    </div>
                )
            }
        },
    ];
    const toList=(e)=>{
        setOpen(true);
        getweiyuejinInfo(e);
    };
    const getweiyuejinInfo=(e:number)=>{
        ArrearsBillService.weiyuejinInfoList(e).then((res:TypeErrorCode)=>{
            setspinning(true);
            if (res.ErrorCode==0){
                setweiyueListInfo(res.Data);
                setsumweiyue(getTotalDefaultAmount(res.Data));
                setspinning(false);
            }else {
                setspinning(false);
                message.error(res.Data);
            }
        })
    };
    const changeName=(e)=>{
        setName(e.target.value);
    };
    const getTotalDefaultAmount = (arr) => {
        if (!Array.isArray(arr)) return 0;
        return arr.reduce((total, item) => {
            const amount = item && typeof item.defaultAmount === 'number'
                ? item.defaultAmount
                : 0;
            return total + amount;
        }, 0);
    };
    const getContainerStyle = () => {
        return {
            padding: windowWidth <= 480 ? '1rem' : '2rem',
            maxWidth: windowWidth <= 480 ? '100%' : '1200px',
            margin: '0 auto',
            backgroundColor: '#f5f6fa',
            minHeight: '85vh'
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
                >
                    违约金扣费
                </NavBar>
                <List>
                    <List.Item>
                        <Space>
                            <Input
                                onChange={changeName}
                                addonBefore="姓名:"
                                value={name}
                            />
                        </Space>
                        <Space>
                            <DateRangePicker  onDateSelected={changeDate}/>
                            <Button type="primary" onClick={sousuo}>
                                搜索
                            </Button>
                        </Space>
                    </List.Item>
                </List>
                <div style={{ display: 'flex', flexDirection: 'column', height: '65vh', overflowY: 'auto' }}>
                    {dataSource.map((item) => (
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
                            <div style={getTextStyle()}>日期: {dayjs(item.created).format('YYYY-MM-DD')}</div>
                            <div style={getTextStyle()}>租户: {item.tenant_name}</div>
                            <div style={getTextStyle()}>扣费金额: {item.defaultAmount.toFixed(2)}元</div>
                            <div style={getTextStyle()}>水表描述: {item.billStatus==1?<Tag color='red'>未交</Tag>:<Tag color='green'>已交</Tag>}</div>
                            <div style={getTextStyle()}>违约详情:<Button onClick={()=>toList(item.rentId)}><QuestionCircleOutlined/></Button></div>

                        </div>
                    ))}
                </div>
            </div>
            <div style={{display:'flex',justifyContent:'space-around',marginTop:'5px',flexWrap:'wrap'}}>
                <div>总金额:{moneySum.toFixed(2)}元</div>
            </div>
            <Pagination total={count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>
            <Modal open={open} loading={spinning} onCancel={()=>setOpen(false)} onOk={()=>setOpen(false)} title='违约金详情' width={1000}>
                <Table
                    columns={columnsz}
                    pagination={false}
                    dataSource={weiyueListInfo}
                    scroll={{y:'70vh'}}
                    rowKey={(columns) => columns.id}
                    size='small'
                    summary={(columns) => (
                        <Table.Summary fixed>
                            <Table.Summary.Row>
                                <Table.Summary.Cell index={0}> 统计 </Table.Summary.Cell>
                                <Table.Summary.Cell index={1}></Table.Summary.Cell>
                                <Table.Summary.Cell index={2}></Table.Summary.Cell>
                                <Table.Summary.Cell index={3}>{sumweiyue.toFixed(2)}元</Table.Summary.Cell>
                            </Table.Summary.Row>
                        </Table.Summary>
                    )}
                />
            </Modal>
        </Spin>
    )
}
export default WyList