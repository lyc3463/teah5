import {Button, Input, List, message, Modal, Pagination, Space, Spin, Tag} from "antd";
import dayjs from "dayjs";
import {useCallback, useEffect, useRef, useState} from "react";
import {history,connect} from "umi";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {StaticInfo} from "@/StaticInfo";
import {Popup} from "antd-mobile";
import PageLayout from "@/components/PageLayout ";

const CheckStaff=(props:any)=>{
    const [dopen,setDopen]=useState(false);
    const [uName,setUname]=useState('');
    const [did,setDid]=useState(0);
    // 当前页数
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    // 审核状态 0全部  1未审核 2已审核
    const [stutes,setStutes]=useState(1);
    // 姓名
    const [cname,setCname]=useState('');
    // 昵称
    const [nickname,setNickname]=useState('');
    // 手机号
    const [phone,setPhone]=useState('');
    const [companyName,setcompanyName]=useState('');
    const [spinning,setspinning]=useState(false);
    const [list,setList]=useState([]);
    const [filterOpen, setFilterOpen] = useState(false);
    const [tenantId,setTenantId]=useState(0);
    // 用户权限
    const [uqx,setUqx]=useState([]);
    const [loadedImageIds, setLoadedImageIds] = useState<Set<string>>(new Set());
    // 行ref数组
    const rowRefs = useRef<HTMLDivElement[]>([]);
    // 交叉观察器实例
    const observerRef = useRef<IntersectionObserver | null>(null);
    // 监听数据变化，重置图片加载状态
    useEffect(() => {
        setLoadedImageIds(new Set());
        // 初始化交叉观察器
        initObserver();
    }, []);
    // 初始化交叉观察器：检测行是否进入可视区域
    const initObserver = useCallback(() => {
        // 销毁旧的观察器
        if (observerRef.current) {
            observerRef.current.disconnect();
        }
        // 创建新的观察器：元素进入可视区域时加载图片
        observerRef.current = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const rowId = entry.target.dataset.rowId;
                        if (rowId && !loadedImageIds.has(rowId)) {
                            // 标记为已加载，触发重新渲染
                            setLoadedImageIds(prev => new Set(prev).add(rowId));
                        }
                    }
                });
            },
            {
                root: document.querySelector('.ant-table-body'), // 表格滚动容器
                rootMargin: '20px', // 提前20px加载（预加载）
                threshold: 0.1 // 元素10%进入可视区域时触发
            }
        );
        // 观察所有行元素
        rowRefs.current.forEach((rowEl) => {
            if (rowEl) {
                observerRef.current?.observe(rowEl);
            }
        });
    }, [loadedImageIds]);
    // 搜索
    const sousuo=()=>{
        setPage(1);
        logFenye();
        setFilterOpen(false);
    };
    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"Emp/fetch",
            payload:{page,cname,nickname,phone,stutes,companyName,pageSize,tenantId}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setList(res.Data.data);
            }else {
                message.success(res.Data);
            }
        })
    };
    // 监听页数
    const onChange=(e:number,pageSize:number)=>{
        setPage(e);
        setPageSize(pageSize);
    };
    // 监听状态
    const changeStutes=(e:number)=>{
        setStutes(e);
    };
    useEffect(() => {
        logFenye();
    }, [page,pageSize]);
    // 监听员工姓名
    const changeName=(e)=>{
        setCname(e.target.value);
    };
    // 监听员工昵称
    const changeNickname=(e)=>{
        setNickname(e.target.value);
    };
    // 监听手机号
    const changePhone=(e)=>{
        setPhone(e.target.value);
    };
    useEffect(() => {
        let uq=StaticInfo.uqx.split('');
        setUqx(uq);
    }, []);
    const changeCompanyName=(e)=>{
        setcompanyName(e.target.value);
    };

    // 删除弹窗
    const isDelete=(e:any)=>{
        setDid(e.id);
        setUname(e.name);
        setDopen(true);
    };
    // 删除的确定按钮
    const onOk=()=>{
        setspinning(true);
        props.dispatch({
            type:'Emp/delete',
            payload:did
        }).then((res:any)=>{
            if (res.ErrorCode==0){
                message.success('删除成功');
                setDopen(false);
                setspinning(false);
                logFenye();
            }else {
                message.error(res.Data);
                setspinning(false);
                setDopen(false);
                logFenye();
            }
        })
    };
    const toadd=()=>{
        history.push('/staff/addStaff');
    };
    const toedit=(e:number)=>{
        history.push(`/staff/editYuangong?id=${e}`)
    };
    const renderImage = (text, record) => {
        const isImageLoaded = loadedImageIds.has(record.id.toString());
        let imageUrl = '';
        if (isImageLoaded && text) {
            const textStr = String(text || '');
            imageUrl = textStr.endsWith('.png')
                ? `${window.ServerConfig.imgServer}${textStr}`
                : `${window.ServerConfig.imgServer}${textStr}_min.png`;
        }
        return (
            <div style={{ width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img
                    src={imageUrl || 'https://placeholder.pics/svg/50x50/EEEEEE/999999/加载中...'}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    alt="物品图片"
                    onError={(e) => {
                        e.target.src = 'https://placeholder.pics/svg/50x50/EEEEEE/999999/暂无图片';
                    }}
                />
            </div>
        );
    };
    return(
        <Spin spinning={spinning}>
            <PageLayout
                title="员工登记"
                onBack={()=>history.push('/dashboard/')}
            >
                <List>
                    <List.Item>
                        <Space >
                            <Button type="primary" onClick={() => setFilterOpen(true)}>
                                筛选
                            </Button>
                            <Button type="primary" onClick={toadd}>添加员工</Button>
                        </Space>
                    </List.Item>
                </List>
                {/* 筛选弹窗 */}
                <Popup
                    visible={filterOpen}
                    onMaskClick={() => setFilterOpen(false)}
                >
                    <div style={{ padding: 16 }}>
                        <div style={{ marginTop: 15 }}>员工姓名</div>
                        <Input
                            onChange={changeName}
                            value={cname}
                        />
                        <div style={{ marginTop: 15 }}>员工昵称</div>
                        <Input
                            onChange={changeNickname}
                            value={nickname}
                        />
                        <div style={{ marginTop: 15 }}>员工姓名</div>
                        <Input
                            onChange={changePhone}
                            value={phone}
                        />
                        <div style={{ marginTop: 15 }}>公司/单元</div>
                        <Input
                            onChange={changeCompanyName}
                            value={companyName}
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
                <div   style={{
                    height: 'calc(100vh - 230px)',
                    overflowY: 'auto',
                    padding: '0 12px'
                }}>
                    {list.map((item,index) => (
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
                            ref={(el) => {
                                if (el) {
                                    el.dataset.rowId = item.id; // 存储行ID
                                    rowRefs.current[index] = el;
                                    observerRef.current?.observe(el);
                                }
                            }}
                        >
                            <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}>登记时间: {dayjs(item.begintime).format('YYYY-MM-DD')}</div>
                            <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}>到期时间:  {dayjs(item.eendtime).format('YYYY-MM-DD')}</div>
                            <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}>姓名: {item.name}</div>
                            <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}>昵称: {item.nickname}</div>
                            <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}>头像:{renderImage(item.avatarBase64, item)}</div>
                            <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}>联系方式: {item.phone}</div>
                            <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}>公司/单元: {item.companyName}</div>
                            <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}>状态:{item.emp_status==2?<Tag color='green'>已审核</Tag>:<Tag color='red'>未审核</Tag>}</div>
                            <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}>
                                {
                                    item.emp_status==1?<Space>
                                        {uqx[188]=='1'?<Button type='primary' onClick={()=>toedit(item.id)}>编辑</Button> :''}
                                        {uqx[189]=='1'?<Button type='primary' danger onClick={()=>isDelete(item)}>删除</Button>:''}
                                    </Space>:''
                                }
                            </div>
                        </List.Item>
                    ))}
                </div>
                {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
            </PageLayout>
            {/*删除弹窗*/}
            <Modal onOk={onOk} open={dopen} title={'删除人脸'} onCancel={()=>setDopen(false)} loading={spinning}>
                <div>
                    <span>是否要删除：<span style={{color:"red"}}>{uName}</span></span>
                </div>
            </Modal>
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        EmpList: state.CheckEmp.list,
        count: state.CheckEmp.count,
    }
};
export default  connect(mapStateToProps) (CheckStaff)