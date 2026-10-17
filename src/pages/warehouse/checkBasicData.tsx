import {ArrowLeftOutlined} from '@ant-design/icons';
import {Button, Card, Tabs} from 'antd';
import {useState} from 'react';
import {history} from 'umi';
import {StaticInfo} from '@/StaticInfo';
import WarehouseTypePage from './warehouseType';
import WarehouseListPage from './warehouseList';
import UnitSettingPage from './unitSetting';
import UnitCalculationPage from './unitCalculation';
import BrandListPage from './brandList';
import PayTypePage from './payType';
import YearSettingPage from './yearSetting';
import TexturePage from './texture';

const CheckBasicData = () => {
    const permissions = StaticInfo.uqx || '';
    const tabs = [
        {key: '1', label: '物品类型', allowed: permissions[442] === '1', node: <WarehouseTypePage />},
        {key: '2', label: '仓库列表', allowed: permissions[464] === '1', node: <WarehouseListPage />},
        {key: '3', label: '单位设置', allowed: permissions[456] === '1', node: <UnitSettingPage />},
        {key: '4', label: '单位计算', allowed: permissions[475] === '1', node: <UnitCalculationPage />},
        {key: '5', label: '品牌列表', allowed: permissions[471] === '1', node: <BrandListPage />},
        {key: '6', label: '支付方式', allowed: permissions[545] === '1', node: <PayTypePage />},
        {key: '7', label: '年份设置', allowed: permissions[546] === '1', node: <YearSettingPage />},
        {key: '8', label: '口感设置', allowed: permissions[547] === '1', node: <TexturePage />},
    ].filter(item => item.allowed);
    const firstAvailableKey = tabs[0]?.key || '';
    const [activeKey, setActiveKey] = useState(() => {
        const savedActiveKey = sessionStorage.getItem('checkBasicDataActiveKey') || '';
        return tabs.some(item => item.key === savedActiveKey) ? savedActiveKey : firstAvailableKey;
    });
    return <div style={{minHeight: 'calc(100vh - 20px)', padding: 10, background: '#f5f7fa'}}>
        <Card bordered={false} bodyStyle={{padding: '8px 12px 12px'}} style={{borderRadius: 8, boxShadow: '0 1px 6px rgba(31, 35, 41, 0.05)'}}>
            <div style={{display: 'flex', alignItems: 'center', marginBottom: 6}}>
                <Button type="text" size="small" icon={<ArrowLeftOutlined />} onClick={() => history.back()}></Button>
            </div>
            <Tabs activeKey={activeKey} onChange={key => {setActiveKey(key); sessionStorage.setItem('checkBasicDataActiveKey', key);}} tabBarGutter={20}>
                {tabs.map(item => <Tabs.TabPane tab={item.label} key={item.key}>{item.node}</Tabs.TabPane>)}
            </Tabs>
        </Card>
    </div>;
};

export default CheckBasicData;
