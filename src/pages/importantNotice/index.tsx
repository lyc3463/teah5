import {Button, DatePicker, Image, Input, List, message, Modal, Pagination, Space, Spin, Table, Tag} from "antd";
import dayjs from "dayjs";
import {history,connect} from "umi";
import {useEffect, useState} from "react";
import * as ImportantNoticeService from '@/services/importantNotice';
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {NavBar} from "antd-mobile";

const ImportantNotice=(props)=>{
    const [startDate,setStartDate]=useState(sessionStorage.getItem('importantNoticeStartDate') || '2000-01-01');
    const [endDate,setEndDate]=useState(sessionStorage.getItem('importantNoticeEndDate') || '2099-01-01');
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    const [open,setOpen]=useState(false);
    const [spinning,setSpinning]=useState(false);
    const [dOpen,setdOpen]=useState(false);
    const [uid,setUid]=useState(0);
    const [imgs,setImgs]=useState([]);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const toadd=()=>{
        history.push('/importantNotice/importantNoticeAdd');
    };
    const changeDate=(_:any,data:string[])=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setStartDate('2000-01-01');
            setEndDate('2099-01-01');

        } else {
            setStartDate(data[0]);
            setEndDate(data[1]);
        }
    };
    const getList=()=>{
        props.dispatch({
            type:'ImportantNotice/fetch',
            payload:{startDate, endDate,page,pageSize}
        })
    };
    const getListFenye=()=>{
        props.dispatch({
            type:'ImportantNotice/fenye',
            payload:{startDate, endDate,pageSize}
        })
    };
    const suosou=()=>{
        setPage(1);
        getList();
        getListFenye();
        console.log('props',props)

    };
    useEffect(() => {
        getListFenye();
    }, []);
    useEffect(() => {
        getList();
    }, [page,pageSize]);

    const onChange=(e:number,pageSize:number)=>{
        setPage(e);
        setPageSize(pageSize);
    };
    const onInfo=(e)=>{
        setOpen(true);
        getInfo(e.id);
    };
    const getInfo=(e)=>{
        setSpinning(true);
        ImportantNoticeService.one(e).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setSpinning(false);
                if (res.Data.inImageBase64){
                    setImgs(res.Data.inImageBase64);
                }else {
                    setImgs([]);
                }
                // setImgs(res.Data.inImageBase64);
            }else {
                message.error(res.Data);
                setSpinning(false);
            }
        })
    };
    const onDelete=(e)=>{
        setUid(e.id);
        setdOpen(true);
    };
    const onOK=()=>{
        setSpinning(true);
        props.dispatch({
            type:'ImportantNotice/remove',
            payload:uid
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('删除成功');
                setSpinning(false);
                setdOpen(false)
            }else {
                message.error(res.Data);
                setSpinning(false);
                setdOpen(false)
            }
        })
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
        <Spin spinning={spinning}>
            <div style={getContainerStyle()}>
                <NavBar
                    onBack={() => history.push('/dashboard/')}
                    style={getNavBarStyle()}
                >
                    重要通知
                </NavBar>
                <List>
                    <div>
                        <Button type="primary" onClick={toadd}>添加重要通知</Button>
                    </div>
                </List>
                <div style={{ display: 'flex', flexDirection: 'column', height: '75vh', overflowY: 'auto' }}>
                    {props.ReportList&&props.ReportList.length>0?props.ReportList.map((item) => (
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
                            <p style={getTextStyle()}>日期:{dayjs(item.created).format('YYYY-MM-DD HH:mm:ss')}</p>
                            <p style={getTextStyle()}>标题: {item.inType}</p>
                            <p style={getTextStyle()}>内容:<Input.TextArea value={item.inContent}/></p>
                            <p style={getTextStyle()}>发起人:{item.user_name}</p>
                            <p style={getTextStyle()}>
                                <Space>
                                    <Button type='primary' onClick={()=>onInfo(item)}>详情</Button>
                                    <Button type='primary' danger onClick={()=>onDelete(item)}>删除</Button>
                                </Space>
                            </p>

                        </div>
                    )):''}
                </div>
                {/*详情的弹窗*/}
                <Modal open={open} onCancel={()=>setOpen(false)} loading={spinning} onOk={()=>setOpen(false)}>
                    <Space style={{display:'flex',flexWrap:'wrap'}}>
                        {imgs.map((item,index)=>{
                            return <Image key={index} src={item} style={{width:'100px',height:'100px'}}/>
                        })}
                    </Space>
                </Modal>
                {/*删除的弹窗*/}
                <Modal open={dOpen} onCancel={()=>setdOpen(false)} loading={spinning} onOk={onOK}>
                    <div>
                        <div>确定删除吗？</div>
                    </div>
                </Modal>
            </div>
            {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        ReportList: state.ImportantNotice.list,
        count: state.ImportantNotice.count,
    }
};
export default connect(mapStateToProps)(ImportantNotice);
