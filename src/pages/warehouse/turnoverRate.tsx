import {Button, DatePicker, Image, Input, Pagination, Space, Spin, message} from 'antd';
import {List, Popup} from 'antd-mobile';
import dayjs from 'dayjs';
import {useEffect, useState} from 'react';
import * as TurnoverRate from '@/services/turnoverRate';

const TurnoverRatePage = () => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(50);
    const [list, setList] = useState<any[]>([]);
    const [count, setCount] = useState(0);
    const [filters, setFilters] = useState({orderCode: '', productsName: '', startDate: '2000-01-01', endDate: '2099-01-01'});
    const [loading, setLoading] = useState(false);
    const [filterOpen, setFilterOpen] = useState(false);

    const loadList = async (targetPage = page) => {
        setLoading(true);
        const result: any = await TurnoverRate.fetch({page: targetPage, pageSize, ...filters});
        setLoading(false);
        if (result?.ErrorCode !== 0) return message.error(result?.Data || '获取周转情况失败');
        setList(result.Data?.data || []);
        setCount(result.Data?.count || 0);
    };
    useEffect(() => { loadList(); }, [page, pageSize]);

    const update = (key: string, value: any) => setFilters(previous => ({...previous, [key]: value}));
    const search = () => { setPage(1); loadList(1); setFilterOpen(false); };
    const calcRate = (record: any) => {
        const {xsTime, rkTime, quantityXs} = record;
        if (xsTime === '0001-01-01T00:00:00') return '0';
        const start = dayjs(rkTime);
        const end = dayjs(xsTime);
        if (!start.isValid() || !end.isValid()) return '0';
        const diffMinutes = Math.max(end.diff(start, 'minute'), 1);
        if (diffMinutes <= 0 || quantityXs <= 0) return '0';
        return (quantityXs / diffMinutes).toFixed(3);
    };

    return <Spin spinning={loading}>
        <Space direction="vertical" style={{width: '100%'}} size="middle">
            <Space style={{padding: 10}}><Button size="small" type="primary" onClick={() => setFilterOpen(true)}>筛选</Button></Space>
            <Popup visible={filterOpen} onMaskClick={() => setFilterOpen(false)}>
                <div style={{padding: 16}}>
                    <div style={{marginTop: 8}}>日期</div>
                    <DatePicker.RangePicker style={{width: '100%', marginTop: 8}} defaultValue={[dayjs('2000-01-01'), dayjs('2099-01-01')]} onChange={(_, values) => {update('startDate', values[0] || '2000-01-01'); update('endDate', values[1] || '2099-01-01');}} />
                    <div style={{marginTop: 15}}>物品名称</div>
                    <Input placeholder="请输入物品名称" value={filters.productsName} onChange={event => update('productsName', event.target.value)} />
                    <div style={{marginTop: 15}}>单号</div>
                    <Input placeholder="请输入单号" value={filters.orderCode} onChange={event => update('orderCode', event.target.value)} />
                    <Button block type="primary" style={{marginTop: 20}} onClick={search}>搜索</Button>
                </div>
            </Popup>
            <div style={{height: 'calc(100vh - 230px)', overflowY: 'auto', padding: '0 12px'}}>
                {list.length > 0 ? list.map(record => <List.Item key={record.id} style={{border: '1px solid #e5e6eb', borderRadius: 8, padding: 16, marginBottom: 12, backgroundColor: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.06)'}}>
                    <div style={{display: 'flex', gap: 12, alignItems: 'flex-start'}}>
                        <Image src={record.productsImageBase64} style={{width: 60, height: 60, objectFit: 'cover', borderRadius: 6}} />
                        <div style={{flex: 1}}>
                            <div style={{fontSize: 16, fontWeight: 500}}>{record.productsName || '-'}</div>
                            <div style={{fontSize: 15, color: '#666', marginTop: 4}}>编码：{record.productsCode || '-'}</div>
                            <div style={{fontSize: 15, color: '#666', marginTop: 4}}>入库时间：{record.rkTime ? dayjs(record.rkTime).format('YYYY-MM-DD HH:mm:ss') : '-'}</div>
                            <div style={{fontSize: 15, color: '#666', marginTop: 4}}>所属单号：{record.orderCode || '-'}</div>
                            <div style={{fontSize: 15, color: '#666', marginTop: 4}}>单位：{record.unitsName || '-'}</div>
                            <div style={{fontSize: 15, color: '#666', marginTop: 4}}>周转率：{calcRate(record)}</div>
                        </div>
                    </div>
                </List.Item>) : <div style={{textAlign: 'center', padding: '40px 0', color: '#999'}}>暂无数据</div>}
            </div>
            <Pagination total={count} showSizeChanger pageSize={pageSize} current={page} onChange={(nextPage, nextSize) => {setPage(nextPage); setPageSize(nextSize);}} pageSizeOptions={[50, 100, 500, 1000]} />
        </Space>
    </Spin>;
};

export default TurnoverRatePage;
