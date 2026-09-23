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
import {StaticInfo} from "@/StaticInfo";
import {NavBar} from "antd-mobile";
import {history} from "@@/core/history";
import DateRangePicker from "@/components/DateRangePickerProps";
interface PayInfo {
    recordTime: string;
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
    recordTime: '',
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
    const [recordStatus,setrecordStatus]=useState('扣费成功');
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
        props.dispatch({
            type:'CableRate/fenye',
            payload:{name,cid,startDate,endDate,tenantId,recordStatus,remark,pageSize}
        });
    };
    // 列表
    const logFenye=()=>{
        props.dispatch({
            type:"CableRate/fetch",
            payload:{page,name,cid,startDate,endDate,tenantId,recordStatus,remark,pageSize}
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
                    {props.CableRateList&&props.CableRateList.length>0?props.CableRateList.map((item) => (
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
                            <div style={getTextStyle()}>日期: {dayjs(item.recordTime).format('YYYY-MM-DD HH:mm:ss')}</div>
                            <div style={getTextStyle()}>租户: {item.tenant_name}</div>
                            {/*<div style={getTextStyle()}>电表地址: {item.address}</div>*/}
                            <div style={getTextStyle()}>电表描述: {item.remark}</div>
                            {/*<div style={getTextStyle()}>度数: {item.energyNew.toFixed(2)}kwh</div>*/}
                            <div style={getTextStyle()}>消耗度数:{item.energyUsage.toFixed(2)}kwh</div>
                            {/*<div style={getTextStyle()}>倍率:{item.rate}倍</div>*/}
                            <div style={getTextStyle()}>扣费金额:{item.eleMoney.toFixed(2)}元</div>
                            <div style={getTextStyle()}>操作:<Button type='primary' onClick={()=>toinfo(item)} >详情</Button></div>
                        </div>
                    )):''}
                </div>
            </div>
            <Modal open={open} title='详情' onCancel={()=>setOpen(false)} onOk={()=>setOpen(false)}>
                <div style={getTextStyle()}>日期: {dayjs(payInfo.recordTime).format('YYYY-MM-DD HH:mm:ss')}</div>
                <div style={getTextStyle()}>租户: {payInfo.tenant_name}</div>
                <div style={getTextStyle()}>电表地址: {payInfo.address}</div>
                <div style={getTextStyle()}>电表描述: {payInfo.remark}</div>
                <div style={getTextStyle()}>度数: {payInfo.energyNew.toFixed(2)}kwh</div>
                <div style={getTextStyle()}>消耗度数:{payInfo.energyUsage.toFixed(2)}kwh</div>
                <div style={getTextStyle()}>倍率:{payInfo.rate}倍</div>
                <div style={getTextStyle()}>扣费金额:{payInfo.eleMoney.toFixed(2)}元</div>
            </Modal>
            <div style={{display:'flex',justifyContent:'space-around',marginTop:'5px',flexWrap:'wrap'}}>
                <div>度数:{props.count?props.count.energyUsage:''}kwh</div>
                <div>总金额:{props.count?props.count.moneySum:''}元</div>
            </div>
            {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        CableRateList: state.CableRate.list,
        count: state.CableRate.count,
    }
};
export default connect(mapStateToProps) (CableRate)