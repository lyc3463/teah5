import {Button, Card, DatePicker, Form, Input, InputNumber, Select, Space, Spin, message} from 'antd';
import dayjs from 'dayjs';
import {useEffect, useState} from 'react';
import {history} from 'umi';
import * as Application from '@/services/application';
import * as SupplierService from '@/services/supplier';
import * as WarehouseListService from '@/services/warehouseList';
import * as ThingListService from '@/services/thingList';
import * as UnitSettingService from '@/services/unitSetting';
import * as PayTypeService from '@/services/payType';
import PurchaseFormGoodsTable from './PurchaseFormGoodsTable';

const EditApplication = () => {
    const [form] = Form.useForm();
    const [spinning, setSpinning] = useState(false);
    const [uid, setUid] = useState('');
    const [orderCode, setOrderCode] = useState('');
    const [warehouseId, setWarehouseId] = useState(0);
    const [supplierId, setSupplierId] = useState(0);
    const [orderTime, setOrderTime] = useState('2000-01-01');
    const [paidAmount, setPaidAmount] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [remark, setRemark] = useState('');
    const [goods, setGoods] = useState<any[]>([]);
    const [pmId, setPmId] = useState(0);
    const [suppliers, setSuppliers] = useState<any[]>([]);
    const [warehouses, setWarehouses] = useState<any[]>([]);
    const [thingList, setThingList] = useState<any[]>([]);
    const [unitSettings, setUnitSettings] = useState<any[]>([]);
    const [payTypes, setPayTypes] = useState<any[]>([]);

    const loadData = async () => {
        const [supplierRes, warehouseRes, thingRes, unitRes, payRes]: any[] = await Promise.all([
            SupplierService.fetch({page: 1, pageSize: 10000, supplierName: '', personName: '', personPhone: ''}),
            WarehouseListService.fetch({page: 1, pageSize: 10000, warehouseName: '', personName: '', personPhone: '', isXs: 2}),
            ThingListService.fetch({page: 1, pageSize: 10000, code: '', name: '', goodsTypeId: 0}),
            UnitSettingService.fetch({name: ''}),
            PayTypeService.fetch({name: ''}),
        ]);
        if (supplierRes?.ErrorCode === 0) setSuppliers(supplierRes.Data?.data || []);
        if (warehouseRes?.ErrorCode === 0) setWarehouses(warehouseRes.Data?.data || []);
        if (thingRes?.ErrorCode === 0) setThingList(thingRes.Data?.data || []);
        if (unitRes?.ErrorCode === 0) setUnitSettings(unitRes.Data?.data || []);
        if (payRes?.ErrorCode === 0) setPayTypes(payRes.Data?.data || []);
    };

    const getOne = async (id: string) => {
        setSpinning(true);
        const res: any = await Application.one(id);
        setSpinning(false);
        if (res.ErrorCode !== 0) return message.error(res.Data);
        const data = res.Data;
        setOrderCode(data.orderCode);
        setWarehouseId(data.warehouseId);
        setSupplierId(data.supplierId);
        setOrderTime(data.orderTime);
        setPaidAmount(data.paidAmount);
        setTotalAmount(data.totalAmount);
        setRemark(data.remark);
        setPmId(data.pmId);
        const newArr = (data.ppList || []).map((item: any) => ({
            ...item,
            quantity: item.quantityTotal,
            productsId: item.id,
        }));
        setGoods(newArr);
    };

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id') || '';
        setUid(id);
        getOne(id);
        loadData();
    }, []);

    useEffect(() => {
        const sum = goods.reduce((acc, item) => acc + (Number(item.totalPrice) || 0), 0);
        setTotalAmount(Number(sum.toFixed(2)));
    }, [goods]);

    const onOk = () => {
        if (goods.length < 1) return message.error('请添加入库物品');
        if (warehouseId === 0) return message.error('请选择入库仓库');
        if (supplierId === 0) return message.error('请选择供应商');
        if (orderTime === '') return message.error('请选择采购日期');
        if (pmId === 0) return message.error('请选择支付方式');
        const hasInvalidItem = goods.some(item => !item.productsName || item.unitsId === 0 || item.quantity === 0 || item.price === 0);
        if (hasInvalidItem) return message.error('请先填写完整所有物品的资料（物品名称、单位、数量、单价）');
        goods.forEach(item => { item.price = Math.trunc(item.price * 100) / 100; });
        const hasInvalidPrice = goods.some(item => item.price < 0.01);
        if (hasInvalidPrice) return message.error('请确保所有物品的单价大于0.01');
        const newFilteredData = goods.map((item: any) => ({
            quantity: item.quantity,
            unitsId: item.unitsId,
            productsName: item.productsName,
            abbreviation: item.abbreviation,
            productsCode: item.productsCode,
            productsImage: item.productsImage,
            price: item.price,
            totalPrice: item.totalPrice,
            id: item.productsId,
        }));
        const jsonData = JSON.stringify(newFilteredData);
        setSpinning(true);
        Application.edit({uid, orderCode, orderTime, warehouseId, supplierId, paidAmount, totalAmount, remark, jsonData, pmId}).then((res: any) => {
            setSpinning(false);
            if (res.ErrorCode === 0) {
                message.success('修改成功');
                history.push('/warehouse/checkPurchaseRequest');
            } else {
                message.error(res.Data);
            }
        });
    };

    return <Spin spinning={spinning}>
        <Card title="编辑" bordered={false} style={{borderRadius: 8, margin: 10}}>
            <Form form={form} layout="horizontal" labelCol={{span: 4}} wrapperCol={{span: 14}}>
                <Form.Item label="单号"><Input disabled value={orderCode} /></Form.Item>
                <Form.Item label="日期" required><DatePicker style={{width: '100%'}} value={orderTime ? dayjs(orderTime) : null} onChange={(_, dateString) => setOrderTime(dateString as string)} /></Form.Item>
                <Form.Item label="入库仓库" required><Select value={warehouseId || undefined} onChange={setWarehouseId} options={warehouses.map(item => ({label: item.warehouseName, value: item.id}))} placeholder="请选择入库仓库" /></Form.Item>
                <Form.Item label="供应商" required><Select value={supplierId || undefined} onChange={setSupplierId} options={suppliers.map(item => ({label: item.supplierName, value: item.id}))} placeholder="请选择供应商" showSearch filterOption={(input, option) => (option?.label as string)?.toLowerCase().includes(input.toLowerCase())} /></Form.Item>
                <Form.Item label="支付方式" required><Select value={pmId || undefined} onChange={setPmId} options={payTypes.map(item => ({label: item.pmName, value: item.id}))} placeholder="请选择支付方式" /></Form.Item>
                <Form.Item label="已付金额"><InputNumber min={0} value={paidAmount} onChange={value => setPaidAmount(value || 0)} style={{width: '100%'}} /></Form.Item>
                <Form.Item label="总金额"><InputNumber min={0} value={totalAmount} onChange={value => setTotalAmount(value || 0)} style={{width: '100%'}} /></Form.Item>
                <Form.Item label="备注"><Input.TextArea value={remark} onChange={event => setRemark(event.target.value)} rows={3} /></Form.Item>
                <Form.Item label="物品明细" wrapperCol={{span: 20}}>
                    <PurchaseFormGoodsTable goods={goods} setGoods={setGoods} thingList={thingList} unitSettings={unitSettings} />
                </Form.Item>
                <Form.Item wrapperCol={{offset: 4}}>
                    <Space>
                        <Button type="primary" onClick={onOk}>提交</Button>
                        <Button onClick={() => history.back()}>返回</Button>
                    </Space>
                </Form.Item>
            </Form>
        </Card>
    </Spin>;
};

export default EditApplication;
