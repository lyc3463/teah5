import {Button, DatePicker, Image, Input, List, Pagination, Space, Table, Tag} from "antd";
import {useEffect, useState} from "react";
import {connect} from "umi";
import dayjs from "dayjs";
import DateRangePicker from "@/components/DateRangePickerProps";
import {NavBar} from "antd-mobile";
import {history} from "@@/core/history";

const TravelRecord=(props:any)=>{
    // 开始时间
    const [startDate,setStartDate]=useState('2000-01-01');
    // 结束时间
    const [endDate,setEndDate]=useState('2099-01-01');
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    // 闸机编号
    const [deviceSn,setDeviceSn]=useState('');
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    // 监听时间
    const changeDate=(start:any,end:any)=>{
        setStartDate(start);
        setEndDate(end);
    };
    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"TravelRecord/fetch",
            payload:{page,deviceSn,startDate,endDate,pageSize}
        });
    };
    useEffect(() => {
        logFenye();
    }, [page,pageSize]);
    useEffect(() => {
        getFenyeInfo();
    }, []);
    const onChange=(e:number,pageSize:number)=>{
        setPage(e);
        setPageSize(pageSize);
    };
    // 搜索
    const  sousuo=()=>{
        setPage(1);
        getFenyeInfo();
        logFenye();
    };
    const getFenyeInfo=()=>{
        props.dispatch({
            type:'TravelRecord/fenye',
            dispatch:{deviceSn,startDate,endDate,pageSize}
        });
    };
    const changeDeviceSn=(e)=>{
        setDeviceSn(e.target.value);
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
    const getContainerStyle = () => {
        return {
            padding: windowWidth <= 480 ? '1rem' : '2rem',
            maxWidth: windowWidth <= 480 ? '100%' : '1200px',
            margin: '0 auto',
            backgroundColor: '#f5f6fa',
            minHeight: '90vh'
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
         <div style={getContainerStyle()}>
             <NavBar
                 onBack={() => history.push('/dashboard/')}
                 style={getNavBarStyle()}
             >
                 通行记录
             </NavBar>
             <List>
                <List.Item>
                    <Space>
                        <DateRangePicker  onDateSelected={changeDate}/>
                        <Button type="primary" onClick={sousuo}>
                            搜索
                        </Button>
                    </Space>
                </List.Item>
            </List>
             <div style={{ display: 'flex', flexDirection: 'column', height: '60vh', overflowY: 'auto' }}>
                 {props.TravelRecordList&&props.TravelRecordList.length>0?props.TravelRecordList.map((item) => (
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
                         <p style={getTextStyle()}>闸机编号: {item.device_sn}</p>
                         <p style={getTextStyle()}>闸机地点: {item.gateName}</p>
                         <p style={getTextStyle()}>姓名: {item.travel_name}</p>
                         <p style={getTextStyle()}>人脸:<Image src={`data:image/jpeg;base64,${item.reg_image}`} style={{height:'50px',width:'50px'}}/></p>
                         <p style={getTextStyle()}>通行时间:  {dayjs(item.travelTime).format('YYYY-MM-DD HH:mm:ss')}</p>
                     </div>
                 )):''}
             </div>
             <div style={{ marginTop: windowWidth <= 480 ? '1rem' : '2rem', textAlign: 'center' }}>
                 {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
             </div>
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        TravelRecordList: state.TravelRecord.list,
        count: state.TravelRecord.count,
    }
};
export default connect(mapStateToProps) (TravelRecord)