import {ArrowLeftOutlined} from '@ant-design/icons';
import {Button, Card, Tabs} from 'antd';
import {useState} from 'react';
import {history} from 'umi';
import {StaticInfo} from '@/StaticInfo';
import TransferForm from './transferForm';
import ReviewTransferForm from './ReviewTransferForm';
import CrossStoreTransferForm from './crossStoreTransferForm';
import CrossStoreReviewTransferForm from './crossStoreReviewTransferForm';
import InAndOutDetails from './inAndOutDetails';
import TransferDetails from './transferDetails';
import ThingStockInfo from './thingStockInfo';

const ThingStock = () => {
    const permissions = StaticInfo.uqx || '';
    const canthingStockInfo = permissions[488] === '1';
    const canTransferForm = permissions[533] === '1';
    const canReviewTransferForm = permissions[537] === '1';
    const canCrossStoreTransferForm = permissions[563] === '1';
    const canTransferDetails = permissions[539] === '1';
    const firstAvailableKey = canthingStockInfo ? '1' 
    : canTransferForm ? '2' : canReviewTransferForm ? '3' : canCrossStoreTransferForm ? '4' : canTransferDetails ? '6' : '7';
    const [activeKey, setActiveKey] = useState(() => {
        const savedActiveKey = sessionStorage.getItem('thingStockActiveKey') || '';
        const availableKeys = [
            canthingStockInfo && '1',
            canTransferForm && '2',
            canReviewTransferForm && '3',
            canCrossStoreTransferForm && '4',
            canTransferDetails && '6',
            '7',
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
            <Tabs activeKey={activeKey} onChange={key => {setActiveKey(key); sessionStorage.setItem('thingStockActiveKey', key);}} tabBarGutter={20}>
                {canthingStockInfo && <Tabs.TabPane tab="库存明细" key="1"><ThingStockInfo /></Tabs.TabPane>}
                {canTransferForm && <Tabs.TabPane tab="申请调拨" key="2"><TransferForm /></Tabs.TabPane>}
                {canReviewTransferForm && <Tabs.TabPane tab="调拨审核" key="3"><ReviewTransferForm /></Tabs.TabPane>}
                {canCrossStoreTransferForm && <Tabs.TabPane tab="跨店调拨申请" key="4"><CrossStoreTransferForm /></Tabs.TabPane>}
                {<Tabs.TabPane tab="跨店调拨审核" key="5"><CrossStoreReviewTransferForm /></Tabs.TabPane>}
                {canTransferDetails && <Tabs.TabPane tab="调拨明细" key="6"><TransferDetails /></Tabs.TabPane>}
                {<Tabs.TabPane tab="进出数量明细" key="7"><InAndOutDetails /></Tabs.TabPane>}
            </Tabs>
        </Card>
    </div>;
};

export default ThingStock;
