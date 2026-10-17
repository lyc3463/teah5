import {Button, Card, DatePicker, Input, Pagination, Select, Space, Spin, Tag, Modal, message} from 'antd';
import {List, Popup} from 'antd-mobile';
import dayjs from 'dayjs';
import {useEffect, useState} from 'react';
import * as Application from '@/services/application';
import {InStatus, IN_STATUS} from '@/utils/commonEnum';

const mergeByWoCode = (items: any[]) => {
    const groups = new Map<string, any>();
    items.forEach(item => {
        const current = groups.get(item.woCode);
        const product = {id: item.id, productsName: item.productsName, productsCode: item.productsCode, unitsName: item.unitsName, price: item.price, quantity: item.quantity};
        if (current) current.productsList.push(product);
        else groups.set(item.woCode, {...item, productsList: [product]});
    });
    return Array.from(groups.values());
};

const productCards = (items: any[] = []) => <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12}}>
    {items.length ? items.map((item: any, index: number) => <Card key={item.id || item.productsCode || index} size="small" bordered style={{borderRadius: 8, background: '#fff'}}>
        <div style={{fontWeight: 600, fontSize: 15}}>{item.productsName || '-'}</div>
        <div style={{color: '#8c8c8c', fontSize: 12, marginTop: 6}}>编号：{item.productsCode || '-'}</div>
        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 12, color: '#595959'}}><span>单位：{item.unitsName || '-'}</span><span>数量：{item.quantity ?? '-'}</span></div>
        <div style={{marginTop: 8, color: '#595959'}}>单价：¥ {item.price ?? '-'}</div>
    </Card>) : <div style={{color: '#999', textAlign: 'center', padding: 24}}>暂无物品信息</div>}
</div>;

const inboundStatusOptions = [
    {label: '全部', value: 0},
    ...Object.entries(IN_STATUS)
        .filter(([value]) => Number(value) !== InStatus.DEFAULT)
        .map(([value, config]) => ({label: config.text, value: Number(value)})),
];

