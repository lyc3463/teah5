import {ArrowLeftOutlined} from '@ant-design/icons';
import {Button, Card, Tabs} from 'antd';
import {useState} from 'react';
import {history} from 'umi';
import {StaticInfo} from '@/StaticInfo';
import Application from './application';
import Purchase from './purchase';
import DirectPurchase from './directPurchase';
import RequisitionForm from './requisitionForm';
import ReturnForm from './returnForm';
import DamageForm from './damageForm';
import SalesList from './salesList';
import TransferForm from './transferForm';
import CrossStoreTransferForm from './crossStoreTransferForm';
import InventoryRequestPage from './inventoryRequest';
import InventoryEntry from './InventoryEntry';

const CheckApply = () => {
    const permissions = StaticInfo.uqx || '';
    const tabs = [
        {key: '1', label: '申请采购', allowed: permissions[479] === '1', node: <Application />},
        {key: '2', label: '采购入库', allowed: permissions[486] === '1', node: <Purchase />},
        {key: '3', label: '直接入库', allowed: permissions[489] === '1', node: <DirectPurchase />},
        {key: '4', label: '领用申请', allowed: permissions[491] === '1', node: <RequisitionForm />},
        {key: '5', label: '退货申请', allowed: permissions[503] === '1', node: <ReturnForm />},
        {key: '6', label: '报损申请', allowed: permissions[509] === '1', node: <DamageForm />},
        {key: '7', label: '销售申请', allowed: permissions[526] === '1', node: <SalesList />},
        {key: '8', label: '申请调拨', allowed: permissions[533] === '1', node: <TransferForm />},
        {key: '9', label: '申请跨店调拨', allowed: permissions[563] === '1', node: <CrossStoreTransferForm />},
        {key: '10', label: '申请盘点', allowed: permissions[515] === '1', node: <InventoryRequestPage uqx={permissions} />},
        {key: '11', label: '盘点录入', allowed: permissions[521] === '1', node: <InventoryEntry uqx={permissions} />},
    ].filter(item => item.allowed);
    const firstAvailableKey = tabs[0]?.key || '';
    const [activeKey, setActiveKey] = useState(() => {
        const savedActiveKey = sessionStorage.getItem('checkApplyActiveKey') || '';
        return tabs.some(item => item.key === savedActiveKey) ? savedActiveKey : firstAvailableKey;
    });
    return <div style={{minHeight: 'calc(100vh - 20px)', padding: 10, background: '#f5f7fa'}}>
        <Card bordered={false} bodyStyle={{padding: '8px 12px 12px'}} style={{borderRadius: 8, boxShadow: '0 1px 6px rgba(31, 35, 41, 0.05)'}}>
            <div style={{display: 'flex', alignItems: 'center', marginBottom: 6}}>
                <Button type="text" size="small" icon={<ArrowLeftOutlined />} onClick={() => history.back()}></Button>
            </div>
            <Tabs activeKey={activeKey} onChange={key => {setActiveKey(key); sessionStorage.setItem('checkApplyActiveKey', key);}} tabBarGutter={20}>
                {tabs.map(item => <Tabs.TabPane tab={item.label} key={item.key}>{item.node}</Tabs.TabPane>)}
            </Tabs>
        </Card>
    </div>;
};

export default CheckApply;
