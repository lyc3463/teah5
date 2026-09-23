import {ArrowLeftOutlined} from '@ant-design/icons';
import {Button, Card, Tabs} from 'antd';
import {useState} from 'react';
import {history} from 'umi';
import {StaticInfo} from '@/StaticInfo';
import PurchaseRequestCheck from './purchaseRequestCheck';
import PurchaseReceiving from './rurchaseReceiving';
import ReceivingDirectPurchase from './receivingDirectPurchase';

const CheckPurchaseRequest = () => {
    const permissions = StaticInfo.uqx || '';
    const canPurchaseReview = permissions[485] === '1';
    const canPurchaseReceivingReview = permissions[572] === '1';
    const canDirectReceivingReview = permissions[573] === '1';
    const firstAvailableKey = canPurchaseReview ? '1' : canPurchaseReceivingReview ? '2' : canDirectReceivingReview ? '3' : '';
    const [activeKey, setActiveKey] = useState(() => {
        const savedActiveKey = sessionStorage.getItem('checkPurchaseRequestActiveKey') || '';
        const availableKeys = [
            canPurchaseReview && '1',
            canPurchaseReceivingReview && '2',
            canDirectReceivingReview && '3',
        ];
        return availableKeys.includes(savedActiveKey) ? savedActiveKey : firstAvailableKey;
    });
    return <div style={{minHeight: 'calc(100vh - 20px)', padding: 10, background: '#f5f7fa'}}>
        <Card bordered={false} bodyStyle={{padding: '8px 12px 12px'}} style={{borderRadius: 8, boxShadow: '0 1px 6px rgba(31, 35, 41, 0.05)'}}>
            <div style={{display: 'flex', alignItems: 'center', marginBottom: 6}}>
                <Button type="text" size="small" icon={<ArrowLeftOutlined />} onClick={() => history.back()}></Button>
                {/* <div>
                    <div style={{fontSize: 20, fontWeight: 600, color: '#1f2329'}}>采购审核</div>
                    <div style={{marginTop: 4, color: '#8c8c8c', fontSize: 13}}>采购申请、采购入库与直接入库审核</div>
                </div> */}
            </div>
            <Tabs activeKey={activeKey} onChange={key => {setActiveKey(key); sessionStorage.setItem('checkPurchaseRequestActiveKey', key);}} tabBarGutter={20}>
                {canPurchaseReview && <Tabs.TabPane tab="采购审核" key="1"><PurchaseRequestCheck /></Tabs.TabPane>}
                {canPurchaseReceivingReview && <Tabs.TabPane tab="采购入库审核" key="2"><PurchaseReceiving /></Tabs.TabPane>}
                {canDirectReceivingReview && <Tabs.TabPane tab="直接入库审核" key="3"><ReceivingDirectPurchase /></Tabs.TabPane>}
            </Tabs>
        </Card>
    </div>;
};

export default CheckPurchaseRequest;
