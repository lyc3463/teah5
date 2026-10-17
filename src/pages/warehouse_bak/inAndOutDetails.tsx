import {Button, DatePicker, Image, Input, Pagination, Select, Space, Spin, Tag, message} from 'antd';
import {List, Popup} from 'antd-mobile';
import dayjs from 'dayjs';
import {useEffect, useState} from 'react';
import * as ThingStockInfo from '@/services/thingStockInfo';
import * as WarehouseList from '@/services/warehouseList';

const OPERATE_TYPE: Record<number, string> = {
    1: '采购入库', 2: '直接入库', 3: '领用', 4: '退货', 5: '报损', 6: '销售',
    7: '调拨入库', 8: '调拨出库', 9: '跨门店调拨入库', 10: '跨门店调拨出库',
    11: '拆分入', 12: '拆分出', 13: '合并入', 14: '合并出', 15: '盘盈', 16: '盘亏',
};

const typeOptions = [{label: '全部', value: 0}, ...Object.entries(OPERATE_TYPE).map(([value, text]) => ({label: text, value: Number(value)}))];

const InAndOutDetails = () => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(50);
    const [list, setList] = useState<any[]>([]);
    const [count, setCount] = useState(0);
    const [quantitySum, setQuantitySum] = useState(0);
    const [warehouseList, setWarehouseList] = useState<any[]>([]);
    const [filters, setFilters] = useState({warehouseId: 0, productsName: '', startDate: '2000-01-01', endDate: '2099-01-01', typeId: 0});
    const [loading, setLoading] = useState(false);
    const [filterOpen, setFilterOpen] = useState(false);

    const loadWarehouses = async () => {
        const result: any = await WarehouseList.fetch({page: 1, pageSize: 500, warehouseName: '', personName: '', personPhone: '', isXs: 2});
        if (result?.ErrorCode === 0) setWarehouseList(result.Data?.data || []);
    };
    const loadList = async (targetPage = page) => {
        setLoading(true);
        const result: any = await ThingStockInfo.InAndOutDetailsServer({page: targetPage, pageSize, ...filters});
        setLoading(false);
        if (result?.ErrorCode !== 0) return message.error(result?.Data || '获取明细失败');
        setList(result.Data?.data || []);
        setCount(result.Data?.count || 0);
        setQuantitySum(result.Data?.totalPriceSum || 0);
    };
    useEffect(() => { loadWarehouses(); }, []);
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
                    <div style={{marginTop: 15}}>仓库</div>
                    <Select style={{width: '100%'}} value={filters.warehouseId} onChange={value => update('warehouseId', value)} options={[{label: '全部', value: 0}, ...warehouseList.map(item => ({label: item.warehouseName, value: item.id}))]} />
                    <div style={{marginTop: 15}}>物品名称</div>
                    <Input placeholder="请输入物品名称" value={filters.productsName} onChange={event => update('productsName', event.target.value)} />
                    <div style={{marginTop: 15}}>出入类型</div>
                    <Select style={{width: '100%'}} value={filters.typeId} onChange={value => update('typeId', value)} options={typeOptions} />
                    <Button block type="primary" style={{marginTop: 20}} onClick={search}>搜索</Button>
                </div>
            </Popup>
            <div style={{height: 'calc(100vh - 230px)', overflowY: 'auto', padding: '0 12px'}}>
                {list.length > 0 ? list.map(record => <List.Item key={record.id} style={{border: '1px solid #e5e6eb', borderRadius: 8, padding: 16, marginBottom: 12, backgroundColor: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.06)'}}>
                    <div style={{display: 'flex', gap: 12, alignItems: 'flex-start'}}>
                        <Image src={record.productsImage ? `${window.ServerConfig.imgServer}${record.productsImage}_min.png` : ''} style={{width: 60, height: 60, objectFit: 'cover', borderRadius: 6}} preview={{src: record.productsImage ? `${window.ServerConfig.imgServer}${record.productsImage}.png` : ''}} />
                        <div style={{flex: 1}}>
                            <div style={{fontSize: 16, fontWeight: 500}}>{record.productsName || '-'}</div>
                            <div style={{fontSize: 15, color: '#666', marginTop: 4}}>仓库：{record.warehouseName || '-'}</div>
                            <div style={{fontSize: 15, color: '#666', marginTop: 4}}>日期：{record.created ? dayjs(record.created).format('YYYY-MM-DD') : '-'}</div>
                            <div style={{fontSize: 15, color: '#666', marginTop: 4}}>类型：<Tag>{OPERATE_TYPE[record.operateType] || '未知类型'}</Tag></div>
                            <div style={{fontSize: 15, color: '#666', marginTop: 4}}>数量：{record.quantity ?? '-'} {record.unitsName || ''}</div>
                            <div style={{fontSize: 15, color: '#666', marginTop: 4}}>库存：{record.beforeQuantity ?? '-'} → {record.afterQuantity ?? '-'}</div>
                            <div style={{fontSize: 15, color: '#999', marginTop: 4}}>操作人：{record.user_name || '-'}</div>
                        </div>
                    </div>
                </List.Item>) : <div style={{textAlign: 'center', padding: '40px 0', color: '#999'}}>暂无数据</div>}
            </div>
            <div style={{padding: '0 12px', color: '#666'}}>数量合计：{quantitySum}</div>
            <Pagination total={count} showSizeChanger pageSize={pageSize} current={page} onChange={(nextPage, nextSize) => {setPage(nextPage); setPageSize(nextSize);}} pageSizeOptions={[50, 100, 500, 1000]} />
        </Space>
    </Spin>;
};

export default InAndOutDetails;
