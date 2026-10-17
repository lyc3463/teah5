import {Button, DatePicker, Image, Input, Space, Spin, message} from 'antd';
import {List, Popup} from 'antd-mobile';
import dayjs from 'dayjs';
import {useEffect, useState} from 'react';
import * as SalesRanking from '@/services/salesRanking';

const formatQuantity = (quantity: number, unitsList: any[], unitsName: string) => {
    const qty = Math.round(quantity);
    if (!Array.isArray(unitsList) || unitsList.length === 0 || qty <= 0) {
        return `${qty}${unitsList?.[0]?.unitsName || unitsName || ''}`;
    }
    const baseUnit = unitsList.find((unit: any) => unit.to_unit_id === 0);
    if (!baseUnit) return `${qty}单位未知`;
    const unitsMap = unitsList.reduce((map: Record<number, any>, unit: any) => {
        map[unit.from_unit_id] = unit;
        return map;
    }, {});
    const unitChain: any[] = [];
    let currentUnit: any = baseUnit;
    while (currentUnit) {
        unitChain.push(currentUnit);
        currentUnit = unitsList.find((unit: any) => unit.to_unit_id === currentUnit.from_unit_id);
    }
    const sortedUnits = unitChain.reverse();
    let remaining = qty;
    const result: string[] = [];
    sortedUnits.forEach((unit) => {
        let conversionFactor = unit.conversion_rate;
        let nextUnit = unitsMap[unit.to_unit_id];
        while (nextUnit && nextUnit.to_unit_id !== 0 && nextUnit.conversion_rate > 0) {
            conversionFactor *= nextUnit.conversion_rate;
            nextUnit = unitsMap[nextUnit.to_unit_id];
        }
        if (conversionFactor <= 0) return;
        const unitQuantity = Math.floor(remaining / conversionFactor);
        if (unitQuantity > 0 || (result.length === 0 && unit === sortedUnits[sortedUnits.length - 1])) {
            result.push(`${unitQuantity}${unit.unitsName}`);
        }
        remaining = remaining % conversionFactor;
    });
    return result.join('');
};

const SalesRankingPage = () => {
    const [list, setList] = useState<any[]>([]);
    const [filters, setFilters] = useState({warehouseName: '', productsName: '', startDate: '2000-01-01', endDate: '2099-01-01'});
    const [loading, setLoading] = useState(false);
    const [filterOpen, setFilterOpen] = useState(false);

    const loadList = async () => {
        setLoading(true);
        const result: any = await SalesRanking.fetch(filters);
        setLoading(false);
        if (result?.ErrorCode !== 0) return message.error(result?.Data || '获取销售排名失败');
        setList(result.Data || []);
    };
    useEffect(() => { loadList(); }, []);

    const update = (key: string, value: any) => setFilters(previous => ({...previous, [key]: value}));
    const search = () => { loadList(); setFilterOpen(false); };

    return <Spin spinning={loading}>
        <Space direction="vertical" style={{width: '100%'}} size="middle">
            <Space style={{padding: 10}}><Button size="small" type="primary" onClick={() => setFilterOpen(true)}>筛选</Button></Space>
            <Popup visible={filterOpen} onMaskClick={() => setFilterOpen(false)}>
                <div style={{padding: 16}}>
                    <div style={{marginTop: 8}}>日期</div>
                    <DatePicker.RangePicker style={{width: '100%', marginTop: 8}} defaultValue={[dayjs('2000-01-01'), dayjs('2099-01-01')]} onChange={(_, values) => {update('startDate', values[0] || '2000-01-01'); update('endDate', values[1] || '2099-01-01');}} />
                    <div style={{marginTop: 15}}>物品名称</div>
                    <Input placeholder="请输入物品名称" value={filters.productsName} onChange={event => update('productsName', event.target.value)} />
                    <div style={{marginTop: 15}}>仓库名称</div>
                    <Input placeholder="请输入仓库名称" value={filters.warehouseName} onChange={event => update('warehouseName', event.target.value)} />
                    <Button block type="primary" style={{marginTop: 20}} onClick={search}>搜索</Button>
                </div>
            </Popup>
            <div style={{height: 'calc(100vh - 230px)', overflowY: 'auto', padding: '0 12px'}}>
                {list.length > 0 ? list.map((record: any, index: number) => <List.Item key={record.id || index} style={{border: '1px solid #e5e6eb', borderRadius: 8, padding: 16, marginBottom: 12, backgroundColor: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.06)'}}>
                    <div style={{display: 'flex', gap: 12, alignItems: 'flex-start'}}>
                        <Image src={record.productsImageBase64} style={{width: 60, height: 60, objectFit: 'cover', borderRadius: 6}} />
                        <div style={{flex: 1}}>
                            <div style={{fontSize: 16, fontWeight: 500}}>{record.productsName || '-'}</div>
                            <div style={{fontSize: 15, color: '#666', marginTop: 4}}>编码：{record.productsCode || '-'}</div>
                            <div style={{fontSize: 15, color: '#666', marginTop: 4}}>日期：{record.rkTime ? dayjs(record.rkTime).format('YYYY-MM-DD') : '-'}</div>
                            <div style={{fontSize: 15, color: '#666', marginTop: 4}}>销售数量：{formatQuantity(record.quantitySum, record.unitsList, record.unitsName)}</div>
                        </div>
                    </div>
                </List.Item>) : <div style={{textAlign: 'center', padding: '40px 0', color: '#999'}}>暂无数据</div>}
            </div>
        </Space>
    </Spin>;
};

export default SalesRankingPage;
