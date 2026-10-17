import {Button, Card, Input, Modal, Pagination, Space, Spin, message, Select} from 'antd';
import {List, Popup} from 'antd-mobile';
import {useEffect, useState} from 'react';
import * as WarehouseType from '@/services/warehouseType';
import * as WarehouseList from '@/services/warehouseList';
import * as UnitSetting from '@/services/unitSetting';
import * as UnitCalculation from '@/services/unitCalculation';
import * as BrandList from '@/services/brandList';
import * as PayType from '@/services/payType';
import * as YearSetting from '@/services/yearSetting';
import * as Texture from '@/services/texture';

export type BasicKind = 'warehouseType' | 'warehouse' | 'unitSetting' | 'unitCalculation' | 'brand' | 'payType' | 'year' | 'texture';

const SERVICE: Record<BasicKind, any> = {
    warehouseType: WarehouseType,
    warehouse: WarehouseList,
    unitSetting: UnitSetting,
    unitCalculation: UnitCalculation,
    brand: BrandList,
    payType: PayType,
    year: YearSetting,
    texture: Texture,
};

const FIELD: Record<BasicKind, string[]> = {
    warehouseType: ['typeName'],
    warehouse: ['warehouseName'],
    unitSetting: ['unitsName', 'unitsCode'],
    unitCalculation: ['groupName'],
    brand: ['brandName'],
    payType: ['pmName'],
    year: ['ytName'],
    texture: ['remark'],
};

const LABEL: Record<BasicKind, string> = {
    warehouseType: '物品类型',
    warehouse: '仓库',
    unitSetting: '单位',
    unitCalculation: '计算',
    brand: '品牌',
    payType: '支付名称',
    year: '年份',
    texture: '口感',
};

