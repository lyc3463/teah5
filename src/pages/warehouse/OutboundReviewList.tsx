import {Button, Card, DatePicker, Input, Modal, Pagination, Select, Space, Spin, Tag, message} from 'antd';
import {List, Popup} from 'antd-mobile';
import dayjs from 'dayjs';
import {useEffect, useState} from 'react';
import * as RequisitionForm from '@/services/requisitionForm';

export type OutboundKind = 'requisition' | 'return' | 'damage' | 'sales' | 'transfer' | 'crossStore';

const ORDER_TYPE: Record<OutboundKind, number> = {
    requisition: 1,
    return: 2,
    damage: 3,
    transfer: 4,
    sales: 5,
    crossStore: 6,
};

const DOC_NAME: Record<OutboundKind, string> = {
    requisition: '领用单',
    return: '退货单',
    damage: '报损单',
    sales: '销售单',
    transfer: '调拨单',
    crossStore: '调拨单',
};

const STATUS_MAP: Record<number, {color: string; text: string}> = {
    1: {color: 'blue', text: '待送审'},
    2: {color: 'green', text: '已审核'},
    5: {color: 'orange', text: '已送审'},
    6: {color: 'red', text: '已驳回'},
};

const statusOptions = [
    {label: '全部', value: 0},
    {label: '待送审', value: 1},
    {label: '已审核', value: 2},
    {label: '已送审', value: 5},
    {label: '已驳回', value: 6},
];

const productCards = (items: any[] = []) => <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12}}>
    {items.length ? items.map((item: any, index: number) => <Card key={item.ppId || item.id || item.productsCode || index} size="small" bordered style={{borderRadius: 8, background: '#fff'}}>
        <div style={{fontWeight: 600, fontSize: 15}}>{item.productsName || '-'}</div>
        <div style={{color: '#8c8c8c', fontSize: 12, marginTop: 6}}>编号：{item.productsCode || '-'}</div>
        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 12, color: '#595959'}}><span>单位：{item.unitsName || '-'}</span><span>数量：{item.quantity ?? '-'}</span></div>
    </Card>) : <div style={{color: '#999', textAlign: 'center', padding: 24}}>暂无物品信息</div>}
</div>;

