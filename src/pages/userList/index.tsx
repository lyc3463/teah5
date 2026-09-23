import {
    Button,
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
    Spin,
    Table,
    Tag
} from "antd";
import {connect,history} from 'umi';
import * as AppUserService from '@/services/appUser';
import {useCallback, useEffect, useRef, useState} from "react";
import {qxTree} from '@/constants/wxMenu'
import {buildTree,ensureArrayLength} from "@/utils/OpenTool";
import {StaticInfo} from "@/StaticInfo";
import {NavBar, Popup} from "antd-mobile";
import PageLayout from "@/components/PageLayout ";
const checkboxRelationMap = {
    190: [209, 263],
    275: [272],
    271: [268, 404, 269],
    392: [176],
    369: [366, 368, 367, 365],
    186: [307],
    363: [366, 364],
    225: [285],
    230: [285],
    233: [285],
    236: [285],
    239: [239],
    60: [61, 355, 347, 336, 413, 400, 435],
    399: [421, 422, 423, 424, 404],
    110: [111],
    426: [427, 428, 429, 430],
};
const UserList=(props:any)=>{
    const treeData = buildTree(qxTree);
    const [isSpinning,setIsSpinning]=useState(false);
    const [page,setPage]=useState(1);
    const [balance,setbalance]=useState(0);
    const [pageSize,setpageSize]=useState(50);
    const [name,setName]=useState('');
    const [phone,setPhone]=useState('');
    const [uqx,setUqx]=useState([]);
    // 弹窗
    const [isOpen,setIsOpen]=useState(false);
    const [selected, setSelected] = useState<string[]>(Array(562).fill('0'));
    const [appid,setAppid]=useState(0);
    const [filterOpen,setFilterOpen]=useState(false);
    // 新增：存储已加载图片的行ID（避免重复加载）
    const [loadedImageIds, setLoadedImageIds] = useState<Set<string>>(new Set());
    // 行ref数组
    const rowRefs = useRef<HTMLDivElement[]>([]);
    // 交叉观察器实例
    const observerRef = useRef<IntersectionObserver | null>(null);

    // 监听手机号
    const changePhone=(e)=>{
        setPhone(e.target.value);
    };
    // 监听名字
    const changeName=(e)=>{
        setName(e.target.value);
    };
    const toChangePark=(e)=>{
        history.push(`/kehu/changePark?id=${e.id}`);
    };
    // 搜索按钮
    const shousuo=()=>{
        setPage(1);
        getList();
        setFilterOpen(false);
    };
    const getList=()=>{
        props.dispatch({
            type:'AppUser/fetch',
            payload:{page,name,phone,pageSize,balance}
        });
    };

    // 监听页数
    const onChange=(page:number,pageSize:number)=>{
        setPage(page);
        setpageSize(pageSize);
    };
    useEffect(() => {
        getList();
    }, [page,pageSize]);
    // 弹窗信息
    const editInfo=(vla:any)=>{
        setAppid(vla.id);
        setIsOpen(true);
        const authorityString = vla.authority;
        const splitArray = authorityString.split('');
        const adjustedArray = ensureArrayLength(splitArray, selected.length, '0');
        setSelected(adjustedArray);
    };
    // 获取小程序信息详情
    const getOne=(id:number)=>{
        AppUserService.one(id).then((res:any)=>{
            if (res.ErrorCode==0){
                const authorityString = res.Data.authority;
                const splitArray = authorityString.split('');
                const adjustedArray = ensureArrayLength(splitArray, selected.length, '0');
                setSelected(adjustedArray);
            }else{
                message.error(res.Data);
            }
        })
    };
    // 确定编辑权限
    const onOk=()=>{
        let joinqx=selected.join('');
        setIsSpinning(true);
        props.dispatch({
            type:'AppUser/edit',
            payload:{appid,joinqx}
        }).then((res:any)=>{
            if (res.ErrorCode==0){
                message.success('修改成功');
                setIsSpinning(false);
                setIsOpen(false);
            }else {
                message.error(res.Data);
                setIsOpen(false);
                setIsSpinning(false);
            }
        })
    };
    useEffect(() => {
        let uq=StaticInfo.uqx.split('');
        setUqx(uq);
    }, []);
    const TreeMenu=({ tree, selected,disabled, setSelected }: { tree: qxTree[]; selected: string[]; setSelected: (newSelected: string[]) => void })=> {
        return (
            <ul>
                {tree.map(node => (
                    <li key={node.id}>
                        <input
                            type="checkbox"
                            checked={selected[node.id] === '1'}
                            onChange={e => handleCheckboxChange(node.id, e.target.checked)}
                        />
                        {node.name}
                        {node.children && node.children.length > 0 && (
                            <TreeMenu tree={node.children} selected={selected} setSelected={setSelected} />
                        )}
                    </li>
                ))}
            </ul>
        );
    };
    const handleCheckboxChange = (id: number, isChecked: boolean) => {
        const newSelected = [...selected];
        // 设置当前项
        newSelected[id] = isChecked ? '1' : '0';
        // 如果当前是勾选，才自动关联其他选项
        if (isChecked && checkboxRelationMap[id]) {
            checkboxRelationMap[id].forEach(relatedId => {
                newSelected[relatedId] = '1';
            });
        }
        setSelected(newSelected);
    };
    const changeBalance=(value)=>{
        // 确保值不小于 0
        const newValue = value !== undefined ? Math.max(value, 0) : 0;
        setbalance(newValue);
    };
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
    // 清理观察器
    useEffect(() => {
        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, []);
    const renderImage = (text, record) => {
        const isImageLoaded = loadedImageIds.has(record.userId.toString());
        let imageUrl = '';
        if (isImageLoaded && text) {
            const textStr = String(text || '');
            imageUrl = textStr.endsWith('.png')
                ? `${window.ServerConfig.imgServer}${textStr}`
                : `${window.ServerConfig.imgServer}${textStr}_X.png`;
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
        <Spin spinning={isSpinning}>
            <PageLayout
                title="小程序列表"
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
                        <div style={{ marginTop: 15 }}>手机号</div>
                        <Input
                            onChange={changePhone}
                            value={phone}
                        />
                        <div style={{ marginTop: 15 }}>姓名</div>
                        <Input
                            onChange={changeName}
                            value={name}
                        />
                        <div style={{ marginTop: 15 }}>余额</div>
                        <InputNumber
                            onChange={changeBalance}
                            min={0}
                            value={balance}
                        />
                        <Button
                            block
                            color="primary"
                            style={{ marginTop: 20 }}
                            onClick={shousuo}
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
                    {
                        props.AppUserList&&props.AppUserList.length>0?props.AppUserList.map((item:any,index:number)=>{
                            return (
                                <List.Item
                                    key={item.userId}
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
                                            el.dataset.rowId = item.userId; // 存储行ID
                                            rowRefs.current[index] = el;
                                            observerRef.current?.observe(el);
                                        }
                                    }}
                                >
                                    <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}>{renderImage(item.userImage, item)}</div>
                                    <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}>微信呢称: {item.userName}</div>
                                    <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}>手机号: {item.phone}</div>
                                    <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}>余额(元): {item.balance.toFixed(2)}</div>
                                    <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}>账单(元): {item.billMoney.toFixed(2)}</div>
                                    <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}>积分(分): {item.integral.toFixed(2)}</div>
                                    <Space>
                                        <Button  type='primary' onClick={()=>editInfo(item)}>权限</Button>
                                    </Space>
                                </List.Item>
                            )
                        }):''
                    }
                </div>
                <div style={{display:'flex',justifyContent:'space-around',marginTop:'5px'}}>
                    <div>总余额：{props.count?props.count.balanceSum:''}元</div>
                    <div>总账单：{props.count?props.count.billMoneySum:''}元</div>
                </div>
                <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                    {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
                </div>
                {/*编辑权限弹窗*/}
                <Modal open={isOpen} title={'编辑权限'} onCancel={()=>setIsOpen(false)} onOk={onOk} loading={isSpinning}>
                    <Space>
                        <Button type='primary' onClick={()=>setSelected(Array(441).fill('1'))}>全选</Button>
                        <Button type='primary' onClick={()=>setSelected(Array(441).fill('0'))}>反选</Button>
                    </Space>
                    <TreeMenu tree={treeData} selected={selected} setSelected={setSelected} />
                </Modal>
            </PageLayout>
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        AppUserList: state.AppUser.list,
        count: state.AppUser.count
    }
};

export default connect(mapStateToProps) (UserList)