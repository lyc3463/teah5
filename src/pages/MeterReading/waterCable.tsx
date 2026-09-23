import {Button, Input, List, message, Pagination, Space, Spin, Table, Tag} from "antd";
import {connect} from "umi";
import {useEffect, useState} from "react";
import dayjs from "dayjs";
import {NavBar} from "antd-mobile";
import {history} from "@@/core/history";
import DateRangePicker from "@/components/DateRangePickerProps";

const WaterCable=(props:any)=>{
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    const [collector_id,setCollector_id]=useState('');
    const [name,setName]=useState('');
    const [startDate,setStartDate]=useState('2000-01-01');
    const [endDate,setEndDate]=useState('2099-01-01');
    const [spinning,setspinning]=useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    // 手动抄表
    const shoudong=()=>{
        setspinning(true);
        props.dispatch({
            type:'WaterCable/shoudong'
        }).then((res:any)=>{
            if (res.ErrorCode==0){
                setspinning(false);
                message.success('抄表成功');
            }else {
                message.error(res.Data);
                setspinning(false);
            }
        })
    };
    // 搜索
    const sousuo=()=>{
        setPage(1);
        getFenyeInfo();
        logFenye();
    };
    const getFenyeInfo=()=>{
        props.dispatch({
            type:'WaterCable/fenye',
            payload:{collector_id,name,startDate,endDate,pageSize}
        });
    };
    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"WaterCable/fetch",
            payload:{page,collector_id,name,startDate,endDate,pageSize}
        })
    };
    useEffect(() => {
        logFenye();
    }, [page,pageSize]);
    // 监听页数
    const onChange=(e:number,pageSize:number)=>{
        setPage(e);
        setPageSize(pageSize);
    };
    useEffect(() => {
        getFenyeInfo();
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
    // 监听日期
    const changeDate=(start:any,end:any)=>{
        setStartDate(start);
        setEndDate(end);
    };
    return(
        <Spin spinning={spinning}>
            <div style={getContainerStyle()}>
                <NavBar
                    onBack={() => history.push('/dashboard/')}
                    style={{
                        '--height': '48px',
                        '--border-bottom': 'none',
                        '--background-color': '#fff'
                    }}
                >
                    水表抄表列表
                </NavBar>
                <List>
                    <List.Item>
                        <Space>
                            <Button type="primary" onClick={shoudong}>
                                手动抄水表
                            </Button>
                            <DateRangePicker  onDateSelected={changeDate}/>
                        </Space>
                        <Space>
                            <Input
                                addonBefore="租户姓名:"
                                onChange={(e)=>setName(e.target.value)}
                            />
                            <Button type="primary" onClick={sousuo}>
                                搜索
                            </Button>
                        </Space>
                    </List.Item>
                </List>
                <div style={{ display: 'flex', flexDirection: 'column', height: '65vh', overflowY: 'auto' }}>
                    {props.WaterCableList&&props.WaterCableList.length>0?props.WaterCableList.map((item:any)=>(
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
                            <div style={getTextStyle()}>抄表时间: {dayjs(item.recordTime).format('YYYY-MM-DD HH:mm:ss')}</div>
                            <div style={getTextStyle()}>水表描述: {item.remark}</div>
                            <div style={getTextStyle()}>水表地址: {item.collector_id}</div>
                            <div style={getTextStyle()}>租户: {item.tenant_name}</div>
                            <div style={getTextStyle()}>抄表前电量: {item.energyOld}m³</div>
                            <div style={getTextStyle()}>抄表后电量: {item.energyNew}m³</div>
                        </div>
                    )):''}
                </div>
                {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50]}/>:''}
            </div>
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        WaterCableList: state.WaterCable.list,
        count: state.WaterCable.count,
    }
};
export default connect(mapStateToProps) (WaterCable)