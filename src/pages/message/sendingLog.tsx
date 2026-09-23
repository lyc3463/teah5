import {Button, Form, Input, Table, DatePicker, Space, List, Pagination} from "antd";
import {connect} from "umi";
import dayjs from "dayjs";
import {useEffect, useState} from "react";
import DateRangePicker from "@/components/DateRangePickerProps";
import {NavBar} from "antd-mobile";
import {history} from "@@/core/history";

const SendingLog=(props:any)=>{
    const [current, setCurrent] = useState(1);
    const [pageSize, setpageSize] = useState(50);
    const [phone,setPhone]=useState('');
    const [starTime,setStarTime]=useState('2000-01-01');
    const [endTime,setEndTime]=useState('2099-01-01');
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const columns =[
        {
            title: '手机号',
            dataIndex: 'receiverPhone',
            key: 'receiverPhone',
        },
        {
            title: '时间',
            dataIndex: 'SendTime',
            key: 'SendTime',
            render: (_: any, record: any) => (
                <span>{dayjs(record.SendTime).format('YYYY-MM-DD HH:mm:ss')}</span>
            ),
        },
        {
            title: '短信内容',
            dataIndex: 'smsContent',
            key: 'smsContent',
        },
        {
            title: '发送人',
            dataIndex: 'userName',
            key: 'userName',
        }
    ];
    const logFenye=()=>{
        props.dispatch({
            type:"SendingLog/fetch",
            payload:{current,phone,starTime,endTime,pageSize}
        })
    };
    const onChange=(page,pageSize)=>{
        setCurrent(page);
        setpageSize(pageSize);
    };
    const changeDate=(start:any,end:any)=>{
        setStarTime(start);
        setEndTime(end);
    };
    const changePhone=(e)=>{
        setPhone(e.target.value);
    };
    const sousuo=()=>{
        setCurrent(1);
        getFenyeInfo();
        logFenye();
    };
    useEffect(() => {
        logFenye();
    }, [current,pageSize]);
    const getFenyeInfo=()=>{
        props.dispatch({
            type:'SendingLog/fenye',
            payload:{phone,starTime,endTime,pageSize}
        })
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
                onBack={() => history.push('/dashboard')}
                style={getNavBarStyle()}
            >
                短信发送
            </NavBar>
            <List>
            <Space>
                <Input
                    onChange={changePhone}
                    addonBefore="手机号:"
                    value={phone}
                />
            </Space>
            <List.Item>
                <Space>
                    <DateRangePicker  onDateSelected={changeDate}/>
                    <Button type="primary" onClick={sousuo}>
                        搜索
                    </Button>
                </Space>
            </List.Item>
        </List>
            <Table
                columns={columns}
                rowKey={(columns) => columns.smsId}
                style={{border:'1px solid #ddd',borderRadius:'4px'}}
                size='small'
                scroll={{y:'60vh'}}
                dataSource={props.SendingLogList}
                pagination={false}
            />
            {props.count?<Pagination total={props.count.count} pageSize={pageSize} current={current}  onChange={onChange} pageSizeOptions={[50]}/>:''}
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        SendingLogList: state.SendingLog.list,
        count: state.SendingLog.count
    }
};
export default connect(mapStateToProps) (SendingLog)