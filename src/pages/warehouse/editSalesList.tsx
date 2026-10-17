import {Button, Card, DatePicker, Form, Input, InputNumber, Select, Space, Spin, message} from 'antd';
import dayjs from 'dayjs';
import {useEffect, useState} from 'react';
import {history} from 'umi';
import * as RequisitionForm from '@/services/requisitionForm';
import * as WarehouseListService from '@/services/warehouseList';
import * as ThingStockInfo from '@/services/thingStockInfo';
import * as PayTypeService from '@/services/payType';

const EditSalesList = () => {
    const [form] = Form.useForm();
    const [spinning, setSpinning] = useState(false);
    const [uid, setUid] = useState(0);
    const [orderCode, setOrderCode] = useState('');
    const [orderTime, setOrderTime] = useState('2000-01-01');
    const [warehouseId, setWarehouseId] = useState(0);
    const [remark, setRemark] = useState('');
    const [displayData, setDisplayData] = useState<any[]>([]);
    const [thingStockInfoList, setThingStockInfoList] = useState<any[]>([]);
    const [warehouses, setWarehouses] = useState<any[]>([]);
    const [paidAmount, setPaidAmount] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [discountPrice, setDiscountPrice] = useState(0);
    const [discountRate, setDiscountRate] = useState(100);
    const [customerId, setCustomerId] = useState(0);
    const [pmId, setPmId] = useState(0);
    const [salesperson, setSalesPerson] = useState('');
    const [payTypes, setPayTypes] = useState<any[]>([]);

    const loadData = async () => {
        const [warehouseRes, payRes]: any[] = await Promise.all([
            WarehouseListService.fetch({page: 1, pageSize: 10000, warehouseName: '', personName: '', personPhone: '', isXs: 2}),
            PayTypeService.fetch({name: ''}),
        ]);
        if (warehouseRes?.ErrorCode === 0) setWarehouses(warehouseRes.Data?.data || []);
        if (payRes?.ErrorCode === 0) setPayTypes(payRes.Data?.data || []);
    };
    const loadStock = async (wid: number) => {
        if (!wid) return;
        setSpinning(true);
        const result: any = await ThingStockInfo.selectFetch(wid);
        setSpinning(false);
        if (result?.ErrorCode === 0) setThingStockInfoList(result.Data || []);
    };
    const getOne = async (id: string) => {
        setSpinning(true);
        const res: any = await RequisitionForm.one(id);
        setSpinning(false);
        if (res.ErrorCode !== 0) return message.error(res.Data);
        const data = res.Data;
        setOrderCode(data.orderCode);
        setWarehouseId(data.warehouseId);
        setOrderTime(data.orderTime);
        setRemark(data.remark);
        setPaidAmount(data.paidAmount || 0);
        setTotalAmount(data.totalAmount || 0);
        setDiscountPrice(data.discountPrice || 0);
        setDiscountRate(data.discountRate || 100);
        setCustomerId(data.customerId || 0);
        setPmId(data.pmId || 0);
        setSalesPerson(data.salesperson || '');
        loadStock(data.warehouseId);
        if (data.ppList?.length > 0) {
            setDisplayData(data.ppList.map((item: any) => ({...item, poId: data.id, productsId: item.id})));
        }
    };

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id') || '0';
        setUid(Number(id));
        getOne(id);
        loadData();
    }, []);

    useEffect(() => {
        const sum = displayData.reduce((acc, item) => acc + (Number(item.totalPrice) || 0), 0);
        setTotalAmount(Number(sum.toFixed(2)));
    }, [displayData]);

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
                    price: selectedProduct.retailPricce || selectedProduct.price || 0,
                    priceKc: selectedProduct.priceKc || 0,
                    discountRateDp: 100,
                    discountPriceDp: 0,
                    isZk: 1,
                };
            }
            return item;
        }));
    };
    const changproductsNum = (value: number | null, recordId: number) => {
        if (value === null) return;
        setDisplayData(displayData.map(item => {
            if (item.id === recordId) {
                const quantity = value;
                const discountedPrice = quantity * (item.priceKc || 0);
                const minPrice = quantity * (item.price || 0);
                const totalPrice = Math.max(discountedPrice, minPrice);
                return {...item, quantity, totalPrice};
            }
            return item;
        }));
    };
    const isDel = (id: number) => {
        setDisplayData(displayData.filter(item => item.id !== id));
    };
    const addEmptyRecord = () => {
        const maxId = displayData.length > 0 ? Math.max(...displayData.map(item => item.id)) : 0;
        setDisplayData([...displayData, {id: maxId + 1, productsImage: '', productsName: '', productsCode: '', unitsId: 0, unitsName: '', quantity: 0, quantityKc: 0, inventoryId: 0, price: 0, priceKc: 0, totalPrice: 0, productsId: 0, discountRateDp: 100, discountPriceDp: 0, isZk: 1}]);
    };
    const onOK = () => {
        if (orderTime === '') return message.warning('请选择申请时间');
        const filteredData = displayData.filter(item => item.productsCode !== '' && item.unitsId > 0);
        if (filteredData.length === 0) return message.warning('请选择有效的物品信息');
        const hasInvalidQuantity = filteredData.some(item => item.quantity <= 0);
        if (hasInvalidQuantity) return message.warning('请输入销售数量');
        const newFilteredData = filteredData.map((item: any) => ({
            inventoryId: item.inventoryId,
            quantity: item.quantity,
            unitsId: item.unitsId,
            productsName: item.productsName,
            productsCode: item.productsCode,
            productsImage: item.productsImage,
            price: item.price,
            totalPrice: item.totalPrice,
            discountRateDp: item.discountRateDp,
            discountPriceDp: item.discountPriceDp,
            isZk: item.isZk,
            id: item.productsId,
            poId: uid,
        }));
        const jsonData = JSON.stringify(newFilteredData);
        setSpinning(true);
        RequisitionForm.edit({uid, warehouseId, orderCode, orderTime, jsonData, paidAmount, totalAmount, discountPrice, remark, pmId, customerType: 0, customerId, discountRate, warehouseId2: 0, parkIdDB: 0, salesperson}).then((res: any) => {
            setSpinning(false);
            if (res.ErrorCode === 0) {
                message.success('修改成功');
                history.push('/warehouse/Sales');
            } else {
                message.error(res.Data);
            }
        });
    };

    return <Spin spinning={spinning}>
        <Card title="编辑销售申请" bordered={false} style={{borderRadius: 8, margin: 10}}>
            <Form form={form} layout="horizontal" labelCol={{span: 4}} wrapperCol={{span: 14}}>
                <Form.Item label="销售单号"><Input disabled value={orderCode} /></Form.Item>
                <Form.Item label="申请时间" required><DatePicker style={{width: '100%'}} value={orderTime ? dayjs(orderTime) : null} onChange={(_, dateString) => setOrderTime(dateString as string)} /></Form.Item>
                <Form.Item label="所属仓库" required><Select value={warehouseId || undefined} onChange={changeWarehouse} options={warehouses.map(item => ({label: item.warehouseName, value: item.id}))} placeholder="请选择仓库" /></Form.Item>
                <Form.Item label="支付方式"><Select value={pmId || undefined} onChange={setPmId} options={payTypes.map(item => ({label: item.pmName, value: item.id}))} placeholder="请选择支付方式" /></Form.Item>
                <Form.Item label="销售人"><Input value={salesperson} onChange={event => setSalesPerson(event.target.value)} /></Form.Item>
                <Form.Item label="已付金额"><InputNumber min={0} value={paidAmount} onChange={value => setPaidAmount(value || 0)} style={{width: '100%'}} /></Form.Item>
                <Form.Item label="总金额"><InputNumber min={0} value={totalAmount} onChange={value => setTotalAmount(value || 0)} style={{width: '100%'}} /></Form.Item>
                <Form.Item label="备注"><Input.TextArea value={remark} onChange={event => setRemark(event.target.value)} rows={3} /></Form.Item>
                <Form.Item label="物品明细" wrapperCol={{span: 20}}>
                    <div style={{overflowX: 'auto'}}>
                        <table style={{width: '100%', borderCollapse: 'collapse'}}>
                            <thead>
                                <tr style={{borderBottom: '1px solid #f0f0f0'}}>
                                    <th style={{padding: 8, textAlign: 'left'}}>物品选择</th>
                                    <th style={{padding: 8, textAlign: 'left'}}>物品编号</th>
                                    <th style={{padding: 8, textAlign: 'left'}}>单位</th>
                                    <th style={{padding: 8, textAlign: 'left'}}>销售数量</th>
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
                        <Button type="primary" onClick={onOK}>提交</Button>
                        <Button onClick={() => history.back()}>返回</Button>
                    </Space>
                </Form.Item>
            </Form>
        </Card>
    </Spin>;
};

export default EditSalesList;
