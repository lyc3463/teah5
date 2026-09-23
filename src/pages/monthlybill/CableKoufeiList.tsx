import {useEffect, useState} from "react";
import dayjs from "dayjs";
import {Button, DatePicker, Input, List, message, Pagination, Space, Table, Tag, Tooltip} from "antd";
import * as ArrearsBillService from '@/services/ArrearsBill';
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";

const CableKoufeiList=()=>{
    // 当前页数
    const [page,setPage]=useState(1);
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
    const [recordStatus,setrecordStatus]=useState('余额不足');
    // 列表
    const [dataSource,setdataSource]=useState([]);
    // 消耗度数总统计
    const [energyUsage,setenergyUsage]=useState(0);
    // 扣费金额总计
    const [moneySum,setmoneySum]=useState(0);
    // 电表备注
    const [remake,setRemake]=useState('');
    const [count,setcount]=useState(0);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const sousuo=()=>{
        setPage(1);
        getzujinList();
        logFenye();
    };
    // 查看电费扣费失败记录
    const getzujinList=()=>{
        ArrearsBillService.eleList(page,cid,name,startDate,endDate,tenantId,recordStatus,remake,pageSize).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                console.log('水表列表',res)
                setdataSource(res.Data);
            }else {
                message.error(res.Data);
            }
        })
    };
    // 分页
    const logFenye=()=>{
        ArrearsBillService.eleListFenye(cid,name,startDate,endDate,tenantId,recordStatus,remake,pageSize).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setenergyUsage(res.Data.energyUsage);
                setmoneySum(res.Data.moneySum);
                setcount(res.Data.count);
            }else {
                message.error(res.Data);
            }
        })
    };
    useEffect(() => {
        getzujinList();
    }, [page,pageSize]);
    useEffect(() => {
        logFenye();
    }, []);
    const onChange=(e:number,pageSize:number)=>{
        setPage(e);
        setPageSize(pageSize);
    };
    const changeRemake=(e)=>{
        setRemake(e.target.value);
    };
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
        <div>
            <List>
                <List.Item>
                    <Space style={{marginBottom:'10px'}}>
                        <Button type="primary" onClick={sousuo}>
                            搜索
                        </Button>
                        <span>缴费金额:{moneySum.toFixed(2)}元</span>
                    </Space>
                    <Space>
                        <Input
                            onChange={changeName}
                            addonBefore="租户姓名:"
                            value={name}
                        />
                        <Input
                            onChange={changeRemake}
                            addonBefore="电表备注:"
                            value={remake}
                        />
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
                        <div style={getTextStyle()}>日期:{dayjs(item.recordTime).format("YYYY-MM-DD")}</div>
                        <div style={getTextStyle()}>租户姓名:{item.tenant_name}</div>
                        <div style={getTextStyle()}>电表地址:{item.address}</div>
                        <div style={getTextStyle()}>备注:{item.remark}</div>
                        <div style={getTextStyle()}>账单类型:电费</div>
                        <div style={getTextStyle()}>度数: {item.energyNew}kwh</div>
                        <div style={getTextStyle()}>消耗度数: {item.energyUsage}kwh</div>
                        <div style={getTextStyle()}>倍率: {item.rate}</div>
                        <div style={getTextStyle()}>扣费金额: {item.eleMoney.toFixed(2)}元</div>
                    </div>
                ))}
            </div>
            <Pagination total={count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>
        </div>
    )
}
export default CableKoufeiList