const OutboundReviewList = ({kind}: {kind: OutboundKind}) => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(50);
    const [list, setList] = useState<any[]>([]);
    const [count, setCount] = useState(0);
    const [filters, setFilters] = useState({orderCode: '', warehouseName: '', startDate: '2000-01-01', endDate: '2099-01-01', orderStatus: 0, uName: ''});
    const [loading, setLoading] = useState(false);
    const [filterOpen, setFilterOpen] = useState(false);
    const [selected, setSelected] = useState<any>(null);
    const [detail, setDetail] = useState<any[]>([]);
    const [reviewRecord, setReviewRecord] = useState<any>(null);
    const [reviewGoods, setReviewGoods] = useState<any[]>([]);
    const [reviewReason, setReviewReason] = useState('');
    const [reviewOpen, setReviewOpen] = useState(false);

    const loadList = async (targetPage = page) => {
        setLoading(true);
        const result: any = await RequisitionForm.fetch({page: targetPage, pageSize, ...filters, billStatus: 0, orderType: ORDER_TYPE[kind]});
        setLoading(false);
        if (result?.ErrorCode !== 0) return message.error(result?.Data || '获取列表失败');
        setList(result.Data?.data || []);
        setCount(result.Data?.count || 0);
    };
    useEffect(() => { loadList(); }, [page, pageSize]);

    const update = (key: string, value: any) => setFilters(previous => ({...previous, [key]: value}));
    const search = () => { setPage(1); loadList(1); setFilterOpen(false); };
    const loadGoods = async (id: number) => {
        const result: any = await RequisitionForm.one(id);
        if (result?.ErrorCode === 0) return result.Data?.ppList || [];
        message.error(result?.Data || '获取物品信息失败');
        return [];
    };
    const inspect = async (record: any) => {
        setSelected(record);
        setDetail([]);
        setDetail(await loadGoods(record.id));
    };
    const review = async (record: any) => {
        setReviewRecord(record);
        setReviewReason('');
        setReviewGoods([]);
        setReviewOpen(true);
        setReviewGoods(await loadGoods(record.id));
    };
    const submitReview = async (approved: boolean) => {
        if (!reviewRecord) return;
        if (!approved && !reviewReason.trim()) return message.warning('请输入驳回原因');
        setLoading(true);
        const result: any = await RequisitionForm.check({uid: reviewRecord.id, orderStatus: approved ? 2 : 6, Reason: reviewReason});
        setLoading(false);
        if (result?.ErrorCode !== 0) return message.error(result?.Data || '审核失败');
        message.success(approved ? '审核通过' : '驳回成功');
        setReviewOpen(false);
        setReviewRecord(null);
        loadList();
    };

    const showAmount = kind === 'return' || kind === 'sales';
    return <Spin spinning={loading}>
        <Space direction="vertical" style={{width: '100%'}} size="middle">
            <Space style={{padding: 10}}><Button size="small" type="primary" onClick={() => setFilterOpen(true)}>筛选</Button></Space>
            <Popup visible={filterOpen} onMaskClick={() => setFilterOpen(false)}>
                <div style={{padding: 16}}>
                    <div style={{marginTop: 8}}>日期</div>
                    <DatePicker.RangePicker style={{width: '100%', marginTop: 8}} defaultValue={[dayjs('2000-01-01'), dayjs('2099-01-01')]} onChange={(_, values) => {update('startDate', values[0] || '2000-01-01'); update('endDate', values[1] || '2099-01-01');}} />
                    <div style={{marginTop: 15}}>单号</div>
                    <Input placeholder="请输入单号" value={filters.orderCode} onChange={event => update('orderCode', event.target.value)} />
                    <div style={{marginTop: 15}}>仓库名称</div>
                    <Input placeholder="请输入仓库名称" value={filters.warehouseName} onChange={event => update('warehouseName', event.target.value)} />
                    <div style={{marginTop: 15}}>申请人</div>
                    <Input placeholder="请输入申请人" value={filters.uName} onChange={event => update('uName', event.target.value)} />
                    <div style={{marginTop: 15}}>状态</div>
                    <Select style={{width: '100%'}} value={filters.orderStatus} onChange={value => update('orderStatus', value)} options={statusOptions} />
                    <Button block type="primary" style={{marginTop: 20}} onClick={search}>搜索</Button>
                </div>
            </Popup>
            <div style={{height: 'calc(100vh - 230px)', overflowY: 'auto', padding: '0 12px'}}>
                {list.length > 0 ? list.map(record => {
                    const status = STATUS_MAP[Number(record.orderStatus)] || {color: 'default', text: '未知状态'};
                    return <List.Item key={record.id} onClick={() => inspect(record)} style={{border: '1px solid #e5e6eb', borderRadius: 8, padding: 16, marginBottom: 12, backgroundColor: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', cursor: 'pointer'}}>
                        <div style={{fontSize: 16, fontWeight: 500, marginBottom: 6}}>{record.orderCode}<Tag color={status.color} style={{marginLeft: 8}}>{status.text}</Tag></div>
                        <div style={{fontSize: 15, color: '#666', marginTop: 4}}>日期：{dayjs(record.orderTime).format('YYYY-MM-DD')}</div>
                        <div style={{fontSize: 15, color: '#666', marginTop: 4}}>仓库：{record.warehouseName || '-'}</div>
                        {kind === 'transfer' && <div style={{fontSize: 15, color: '#666', marginTop: 4}}>入库仓库：{record.warehouseName2 || '-'}</div>}
                        {kind === 'crossStore' && <>
                            <div style={{fontSize: 15, color: '#666', marginTop: 4}}>入库园区：{record.park_name || '-'}</div>
                            <div style={{fontSize: 15, color: '#666', marginTop: 4}}>入库仓库：{record.warehouseName2 || '-'}</div>
                        </>}
                        {kind === 'sales' && <div style={{fontSize: 15, color: '#666', marginTop: 4}}>销售人：{record.xsName || '-'}</div>}
                        {showAmount && <div style={{fontSize: 15, color: '#666', marginTop: 4}}>金额：¥ {record.totalAmount ?? '-'}</div>}
                        <div style={{fontSize: 15, color: '#999', marginTop: 4}}>申请人：{record.user_name || '-'}</div>
                        {record.orderStatus === 5 && <Space style={{marginTop: 12, width: '100%', justifyContent: 'flex-end'}}>
                            <Button size="small" type="primary" onClick={event => {event.stopPropagation(); review(record);}}>审核</Button>
                        </Space>}
                    </List.Item>;
                }) : <div style={{textAlign: 'center', padding: '40px 0', color: '#999'}}>暂无数据</div>}
            </div>
            <Pagination total={count} showSizeChanger pageSize={pageSize} current={page} onChange={(nextPage, nextSize) => {setPage(nextPage); setPageSize(nextSize);}} pageSizeOptions={[50, 100, 500, 1000]} />
        </Space>
        <Modal title={`${DOC_NAME[kind]}详情`} open={!!selected} onCancel={() => setSelected(null)} footer={null} width={720}>
            <Card bordered={false} style={{background: '#f7f8fa', borderRadius: 8}}>{productCards(detail)}</Card>
        </Modal>
        <Modal title="审核" open={reviewOpen} onCancel={() => setReviewOpen(false)} footer={null} width={520}>
            <div style={{padding: 4}}>
                <div style={{color: '#666'}}>{DOC_NAME[kind]}：{reviewRecord?.orderCode || '-'}</div>
                <Card title="物品信息" bordered={false} style={{marginTop: 16, background: '#f7f8fa', borderRadius: 8}}>{productCards(reviewGoods)}</Card>
                <Input.TextArea rows={4} value={reviewReason} onChange={event => setReviewReason(event.target.value)} placeholder="驳回时请填写原因" style={{marginTop: 16}} />
                <Space style={{marginTop: 16}}>
                    <Button type="primary" onClick={() => submitReview(true)}>通过</Button>
                    <Button danger onClick={() => submitReview(false)}>驳回</Button>
                </Space>
            </div>
        </Modal>
    </Spin>;
};

export default OutboundReviewList;
