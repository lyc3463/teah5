import {Button, Card, DatePicker, Input, Modal, Pagination, Select, Space, Spin, Tag, message} from 'antd';
import {List, Popup} from 'antd-mobile';
import dayjs from 'dayjs';
import {useEffect, useState} from 'react';
import * as Application from '@/services/application';
import * as SupplierService from '@/services/supplier';
import {InStatus, IN_STATUS, PurStatus, PUR_STATUS} from '@/utils/commonEnum';

type ReviewMode = 'purchase' | 'direct';

const defaultFilters = {
    orderCode: '', warehouseName: '', supplierName: 0, startDate: '2000-01-01', endDate: '2099-01-01', orderStatus: 0, uName: '',
};

const statusTag = (status: number, inbound = false) => {
    const config = (inbound ? IN_STATUS : PUR_STATUS)[status] || (inbound ? IN_STATUS : PUR_STATUS)[99];
    return <Tag color={config.color}>{config.text}</Tag>;
};

const getPurchaseStatusOptions = (direct: boolean) => {
    const statusValues = [
        PurStatus.DRAFT,
        PurStatus.AUDITING,
        PurStatus.APPROVED,
        PurStatus.REJECTED,
        PurStatus.PENDING_REIMBURSEMENT,
        PurStatus.REIMBURSED,
    ];
    return [
        {label: '全部', value: 0},
        ...statusValues.map(value => ({
            label: direct && value === PurStatus.AUDITING ? '已送审' : PUR_STATUS[value].text,
            value,
        })),
    ];
};

