import {
    Button, DatePicker,
    Form,
    Image,
    Input,
    InputNumber,
    List,
    message,
    Modal,
    Pagination,
    Select,
    Space,
    Table,
    Spin,
    Tag
} from "antd";
import  {history,connect} from "umi";
import {useEffect, useState} from "react";
import * as TestService from '@/services/test';
import MyQRCodeComponent from '@/components/Myqrcode';
import {StaticInfo} from "@/StaticInfo";
import dayjs from "dayjs";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {NavBar} from "antd-mobile";
const Device=(props)=>{
    // 页码
    const [page,setPage]=useState(1);
    const [pageSize,setpageSize]=useState(50);
    // 闸机编号
    const [deviceSn,setDeviceSn]=useState(sessionStorage.getItem('gateManageDeviceDeviceSn')||'');
    // 二维码弹窗
    const [open,setOpen]=useState(false);
    const [code,setCode]=useState('');
    const [timestamp,setTimestamp]=useState(0);
    const [title,setTitle]=useState('');
    // 同步数据弹窗
    const [synchronousOpen,setsynchronousOpen]=useState(false);
    //转圈
    const [spinning,setspinning]=useState(false);
    // 用户权限
    const [uqx,setUqx]=useState([]);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    // 添加闸机
    const toadd=()=>{
        history.push('/gateManage/addDevice');
    };
    // 修改闸机
    const toedit=(record)=>{
        history.push(`/gateManage/editdevice?id=${record.id}`);
    };
    // 同步数据弹窗
    const synchronousData=()=>{
        TestService.text().then((res:TypeErrorCode)=>{

        })
    };
    // 生成二维码
    const onOK=()=>{
        let obj={id:StaticInfo.park_id,ts:timestamp}
        TestService.testQrCode(JSON.stringify(obj)).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setCode(res.Data);
                setTitle('请截图或者拍照保留通行二维码');
            }else {
                message.error(res.Data);
            }
        });
    };
    // 开门
    const kaimen=(item:any)=>{
        TestService.test(item.deviceSn).then((res:any)=>{
            if (res.ErrorCode==0){
                message.success('开门成功');
            }else {
                message.error(res.Data);
            }
        });
    };
    // 获取闸机列表
    const getGeteList=()=>{
        props.dispatch({
            type:'Gate/fetch',
            payload:{page,deviceSn,pageSize}
        })
    };
    useEffect(() => {
        getGeteList();
    }, [page,pageSize]);
    // 搜索
    const sousuo=()=>{
        setPage(1);
        getFenYeInfo();
        getGeteList();
    };
    const getFenYeInfo=()=>{
        props.dispatch({
            type:'Gate/fenye',
            payload:{deviceSn,pageSize}
        });
    };
    const onChange=(e:number,pageSize:number)=>{
        setPage(e);
        setpageSize(pageSize);
    };
    const changeDate=(_:any,item:any)=>{
        // 精确到秒的时间戳
        setTimestamp(Date.parse(`${item} 23:59:59`)/1000);
    };
    const synchronousOK=()=>{
        setspinning(true);
        props.dispatch({
            type:'Gate/synchronous',
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setspinning(false);
                setsynchronousOpen(false);
            }else {
                message.error(res.Data);
                setsynchronousOpen(false);
                setspinning(false);
            }
        })
    };
    useEffect(() => {
        let uq=StaticInfo.uqx.split('');
        setUqx(uq);
        getFenYeInfo();
    }, []);
    const changeDeviceSn=(e)=>{
        setDeviceSn(e.target.value);
        sessionStorage.setItem('gateManageDeviceDeviceSn',e.target.value);
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
        <Spin spinning={spinning} style={{zIndex:'10000'}}>
            <div style={getContainerStyle()}>
                <NavBar
                    onBack={() => history.push('/dashboard/')}
                    style={getNavBarStyle()}
                >
                    闸机列表
                </NavBar>
                <List>
                    <Space>
                        {uqx[191]=='1'?<Button type="primary" onClick={toadd}>新增闸机</Button>:''}
                        {uqx[263]=='1'?<Button type="primary" onClick={()=>setOpen(true)}>生成访客二维码</Button>:''}
                    </Space>
                    <List.Item>

                        <Space>
                            <Input
                                addonBefore="闸机编号:"
                                onChange={changeDeviceSn}
                                value={deviceSn}
                            />
                            <Button type="primary" onClick={sousuo}>
                                搜索
                            </Button>
                        </Space>
                    </List.Item>
                </List>
                <div style={{ display: 'flex', flexDirection: 'column', height: '70vh', overflowY: 'auto' }}>
                    {props.GateList&&props.GateList.length>0?props.GateList.map((item) => (
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
                            <div style={getTextStyle()}>闸机编号: {item.deviceSn}</div>
                            <div style={getTextStyle()}>所属房屋: {item.house_name}</div>
                            <div style={getTextStyle()}>闸机地点: {item.position}</div>
                            <Space>
                                {uqx[209]=='1'?<Button type='primary' onClick={()=>kaimen(item)}>开门</Button> :''}
                                {uqx[192]=='1'?<Button type='primary' onClick={()=>toedit(item)}>修改</Button>:''}
                            </Space>
                        </div>
                    )):''}
                </div>
            {/*<Table*/}
            {/*    columns={columns}*/}
            {/*    rowKey={(columns) => columns.id}*/}
            {/*    pagination={false}*/}
            {/*    dataSource={props.GateList}*/}
            {/*    size='small'*/}
            {/*    scroll={{y:'70vh'}}*/}
            {/*    rowClassName={(record, index) =>*/}
            {/*        index % 2 === 1 ? 'tbodd' : 'tbeven'*/}
            {/*    }*/}
            {/*/>*/}

                <div style={{ marginTop: windowWidth <= 480 ? '1rem' : '2rem', textAlign: 'center' }}>
                    {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
                </div>
            {/*访客二维码*/}
            <Modal title='访客二维码' onOk={onOK} open={open} onCancel={()=>setOpen(false)} loading={spinning}>
                <Form>
                    <Form.Item label='选择到期时间' >
                        <DatePicker onChange={changeDate}/>
                    </Form.Item>
                </Form>
                <div style={{textAlign:'center'}}>
                    {code?
                        <div>
                            <MyQRCodeComponent value={code}/>
                            <span style={{fontSize:'12px' ,color:'#555'}}>{title}</span>
                        </div>
                        :''}
                </div>
            </Modal>
            {/*  同步闸机数据弹窗  */}
            <Modal title='同步数据' onOk={synchronousOK} open={synchronousOpen} onCancel={()=>setsynchronousOpen(false)}>
                <div>
                    确定要同步数据吗？
                </div>
            </Modal>
            </div>
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        GateList: state.Gate.list,
        count: state.Gate.count,
        GroupingList: state.Grouping.list
    }
};
export default connect(mapStateToProps) (Device)