const BasicDataList = ({kind}: {kind: BasicKind}) => {
    const [name, setName] = useState('');
    const [warehouseName, setWarehouseName] = useState('');
    const [personName, setPersonName] = useState('');
    const [personPhone, setPersonPhone] = useState('');
    const [isXs, setIsXs] = useState(2);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(50);
    const [list, setList] = useState<any[]>([]);
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [filterOpen, setFilterOpen] = useState(false);
    const [delId, setDelId] = useState(0);
    const [delOpen, setDelOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [editId, setEditId] = useState(0);
    const [editValue, setEditValue] = useState('');
    const [addOpen, setAddOpen] = useState(false);
    const [addValue, setAddValue] = useState('');
    const [addUnitsCode, setAddUnitsCode] = useState('');
    const [editUnitsCode, setEditUnitsCode] = useState('');

    const service = SERVICE[kind];
    const field = FIELD[kind];
    const label = LABEL[kind];

    const loadList = async (targetPage = page) => {
        setLoading(true);
        const result: any = await service.fetch({page: targetPage, pageSize: pageSize, name: name, warehouseName: warehouseName, personName: personName
            , personPhone: personPhone, isXs: isXs
        });
        setLoading(false);
        if (result?.ErrorCode !== 0) return message.error(result?.Data || '获取列表失败');
        setList(result.Data?.data || result.Data || []);
        setCount(result.Data?.count || 0);
    };
    useEffect(() => { loadList(); }, [page, pageSize]);

    const search = () => { setPage(1); loadList(1); setFilterOpen(false); };
    const delOk = async () => {
        setLoading(true);
        const result: any = await service.remove(delId);
        setLoading(false);
        if (result?.ErrorCode === 0) { message.success('删除成功'); setDelOpen(false); loadList(); }
        else message.error(result?.Data || '删除失败');
    };
    const editOk = async () => {
        if (!editValue.trim()) return message.warning(`请输入${label}名称`);
        setLoading(true);
        const payload: any = {uid: editId, [field[0]]: editValue};
        if (kind === 'unitSetting') payload[field[1]] = editUnitsCode;
        const result: any = await service.edit(payload);
        setLoading(false);
        if (result?.ErrorCode === 0) { message.success('编辑成功'); setEditOpen(false); loadList(); }
        else message.error(result?.Data || '编辑失败');
    };
    const addOk = async () => {
        if (!addValue.trim()) return message.warning(`请输入${label}名称`);
        setLoading(true);
        const payload: any = kind === 'unitSetting' ? {[field[0]]: addValue, [field[1]]: addUnitsCode} : {[field[0]]: addValue};
        const result: any = await service.add(payload);
        setLoading(false);
        if (result?.ErrorCode === 0) { message.success('新增成功'); setAddOpen(false); setAddValue(''); loadList(); }
        else message.error(result?.Data || '新增失败');
    };

    return <Spin spinning={loading}>
        <Space direction="vertical" style={{width: '100%'}} size="middle">
            <Space style={{padding: 10}}>
                <Button size="small" type="primary" onClick={() => setAddOpen(true)}>新增{label}</Button>
                <Button size="small" type="primary" onClick={() => setFilterOpen(true)}>筛选</Button>
            </Space>
            <Popup visible={filterOpen} onMaskClick={() => setFilterOpen(false)}>
                <div style={{padding: 16}}>
                    <div style={{marginTop: 8}}>{label}名称</div>
                    <Input placeholder={`请输入${label}名称`} value={name} onChange={event => setName(event.target.value)} />
                    <Button block type="primary" style={{marginTop: 20}} onClick={search}>搜索</Button>
                </div>
            </Popup>
            <div style={{height: 'calc(100vh - 230px)', overflowY: 'auto', padding: '0 12px'}}>
                {list.length > 0 ? list.map(record => <List.Item key={record.id} style={{border: '1px solid #e5e6eb', borderRadius: 8, padding: 16, marginBottom: 12, backgroundColor: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.06)'}}>
                    <div style={{fontSize: 16, fontWeight: 500}}>{record[field[0]] || record.ytName || record.remark || record.brandName || record.pmName || record.unitsName || record.groupName || record.typeName || record.warehouseName || '-'}</div>
                    {kind === 'warehouse' && <>
                        <div style={{fontSize: 15, color: '#666', marginTop: 4}}>类型：{record.typeName || '-'}</div>
                        <div style={{fontSize: 15, color: '#666', marginTop: 4}}>位置：{record.warehouseAddress || '-'}</div>
                        <div style={{fontSize: 15, color: '#666', marginTop: 4}}>负责人：{record.personName || '-'}</div>
                        <div style={{fontSize: 15, color: '#666', marginTop: 4}}>电话：{record.personPhone || '-'}</div>
                    </>}
                    {kind === 'unitSetting' && <div style={{fontSize: 15, color: '#666', marginTop: 4}}>代码：{record.unitsCode || '-'}</div>}
                    <Space style={{marginTop: 12, width: '100%', justifyContent: 'flex-end'}}>
                        <Button size="small" onClick={() => {setEditId(record.id); setEditValue(record[field[0]] || record.ytName || record.remark || record.brandName || record.pmName || record.unitsName || record.groupName || record.typeName || record.warehouseName || ''); setEditOpen(true);}}>编辑</Button>
                        <Button size="small" danger onClick={() => {setDelId(record.id); setDelOpen(true);}}>删除</Button>
                    </Space>
                </List.Item>) : <div style={{textAlign: 'center', padding: '40px 0', color: '#999'}}>暂无数据</div>}
            </div>
            <Pagination total={count} showSizeChanger pageSize={pageSize} current={page} onChange={(nextPage, nextSize) => {setPage(nextPage); setPageSize(nextSize);}} pageSizeOptions={[50, 100, 500, 1000]} />
        </Space>
        <Modal title={`新增${label}`} open={addOpen} onOk={addOk} onCancel={() => setAddOpen(false)} confirmLoading={loading}>
            <Input value={addValue} onChange={event => setAddValue(event.target.value)} placeholder={`请输入${label}名称`} />
            {kind === 'unitSetting' && <Input value={addUnitsCode} placeholder="代码" onChange={event => setAddUnitsCode(event.target.value)} />}
        </Modal>
        <Modal title={`编辑${label}`} open={editOpen} onOk={editOk} onCancel={() => setEditOpen(false)} confirmLoading={loading}>
            <Input value={editValue} onChange={event => setEditValue(event.target.value)} placeholder={`请输入${label}名称`} />
            {kind === 'unitSetting' && <Input value={editUnitsCode} placeholder="代码" onChange={event => setEditUnitsCode(event.target.value)} />}
        </Modal>
        <Modal title="删除确认" open={delOpen} onOk={delOk} onCancel={() => setDelOpen(false)} confirmLoading={loading}>
            <p>确定要删除吗？</p>
        </Modal>
    </Spin>;
};

export default BasicDataList;
