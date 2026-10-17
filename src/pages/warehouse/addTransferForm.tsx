import {Button, Card, DatePicker, Form, Input, Select, Space, Spin, message} from 'antd';
import dayjs from 'dayjs';
import {useEffect, useState} from 'react';
import {history} from 'umi';
import * as RequisitionForm from '@/services/requisitionForm';
import * as WarehouseListService from '@/services/warehouseList';
import * as ThingStockInfo from '@/services/thingStockInfo';
import {generate} from '@/utils/OpenTool';
import {StaticInfo} from '@/StaticInfo';

const EditTransferForm = () => {
    const [form] = Form.useForm();
    const [spinning, setSpinning] = useState(false);
    const [orderCode, setOrderCode] = useState('');
    const [orderTime, setOrderTime] = useState('2000-01-01');
    const [warehouseId, setWarehouseId] = useState(0);
    const [warehouseId2, setWarehouseId2] = useState(0);
    const [remark, setRemark] = useState('');
    const [displayData, setDisplayData] = useState<any[]>([]);
    const [thingStockInfoList, setThingStockInfoList] = useState<any[]>([]);
    const [warehouses, setWarehouses] = useState<any[]>([]);

    const loadWarehouses = async () => {
        const result: any = await WarehouseListService.fetch({page: 1, pageSize: 10000, warehouseName: '', personName: '', personPhone: '', isXs: 2});
        if (result?.ErrorCode === 0) setWarehouses(result.Data?.data || []);
    };
    const loadStock = async (wid: number) => {
        if (!wid) return;
        setSpinning(true);
        const result: any = await ThingStockInfo.selectFetch(wid);
        setSpinning(false);
        if (result?.ErrorCode === 0) setThingStockInfoList(result.Data || []);
    };

    useEffect(() => {
        setOrderCode(generate(StaticInfo.park_name));
        loadWarehouses();
    }, []);

    const changeWarehouse = (value: number) => {
        setWarehouseId(value);
        setDisplayData(displayData.filter(item => item.productsName === ''));
        loadStock(value);
    };
    const handleProductSelect = (value: number, record: any) => {
        const selectedProduct = thingStockInfoList.find(item => item.id == value);
        if (!selectedProduct) return;
        setDisplayData(displayData.map(item => {
            if (item.id === record.id) {
                return {
                    ...item,
                    inventoryId: selectedProduct.id,
                    productsId: selectedProduct.productsId || selectedProduct.id,
                    productsName: selectedProduct.productsName,
                    productsCode: selectedProduct.productsCode,
                    productsImage: selectedProduct.productsImage,
                    unitsId: selectedProduct.unitsId,
                    unitsName: selectedProduct.unitsName,
                    quantityKc: selectedProduct.quantity,
                    price: selectedProduct.price || 0,
                };
            }
            return item;
        }));
    };
    const changproductsNum = (value: number | null, recordId: number) => {
        if (value === null) return;
        setDisplayData(displayData.map(item => {
            if (item.id === recordId) return {...item, quantity: value};
            return item;
        }));
    };
    const isDel = (id: number) => {
        setDisplayData(displayData.filter(item => item.id !== id));
    };
    const addEmptyRecord = () => {
        const maxId = displayData.length > 0 ? Math.max(...displayData.map(item => item.id)) : 0;
        setDisplayData([...displayData, {id: maxId + 1, productsImage: '', productsName: '', productsCode: '', unitsId: 0, unitsName: '', quantity: 0, quantityKc: 0, inventoryId: 0, price: 0, totalPrice: 0, productsId: 0}]);
    };
    const onOK = (status: number) => {
        if (orderTime === '') return message.warning('请选择申请时间');
        if (warehouseId2 === 0) return message.warning('请选择入库仓库');
        const filteredData = displayData.filter(item => item.productsCode !== '' && item.unitsId > 0);
        if (filteredData.length === 0) return message.warning('请选择有效的物品信息');
        const hasInvalidQuantity = filteredData.some(item => item.quantity <= 0);
        if (hasInvalidQuantity) return message.warning('请输入调拨数量');
        const newFilteredData = filteredData.map((item: any) => ({
            inventoryId: item.inventoryId,
            quantity: item.quantity,
            unitsId: item.unitsId,
            productsName: item.productsName,
            productsCode: item.productsCode,
            productsImage: item.productsImage,
            price: item.price,
            totalPrice: item.totalPrice,
            id: item.productsId,
        }));
        const jsonData = JSON.stringify(newFilteredData);
        setSpinning(true);
        RequisitionForm.addTransfer({warehouseId, orderCode, orderTime, jsonData, paidAmount: 0, totalAmount: 0, discountPrice: 0, remark, pmId: 0, customerType: 0, customerId: 0, discountRate: 0, warehouseId2, parkIdDB: 0, salesperson: 0, orderStatus: status}).then((res: any) => {
            setSpinning(false);
            if (res.ErrorCode === 0) {
                message.success('添加成功');
                history.push('/warehouse/thingStock');
            } else {
                message.error(res.Data);
            }
        });
    };

    return <Spin spinning={spinning}>
        <Card title="添加调拨申请" bordered={false} style={{borderRadius: 8, margin: 10}}>
            <Form form={form} layout="horizontal" labelCol={{span: 4}} wrapperCol={{span: 14}}>
                <Form.Item label="调拨单号"><Input disabled value={orderCode} /></Form.Item>
                <Form.Item label="申请时间" required><DatePicker style={{width: '100%'}} value={orderTime ? dayjs(orderTime) : null} onChange={(_, dateString) => setOrderTime(dateString as string)} /></Form.Item>
                <Form.Item label="调离仓库" required><Select value={warehouseId || undefined} onChange={changeWarehouse} options={warehouses.map(item => ({label: item.warehouseName, value: item.id}))} placeholder="请选择仓库" /></Form.Item>
                <Form.Item label="入库仓库" required><Select value={warehouseId2 || undefined} onChange={setWarehouseId2} options={warehouses.map(item => ({label: item.warehouseName, value: item.id}))} placeholder="请选择入库仓库" /></Form.Item>
                <Form.Item label="备注"><Input.TextArea value={remark} onChange={event => setRemark(event.target.value)} rows={3} /></Form.Item>
                <Form.Item label="物品明细" wrapperCol={{span: 20}}>
                    <div style={{overflowX: 'auto'}}>
                        <table style={{width: '100%', borderCollapse: 'collapse'}}>
                            <thead>
                                <tr style={{borderBottom: '1px solid #f0f0f0'}}>
                                    <th style={{padding: 8, textAlign: 'left'}}>物品选择</th>
                                    <th style={{padding: 8, textAlign: 'left'}}>物品编号</th>
                                    <th style={{padding: 8, textAlign: 'left'}}>单位</th>
                                    <th style={{padding: 8, textAlign: 'left'}}>调拨数量</th>
                                    <th style={{padding: 8, textAlign: 'left'}}>库存数量</th>
                                    <th style={{padding: 8, textAlign: 'left'}}>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayData.map(record => (
                                    <tr key={record.id} style={{borderBottom: '1px solid #f0f0f0'}}>
                                        <td style={{padding: 8}}>
                                            <Select
                                                showSearch
                                                optionFilterProp="children"
                                                placeholder="搜索物品名称"
                                                style={{width: 200}}
                                                value={record.inventoryId || undefined}
                                                onChange={(value) => handleProductSelect(value, record)}
                                                filterOption={(input, option) => {
                                                    if (!Array.isArray(thingStockInfoList) || thingStockInfoList.length === 0) return false;
                                                    const item = thingStockInfoList.find(unit => unit.id == option.value);
                                                    if (!item) return false;
                                                    return item.productsName?.toLowerCase().includes(input.toLowerCase());
                                                }}
                                                options={Array.isArray(thingStockInfoList) ? thingStockInfoList.map(item => ({label: `${item.unitsName}-${item.productsName}`, value: item.id})) : []}
                                            />
                                        </td>
                                        <td style={{padding: 8}}>{record.productsCode || '-'}</td>
                                        <td style={{padding: 8}}>{record.unitsName || '-'}</td>
                                        <td style={{padding: 8}}><Input min={0} value={record.quantity} onChange={event => changproductsNum(Number(event.target.value) || 0, record.id)} style={{width: 100}} /></td>
                                        <td style={{padding: 8}}>{record.quantityKc ?? '-'}</td>
                                        <td style={{padding: 8}}><Button type="primary" danger size="small" onClick={() => isDel(record.id)}>删除</Button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <Button type="dashed" onClick={addEmptyRecord} style={{width: '100%', marginTop: 8}}>+ 添加物品</Button>
                    </div>
                </Form.Item>
                <Form.Item wrapperCol={{offset: 4}}>
                    <Space>
                        <Button type="primary" onClick={() => onOK(1)}>保存草稿</Button>
                        <Button type="primary" onClick={() => onOK(5)}>直接送审</Button>
                        <Button onClick={() => history.back()}>返回</Button>
                    </Space>
                </Form.Item>
            </Form>
        </Card>
    </Spin>;
};

export default EditTransferForm;
