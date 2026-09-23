import {useEffect, useState} from "react";
import * as ArrearsBillService from "@/services/ArrearsBill";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {Button, DatePicker, Input, List, message, Modal, Pagination, Space, Spin, Table, Tag, Tooltip} from "antd";
import dayjs from "dayjs";
import {QuestionCircleOutlined} from "@ant-design/icons";

const LiquidatedDamagesList=()=>{
    // 当前页数
    const [page,setPage]=useState(1);
    const [spinning,setspinning]=useState(false);
    const [pageSize,setPageSize]=useState(50);
    // 租户姓名
    const [name,setName]=useState('');
    // 租户id
    const [tenandId,settenandId]=useState(0);
    // 账单开始时间
    const [startDate,setStartDate]=useState('2000-01-01');
    // 账单结束时间
    const [endDate,setEndDate]=useState('2099-01-01');
    // 总页码
    const [count,setcount]=useState(0);
    // 列表
    const [dataSource,setdataSource]=useState([]);
    // 租金管理费统计
    const [moneySum,setmoneySum]=useState(0);
    // 租金已交费用统计
    const [NotBillSum,setNotBillSum]=useState(0);
    const [stutes,setstutes]=useState(1);
    const [weiyueListInfo,setweiyueListInfo]=useState([]);
    const [open,setOpen]=useState(false);
    const [sumweiyue,setsumweiyue]=useState(0);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    // 搜索
    const sousuo=()=>{
        setPage(1);
        getzujinList();
        logFenye();
    };
    // 查看违约金列表
    const getzujinList=()=>{
        ArrearsBillService.weiyueList({page,name,startDate,endDate,tenandId,stutes,pageSize}).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setdataSource(res.Data);
            }else {
                message.error(res.Data);
            }
        })
    };
    // 分页
    const logFenye=()=>{
        ArrearsBillService.weiyueListFenye({name,startDate,endDate,tenandId,stutes,pageSize}).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setcount(res.Data.count);
                setmoneySum(res.Data.moneySum);
                setNotBillSum(res.Data.NotBillSum);
            }else {
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
        logFenye();
    }, []);
    useEffect(() => {
        getzujinList();
    }, [page,pageSize]);
    const toList=(e)=>{
        setOpen(true);
        getweiyuejinInfo(e);
    };
    const getweiyuejinInfo=(e:number)=>{
        ArrearsBillService.weiyuejinInfoList(e).then((res:TypeErrorCode)=>{
            setspinning(true);
            if (res.ErrorCode==0){
                setweiyueListInfo(res.Data);
                setspinning(false);
                setsumweiyue(getTotalDefaultAmount(res.Data));

            }else {
                setspinning(false);
                message.error(res.Data);
            }
        })
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
        },
    ];
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
    return(
        <Spin spinning={spinning}>
            <List>
                <List.Item>
                    <Space style={{marginBottom:'10px'}}>
                        <span>违约金额:{moneySum.toFixed(2)}元</span>
                        <span>未交金额:{NotBillSum.toFixed(2)}元</span>
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
                        <div style={getTextStyle()}>日期:{dayjs(item.created).format("YYYY-MM-DD")}</div>
                        <div style={getTextStyle()}>租户姓名:{item.tenant_name}</div>
                        <div style={getTextStyle()}>账单类型:违约金</div>
                        <div style={getTextStyle()}>违约天数: {item.defaultNum}天</div>
                        <div style={getTextStyle()}>违约金额(元):{item.defaultAmount}元<Button onClick={()=>toList(item.rentId)}><QuestionCircleOutlined/></Button></div>
                        <div style={getTextStyle()}>已交金额: {item.stopAmount.toFixed(2)}元</div>
                        <div style={getTextStyle()}>未交: {(item.defaultAmount-item.stopAmount).toFixed(3)}元</div>
                    </div>
                ))}
            </div>
            <Pagination total={count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>
            <Modal open={open} loading={spinning} onCancel={()=>setOpen(false)} onOk={()=>setOpen(false)} title='违约金详情' width={1000}>
                <Table
                    columns={columnsz}
                    pagination={false}
                    dataSource={weiyueListInfo}
                    scroll={{y:'60vh'}}
                    rowKey={(columns) => columns.id}
                    size='small'
                    summary={(columns) => (
                        <Table.Summary fixed>
                            <Table.Summary.Row>
                                <Table.Summary.Cell index={0}> 统计 </Table.Summary.Cell>
                                <Table.Summary.Cell index={1}></Table.Summary.Cell>
                                <Table.Summary.Cell index={2}></Table.Summary.Cell>
                                <Table.Summary.Cell index={3}>{sumweiyue}元</Table.Summary.Cell>
                            </Table.Summary.Row>
                        </Table.Summary>
                    )}
                />
            </Modal>
        </Spin>
    )
}
export default LiquidatedDamagesList