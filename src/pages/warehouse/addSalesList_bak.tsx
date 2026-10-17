import {Button, Card, DatePicker, Form, Input, InputNumber, Select, Space, Spin, message} from 'antd';
import dayjs from 'dayjs';
import {useEffect, useState} from 'react';
import {history} from 'umi';
import * as RequisitionForm from '@/services/requisitionForm';
import * as WarehouseListService from '@/services/warehouseList';
import * as ThingStockInfo from '@/services/thingStockInfo';
import * as PayTypeService from '@/services/payType';
import * as AppUserService from '@/services/appUser';
import * as UsersService from '@/services/users';
import {generate, getCurrentDate} from '@/utils/OpenTool';
import {StaticInfo} from '@/StaticInfo';

const AddSalesList = () => {
    const [form] = Form.useForm();
    const [spinning, setSpinning] = useState(false);
    const [orderCode, setOrderCode] = useState('');
    const [orderTime, setOrderTime] = useState(getCurrentDate());
    const [warehouseId, setWarehouseId] = useState(0);
    const [remark, setRemark] = useState('');
    const [displayData, setDisplayData] = useState<any[]>([]);
    const [thingStockInfoList, setThingStockInfoList] = useState<any[]>([]);
    const [warehouses, setWarehouses] = useState<any[]>([]);
    const [customers, setCustomers] = useState<any[]>([]);
    const [paidAmount, setPaidAmount] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [discountPrice, setDiscountPrice] = useState(0);
    const [discountRate, setDiscountRate] = useState(100);
    const [customerId, setCustomerId] = useState(0);
    const [pmId, setPmId] = useState(0);
    const [salesperson, setSalesPerson] = useState<any[]>([]);
    const [salespersonId, setSalesPersonId] = useState(StaticInfo.userId);
    const [payTypes, setPayTypes] = useState<any[]>([]);
    

    const loadData = async () => {
        const [warehouseRes, payRes, appUserRes, usersRes]: any[] = await Promise.all([
            WarehouseListService.fetch({page: 1, pageSize: 10000, warehouseName: '', personName: '', personPhone: '', isXs: 2}),
            PayTypeService.fetch({name: ''}),
            AppUserService.fetch({page: 1, pageSize: 10000, name: '', phone: ''}),
            UsersService.fetch({page: 1, pageSize: 10000, phone: ''})
        ]);
        if (warehouseRes?.ErrorCode === 0) setWarehouses(warehouseRes.Data?.data || []);
        if (payRes?.ErrorCode === 0) setPayTypes(payRes.Data || []);
        console.log(appUserRes, usersRes);
        if (appUserRes?.ErrorCode === 0) setCustomers(appUserRes.Data?.data || []);
        if (usersRes?.ErrorCode === 0) setSalesPerson(usersRes.Data?.data || []);
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
        loadData();
    }, []);

    useEffect(() => {
        const totalSum = displayData.reduce((acc, item) => {
            const itemTotal = (item.quantity || 0) * (item.price || 0);
            return acc + itemTotal;
        }, 0);
        const discountedSum = totalSum * (discountRate / 100);
        setDiscountPrice(totalSum);
        setTotalAmount(discountedSum);
    }, [displayData, discountRate]);

    useEffect(() => {
        const totalSum = displayData.reduce((acc, item) => {
            const itemOriginalTotal = (item.quantity || 0) * (item.price || 0);
            return acc + itemOriginalTotal;
        }, 0);
        const totalDiscountedSum = displayData.reduce((acc, item) => {
            return acc + (item.totalPrice || 0);
        }, 0);
        setDiscountPrice(totalSum);
        setTotalAmount(totalDiscountedSum);
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
                const discountedPrice = quantity * (item.price || 0) * (item.discountRateDp || 0) / 100;
                const minPrice = quantity * (item.presalePrice || 0);
                const totalPrice = Math.max(discountedPrice, minPrice);
                return {
                    ...item,
                    quantity: quantity,
                    totalPrice: Number(totalPrice.toFixed(2))
                };
            }
            return item;
        }));
    };
    // 全局折扣率变更
    const changeDiscountRate = (e: number) => {
        if (e === null) return;
        setDiscountRate(e);
        setDisplayData(prevData =>
            prevData.map(item => {
                if (item.isZk === 1) {
                    const baseTotalPrice = (item.quantity || 0) * (item.price || 0) * e / 100;
                    const presaleTotal = (item.quantity || 0) * (item.presalePrice || 0);
                    const totalPrice = Math.max(baseTotalPrice, presaleTotal);
                    return {
                        ...item,
                        discountRateDp: e,
                        totalPrice: totalPrice
                    };
                }
                return item;
            })
        );
    };
    const isDel = (id: number) => {
        setDisplayData(displayData.filter(item => item.id !== id));
    };
    const addTenEmptyRecords = () => {
        const maxId = displayData.length > 0
            ? Math.max(...displayData.map(item => item.id))
            : 0;
        const newRecords = Array.from({ length: 1 }, (_, i) => ({
            id: maxId + i + 1,
            productsImageBase64: '',
            brandId: 0,
            abbreviation: '',
            barcode: '',
            costPrice: 0,
            groupId: 0,
            inventoryId: 0,
            number: 0,
            presalePrice: 0,
            price: 0,
            priceKc: 0,
            productsCode: '',
            productsImage: '',
            productsName: '',
            quantity: 0,
            quantityKc: 0,
            retailPricce: 0,
            specifications: '',
            totalPrice: 0,
            unitsId: 0,
            unitsName: '',
            isZk: 1,
            discountRateDp: 100,
            discountPriceDp: 0,
            iList: [],
        }));
        setDisplayData([...displayData, ...newRecords]);
    };
    const onOK = (status: number) => {
        if (orderTime === '') return message.warning('请选择申请时间');
        const filteredData = displayData.filter(item => item.productsCode !== '' && item.unitsId > 0);
        if (filteredData.length === 0) return message.warning('请选择有效的物品信息');
        const hasInvalidQuantity = filteredData.some(item => item.quantity <= 0);
        if (hasInvalidQuantity) return message.warning('请输入销售数量');
        let newFilteredData = filteredData.map((item:any)=>({
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
        }));
        const jsonData = JSON.stringify(newFilteredData);
        setSpinning(true);
        RequisitionForm.addSales({warehouseId, orderCode, orderTime, jsonData, paidAmount, totalAmount, discountPrice, remark, pmId, customerType: 0, customerId, discountRate, warehouseId2: 0, parkIdDB: 0, salesperson, orderStatus: status}).then((res: any) => {
            setSpinning(false);
            if (res.ErrorCode === 0) {
                message.success('添加成功');
                history.push('/warehouse/Sales');
            } else {
                message.error(res.Data);
            }
        });
    };

    return <Spin spinning={spinning}>
        <Card title="添加销售申请" bordered={false} style={{borderRadius: 8, margin: 10}}>
            <Form form={form} layout="horizontal" labelCol={{span: 4}} wrapperCol={{span: 14}}>
                <Form.Item label="销售单号"><Input disabled value={orderCode} /></Form.Item>
                <Form.Item label="申请时间" required><DatePicker style={{width: '100%'}} value={orderTime ? dayjs(orderTime) : null} onChange={(_, dateString) => setOrderTime(dateString as string)} /></Form.Item>
                <Form.Item label="所属仓库" required><Select value={warehouseId || undefined} onChange={changeWarehouse} options={warehouses.map(item => ({label: item.warehouseName, value: item.id}))} placeholder="请选择仓库" /></Form.Item>
                <Form.Item label="客户" required><Select value={customerId || undefined} onChange={setCustomerId} options={customers.map(item => ({label: item.userName, value: item.userId}))} placeholder="请选择客户" /></Form.Item>
                <Form.Item label="支付方式"><Select value={pmId || undefined} onChange={setPmId} options={payTypes.map(item => ({label: item.pmName, value: item.id}))} placeholder="请选择支付方式" /></Form.Item>
                <Form.Item label="总金额"><InputNumber disabled min={0} value={totalAmount} onChange={value => setTotalAmount(value || 0)} style={{width: '100%'}} /></Form.Item>
                <Form.Item label="折扣%"><InputNumber min={0} value={discountRate} onChange={value => changeDiscountRate(value || 0)} style={{width: '100%'}} /></Form.Item>
                <Form.Item label="折后金额"><InputNumber disabled min={0} value={discountPrice} onChange={value => setDiscountPrice(value || 0)} style={{width: '100%'}} /></Form.Item>
                <Form.Item label="实收金额"><InputNumber min={0} value={paidAmount} onChange={value => setPaidAmount(value || 0)} style={{width: '100%'}} /></Form.Item>
                <Form.Item label="销售人" required><Select value={salespersonId || undefined} onChange={setSalesPersonId} options={salesperson.map(item => ({label: item.user_name, value: item.id}))} placeholder="请选择销售人" /></Form.Item>
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
                                    <th style={{padding: 8, textAlign: 'left'}}>折扣</th>
                                    <th style={{padding: 8, textAlign: 'left'}}>折后金额</th>
                                    <th style={{padding: 8, textAlign: 'left'}}>零售价</th>
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
                                        <td style={{padding: 8}}>{record.discountRateDp ?? '-'}</td>
                                        <td style={{padding: 8}}>{record.totalPrice ?? '-'}</td>
                                        <td style={{padding: 8}}>{record.price ?? '-'}</td>
                                        <td style={{padding: 8}}>{record.quantityKc ?? '-'}</td>
                                        <td style={{padding: 8}}><Button type="primary" danger size="small" onClick={() => isDel(record.id)}>删除</Button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <Button type="dashed" onClick={() => addTenEmptyRecords()} style={{width: '100%', marginTop: 8}}>+ 添加物品</Button>
                    </div>
                </Form.Item>
                <Form.Item wrapperCol={{offset: 4}}>
                    <Space>
                        <Button type="primary" onClick={() => onOK(1)}>保存草稿</Button>
                        <Button danger onClick={() => onOK(5)}>直接送审</Button>
                        <Button onClick={() => history.back()}>返回</Button>
                    </Space>
                </Form.Item>
            </Form>
        </Card>
    </Spin>;
};

export default AddSalesList;
