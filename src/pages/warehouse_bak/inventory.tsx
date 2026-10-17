import {ArrowLeftOutlined} from '@ant-design/icons';
import {Button, Card, Tabs} from 'antd';
import {useState} from 'react';
import {history} from 'umi';
import {StaticInfo} from '@/StaticInfo';
import InventoryRequest from './inventoryRequest';
import InventoryEntry from './InventoryEntry';
import InventoryAudit from './inventoryAudit';
import LossRecord from './lossRecord';

const Inventory = () => {
    const permissions = StaticInfo.uqx || '';
    const canInventoryRequest = permissions[515] === '1';
    const canInventoryEntry = permissions[521] === '1';
    const canInventoryAudit = permissions[523] === '1';
    const canLossRecord = permissions[525] === '1';
    const firstAvailableKey = canInventoryRequest ? '1' 
    : canInventoryEntry ? '2' : canInventoryAudit ? '3' : canLossRecord ? '4' : '';
    const [activeKey, setActiveKey] = useState(() => {
        const savedActiveKey = sessionStorage.getItem('inventoryActiveKey') || '';
        const availableKeys = [
            canInventoryRequest && '1',
            canInventoryEntry && '2',
            canInventoryAudit && '3',
            canLossRecord && '4',
        ];
        return availableKeys.includes(savedActiveKey) ? savedActiveKey : firstAvailableKey;
    });
    return <div style={{minHeight: 'calc(100vh - 20px)', padding: 10, background: '#f5f7fa'}}>
        <Card bordered={false} bodyStyle={{padding: '8px 12px 12px'}} style={{borderRadius: 8, boxShadow: '0 1px 6px rgba(31, 35, 41, 0.05)'}}>
            <div style={{display: 'flex', alignItems: 'center', marginBottom: 6}}>
                <Button type="text" size="small" icon={<ArrowLeftOutlined />} onClick={() => history.push('/dashboard')}></Button>
                {/* <div>
                    <div style={{fontSize: 20, fontWeight: 600, color: '#1f2329'}}>采购审核</div>
                    <div style={{marginTop: 4, color: '#8c8c8c', fontSize: 13}}>采购申请、采购入库与直接入库审核</div>
                </div> */}
            </div>
            <Tabs activeKey={activeKey} onChange={key => {setActiveKey(key); sessionStorage.setItem('inventoryActiveKey', key);}} tabBarGutter={20}>
                {canInventoryRequest && <Tabs.TabPane tab="盘点申请" key="1"><InventoryRequest /></Tabs.TabPane>}
                {canInventoryEntry && <Tabs.TabPane tab="盘点录入" key="2"><InventoryEntry /></Tabs.TabPane>}
                {canInventoryAudit && <Tabs.TabPane tab="盘点审核" key="3"><InventoryAudit /></Tabs.TabPane>}
                {canLossRecord && <Tabs.TabPane tab="盘点差异记录" key="4"><LossRecord /></Tabs.TabPane>}
            </Tabs>
        </Card>
    </div>;
};

export default Inventory;
