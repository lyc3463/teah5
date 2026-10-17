import {ArrowLeftOutlined} from '@ant-design/icons';
import {Button, Card, Tabs} from 'antd';
import {useState} from 'react';
import {history} from 'umi';
import {StaticInfo} from '@/StaticInfo';
import TurnoverRate from './turnoverRate';
import SalesRanking from './salesRanking';

const ThingTurnoverRate = () => {
    const permissions = StaticInfo.uqx || '';
    const canTurnoverRate = permissions[552] === '1';
    const canSalesRanking = permissions[553] === '1';
    const firstAvailableKey = canTurnoverRate ? '1' 
    : canSalesRanking ? '2' : '';
    const [activeKey, setActiveKey] = useState(() => {
        const savedActiveKey = sessionStorage.getItem('thingTurnoverRateActiveKey') || '';
        const availableKeys = [
            canTurnoverRate && '1',
            canSalesRanking && '2',
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
            <Tabs activeKey={activeKey} onChange={key => {setActiveKey(key); sessionStorage.setItem('thingTurnoverRateActiveKey', key);}} tabBarGutter={20}>
                {canTurnoverRate && <Tabs.TabPane tab="周转情况" key="1"><TurnoverRate /></Tabs.TabPane>}
                {canSalesRanking && <Tabs.TabPane tab="销售排名" key="2"><SalesRanking /></Tabs.TabPane>}
            </Tabs>
        </Card>
    </div>;
};

export default ThingTurnoverRate;
