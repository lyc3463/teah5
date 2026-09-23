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
    Tag, Tooltip
} from "antd";
import {useEffect, useState} from "react";
import {connect} from "umi";
import dayjs from "dayjs";
import ImageUploader from "@/components/ImageUploader";
import {NavBar, Popup} from "antd-mobile";
import {history} from "@@/core/history";
import PageLayout from "@/components/PageLayout ";
import DateRangePicker from "@/components/DateRangePickerProps";

const Complaint=(props:any)=>{
    const [loading, setLoading] = useState(false);
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    const [name,setName]=useState('');
    const [phone,setPhone]=useState('');
    const [state,setState]=useState(0);
    const [startDate,setstartDate]=useState('2000-01-01');
    const [endDate,setendDate]=useState('2099-01-01');
    const [openID,setopenID]=useState(0);
    const [open,setOpen]=useState(false);
    const [tenantId,settenantId]=useState(0);
    const [type,setType]=useState(0);
    const [conten,setconten]=useState('');
    const [title,setTitle]=useState('投诉建议回复');
    const [upimg,setUpImg]=useState('');
    const [imgB64,setImgB64]=useState('');
    const [complaintTitle,setComplaintTitle]=useState('');
    const [complaintContent,setComplaintContent]=useState('');
    const [enitOpen,setEnitOpen]=useState(false);
    const [okOpen,setOkOpen]=useState(false);
    const [uid,setUid]=useState(0);
    const [filterOpen, setFilterOpen] = useState(false);


    // 处理完成
    const isOk=(e)=>{
        setUid(e.id);
        setOkOpen(true);
    };
    // 获取投诉建议列表
    const getList=()=>{
        props.dispatch({
            type:'Tousu/fetch',
            payload:{page,name,phone,state,startDate,endDate,openID,pageSize}
        })
    };
    // const getfenye=()=>{
    //     props.dispatch({
    //         type:'Tousu/fenye',
    //         payload:{name,phone,state,startDate,endDate,openID,pageSize}
    //     })
    // };
    useEffect(() => {
        getList();
    }, [page,pageSize]);
    const onChange=(e,pageSize)=>{
        setPage(e);
        setPageSize(pageSize);
    };
    // 时间选择
    const changeDate=(start:string,end:string)=>{
        setstartDate(start);
        setendDate(end);
    };
    const sousuo=()=>{
        setPage(1);
        getList();
        setFilterOpen(false);
    };
    // 回复内容
    const tohuifu=(e:any)=>{
        settenantId(e.tenantId);
        setOpen(true);
    };
    const onimgname=(item:string)=>{
        setUpImg(item);
    };
    const onb64=(item:string)=>{
        setImgB64(item);
    };
    const onOk=()=>{
        setLoading(true);
        props.dispatch({
            type:'TenantInfo/add',
            payload:{tenantId,conten,upimg,title}
        }).then((res:any)=>{
            if (res.ErrorCode==0){
                setLoading(false);
                message.success('回复成功');
                setOpen(false);
            }else {
                setLoading(false);
                message.error(res.Data);
                setOpen(false);
            }
        })
    };
    const changeName=(e)=>{
        setName(e.target.value);
    };
    const changePhone=(e)=>{
        setPhone(e.target.value);
    };
    const changeType=(e)=>{
        setEnitOpen(true);
        setType(e.complaintType);
        setUid(e.id);
        setComplaintTitle(e.complaintTitle);
        setComplaintContent(e.complaint_content);
    };
    // 类型变更
    const onTypeOk=()=>{
        setLoading(true);
        props.dispatch({
            type:'Tousu/edit',
            payload:{uid,type,complaintTitle,complaintContent}
        }).then((res:any)=>{
            if (res.ErrorCode==0){
                message.success('变更成功');
                setEnitOpen(false);
                setLoading(false);
            }else {
                message.error(res.Data);
                setEnitOpen(false);
                setLoading(false);
            }
        })
    };
    const onStutesOk=()=>{
        setLoading(true);
        props.dispatch({
            type:'Tousu/check',
            payload:uid
        }).then((res:any)=>{
            if (res.ErrorCode==0){
                message.success('已完成');
                setOkOpen(false);
                setLoading(false);
            }else {
                message.error(res.Data);
                setOkOpen(false);
                setLoading(false);
            }
        })
    };
    const changeEditType=(e)=>{
        setType(e);
    };

    return(
        <Spin spinning={loading}>
            <PageLayout
                title="投诉建议"
                onBack={()=>history.push('/dashboard/')}
            >
                <List style={{padding:'0 10px'}}>
                    <List.Item>
                        <Space style={{paddingBottom:'10px'}}>
                            <Button type="primary" onClick={() => setFilterOpen(true)}>
                                筛选
                            </Button>
                        </Space>
                    </List.Item>
                </List>
                <Popup
                    visible={filterOpen}
                    onMaskClick={() => setFilterOpen(false)}
                >
                    <div style={{ padding: 16 }}>
                        <DateRangePicker  onDateSelected={changeDate}/>
                        <div style={{ marginTop: 15 }}>姓名</div>

                        <Input
                            onChange={changeName}
                            addonBefore="姓名:"
                            value={name}
                        />
                        <div style={{ marginTop: 15 }}>手机号</div>
                        <Input
                            onChange={changePhone}
                            addonBefore="手机号:"
                            value={phone}
                        />
                        <Button
                            block
                            color="primary"
                            style={{ marginTop: 20 }}
                            onClick={sousuo}
                        >
                            搜索
                        </Button>
                    </div>
                </Popup>
                <div style={{
                    height: 'calc(100vh - 230px)',
                    overflowY: 'auto',
                    padding: '0 12px'
                }}>
                    {props.TousuList&&props.TousuList.length>0?props.TousuList.map((item) => (
                        <List.Item
                            key={item.id}
                            style={{
                                border: '1px solid #e5e6eb',
                                borderRadius: '8px',
                                padding: '16px',
                                marginBottom: '12px',
                                backgroundColor: '#fff',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                            }}
                        >
                            <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}>
                                <Tag color="blue">日期:</Tag> {dayjs(item.created).format('YYYY-MM-DD')}
                            </div>
                            <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}>
                                <Tag color="green">姓名:</Tag> {item.tenant_name}
                            </div>
                            <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}>
                                <Tag color="green">用户联系方式:</Tag> {item.tenant_phone}
                            </div>
                            <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}>
                                <Tag color="green">投诉标题:</Tag> {item.complaintTitle}
                            </div>
                            <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}>
                                <Tag color="green">投诉内容:</Tag> {item.complaint_content}
                            </div>
                            {/*<div style={{ fontSize: 16, color: "#666", marginTop: 4 }}>*/}
                            {/*    <Tag color="gray">投诉类型:</Tag>*/}
                            {/*    /!* 使用对象映射多种状态 *!/*/}
                            {/*    {(() => {*/}
                            {/*        // 定义状态映射关系*/}
                            {/*        const statusConfig = {*/}
                            {/*            1: {text: '服务类', color: 'red'},*/}
                            {/*            2: {text: '收费类', color: 'blue'},*/}
                            {/*            3: {text: '工程类', color: 'orange'},*/}
                            {/*            4: {text: '卫生类', color: 'purple'},*/}
                            {/*        };*/}
                            {/*        const config = statusConfig[item.complaintStatus] || { text: '未知状态', color: 'default' };*/}
                            {/*        return <Tag color={config.color}>{config.text}</Tag>;*/}
                            {/*    })()}*/}
                            {/*</div>*/}
                            <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}>
                                <Tag color="gray">状态:</Tag>
                                {/* 使用对象映射多种状态 */}
                                {(() => {
                                    // 定义状态映射关系
                                    const statusMap = {
                                        1: { text: '待处理', color: 'red' },
                                        2: { text: '已处理', color: 'green' },
                                    };
                                    const status = statusMap[item.complaintStatus] || { text: '未知状态', color: 'default' };
                                    return <Tag color={status.color}>{status.text}</Tag>;
                                })()}
                            </div>
                            <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}>
                                <Space>
                                    {item.complaintStatus==1?
                                        <>
                                            {/*<Button type='primary' onClick={()=>changeType(item)}>变更类型</Button>*/}
                                            <Button type='primary' onClick={()=>isOk(item)}>处理完成</Button>
                                        </>
                                        :''
                                    }
                                    <Button type='primary' onClick={()=>tohuifu(item)}>回复</Button>
                                </Space>
                            </div>
                        </List.Item>
                    )):''}
                </div>
                {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
                {/*回复消息弹窗*/}
                <Modal open={open} onCancel={()=>setOpen(false)} title='回复消息' onOk={onOk} loading={loading}>
                    <Form>
                        <Form.Item label='标题'>
                            <Input value={title} onChange={(e)=>setTitle(e.target.value)}/>
                        </Form.Item>
                        <Form.Item label='消息内容'>
                            <Input.TextArea value={conten} onChange={(e)=>setconten(e.target.value)}/>
                        </Form.Item>
                        <Form.Item label='图片'>
                            <ImageUploader onImageUpload={onimgname} oldBase64={onb64}/>
                            {imgB64?<Image src={imgB64} style={{width:'100px',height:'100px'}}/>:''}
                        </Form.Item>
                    </Form>
                </Modal>
                {/*变更类型弹窗*/}
                <Modal open={enitOpen} onCancel={()=>setEnitOpen(false)} title='变更类型' onOk={onTypeOk} loading={loading}>
                    <Form>
                        <Form.Item label='类型'>
                            <Select value={type} onChange={changeEditType}>
                                <Select.Option value={1}>服务类</Select.Option>
                                <Select.Option value={2}>收费类</Select.Option>
                                <Select.Option value={3}>工程类</Select.Option>
                                <Select.Option value={4}>卫生类</Select.Option>
                            </Select>
                        </Form.Item>
                    </Form>
                </Modal>
                {/*完成弹窗*/}
                <Modal open={okOpen} onCancel={()=>setOkOpen(false)} title='完成' onOk={onStutesOk} loading={loading}>
                    <div>是否完成?</div>
                </Modal>
            </PageLayout>
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        TousuList: state.Tousu.list,
        count: state.Tousu.count,
    }
};
export default connect(mapStateToProps) (Complaint)
