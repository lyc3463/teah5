import {connect} from "umi";
import {
    Button,
    DatePicker,
    Image,
    Input,
    List,
    message, Modal,
    Pagination,
    Select,
    Space,
    Spin,
    Table,
    Tag,
    Tooltip
} from "antd";
import dayjs from "dayjs";
import {useEffect, useState} from "react";
import * as DayCableRateService from "@/services/dayCableRate";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {StaticInfo} from "@/StaticInfo";
import DateRangePicker from "@/components/DateRangePickerProps";
interface PayInfo {
    beginTime: string;
    tenant_name: string;
    address: string;
    remark: string;
    energyNew: number;
    energyUsage: number;
    consumptionType: number;
    rate: number;
    eleMoney: number;
    // 其他支付相关字段
}
const initialPayInfo: PayInfo = {
    beginTime: '',
    tenant_name: '',
    address: '',
    remark: '',
    energyNew: 0,
    energyUsage: 0,
    consumptionType: 0,
    rate: 0,
    eleMoney: 0,
};
const CableRate=(props)=>{
    // 当前页数
    const [page,setPage]=useState(1);
    const [energyUsage,setenergyUsage]=useState(0);
    const [dataSource,setdataSource]=useState([]);
    const [moneySum,setmoneySum]=useState(0);
    const [count,setcount]=useState(0);
    const [pageSize,setPageSize]=useState(50);
    // 租户名字
    const [name,setName]=useState('');
    // 电表地址
    const [cid,setCId]=useState('');
    // 开始时间
    const [startDate,setStartDate]=useState('2000-01-01');
    // 结束时间
    const [endDate,setEndDate]=useState('2099-01-01');
    // 租户id
    const [tenantId,settenantId]=useState(0);
    // 电表备注
    const [remark,setremark]=useState('');
    const [spinning,setspinning]=useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [uqx,setUqx]=useState([]);
    const [payInfo, setPayInfo] = useState<PayInfo>(initialPayInfo);
    const [open,setOpen]=useState(false);
    // 搜索
    const sousuo=()=>{
        setPage(1);
        getLogFenyeInfo();
        logFenye();
    };
    // 分页信息
    const getLogFenyeInfo=()=>{
        const originalDate = dayjs(endDate);
        const newDate = originalDate.add(1, 'day');
        DayCableRateService.fenye({name,cid,startDate,endDate:dayjs(newDate).format('YYYY-MM-DD'),tenantId,remark,pageSize}).then((res:TypeErrorCode)=>{
            setspinning(true);
            if (res.ErrorCode==0){
                setspinning(false);
                setcount(res.Data.count);
                setmoneySum(res.Data.moneySum);
            }else {
                message.error(res.Data);
                setspinning(false);
            }
        })
    };
    // 列表
    const logFenye=()=>{
        const originalDate = dayjs(endDate);
        const newDate = originalDate.add(1, 'day');
        DayCableRateService.fetch({page,name,cid,startDate,endDate:dayjs(newDate).format('YYYY-MM-DD'),tenantId,remark,pageSize}).then((res:TypeErrorCode)=>{
            setspinning(true);
            console.log('res',res);

            if (res.ErrorCode==0){
                setdataSource(res.Data);
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
        logFenye();
    }, [page,pageSize]);
    useEffect(() => {
        getLogFenyeInfo();
        let uq=StaticInfo.uqx.split('');
        setUqx(uq);
    }, []);
    const columns =[
        {
            title: '日期',
            dataIndex: 'beginTime',
            key: 'beginTime',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        {dayjs(record.beginTime).format('YYYY-MM-DD')}
                    </div>
                )
            }
        },
        {
            title: '姓名',
            dataIndex: 'tenant_name',
            key: 'tenant_name',
            render: (text:any, record:any) => {
                return(
                    <div style={{width:'100px',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
                        <Tooltip title={record.tenant_name}>
                            {record.tenant_name==null?<span style={{color:'red'}} >未绑定租户</span>:<span >{record.tenant_name}</span>}
                        </Tooltip>
                    </div>
                )
            },
        },
        {
            title: '电表地址',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: '电表描述',
            dataIndex: 'remark',
            key: 'remark',
        },
        {
            title: '类型',
            dataIndex: 'consumptionType',
            key: 'consumptionType',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        <Tag  color='green'>电费</Tag>
                    </div>
                )
            }
        },
        {
            title: '度数',
            dataIndex: 'energyNew',
            key: 'energyNew',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        <Tag  color='warning'>{record.energyNew.toFixed(2)}kwh</Tag>
                    </div>
                )
            }
        },
        {
            title: '消耗度数',
            dataIndex: 'xc',
            key: 'xc',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        <Tag  color='warning'>{(record.energyNew-record.energyOld).toFixed(2)}kwh</Tag>
                    </div>
                )
            }
        },
        {
            title: '扣费金额',
            dataIndex: 'eleMoney',
            key: 'eleMoney',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        <Tag color='blue'>{(record.eleMoney).toFixed(2)}元</Tag>
                    </div>
                )
            }
        },
    ];
    // 监听日期
    const changeDate=(start:any,end:any)=>{
        setStartDate(start);
        setEndDate(end);
    };
    const changeName=(e)=>{
        setName(e.target.value);
    };
    const changeCId=(e:any)=>{
        setCId(e.target.value);
    };
    const changeremark=(e:any)=>{
        setremark(e.target.value);
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
    const toinfo=(e:PayInfo)=>{
        setPayInfo(e);
        setOpen(true);
    };
    return(
           <Spin spinning={spinning}>
               <div>
                   <List>
                       <List.Item>
                           <Space>
                               <Input
                                   addonBefore="租户姓名:"
                                   onChange={changeName}
                                   value={name}
                               />
                               {/*<Input*/}
                               {/*    addonBefore="电表地址:"*/}
                               {/*    onChange={changeCId}*/}
                               {/*    value={cid}*/}
                               {/*/>*/}
                               <Input
                                   addonBefore="电表备注:"
                                   onChange={changeremark}
                                   value={remark}
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
                               <div style={getTextStyle()}>日期: {dayjs(item.beginTime).format('YYYY-MM-DD')}</div>
                               <div style={getTextStyle()}>租户: {item.tenant_name}</div>
                               {/*<div style={getTextStyle()}>电表地址: {item.address}</div>*/}
                               <div style={getTextStyle()}>电表描述: {item.remark}</div>
                               {/*<div style={getTextStyle()}>度数: {item.energyNew.toFixed(2)}kwh</div>*/}
                               <div style={getTextStyle()}>消耗度数:{item.energyUsage.toFixed(2)}kwh</div>
                               <div style={getTextStyle()}>扣费金额:{item.eleMoney.toFixed(2)}元</div>
                               <div style={getTextStyle()}>操作:<Button type='primary' onClick={()=>toinfo(item)} >详情</Button></div>
                           </div>
                       ))}
                   </div>
               </div>
               <Modal open={open} title='详情' onCancel={()=>setOpen(false)} onOk={()=>setOpen(false)}>
                   <div style={getTextStyle()}>日期: {dayjs(payInfo.beginTime).format('YYYY-MM-DD')}</div>
                   <div style={getTextStyle()}>租户: {payInfo.tenant_name}</div>
                   <div style={getTextStyle()}>电表地址: {payInfo.address}</div>
                   <div style={getTextStyle()}>电表描述: {payInfo.remark}</div>
                   <div style={getTextStyle()}>度数: {payInfo.energyNew.toFixed(2)}kwh</div>
                   <div style={getTextStyle()}>消耗度数:{payInfo.energyUsage.toFixed(2)}kwh</div>
                   <div style={getTextStyle()}>倍率:{payInfo.rate}倍</div>
                   <div style={getTextStyle()}>扣费金额:{payInfo.eleMoney.toFixed(2)}元</div>
               </Modal>
               <div style={{display:'flex',justifyContent:'space-around',marginTop:'5px',flexWrap:'wrap'}}>
                   <div>总金额:{moneySum.toFixed(2)}元</div>
               </div>
               {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
            <Pagination total={count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>
        </Spin>
    )
}

export default connect() (CableRate)