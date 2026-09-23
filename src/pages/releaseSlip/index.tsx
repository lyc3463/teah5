import {
    Button,
    DatePicker,
    Form,
    Image,
    Input,
    List,
    message,
    Modal,
    Pagination,
    Select,
    Space,
    Spin,
    Table,
    Tag
} from "antd";
import dayjs from "dayjs";
import {useEffect, useState} from "react";
import {history,connect} from "umi";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import CmpImageUploader from "@/components/ImageUploader";
import * as ReleaseSlipServer from "@/services/releaseSlip";
import {NavBar} from "antd-mobile";
import {joinUnitNames} from "@/utils/OpenTool";

const ReleaseSlip=(props)=>{
    const [startDate,setStartDate]=useState('2000-01-01');
    const [endDate,setEndDate]=useState('2099-01-01');
    const [name,setName]=useState('');
    const [phone,setPhone]=useState('');
    const [status,setStatus]=useState(Number(0));
    const [userID,setUserID]=useState(Number(0));
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    const [uid,setUid]=useState(0);
    const [dopen,setDopen]=useState(false);
    const [spinning,setspinning]=useState(false);
    const [infoOpen,setInfoOpen]=useState(false);
    const [checkOpen,setcheckOpen]=useState(false);
    const [releaseOpen,setReleaseOpen]=useState(false);
    const [imgsName,setImgsName]=useState([]);// 图片名字
    const [goodJson,setGoodJson]=useState([]);
    const [b64,setB64]=useState([]);// 显示的多图
    const [displayB64,setDisplayB64]=useState([]);// 详情弹窗显示的图片
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const suosou=()=>{
        setPage(1);
        getListfenYen();
        getList();
    };
    // 去详情页面
    const toinfo=(e)=>{
        history.push(`/propertyServerManage/releaseSlipInfo?id=${e.id}`);
    };
    // 去添加页面
    const toadd=()=>{
        history.push('/releaseSlip/addReleaseSlip');
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
    // 获取列表
    const getList=()=>{
        props.dispatch({
            type:'ReleaseSlip/fetch',
            payload:{page, pageSize, name, phone, startDate, endDate, status, userID}
        })
    };
    useEffect(() => {
        getList();
    }, [page,pageSize]);
    const onChange=(e:number,pageSize:number)=>{
        setPage(e);
        setPageSize(pageSize);
    };
    // 监听状态
    const changeState=(e)=>{
        setStatus(e);
    };
    const del=(e)=>{
        setUid(e.id);
        setDopen(true);
    };
    const delFn=()=>{
        setspinning(true);
        props.dispatch({
            type:'ReleaseSlip/remove',
            payload:uid
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('删除成功');
                setspinning(false);
                setDopen(false);
            }else {
                message.error(res.Data);
                setspinning(false);
                setDopen(false);
            }
        })
    };
    // 详情弹窗
    const openInfo=(e)=>{
        setInfoOpen(true);
        getOne(e.id);
    };
    // 获取放行条详情
    const getOne=(e)=>{
        setspinning(true);
        ReleaseSlipServer.one(e).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setGoodJson(JSON.parse(res.Data.goodJson));
                let imageBase64=res.Data.imageBase64;
                if (imageBase64){
                    setDisplayB64(imageBase64);
                }else {
                    setDisplayB64([]);
                }
            }
            setspinning(false);
        })
    };
    // 审核弹窗
    const isCheck=(e)=>{
        setUid(e.id);
        setcheckOpen(true);
    };
    // 审核确定按钮
    const checkFn=()=>{
        setspinning(true);
        props.dispatch({
            type:'ReleaseSlip/check',
            payload:uid
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('审核成功');
                setspinning(false);
                setcheckOpen(false);
            }else {
                message.error(res.Data);
                setspinning(false);
                setcheckOpen(false);
            }
        })
    };
    // 放行弹窗
    const isRelease=(e)=>{
        setUid(e.id);
        setReleaseOpen(true);
    };
    // 放行确定按钮
    const releaseFn=()=>{
        setspinning(true);
        let imgs=imgsName.join('|');
        props.dispatch({
            type:'ReleaseSlip/release',
            payload:{uid,imgs}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('放行成功');
                setspinning(false);
                setReleaseOpen(false);
            }else {
                message.error(res.Data);
                setspinning(false);
                setReleaseOpen(false);
            }
        })
    };
    // 多图base64
    const handBase64s=(vals:string)=>{
        setB64([...b64,vals]);
    };
    const handleDelete=(index:number)=>{
        const newImages = [...imgsName];
        newImages.splice(index, 1);
        setImgsName(newImages);
        const newB64 = [...b64];
        newB64.splice(index, 1);
        setB64(newB64);
    };
    // 多图名字
    const handleImageUploads=(val:string)=>{
        setImgsName([...imgsName,val]);
    };
    // 监听手机号
    const changePhone=(e)=>{
        setPhone(e.target.value);
    };
    // 监听名字
    const changeName=(e)=>{
        setName(e.target.value);
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
    const getInputStyle = () => {
        return {
            width: windowWidth <= 480 ? '100%' : 'auto',
            borderRadius: '8px',
            borderColor: '#e0e0e0'
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
                    放行条列表
                </NavBar>
                <List>
                    <List.Item>
                        {/*<Button type="primary" onClick={toadd}>添加放行条</Button>*/}
                        <Button type="primary" onClick={suosou}>搜索</Button>
                    </List.Item>

                    <List.Item>
                        <Space>
                            <Input
                                addonBefore="姓名:"
                                onChange={changeName}
                                value={name}
                            />
                            <Space.Compact>
                                <div
                                    style={{
                                        borderRadius: '6px',
                                        borderStartEndRadius: 0,
                                        borderEndEndRadius: 0,
                                        padding: '0 11px',
                                        border: '1px solid #d9d9d9',
                                        display: 'flex',
                                        alignItems: 'center',
                                        borderInlineEnd: 0,
                                        width:'40px'
                                    }}
                                >
                                    状态:
                                </div>
                                <Select value={status} onChange={changeState}>
                                    <Select.Option value={0}>
                                        全部
                                    </Select.Option>
                                    <Select.Option value={1}>
                                        待审核
                                    </Select.Option>
                                    <Select.Option value={2}>
                                        已审核
                                    </Select.Option>
                                    <Select.Option value={3}>
                                        已放行
                                    </Select.Option>
                                </Select>
                            </Space.Compact>
                        </Space>
                    </List.Item>
                </List>
                <div style={{ display: 'flex', flexDirection: 'column', height: '65vh', overflowY: 'auto' }}>
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
                            <p style={getTextStyle()}>提交日期: {dayjs(item.created).format('YYYY-MM-DD')}</p>
                            <p style={getTextStyle()}>姓名: {item.tenant_name}</p>
                            <p style={getTextStyle()}>手机号: {item.tenant_phone}</p>
                            <p style={getTextStyle()}>申请出行时间: {dayjs(item.releaseDate).format('YYYY-MM-DD')}</p>
                            <p style={getTextStyle()}>放行时间: {
                                item.relStatus===3? dayjs(item.releaseTime).format('YYYY-MM-DD'):'待放行'
                            }</p>
                            <p style={getTextStyle()}>放行人: {item.relStatus==3?item.user_name:'待放行'}</p>
                            <p style={getTextStyle()}>
                                {(() => {
                                    // 定义状态映射关系
                                    const statusMap = {
                                        1: { text: '待审核', color: 'warning' },
                                        2: { text: '已审核', color: 'processing' },
                                        3: { text: '已放行', color: 'success' },
                                        4: { text: '已驳回', color: 'error' },
                                        5: { text: '已终止', color: 'default' },
                                    };
                                    const status = statusMap[item.relStatus] || { text: '未知状态', color: 'default' };
                                    return <Tag color={status.color}>{status.text}</Tag>;
                                })()}
                            </p>
                            <Space>
                                <Button type="primary" onClick={()=>openInfo(item)}>
                                    详情
                                </Button>
                                {
                                    item.relStatus==1?<>
                                        <Button type="primary" danger onClick={()=>del(item)}>删除</Button>
                                        <Button type="primary" onClick={()=>isCheck(item)}>审核</Button>
                                    </>:''
                                }
                                {
                                    item.relStatus==2?<Button type='primary' onClick={()=>isRelease(item)}>放行</Button>:''
                                }
                            </Space>
                        </div>
                    )):''}
                </div>
                {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
                {/* 删除的弹窗*/}
                <Modal title="删除" open={dopen} onCancel={() => setDopen(false)} onOk={delFn} loading={spinning}>
                    <p>确定删除吗？</p>
                </Modal>
                {/* 详情的弹窗*/}
                <Modal title="详情" open={infoOpen} onCancel={() => setInfoOpen(false)} onOk={() => setInfoOpen(false)} loading={spinning}>
                    <div>
                        <Space style={{display:"flex",flexWrap:'wrap'}}>
                            {displayB64.map((item:any)=>{
                                return(
                                    <div key={item}>
                                        <Image src={item} style={{ width: '80px', height: '80px' }} />
                                    </div>
                                )
                            })}
                        </Space>
                        {goodJson.map((item:any)=>{
                            return(
                                <div key={item.id}>
                                    <Space>
                                        <span>商品名称：{item.title}</span>
                                        <span>商品数量：{item.quantity}</span>
                                    </Space>
                                </div>
                            )
                        })}
                    </div>
                </Modal>
                {/* 审核的弹窗*/}
                <Modal title="审核" open={checkOpen} onCancel={() => setcheckOpen(false)} onOk={checkFn} loading={spinning}>
                    <p>确定审核吗？</p>
                </Modal>
                {/* 放行的弹窗*/}
                <Modal title="放行" open={releaseOpen} onCancel={() => setReleaseOpen(false)} onOk={releaseFn} loading={spinning}>
                    <Form>
                        <Form.Item label="多图">
                            <CmpImageUploader onImageUpload={handleImageUploads} oldBase64={handBase64s}/>
                            <Space style={{display:'flex',flexWrap:'wrap'}}>
                                <Space style={{display:'flex',flexWrap:'wrap',marginTop:'25px'}}>
                                    {b64.length>0?b64.map((item:any,index:number)=>{
                                        return(
                                            <div key={index} style={{ display: 'flex', alignItems: 'center', position: 'relative',marginLeft:'20px'}}>
                                                <Image src={item} style={{ width: '80px', height: '80px' }} />
                                                <Button
                                                    type="primary"
                                                    danger
                                                    onClick={() => handleDelete(index)}
                                                    style={{
                                                        position: 'absolute',
                                                        top: '0',
                                                        left: '0',
                                                        zIndex: 1,
                                                        padding: '2px 4px',
                                                        transform: 'translate(-50%, -50%)', // 使按钮居中于图片的左上角
                                                    }}
                                                >
                                                    删除
                                                </Button>
                                            </div>
                                        )
                                    }):''}
                                </Space>
                            </Space>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        ReportList: state.ReleaseSlip.list,
        count: state.ReleaseSlip.count,
    }
};
export default connect(mapStateToProps)(ReleaseSlip);
