import {Button, Card, DatePicker, Form, Input, Select, Space, Spin, message} from 'antd';
import dayjs from 'dayjs';
import {useEffect, useState} from 'react';
import {history} from 'umi';
import * as InventoryRequest from '@/services/inventoryRequest';
import * as WarehouseListService from '@/services/warehouseList';

const EditInventoryRequest = () => {
    const [form] = Form.useForm();
    const [spinning, setSpinning] = useState(false);
    const [uid, setUid] = useState(0);
    const [stockCode, setStockCode] = useState('');
    const [stockTime, setStockTime] = useState('2000-01-01');
    const [warehouseId, setWarehouseId] = useState(0);
    const [remark, setRemark] = useState('');
    const [warehouses, setWarehouses] = useState<any[]>([]);

    const loadWarehouses = async () => {
        const result: any = await WarehouseListService.fetch({page: 1, pageSize: 10000, warehouseName: '', personName: '', personPhone: '', isXs: 2});
        if (result?.ErrorCode === 0) setWarehouses(result.Data?.data || []);
    };
    const getOne = async (id: string) => {
        setSpinning(true);
        const res: any = await InventoryRequest.one(id);
        setSpinning(false);
        if (res.ErrorCode !== 0) return message.error(res.Data);
        const data = res.Data;
        setStockCode(data.stockCode);
        setWarehouseId(data.warehouseId);
        setStockTime(data.stockTime);
        setRemark(data.remark);
    };

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id') || '0';
        setUid(Number(id));
        getOne(id);
        loadWarehouses();
    }, []);

    const onOK = () => {
        if (stockTime === '') return message.warning('请选择申请时间');
        if (warehouseId === 0) return message.warning('请选择仓库');
        setSpinning(true);
        InventoryRequest.edit({uid, stockCode, stockTime, warehouseId, remark, stockStatus: 1}).then((res: any) => {
            setSpinning(false);
            if (res.ErrorCode === 0) {
                message.success('修改成功');
                history.push('/warehouse/checkApply');
            } else {
                message.error(res.Data);
            }
        });
    };

    return <Spin spinning={spinning}>
        <Card title="编辑盘点申请" bordered={false} style={{borderRadius: 8, margin: 10}}>
            <Form form={form} layout="horizontal" labelCol={{span: 4}} wrapperCol={{span: 14}}>
                <Form.Item label="盘点单号"><Input disabled value={stockCode} /></Form.Item>
                <Form.Item label="申请时间" required><DatePicker style={{width: '100%'}} value={stockTime ? dayjs(stockTime) : null} onChange={(_, dateString) => setStockTime(dateString as string)} /></Form.Item>
                <Form.Item label="所属仓库" required><Select value={warehouseId || undefined} onChange={setWarehouseId} options={warehouses.map(item => ({label: item.warehouseName, value: item.id}))} placeholder="请选择仓库" /></Form.Item>
                <Form.Item label="备注"><Input.TextArea value={remark} onChange={event => setRemark(event.target.value)} rows={3} /></Form.Item>
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

export default EditInventoryRequest;
