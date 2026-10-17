import {Button, Card, DatePicker, Input, Modal, Pagination, Select, Space, Spin, Tag, message} from 'antd';
import {List, Popup} from 'antd-mobile';
import dayjs from 'dayjs';
import {useEffect, useState} from 'react';
import * as InventoryRequest from '@/services/inventoryRequest';

const STATUS_MAP: Record<number, {color: string; text: string}> = {
    1: {color: 'blue', text: '未审核'},
    2: {color: 'green', text: '已审核'},
    3: {color: 'orange', text: '已送审'},
    4: {color: 'red', text: '已驳回'},
};

const statusOptions = [
    {label: '全部', value: 0},
    {label: '未审核', value: 1},
    {label: '已审核', value: 2},
    {label: '已送审', value: 3},
    {label: '已驳回', value: 4},
];

const InventoryAudit = () => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(50);
    const [list, setList] = useState<any[]>([]);
    const [count, setCount] = useState(0);
    const [filters, setFilters] = useState({orderCode: '', warehouseName: '', startDate: '2000-01-01', endDate: '2099-01-01', orderStatus: 0});
    const [loading, setLoading] = useState(false);
    const [filterOpen, setFilterOpen] = useState(false);
    const [selected, setSelected] = useState<any>(null);
    const [detail, setDetail] = useState<any>(null);
    const [reviewRecord, setReviewRecord] = useState<any>(null);
    const [auditStatus, setAuditStatus] = useState(2);
    const [rejectReason, setRejectReason] = useState('');
    const [reviewOpen, setReviewOpen] = useState(false);

    const loadList = async (targetPage = page) => {
        setLoading(true);
        const result: any = await InventoryRequest.fetch({page: targetPage, pageSize, ...filters, uName: ''});
        setLoading(false);
        if (result?.ErrorCode !== 0) return message.error(result?.Data || '获取盘点列表失败');
        setList(result.Data?.data || []);
        setCount(result.Data?.count || 0);
    };
    useEffect(() => { loadList(); }, [page, pageSize]);

    const update = (key: string, value: any) => setFilters(previous => ({...previous, [key]: value}));
    const search = () => { setPage(1); loadList(1); setFilterOpen(false); };
    const inspect = async (record: any) => {
        setSelected(record);
        setDetail(null);
        const result: any = await InventoryRequest.one(record.id);
        if (result?.ErrorCode === 0) setDetail(result.Data);
    };
    const review = (record: any, status: number) => {
        setReviewRecord(record);
        setAuditStatus(status);
        setRejectReason('');
        setReviewOpen(true);
    };
    const submitReview = async () => {
        if (!reviewRecord) return;
        if (auditStatus === 4 && !rejectReason.trim()) return message.warning('请填写驳回原因');
        setLoading(true);
        const result: any = await InventoryRequest.check({id: reviewRecord.id, status: auditStatus, rejectReason: rejectReason.trim()});
        setLoading(false);
        if (result?.ErrorCode !== 0) return message.error(result?.Data || '审核失败');
        message.success(auditStatus === 2 ? '审核通过' : '已驳回');
        setReviewOpen(false);
        setReviewRecord(null);
        loadList();
    };

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
                    <div style={{marginTop: 15}}>状态</div>
                    <Select style={{width: '100%'}} value={filters.orderStatus} onChange={value => update('orderStatus', value)} options={statusOptions} />
                    <Button block type="primary" style={{marginTop: 20}} onClick={search}>搜索</Button>
                </div>
            </Popup>
            <div style={{height: 'calc(100vh - 230px)', overflowY: 'auto', padding: '0 12px'}}>
                {list.length > 0 ? list.map(record => {
                    const status = STATUS_MAP[Number(record.stockStatus)] || {color: 'default', text: '未知状态'};
                    return <List.Item key={record.id} onClick={() => inspect(record)} style={{border: '1px solid #e5e6eb', borderRadius: 8, padding: 16, marginBottom: 12, backgroundColor: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', cursor: 'pointer'}}>
                        <div style={{fontSize: 16, fontWeight: 500, marginBottom: 6}}>{record.stockCode}<Tag color={status.color} style={{marginLeft: 8}}>{status.text}</Tag></div>
                        <div style={{fontSize: 15, color: '#666', marginTop: 4}}>日期：{record.stockTime ? dayjs(record.stockTime).format('YYYY-MM-DD') : '-'}</div>
                        <div style={{fontSize: 15, color: '#666', marginTop: 4}}>仓库：{record.warehouseName || '-'}</div>
                        {record.remark && <div style={{fontSize: 15, color: '#999', marginTop: 4}}>备注：{record.remark}</div>}
                        {record.stockStatus === 3 && <Space style={{marginTop: 12, width: '100%', justifyContent: 'flex-end'}}>
                            <Button size="small" type="primary" onClick={event => {event.stopPropagation(); review(record, 2);}}>通过</Button>
                            <Button size="small" danger onClick={event => {event.stopPropagation(); review(record, 4);}}>驳回</Button>
                        </Space>}
                    </List.Item>;
                }) : <div style={{textAlign: 'center', padding: '40px 0', color: '#999'}}>暂无数据</div>}
            </div>
            <Pagination total={count} showSizeChanger pageSize={pageSize} current={page} onChange={(nextPage, nextSize) => {setPage(nextPage); setPageSize(nextSize);}} pageSizeOptions={[50, 100, 500, 1000]} />
        </Space>
        <Modal title="盘点详情" open={!!selected} onCancel={() => setSelected(null)} footer={null} width={720}>
            <Card bordered={false} style={{background: '#f7f8fa', borderRadius: 8}}>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16}}>
                    <div><div style={{color: '#8c8c8c'}}>盘点单号</div><div style={{fontWeight: 600, marginTop: 4}}>{selected?.stockCode || '-'}</div></div>
                    <div><div style={{color: '#8c8c8c'}}>所属仓库</div><div style={{fontWeight: 600, marginTop: 4}}>{selected?.warehouseName || '-'}</div></div>
                    <div><div style={{color: '#8c8c8c'}}>申请日期</div><div style={{fontWeight: 600, marginTop: 4}}>{selected?.stockTime ? dayjs(selected.stockTime).format('YYYY-MM-DD') : '-'}</div></div>
                    <div><div style={{color: '#8c8c8c'}}>备注</div><div style={{fontWeight: 600, marginTop: 4}}>{selected?.remark || '-'}</div></div>
                </div>
            </Card>
        </Modal>
        <Modal title={auditStatus === 2 ? '审核通过' : '驳回盘点'} open={reviewOpen} onOk={submitReview} confirmLoading={loading} onCancel={() => setReviewOpen(false)}>
            <div style={{color: '#666'}}>盘点单号：{reviewRecord?.stockCode || '-'}</div>
            {auditStatus === 2 ? <p style={{marginTop: 16}}>确定通过该盘点申请吗？</p> : <Input.TextArea rows={4} value={rejectReason} onChange={event => setRejectReason(event.target.value)} placeholder="请填写驳回原因" maxLength={8000} showCount style={{marginTop: 16}} />}
        </Modal>
    </Spin>;
};

export default InventoryAudit;