const PurchaseReceiving = () => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(50);
    const [list, setList] = useState<any[]>([]);
    const [count, setCount] = useState(0);
    const [filters, setFilters] = useState({orderCode: '', woCode: '', productsName: '', startDate: '2000-01-01', endDate: '2099-01-01', orderStatus: 0
        , unitsId: 0, warehouseId: 0, userId: 0, supplierName: 0
    });
    const [selected, setSelected] = useState<any>(null);
    const [reviewRecord, setReviewRecord] = useState<any>(null);
    const [reviewReason, setReviewReason] = useState('');
    const [reviewOpen, setReviewOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [filterOpen, setFilterOpen] = useState(false);

    const loadList = async (targetPage = page) => {
        setLoading(true);
        const result: any = await Application.orderList({page: targetPage, pageSize, ...filters, unitsId: 0, warehouseId: 0, userId: 0});
        setLoading(false);
        if (result?.ErrorCode !== 0) return message.error(result?.Data || '获取入库列表失败');
        setList(mergeByWoCode(result.Data?.data || []));
        setCount(result.Data?.count || 0);
    };
    useEffect(() => { loadList(); }, [page, pageSize]);
    const update = (key: string, value: any) => setFilters(previous => ({...previous, [key]: value}));
    const submitReview = async (approved: boolean) => {
        if (!reviewRecord) return;
        setLoading(true);
        const result: any = await Application.warehousingInspection({checkWoCode: reviewRecord.woCode, checkStutes: approved ? InStatus.APPROVED : InStatus.REJECTED, rejectReason: reviewReason});
        setLoading(false);
        if (result?.ErrorCode !== 0) return message.error(result?.Data || '审核失败');
        message.success(approved ? '审核通过' : '驳回成功');
        setReviewOpen(false);
        setReviewRecord(null);
        loadList();
    };
    return <Spin spinning={loading}><Space direction="vertical" style={{width: '100%'}} size="middle">
        <Space style={{padding: 10}}><Button size="small" type="primary" onClick={() => setFilterOpen(true)}>筛选</Button></Space>
        <Popup visible={filterOpen} onMaskClick={() => setFilterOpen(false)}>
            <div style={{padding: 16}}>
                <div style={{marginTop: 8}}>日期</div>
                <DatePicker.RangePicker style={{width: '100%', marginTop: 8}} defaultValue={[dayjs('2000-01-01'), dayjs('2099-01-01')]} onChange={(_, values) => {update('startDate', values[0] || '2000-01-01'); update('endDate', values[1] || '2099-01-01');}} />
                <div style={{marginTop: 15}}>采购单号</div><Input placeholder="请输入采购单号" value={filters.orderCode} onChange={event => update('orderCode', event.target.value)} />
                <div style={{marginTop: 15}}>入库单号</div><Input placeholder="请输入入库单号" value={filters.woCode} onChange={event => update('woCode', event.target.value)} />
                <div style={{marginTop: 15}}>物品名称</div><Input placeholder="请输入物品名称" value={filters.productsName} onChange={event => update('productsName', event.target.value)} />
                <div style={{marginTop: 15}}>状态</div><Select style={{width: '100%'}} value={filters.orderStatus} onChange={value => update('orderStatus', value)} options={inboundStatusOptions} />
                <Button block type="primary" style={{marginTop: 20}} onClick={() => {setPage(1); loadList(1); setFilterOpen(false);}}>搜索</Button>
            </div>
        </Popup>
        <div style={{height: 'calc(100vh - 230px)', overflowY: 'auto', padding: '0 12px'}}>
            {list.length > 0 ? list.map(record => <List.Item key={record.woCode} onClick={() => setSelected(record)} style={{border: '1px solid #e5e6eb', borderRadius: 8, padding: 16, marginBottom: 12, backgroundColor: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', cursor: 'pointer'}}>
                <div style={{fontSize: 16, fontWeight: 500, marginBottom: 6}}>{record.woCode}<Tag color={(IN_STATUS[record.orderStatus] || IN_STATUS[InStatus.DEFAULT]).color} style={{marginLeft: 8}}>{(IN_STATUS[record.orderStatus] || IN_STATUS[InStatus.DEFAULT]).text}</Tag></div>
                <div style={{fontSize: 15, color: '#666', marginTop: 4}}>日期：{dayjs(record.created).format('YYYY-MM-DD')}</div>
                <div style={{fontSize: 15, color: '#666', marginTop: 4}}>采购单号：{record.orderCode}</div>
                <div style={{fontSize: 15, color: '#666', marginTop: 4}}>仓库：{record.warehouseName}</div>
                <div style={{fontSize: 15, color: '#666', marginTop: 4}}>物品：{record.productsList?.map(item => `${item.productsName} x ${item.quantity}`).join('，')}</div>
                <div style={{fontSize: 15, color: '#999', marginTop: 4}}>提交人：{record.user_name || '-'}</div>
                {record.orderStatus === InStatus.AUDITING && <Space style={{marginTop: 12, width: '100%', justifyContent: 'flex-end'}}><Button size="small" type="primary" onClick={event => {event.stopPropagation(); setReviewRecord(record); setReviewReason(''); setReviewOpen(true);}}>审核</Button></Space>}
            </List.Item>) : <div style={{textAlign: 'center', padding: '40px 0', color: '#999'}}>暂无数据</div>}
        </div>
        <Pagination total={count} showSizeChanger pageSize={pageSize} current={page} onChange={(nextPage, nextSize) => {setPage(nextPage); setPageSize(nextSize);}} pageSizeOptions={[50, 100, 500, 1000]} />
    </Space><Modal title="物品详情" open={!!selected} onCancel={() => setSelected(null)} footer={null} width={720}><Card bordered={false} style={{background: '#f7f8fa', borderRadius: 8}}>{productCards(selected?.productsList || [])}</Card></Modal><Modal title="审核" open={reviewOpen} onCancel={() => setReviewOpen(false)} footer={null} width={520}><div style={{color: '#666'}}>入库单号：{reviewRecord?.woCode || '-'}</div><Card title="物品信息" bordered={false} style={{marginTop: 16, background: '#f7f8fa', borderRadius: 8}}>{productCards(reviewRecord?.productsList || [])}</Card><Input.TextArea rows={4} value={reviewReason} onChange={event => setReviewReason(event.target.value)} placeholder="驳回时可填写原因" style={{marginTop: 16}} /><Space style={{marginTop: 16}}><Button type="primary" onClick={() => submitReview(true)}>通过</Button><Button danger onClick={() => submitReview(false)}>驳回</Button></Space></Modal></Spin>;
};

export default PurchaseReceiving;
