import {connect} from "umi";
import {Button, DatePicker, Image, Input, List, message, Pagination, Select, Space, Table, Tag, Tooltip} from "antd";
import dayjs from "dayjs";
import {useEffect, useState} from "react";
import * as ArrearsBillService from '@/services/ArrearsBill';
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {joinUnitNames} from "@/utils/OpenTool";


const ZuList=(props:any)=>{
    // 当前页数
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    const [name,setName]=useState('');
    const [phone,setPhone]=useState('');
    const [tenandId,settenandId]=useState(0);
    const [startDate,setStartDate]=useState('2000-01-01');
    const [endDate,setEndDate]=useState('2099-01-01');
    // 总页码
    const [count,setcount]=useState(0);
    const [stutes,setstutes]=useState(1);
    // 列表
    const [dataSource,setdataSource]=useState([]);
    // 租金管理费统计
    const [moneySum,setmoneySum]=useState(0);
    // 租金已交费用统计
    const [NotBillSum,setNotBillSum]=useState(0);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    // 搜索
    const sousuo=()=>{
        setPage(1);
        getzujinList();
        logFenye();
    };
    // 查看租金缴费列表
    const getzujinList=()=>{
        ArrearsBillService.zujinList({page,name,phone,startDate,endDate,tenandId,stutes,pageSize}).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setdataSource(res.Data);
            }else {
                message.error(res.Data);
            }
        })
    };
    // 分页
    const logFenye=()=>{
        ArrearsBillService.zujinListFenye({name,phone,startDate,endDate,tenandId,stutes,pageSize}).then((res:TypeErrorCode)=>{
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
    const changePhone=(e)=>{
        setPhone(e.target.value);
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
                    <Space>
                        <Button type="primary" onClick={sousuo}>
                            搜索
                        </Button>
                        <span>缴费金额:{moneySum.toFixed(2)}元</span>
                        <span>已交金额:{NotBillSum.toFixed(2)}元</span>
                    </Space>
                    <Space style={{marginTop:'10px'}}>
                        <Input
                            onChange={changeName}
                            addonBefore="姓名:"
                            value={name}
                        />
                        <Input
                            onChange={changePhone}
                            addonBefore="手机号:"
                            value={phone}
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
                        <div style={getTextStyle()}>账单周期:{dayjs(item.billBeginDate).format("YYYY-MM-DD")}至{dayjs(item.billEndDate).format("YYYY-MM-DD")}</div>
                        <div style={getTextStyle()}>租户姓名:{item.tenant_name}</div>
                        <div style={getTextStyle()}>租户手机号:{item.tenant_phone}</div>
                        <div style={getTextStyle()}>账单类型:租金/管理费</div>
                        <div style={getTextStyle()}>缴费金额(元): {item.payAmount.toFixed(2)}</div>
                        <div style={getTextStyle()}>已交金额(元): {item.stopAmount.toFixed(2)}</div>
                        <div style={getTextStyle()}>违约金天数: {item.defaultNum}天</div>
                        <div style={getTextStyle()}>违约金(元): {item.defaultAmount.toFixed(2)}</div>
                        <div style={getTextStyle()}>优惠金额(元): {item.preRen.toFixed(2)}</div>
                        <div style={getTextStyle()}>优惠前租金(元):{(item.preRen+item.payAmount).toFixed(2)}</div>
                        <div style={getTextStyle()}>缴费状态:{item.billStatus==1?<Tag color='red'>未交</Tag>:<Tag>已交</Tag>}</div>
                    </div>
                ))}
            </div>
            <Pagination total={count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>
        </div>
    )
}
export default connect() (ZuList)