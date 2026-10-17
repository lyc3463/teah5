import {ArrowLeftOutlined} from '@ant-design/icons';
import {Button, Card, Tabs} from 'antd';
import {useState} from 'react';
import {history} from 'umi';
import {StaticInfo} from '@/StaticInfo';
import SalesList from './salesList';
import SalesCustomerList from './salesCustomerList';

const Sales = () => {
    const permissions = StaticInfo.uqx || '';
    const canSalesList = permissions[526] === '1';
    const canSalesCustomerList = permissions[530] === '1';
    const firstAvailableKey = canSalesList ? '1' 
    : canSalesCustomerList ? '2' : '';
    const [activeKey, setActiveKey] = useState(() => {
        const savedActiveKey = sessionStorage.getItem('salesActiveKey') || '';
        const availableKeys = [
            canSalesList && '1',
            canSalesCustomerList && '2',
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
            <Tabs activeKey={activeKey} onChange={key => {setActiveKey(key); sessionStorage.setItem('salesActiveKey', key);}} tabBarGutter={20}>
                {canSalesList && <Tabs.TabPane tab="销售列表" key="1"><SalesList /></Tabs.TabPane>}
                {canSalesCustomerList && <Tabs.TabPane tab="销售审核" key="2"><SalesCustomerList /></Tabs.TabPane>}
            </Tabs>
        </Card>
    </div>;
};

export default Sales;
