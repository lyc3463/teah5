import {Button, Card, DatePicker, Image, Input, Modal, Pagination, Select, Space, Spin, message} from 'antd';
import {List, Popup} from 'antd-mobile';
import {CopyOutlined, ArrowLeftOutlined} from '@ant-design/icons';
import {useEffect, useState} from 'react';
import * as ThingListService from '@/services/thingList';
import * as WarehouseTypeService from '@/services/warehouseType';
import CryptoUtils from '@/utils/Crypto';
import dayjs from 'dayjs';
import {history} from 'umi';

const ThingList = () => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(50);
    const [list, setList] = useState<any[]>([]);
    const [count, setCount] = useState(0);
    const [code, setCode] = useState('');
    const [name, setName] = useState('');
    const [goodsTypeId, setGoodsTypeId] = useState(0);
    const [typeList, setTypeList] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [filterOpen, setFilterOpen] = useState(false);
    const [delId, setDelId] = useState(0);
    const [delOpen, setDelOpen] = useState(false);
    const [exportVisible, setExportVisible] = useState(false);
    const [exportSuccessVisible, setExportSuccessVisible] = useState(false);
    const [exportSuccessStr, setExportSuccessStr] = useState('');
    const [validTime, setValidTime] = useState(5);
    const [validPassword, setValidPassword] = useState('');
    const [validArea, setValidArea] = useState(0);
    const [importVisible, setImportVisible] = useState(false);
    const [importKey, setImportKey] = useState('');
    const [importPassword, setImportPassword] = useState('');

    const loadList = async (targetPage = page) => {
        setLoading(true);
        const result: any = await ThingListService.fetch({page: targetPage, pageSize, code, name, goodsTypeId});
        setLoading(false);
        if (result?.ErrorCode !== 0) return message.error(result?.Data || '获取物品列表失败');
        setList(result.Data?.data || []);
        setCount(result.Data?.count || 0);
    };
    const loadTypes = async () => {
        const result: any = await WarehouseTypeService.fetch({name: ''});
        if (result?.ErrorCode === 0) setTypeList(result.Data?.data || []);
    };
    useEffect(() => { loadList(); }, [page, pageSize]);
    useEffect(() => { loadTypes(); }, []);

    const search = () => { setPage(1); loadList(1); setFilterOpen(false); };
    const delOk = async () => {
        setLoading(true);
        const result: any = await ThingListService.remove(delId);
        setLoading(false);
        if (result?.ErrorCode === 0) { message.success('删除成功'); setDelOpen(false); loadList(); }
        else message.error(result?.Data || '删除失败');
    };
    const getNextTime = (minuteNum: number) => dayjs().add(minuteNum, 'minute').format('YYYY-MM-DD HH:mm:ss');
    const exportOk = async () => {
        if (validTime === 0) return message.error('请选择有效时间');
        if (validArea === 0) return message.error('请选择园区');
        if (!validPassword) return message.error('请输入密码');
        setLoading(true);
        const result: any = await ThingListService.exportOk(validArea, CryptoUtils.md5(validPassword), getNextTime(validTime));
        setLoading(false);
        if (result?.ErrorCode === 0) {
            message.success('导出成功');
            setExportVisible(false);
            setExportSuccessStr(result.Data);
            setExportSuccessVisible(true);
        } else message.error(result?.Data || '导出失败');
    };
    const importOk = async () => {
        if (!importKey) return message.error('请输入导入密钥');
        if (!importPassword) return message.error('请输入导入密码');
        setLoading(true);
        const result: any = await ThingListService.importOk(importKey, CryptoUtils.md5(importPassword));
        setLoading(false);
        if (result?.ErrorCode === 0) { message.success('导入成功'); setImportVisible(false); loadList(); }
        else message.error(result?.Data || '导入失败');
    };

    return <Spin spinning={loading}>
        <Button type="text" size="small" icon={<ArrowLeftOutlined />} onClick={() => history.push('/dashboard')}></Button>
        <Space direction="vertical" style={{width: '100%'}} size="middle">
            <Space style={{padding: 10}} wrap>
                {/* <Button size="small" type="primary" onClick={() => setExportVisible(true)}>导出</Button> */}
                {/* <Button size="small" type="primary" onClick={() => setImportVisible(true)}>导入</Button> */}
                <Button size="small" type="primary" onClick={() => setFilterOpen(true)}>筛选</Button>
            </Space>
            <Popup visible={filterOpen} onMaskClick={() => setFilterOpen(false)}>
                <div style={{padding: 16}}>
                    <div style={{marginTop: 8}}>物品名称</div>
                    <Input placeholder="请输入物品名称" value={name} onChange={event => setName(event.target.value)} />
                    <div style={{marginTop: 15}}>物品编码</div>
                    <Input placeholder="请输入物品编码" value={code} onChange={event => setCode(event.target.value)} />
                    <div style={{marginTop: 15}}>物品类型</div>
                    <Select style={{width: '100%'}} value={goodsTypeId} onChange={value => setGoodsTypeId(value)} options={[{label: '全部', value: 0}, ...typeList.map(item => ({label: item.typeName, value: item.id}))]} />
                    <Button block type="primary" style={{marginTop: 20}} onClick={search}>搜索</Button>
                </div>
            </Popup>
            <div style={{height: 'calc(100vh - 230px)', overflowY: 'auto', padding: '0 12px'}}>
                {list.length > 0 ? list.map(record => <List.Item key={record.id} style={{border: '1px solid #e5e6eb', borderRadius: 8, padding: 16, marginBottom: 12, backgroundColor: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.06)'}}>
                    <div style={{display: 'flex', gap: 12, alignItems: 'flex-start'}}>
                        <Image src={record.productsImage ? `${window.ServerConfig.imgServer}${record.productsImage}_min.png` : ''} style={{width: 60, height: 60, objectFit: 'cover', borderRadius: 6}} preview={{src: record.productsImage ? `${window.ServerConfig.imgServer}${record.productsImage}.png` : ''}} />
                        <div style={{flex: 1}}>
                            <div style={{fontSize: 16, fontWeight: 500}}>{record.productsName || '-'}</div>
                            <div style={{fontSize: 15, color: '#666', marginTop: 4}}>编码：{record.productsCode || '-'}</div>
                            <div style={{fontSize: 15, color: '#666', marginTop: 4}}>类型：{record.typeName || '-'}</div>
                            <div style={{fontSize: 15, color: '#666', marginTop: 4}}>品牌：{record.brandName || '-'}</div>
                            <div style={{fontSize: 15, color: '#666', marginTop: 4}}>单位：{record.unitsName || '-'}</div>
                            <div style={{fontSize: 15, color: '#666', marginTop: 4}}>助查码：{record.abbreviation || '-'}</div>
                        </div>
                    </div>
                    <Space style={{marginTop: 12, width: '100%', justifyContent: 'flex-end'}}>
                        <Button size="small" danger onClick={() => {setDelId(record.id); setDelOpen(true);}}>删除</Button>
                    </Space>
                </List.Item>) : <div style={{textAlign: 'center', padding: '40px 0', color: '#999'}}>暂无数据</div>}
            </div>
            <Pagination total={count} showSizeChanger pageSize={pageSize} current={page} onChange={(nextPage, nextSize) => {setPage(nextPage); setPageSize(nextSize);}} pageSizeOptions={[50, 100, 500, 1000]} />
        </Space>
        <Modal title="删除物品" open={delOpen} onOk={delOk} onCancel={() => setDelOpen(false)} confirmLoading={loading}>
            <p>确定删除物品吗？</p>
        </Modal>
        <Modal title="导出物品" open={exportVisible} onOk={exportOk} onCancel={() => setExportVisible(false)} confirmLoading={loading}>
            <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
                <div>
                    <div style={{marginBottom: 8}}>选择有效时间</div>
                    <Select value={validTime} onChange={setValidTime} style={{width: '100%'}}>
                        <Select.Option value={5}>5分钟</Select.Option>
                        <Select.Option value={15}>15分钟</Select.Option>
                        <Select.Option value={30}>30分钟</Select.Option>
                        <Select.Option value={60}>60分钟</Select.Option>
                    </Select>
                    <div style={{marginTop: 4, color: '#999', fontSize: 12}}>{getNextTime(validTime)}后过期</div>
                </div>
                <div>
                    <div style={{marginBottom: 8}}>密码</div>
                    <Input value={validPassword} onChange={event => setValidPassword(event.target.value)} />
                </div>
                <div>
                    <div style={{marginBottom: 8}}>导入园区</div>
                    <Select value={validArea} onChange={setValidArea} style={{width: '100%'}}>
                        <Select.Option value={0}>请选择园区</Select.Option>
                        {Array.isArray(window.ServerConfig?.parkList) && window.ServerConfig.parkList.map((park: any) => (
                            <Select.Option key={park.parkId} value={park.parkId}>{park.park_name}</Select.Option>
                        ))}
                    </Select>
                </div>
            </div>
        </Modal>
        <Modal title="请保存好密钥，导入时需要回填" open={exportSuccessVisible} onOk={() => setExportSuccessVisible(false)} onCancel={() => setExportSuccessVisible(false)}>
            <Input
                value={exportSuccessStr}
                suffix={<Button type="text" icon={<CopyOutlined />} onClick={async () => {
                    try {
                        await navigator.clipboard.writeText(exportSuccessStr);
                        message.success('复制成功');
                    } catch (err) {
                        message.error('复制失败，请手动选中文字复制');
                    }
                }}>复制</Button>}
            />
        </Modal>
        <Modal title="导入物品" open={importVisible} onOk={importOk} onCancel={() => setImportVisible(false)} confirmLoading={loading}>
            <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
                <div>
                    <div style={{marginBottom: 8}}>导入密钥</div>
                    <Input value={importKey} onChange={event => setImportKey(event.target.value)} />
                </div>
                <div>
                    <div style={{marginBottom: 8}}>密码</div>
                    <Input value={importPassword} onChange={event => setImportPassword(event.target.value)} />
                </div>
            </div>
        </Modal>
    </Spin>;
};

export default ThingList;
