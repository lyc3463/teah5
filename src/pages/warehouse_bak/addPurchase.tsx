import {Button, Card, Form, Input, InputNumber, Modal, Space, Spin, Table, message} from 'antd';
import {useEffect, useState} from 'react';
import {history} from 'umi';
import * as Application from '@/services/application';
import {StaticInfo} from '@/StaticInfo';
import {InStatus} from '@/utils/commonEnum';

function mergeByWoCode(data: any[]) {
    const map = new Map();
    data.forEach(item => {
        const {woCode, id, productsName, productsCode, unitsName, price, quantity, ...rest} = item;
        if (map.has(woCode)) {
            map.get(woCode).productsList.push({id, productsName, productsCode, unitsName, price, quantity});
        } else {
            map.set(woCode, {...rest, woCode, productsList: [{id, productsName, productsCode, unitsName, price, quantity}]});
        }
    });
    return Array.from(map.values());
}

const AddPurchase = () => {
    const [spinning, setSpinning] = useState(false);
    const [uid, setUid] = useState(0);
    const [orderCode, setOrderCode] = useState('');
    const [warehouseId, setWarehouseId] = useState(0);
    const [supplierId, setSupplierId] = useState(0);
    const [orderTime, setOrderTime] = useState('2000-01-01');
    const [paidAmount, setPaidAmount] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [remark, setRemark] = useState('');
    const [goods, setGoods] = useState<any[]>([]);
    const [remarkInput, setRemarkInput] = useState('');
    const [list, setList] = useState<any[]>([]);
    const [addOpen, setAddOpen] = useState(false);

    const getOne = async (id: string) => {
        setSpinning(true);
        const res: any = await Application.one(id);
        setSpinning(false);
        if (res.ErrorCode !== 0) return message.error(res.Data);
        const data = res.Data;
        setUid(data.id);
        getList(data.orderCode);
        setOrderCode(data.orderCode);
        setWarehouseId(data.warehouseId);
        setSupplierId(data.supplierId);
        setOrderTime(data.orderTime);
        setPaidAmount(data.paidAmount);
        setTotalAmount(data.totalAmount);
        setRemark(data.remark);
        const ppList = (data.ppList || []).map((item: any) => {
            item.quantity = item.quantityTotal - item.quantitySum;
            return item;
        });
        setGoods(ppList);
    };
    const getList = (orderCode: string) => {
        Application.orderList({page: 1, pageSize: 1000, orderCode, unitsId: 0, warehouseId: 0, supplierName: '', startDate: '2000-01-01', endDate: '2099-01-01', orderStatus: 0, woCode: '', productsName: '', userId: StaticInfo.userId}).then((res: any) => {
            if (res.ErrorCode === 0) {
                setList(mergeByWoCode(res.Data.data || []));
            }
        });
    };

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id') || '0';
        getOne(id);
    }, []);

    const updateQuantity = (id: number, value: number) => {
        setGoods(prev => prev.map(item => item.ppId === id ? {...item, quantity: value} : item));
    };
    const onOk = () => {
        const filteredGoods = goods.filter(item => item.quantity > 0);
        if (filteredGoods.length === 0) return message.warning('请输入入库数量');
        setSpinning(true);
        const newArr = filteredGoods.map(item => ({
            id: item.id,
            price: item.price,
            quantity: item.quantity,
            remark: remarkInput || '',
        }));
        Application.addWarehousing({orderStatus: InStatus.AUDITING, jsonData: JSON.stringify(newArr)}).then((res: any) => {
            setSpinning(false);
            if (res.ErrorCode === 0) {
                message.success('提交成功，待审核');
                history.push('/warehouse/checkPurchaseRequest');
            } else {
                message.error(res.Data);
            }
        });
    };

    const columns = [
        {title: '物品名称', dataIndex: 'productsName'},
        {title: '物品编号', dataIndex: 'productsCode'},
        {title: '单位', dataIndex: 'unitsName'},
        {title: '采购数量', dataIndex: 'quantityTotal'},
        {title: '已入库', dataIndex: 'quantitySum'},
        {
            title: '入库数量',
            dataIndex: 'quantity',
            render: (text: number, record: any) => <InputNumber min={0} max={record.quantityTotal - record.quantitySum} value={text} onChange={value => updateQuantity(record.ppId, value)} />,
        },
        {title: '单价', dataIndex: 'price'},
        {title: '总价', dataIndex: 'totalPrice'},
    ];

    return <Spin spinning={spinning}>
        <Card title={`采购入库 - ${orderCode}`} bordered={false} style={{borderRadius: 8, margin: 10}}>
            <div style={{marginBottom: 16}}>
                <Space direction="vertical" style={{width: '100%'}}>
                    <div>仓库：{warehouseId}</div>
                    <div>供应商：{supplierId}</div>
                    <div>采购日期：{orderTime}</div>
                    <div>已付金额：{paidAmount} / 总金额：{totalAmount}</div>
                    <div>备注：{remark}</div>
                </Space>
            </div>
            <Table columns={columns} dataSource={goods} rowKey="ppId" pagination={false} size="small" />
            <div style={{marginTop: 16}}>
                <Input.TextArea placeholder="入库备注" value={remarkInput} onChange={event => setRemarkInput(event.target.value)} rows={3} />
            </div>
            <div style={{marginTop: 16}}>
                <Space>
                    <Button type="primary" onClick={onOk}>提交入库</Button>
                    <Button onClick={() => history.back()}>返回</Button>
                </Space>
            </div>
        </Card>
    </Spin>;
};

export default AddPurchase;
