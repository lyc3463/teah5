import {connect} from "umi";
import {
    Button,
    DatePicker,
    Image,
    Input,
    List,
    message,
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
import * as dateWaterService from '@/services/dateWater';
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
const WaterKoufeiList=()=>{
    // 当前页数
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    // 租户姓名
    const [name,setName]=useState('');
    // 表地址
    const [cid,setCid]=useState('');
    // 开始时间
    const [startDate,setStartDate]=useState('2000-01-01');
    // 结束时间
    const [endDate,setEndDate]=useState('2099-01-01');
    // 租户ID
    const [tenantId,settenantId]=useState(0);
    // 水费扣费列表
    const [waterRatelist,setwaterRateList]=useState([]);
    // 总条数
    const [count,setcount]=useState(0);
    const [spinning,setspinning]=useState(false);
    // 水费扣费统计
    const [moneySum,setmoneySum]=useState(0);
    // 扣费状态
    const [recordStatus,setrecordStatus]=useState('余额不足');
    // 消耗度数累加
    const [energyUsage,setenergyUsage]=useState(0);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    // 获取水表扣费记录
    const getwaterRateList=()=>{
        setspinning(true);
        dateWaterService.fetch(page,cid,name,startDate,endDate,tenantId,recordStatus,'',pageSize).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setspinning(false);
                setwaterRateList(res.Data?.data);
            }else {
                setspinning(false);
                message.error(res.Data);
            }
        })
    };
    // 获取水表扣费记录分页
    // const getwaterFenye=()=>{
    //     dateWaterService.fenye(cid,name,startDate,endDate,tenantId,recordStatus,'',pageSize).then((res:TypeErrorCode)=>{
    //         if (res.ErrorCode==0){
    //             setcount(res.Data.count);
    //             setmoneySum(res.Data.moneySum);
    //             setenergyUsage(res.Data.energyUsage);
    //         }else {
    //             message.error(res.Data);
    //         }
    //     })
    // };
    // 搜索
    const sousuo=()=>{
        setPage(1);
        getwaterRateList();
        // getwaterFenye();
    };
    // 监听页数
    const onChange=(e:number,pageSize:number)=>{
        setPage(e);
        setPageSize(pageSize);
    };
    useEffect(() => {
        // getwaterFenye();
    }, []);
    useEffect(() => {
        getwaterRateList();
    }, [page,pageSize]);
    // 监听日期
    const changeDate=(_:any,data:string[])=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setStartDate('2000-01-01');
            setEndDate('2099-01-01');
        } else {
            setStartDate(data[0]);
            setEndDate(data[1]);
        }
    };
    const changeName=(e)=>{
        setName(e.target.value);
    };
    const changeCid=(e)=>{
        setCid(e.target.value);
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
                        <Button type="primary" onClick={sousuo}>
                            搜索
                        </Button>
                        <span>缴费金额:{moneySum.toFixed(2)}元</span>
                        <span>消耗度数:{energyUsage.toFixed(3)}m³</span>
                    </Space>
                    <Space>
                        <Input
                            onChange={changeName}
                            addonBefore="租户姓名:"
                            value={name}
                        />
                        <Input
                            onChange={changeCid}
                            addonBefore="水表地址:"
                            value={cid}
                        />
                    </Space>
                </List.Item>
            </List>
            <div style={{ display: 'flex', flexDirection: 'column', height: '65vh', overflowY: 'auto' }}>
                {waterRatelist.map((item) => (
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
                        <div style={getTextStyle()}>度数: {item.energyNew}m³</div>
                        <div style={getTextStyle()}>消耗度数: {(item.energyNew-item.energyOld).toFixed(3)}m³</div>
                        <div style={getTextStyle()}>扣费金额: {item.energyUsage.toFixed(2)}元</div>
                    </div>
                ))}
            </div>
            <Pagination total={count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>
        </Spin>
    )
}
export default WaterKoufeiList