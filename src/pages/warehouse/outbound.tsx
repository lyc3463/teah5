import {ArrowLeftOutlined} from '@ant-design/icons';
import {Button, Card, Tabs} from 'antd';
import {useState} from 'react';
import {history} from 'umi';
import {StaticInfo} from '@/StaticInfo';
import RequisitionForm from './requisitionForm';
import CheckRequisitionForm from './checkRequisitionForm';
import ReturnForm from './returnForm';
import ReturnReview from './returnReview';
import DamageForm from './damageForm';
import DamageFormReview from './damageFormReview';

const Outbound = () => {
    const permissions = StaticInfo.uqx || '';
    const canRequisitionForm = permissions[491] === '1';
    const canCheckRequisitionForm = permissions[500] === '1';
    const canReturnForm = permissions[503] === '1';
    const canReturnReview = permissions[507] === '1';
    const canDamageForm = permissions[509] === '1';
    const canDamageFormReview = permissions[513] === '1';
    const firstAvailableKey = canRequisitionForm ? '1' 
    : canCheckRequisitionForm ? '2' : canReturnForm ? '3' : canReturnReview ? '4' : canDamageForm ? '5' : canDamageFormReview ? '6' : '';
    const [activeKey, setActiveKey] = useState(() => {
        const savedActiveKey = sessionStorage.getItem('outboundActiveKey') || '';
        const availableKeys = [
            canRequisitionForm && '1',
            canCheckRequisitionForm && '2',
            canReturnForm && '3',
            canReturnReview && '4',
            canDamageForm && '5',
            canDamageFormReview && '6',
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
            <Tabs activeKey={activeKey} onChange={key => {setActiveKey(key); sessionStorage.setItem('outboundActiveKey', key);}} tabBarGutter={20}>
                {canRequisitionForm && <Tabs.TabPane tab="领用申请" key="1"><RequisitionForm /></Tabs.TabPane>}
                {canCheckRequisitionForm && <Tabs.TabPane tab="领用审核" key="2"><CheckRequisitionForm /></Tabs.TabPane>}
                {canReturnForm && <Tabs.TabPane tab="退货申请" key="3"><ReturnForm /></Tabs.TabPane>}
                {canReturnReview && <Tabs.TabPane tab="退货审核" key="4"><ReturnReview /></Tabs.TabPane>}
                {canDamageForm && <Tabs.TabPane tab="报损申请" key="5"><DamageForm /></Tabs.TabPane>}
                {canDamageFormReview && <Tabs.TabPane tab="报损审核" key="6"><DamageFormReview /></Tabs.TabPane>}
            </Tabs>
        </Card>
    </div>;
};

export default Outbound;
