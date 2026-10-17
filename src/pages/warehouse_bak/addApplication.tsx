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
import {generate, getCurrentDate} from '@/utils/OpenTool';
import {StaticInfo} from '@/StaticInfo';
import {PurStatus} from '@/utils/commonEnum';
import PurchaseFormGoodsTable from './PurchaseFormGoodsTable';

const AddApplication = () => {
    const [form] = Form.useForm();
    const [spinning, setSpinning] = useState(false);
    const [orderCode, setOrderCode] = useState('');
    const [warehouseId, setWarehouseId] = useState(0);
    const [supplierId, setSupplierId] = useState(0);
    const [orderTime, setOrderTime] = useState(getCurrentDate());
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

    useEffect(() => {
        setOrderCode(generate(StaticInfo.park_name || ''));
        setGoods([{id: 1, productsImage: '', productsName: '', productsCode: '', unitsId: 0, unitsName: '', unitsList: [], isHs: 0, quantity: 0, price: 0, totalPrice: 0, productsId: 0, quantityKc: 0}]);
        loadData();
    }, []);

    useEffect(() => {
        const sum = goods.reduce((acc, item) => acc + (Number(item.totalPrice) || 0), 0);
        setTotalAmount(Number(sum.toFixed(2)));
    }, [goods]);

    const onOk = () => {
        const filteredGoods = goods.filter(item => item.productsName?.trim() !== '');
        if (filteredGoods.length === 0) return message.error('请至少添加一个物品');
        const hasInvalidItem = filteredGoods.some(item => item.unitsId <= 0 || item.quantity <= 0);
        if (hasInvalidItem) return message.error('请确保所有采购的入库数量大于0且已选择单位');
        if (warehouseId === 0) return message.error('请选择入库仓库');
        if (supplierId === 0) return message.error('请选择供应商');
        if (orderTime === '') return message.error('请选择采购日期');
        if (pmId === 0) return message.error('请选择支付方式');
        filteredGoods.forEach(item => { item.price = Math.trunc(item.price * 100) / 100; });
        const hasInvalidPrice = filteredGoods.some(item => item.price < 0.01);
        if (hasInvalidPrice) return message.error('请确保所有物品的单价大于0.01');
        setSpinning(true);
        const newFilteredData = filteredGoods.map((item: any) => ({
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
        Application.add({orderCode, orderTime, warehouseId, supplierId, paidAmount, totalAmount, remark, jsonData, pmId, orderStatus: PurStatus.AUDITING}).then((res: any) => {
            setSpinning(false);
            if (res.ErrorCode === 0) {
                message.success('添加成功');
                history.push('/warehouse/checkPurchaseRequest');
            } else {
                message.error(res.Data);
            }
        });
    };

    return <Spin spinning={spinning}>
        <Card title="申请采购" bordered={false} style={{borderRadius: 8, margin: 10}}>
            <Form form={form} layout="horizontal" labelCol={{span: 4}} wrapperCol={{span: 14}}>
                <Form.Item label="采购单号"><Input disabled value={orderCode} /></Form.Item>
                <Form.Item label="采购日期" required><DatePicker style={{width: '100%'}} value={dayjs(orderTime)} onChange={(_, dateString) => setOrderTime(dateString as string)} /></Form.Item>
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

export default AddApplication;
