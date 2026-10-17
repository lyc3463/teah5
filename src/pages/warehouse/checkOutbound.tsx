import {ArrowLeftOutlined} from '@ant-design/icons';
import {Button, Card, Tabs} from 'antd';
import {useState} from 'react';
import {history} from 'umi';
import {StaticInfo} from '@/StaticInfo';
import CheckRequisitionForm from './checkRequisitionForm';
import ReturnReview from './returnReview';
import DamageFormReview from './damageFormReview';
import SalesCustomerList from './salesCustomerList';
import ReviewTransferForm from './ReviewTransferForm';
import CrossStoreReviewTransferForm from './crossStoreReviewTransferForm';
import InventoryAudit from './inventoryAudit';

const CheckOutbound = () => {
    const permissions = StaticInfo.uqx || '';
    const tabs = [
        {key: '1', label: '领用审核', allowed: permissions[500] === '1', node: <CheckRequisitionForm />},
        {key: '2', label: '退货审核', allowed: permissions[507] === '1', node: <ReturnReview />},
        {key: '3', label: '报损审核', allowed: permissions[513] === '1', node: <DamageFormReview />},
        {key: '4', label: '销售审核', allowed: permissions[530] === '1', node: <SalesCustomerList />},
        {key: '5', label: '调拨审核', allowed: permissions[537] === '1', node: <ReviewTransferForm />},
        {key: '6', label: '跨店调拨审核', allowed: true, node: <CrossStoreReviewTransferForm />},
        {key: '7', label: '盘点审核', allowed: permissions[523] === '1', node: <InventoryAudit />},
    ].filter(item => item.allowed);
    const firstAvailableKey = tabs[0]?.key || '';
    const [activeKey, setActiveKey] = useState(() => {
        const savedActiveKey = sessionStorage.getItem('checkOutboundActiveKey') || '';
        return tabs.some(item => item.key === savedActiveKey) ? savedActiveKey : firstAvailableKey;
    });
    return <div style={{minHeight: 'calc(100vh - 20px)', padding: 10, background: '#f5f7fa'}}>
        <Card bordered={false} bodyStyle={{padding: '8px 12px 12px'}} style={{borderRadius: 8, boxShadow: '0 1px 6px rgba(31, 35, 41, 0.05)'}}>
            <div style={{display: 'flex', alignItems: 'center', marginBottom: 6}}>
                <Button type="text" size="small" icon={<ArrowLeftOutlined />} onClick={() => history.back()}></Button>
            </div>
            <Tabs activeKey={activeKey} onChange={key => {setActiveKey(key); sessionStorage.setItem('checkOutboundActiveKey', key);}} tabBarGutter={20}>
                {tabs.map(item => <Tabs.TabPane tab={item.label} key={item.key}>{item.node}</Tabs.TabPane>)}
            </Tabs>
        </Card>
    </div>;
};

export default CheckOutbound;
