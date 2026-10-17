import {Button, Card, DatePicker, Input, Pagination, Space, Spin, Tag, message} from 'antd';
import {List, Popup} from 'antd-mobile';
import dayjs from 'dayjs';
import {useEffect, useState} from 'react';
import * as InventoryRequest from '@/services/inventoryRequest';

const LossRecord = () => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(50);
    const [list, setList] = useState<any[]>([]);
    const [count, setCount] = useState(0);
    const [filters, setFilters] = useState({orderCode: '', warehouseName: '', startDate: '2000-01-01', endDate: '2099-01-01', orderStatus: 2});
    const [loading, setLoading] = useState(false);
    const [filterOpen, setFilterOpen] = useState(false);

    const loadList = async (targetPage = page) => {
        setLoading(true);
        const result: any = await InventoryRequest.fetch({page: targetPage, pageSize, ...filters, uName: ''});
        setLoading(false);
        if (result?.ErrorCode !== 0) return message.error(result?.Data || '获取盘点差异记录失败');
        setList(result.Data?.data || []);
        setCount(result.Data?.count || 0);
    };
    useEffect(() => { loadList(); }, [page, pageSize]);

    const update = (key: string, value: any) => setFilters(previous => ({...previous, [key]: value}));
    const search = () => { setPage(1); loadList(1); setFilterOpen(false); };

    return <Spin spinning={loading}>
        <Space direction="vertical" style={{width: '100%'}} size="middle">
            <Space style={{padding: 10}}><Button size="small" type="primary" onClick={() => setFilterOpen(true)}>筛选</Button></Space>
            <Popup visible={filterOpen} onMaskClick={() => setFilterOpen(false)}>
                <div style={{padding: 16}}>
                    <div style={{marginTop: 8}}>日期</div>
                    <DatePicker.RangePicker style={{width: '100%', marginTop: 8}} defaultValue={[dayjs('2000-01-01'), dayjs('2099-01-01')]} onChange={(_, values) => {update('startDate', values[0] || '2000-01-01'); update('endDate', values[1] || '2099-01-01');}} />
                    <div style={{marginTop: 15}}>盘点单号</div>
                    <Input placeholder="请输入盘点单号" value={filters.orderCode} onChange={event => update('orderCode', event.target.value)} />
                    <div style={{marginTop: 15}}>仓库名称</div>
                    <Input placeholder="请输入仓库名称" value={filters.warehouseName} onChange={event => update('warehouseName', event.target.value)} />
                    <Button block type="primary" style={{marginTop: 20}} onClick={search}>搜索</Button>
                </div>
            </Popup>
            <div style={{height: 'calc(100vh - 230px)', overflowY: 'auto', padding: '0 12px'}}>
                {list.length > 0 ? list.map(record => <List.Item key={record.id} style={{border: '1px solid #e5e6eb', borderRadius: 8, padding: 16, marginBottom: 12, backgroundColor: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.06)'}}>
                    <div style={{fontSize: 16, fontWeight: 500, marginBottom: 6}}>{record.stockCode}<Tag color={record.stockStatus === 2 ? 'green' : 'red'} style={{marginLeft: 8}}>{record.stockStatus === 2 ? '已审核' : '未审核'}</Tag></div>
                    <div style={{fontSize: 15, color: '#666', marginTop: 4}}>日期：{record.stockTime ? dayjs(record.stockTime).format('YYYY-MM-DD') : '-'}</div>
                    <div style={{fontSize: 15, color: '#666', marginTop: 4}}>仓库：{record.warehouseName || '-'}</div>
                    {record.remark && <div style={{fontSize: 15, color: '#999', marginTop: 4}}>备注：{record.remark}</div>}
                </List.Item>) : <div style={{textAlign: 'center', padding: '40px 0', color: '#999'}}>暂无数据</div>}
            </div>
            <Pagination total={count} showSizeChanger pageSize={pageSize} current={page} onChange={(nextPage, nextSize) => {setPage(nextPage); setPageSize(nextSize);}} pageSizeOptions={[50, 100, 500, 1000]} />
        </Space>
    </Spin>;
};

export default LossRecord;
