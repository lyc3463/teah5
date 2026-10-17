import {ArrowLeftOutlined} from '@ant-design/icons';
import {Button, Card, Tabs} from 'antd';
import {useState} from 'react';
import {history} from 'umi';
import {StaticInfo} from '@/StaticInfo';
import WarehouseType from './warehouseType';
import WarehouseList from './warehouseList';
import UnitSetting from './unitSetting';
import UnitCalculation from './unitCalculation';
import BrandList from './brandList';
import PayType from './payType';
import YearSetting from './yearSetting';
import Texture from './texture';

const WarehouseAndType = () => {
    const permissions = StaticInfo.uqx || '';
    const canWarehouseType = permissions[460] === '1';
    const canWarehouseList = permissions[464] === '1';
    const canUnitSetting = permissions[456] === '1';
    const canUnitCalculation = permissions[475] === '1';
    const canBrandList = permissions[471] === '1';
    const canPayType = permissions[545] === '1';
    const firstAvailableKey = canWarehouseType ? '1' 
    : canWarehouseList ? '2' : canUnitSetting ? '3' : canUnitCalculation ? '4' 
    : canBrandList ? '5' : canPayType ? '6' : '';
    const [activeKey, setActiveKey] = useState(() => {
        const savedActiveKey = sessionStorage.getItem('warehouseAndTypeActiveKey') || '';
        const availableKeys = [
            canWarehouseType && '1',
            canWarehouseList && '2',
            canUnitSetting && '3',
            canUnitCalculation && '4',
            canBrandList && '5',
            canPayType && '6',
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
            <Tabs activeKey={activeKey} onChange={key => {setActiveKey(key); sessionStorage.setItem('warehouseAndTypeActiveKey', key);}} tabBarGutter={20}>
                {canWarehouseType && <Tabs.TabPane tab="物品类型" key="1"><WarehouseType /></Tabs.TabPane>}
                {/* {canWarehouseList && <Tabs.TabPane tab="仓库列表" key="2"><WarehouseList /></Tabs.TabPane>} */}
                {canUnitSetting && <Tabs.TabPane tab="单位设置" key="3"><UnitSetting /></Tabs.TabPane>}
                {/* {canUnitCalculation && <Tabs.TabPane tab="单位换算" key="4"><UnitCalculation /></Tabs.TabPane>} */}
                {canBrandList && <Tabs.TabPane tab="品牌列表" key="5"><BrandList /></Tabs.TabPane>}
                {canPayType && <Tabs.TabPane tab="支付方式" key="6"><PayType /></Tabs.TabPane>}
                {<Tabs.TabPane tab="年份设置" key="7"><YearSetting /></Tabs.TabPane>}
                {<Tabs.TabPane tab="口感设置" key="8"><Texture /></Tabs.TabPane>}
            </Tabs>
        </Card>
    </div>;
};

export default WarehouseAndType;