const WarehouseReviewList = ({mode}: {mode: ReviewMode}) => {
    const [filters, setFilters] = useState(defaultFilters);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(50);
    const [list, setList] = useState<any[]>([]);
    const [count, setCount] = useState(0);
    const [suppliers, setSuppliers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [detail, setDetail] = useState<any>(null);
    const [selected, setSelected] = useState<any>(null);
    const [reviewRecord, setReviewRecord] = useState<any>(null);
    const [reviewDetail, setReviewDetail] = useState<any>(null);
    const [reviewReason, setReviewReason] = useState('');
    const [reviewOpen, setReviewOpen] = useState(false);
    const [filterOpen, setFilterOpen] = useState(false);

    const loadSuppliers = async () => {
        const result: any = await SupplierService.fetch({page: 1, pageSize: 500, supplierName: '', personName: '', personPhone: ''});
        if (result?.ErrorCode === 0) setSuppliers(result.Data?.data || []);
    };

    const loadList = async (targetPage = page) => {
        setLoading(true);
        const result: any = await Application.fetch({page: targetPage, pageSize, ...filters, billStatus: 0, orderType: mode === 'direct' ? 2 : 1});
        setLoading(false);
        if (result?.ErrorCode !== 0) return message.error(result?.Data || '获取采购列表失败');
        setList(result.Data?.data || []);
        setCount(result.Data?.count || 0);
    };

    useEffect(() => { loadSuppliers(); }, []);
    useEffect(() => { loadList(); }, [page, pageSize]);

    const search = () => { setPage(1); loadList(1); };
    const update = (key: string, value: any) => setFilters(previous => ({...previous, [key]: value}));
    const inspect = async (record: any) => {
        setSelected(record);
        const result: any = await Application.one(record.id);
        if (result?.ErrorCode === 0) setDetail(result.Data);
        else message.error(result?.Data || '获取详情失败');
    };
    const review = async (record: any) => {
        setReviewRecord(record);
        setReviewDetail(null);
        setReviewReason('');
        setReviewOpen(true);
        const result: any = await Application.one(record.id);
        if (result?.ErrorCode === 0) setReviewDetail(result.Data);
    };
    const submitReview = async (approved: boolean) => {
        if (!reviewRecord) return;
        setLoading(true);
        const result: any = mode === 'direct'
            ? await Application.checkOrType({uid: reviewRecord.id, orderStatus: approved ? PurStatus.APPROVED : PurStatus.REJECTED, Reason: reviewReason})
            : await Application.check({uid: reviewRecord.id, orderStatus: approved ? PurStatus.APPROVED : PurStatus.REJECTED, Reason: reviewReason});
        setLoading(false);
        if (result?.ErrorCode !== 0) return message.error(result?.Data || '审核失败');
        message.success(approved ? '审核通过' : '驳回成功');
        setReviewOpen(false);
        setReviewRecord(null);
        loadList();
    };

    const productCards = (items: any[] = []) => <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12}}>
        {items.length ? items.map((item: any, index: number) => <Card key={item.id || item.productsCode || index} size="small" bordered style={{borderRadius: 8, background: '#fff'}}>
            <div style={{fontWeight: 600, fontSize: 15}}>{item.productsName || '-'}</div>
            <div style={{color: '#8c8c8c', fontSize: 12, marginTop: 6}}>编号：{item.productsCode || '-'}</div>
            <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 12, color: '#595959'}}><span>单位：{item.unitsName || '-'}</span><span>数量：{item.quantity ?? item.quantityTotal ?? '-'}</span></div>
            <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 8, color: '#595959'}}><span>单价：¥ {item.price ?? '-'}</span><span>总价：¥ {item.totalPrice ?? '-'}</span></div>
        </Card>) : <div style={{color: '#999', textAlign: 'center', padding: 24}}>暂无物品信息</div>}
    </div>;

    return <Spin spinning={loading}>
        <Space direction="vertical" style={{width: '100%'}} size="middle">
            <Space style={{padding: 10}}><Button size="small" type="primary" onClick={() => setFilterOpen(true)}>筛选</Button></Space>
            <Popup visible={filterOpen} onMaskClick={() => setFilterOpen(false)}>
                <div style={{padding: 16}}>
                    <div style={{marginTop: 8}}>日期</div>
                    <DatePicker.RangePicker style={{width: '100%', marginTop: 8}} defaultValue={[dayjs('2000-01-01'), dayjs('2099-01-01')]} onChange={(_, values) => {update('startDate', values[0] || '2000-01-01'); update('endDate', values[1] || '2099-01-01');}} />
                    <div style={{marginTop: 15}}>采购单号</div>
                    <Input placeholder="请输入采购单号" value={filters.orderCode} onChange={event => update('orderCode', event.target.value)} />
                    <div style={{marginTop: 15}}>仓库名称</div>
                    <Input placeholder="请输入仓库名称" value={filters.warehouseName} onChange={event => update('warehouseName', event.target.value)} />
                    <div style={{marginTop: 15}}>供应商</div>
                    <Select style={{width: '100%'}} value={filters.supplierName} onChange={value => update('supplierName', value)} options={[{label: '全部', value: 0}, ...suppliers.map(item => ({label: item.supplierName, value: item.id}))]} />
                    <div style={{marginTop: 15}}>采购人</div>
                    <Input placeholder="请输入采购人" value={filters.uName} onChange={event => update('uName', event.target.value)} />
                    <div style={{marginTop: 15}}>状态</div>
                    <Select style={{width: '100%'}} value={filters.orderStatus} onChange={value => update('orderStatus', value)} options={getPurchaseStatusOptions(mode === 'direct')} />
                    <Button block type="primary" style={{marginTop: 20}} onClick={() => {search(); setFilterOpen(false);}}>搜索</Button>
                </div>
            </Popup>
            <div style={{height: 'calc(100vh - 230px)', overflowY: 'auto', padding: '0 12px'}}>
                {list.length > 0 ? list.map(record => <List.Item key={record.id} onClick={() => inspect(record)} style={{border: '1px solid #e5e6eb', borderRadius: 8, padding: 16, marginBottom: 12, backgroundColor: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', cursor: 'pointer'}}>
                    <div style={{fontSize: 16, fontWeight: 500, marginBottom: 6}}>{record.orderCode}{mode === 'direct' && record.orderStatus === PurStatus.AUDITING ? <Tag color={PUR_STATUS[PurStatus.AUDITING].color}>已送审</Tag> : statusTag(record.orderStatus)}</div>
                    <div style={{fontSize: 15, color: '#666', marginTop: 4}}>日期：{dayjs(record.orderTime).format('YYYY-MM-DD')}</div>
                    <div style={{fontSize: 15, color: '#666', marginTop: 4}}>仓库：{record.warehouseName}</div>
                    <div style={{fontSize: 15, color: '#666', marginTop: 4}}>供应商：{record.supplierName}</div>
                    <div style={{fontSize: 15, color: '#666', marginTop: 4}}>金额：¥ {record.totalAmount}</div>
                    <div style={{fontSize: 15, color: '#999', marginTop: 4}}>{mode === 'direct' ? '审核人' : '采购人'}：{record.user_name || '-'}</div>
                    {record.orderStatus === PurStatus.AUDITING && <Space style={{marginTop: 12, width: '100%', justifyContent: 'flex-end'}}>
                        <Button size="small" type="primary" onClick={event => {event.stopPropagation(); review(record);}}>审核</Button>
                    </Space>}
                </List.Item>) : <div style={{textAlign: 'center', padding: '40px 0', color: '#999'}}>暂无数据</div>}
            </div>
            <Pagination total={count} showSizeChanger pageSize={pageSize} current={page} onChange={(nextPage, nextSize) => {setPage(nextPage); setPageSize(nextSize);}} pageSizeOptions={[50, 100, 500, 1000]} />
        </Space>
        <Modal title="物品详情" open={!!selected} onCancel={() => {setSelected(null); setDetail(null);}} footer={null} width={720}>
            <Card bordered={false} style={{background: '#f7f8fa', borderRadius: 8}}>{productCards((detail?.ppList || []).map((item: any) => ({...item, quantity: item.quantityTotal})))}</Card>
        </Modal>
        <Modal title="审核" open={reviewOpen} onCancel={() => setReviewOpen(false)} footer={null} width={520}>
            <div style={{padding: 4}}>
                <div style={{color: '#666'}}>采购单号：{reviewRecord?.orderCode || '-'}</div>
                <Card title="物品信息" bordered={false} style={{marginTop: 16, background: '#f7f8fa', borderRadius: 8}}>{productCards((reviewDetail?.ppList || []).map((item: any) => ({...item, quantity: item.quantityTotal})))}</Card>
                <Input.TextArea rows={4} value={reviewReason} onChange={event => setReviewReason(event.target.value)} placeholder="驳回时可填写原因" style={{marginTop: 16}} />
                <Space style={{marginTop: 16}}>
                    <Button type="primary" onClick={() => submitReview(true)}>通过</Button>
                    <Button danger onClick={() => submitReview(false)}>驳回</Button>
                </Space>
            </div>
        </Modal>
    </Spin>;
};

export default WarehouseReviewList;
