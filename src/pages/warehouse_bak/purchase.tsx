import {Button, Card, DatePicker, Input, Pagination, Select, Space, Spin, Tag, message} from 'antd';
import {List, Popup} from 'antd-mobile';
import dayjs from 'dayjs';
import {useEffect, useState} from 'react';
import * as Application from '@/services/application';
import * as SupplierService from '@/services/supplier';
import {PUR_STATUS} from '@/utils/commonEnum';

const Purchase = () => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(50);
    const [list, setList] = useState<any[]>([]);
    const [count, setCount] = useState(0);
    const [suppliers, setSuppliers] = useState<any[]>([]);
    const [filters, setFilters] = useState({orderCode: '', warehouseName: '', supplierName: 0, startDate: '2000-01-01', endDate: '2099-01-01', orderStatus: 0, uName: ''});
    const [loading, setLoading] = useState(false);
    const [filterOpen, setFilterOpen] = useState(false);

    const loadSuppliers = async () => {
        const result: any = await SupplierService.fetch({page: 1, pageSize: 500, supplierName: '', personName: '', personPhone: ''});
        if (result?.ErrorCode === 0) setSuppliers(result.Data?.data || []);
    };
    const loadList = async (targetPage = page) => {
        setLoading(true);
        const result: any = await Application.fetch({page: targetPage, pageSize, ...filters, billStatus: 0, orderType: 1});
        setLoading(false);
        if (result?.ErrorCode !== 0) return message.error(result?.Data || '获取列表失败');
        setList(result.Data?.data || []);
        setCount(result.Data?.count || 0);
    };
    useEffect(() => { loadSuppliers(); }, []);
    useEffect(() => { loadList(); }, [page, pageSize]);

    const update = (key: string, value: any) => setFilters(previous => ({...previous, [key]: value}));
    const search = () => { setPage(1); loadList(1); setFilterOpen(false); };

    const statusOptions = [
        {label: '全部', value: 0},
        ...Object.entries(PUR_STATUS).filter(([value]) => Number(value) !== 99).map(([value, config]) => ({label: config.text, value: Number(value)})),
    ];
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
                    <Select style={{width: '100%'}} value={filters.orderStatus} onChange={value => update('orderStatus', value)} options={statusOptions} />
                    <Button block type="primary" style={{marginTop: 20}} onClick={search}>搜索</Button>
                </div>
            </Popup>
            <div style={{height: 'calc(100vh - 230px)', overflowY: 'auto', padding: '0 12px'}}>
                {list.length > 0 ? list.map(record => {
                    const statusConfig = PUR_STATUS[record.orderStatus] || PUR_STATUS[99];
                    return <List.Item key={record.id} style={{border: '1px solid #e5e6eb', borderRadius: 8, padding: 16, marginBottom: 12, backgroundColor: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.06)'}}>
                        <div style={{fontSize: 16, fontWeight: 500, marginBottom: 6}}>{record.orderCode}<Tag color={statusConfig.color} style={{marginLeft: 8}}>{statusConfig.text}</Tag></div>
                        <div style={{fontSize: 15, color: '#666', marginTop: 4}}>日期：{record.orderTime ? dayjs(record.orderTime).format('YYYY-MM-DD') : '-'}</div>
                        <div style={{fontSize: 15, color: '#666', marginTop: 4}}>仓库：{record.warehouseName || '-'}</div>
                        <div style={{fontSize: 15, color: '#666', marginTop: 4}}>供应商：{record.supplierName || '-'}</div>
                        <div style={{fontSize: 15, color: '#666', marginTop: 4}}>已交金额：¥ {record.paidAmount ?? '-'} / 物品总价：¥ {record.totalAmount ?? '-'}</div>
                        <div style={{fontSize: 15, color: '#999', marginTop: 4}}>采购人：{record.user_name || '-'}</div>
                    </List.Item>;
                }) : <div style={{textAlign: 'center', padding: '40px 0', color: '#999'}}>暂无数据</div>}
            </div>
            <Pagination total={count} showSizeChanger pageSize={pageSize} current={page} onChange={(nextPage, nextSize) => {setPage(nextPage); setPageSize(nextSize);}} pageSizeOptions={[50, 100, 500, 1000]} />
        </Space>
    </Spin>;
};

export default Purchase;
