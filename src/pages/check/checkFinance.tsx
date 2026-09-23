import {Tabs} from "antd";
import {useState} from "react";
import {history} from "umi";
import PageLayout from "@/components/PageLayout ";
import OldCheckFinance from "@/pages/check/oldCheckFinance";
import NewCheckFinance from "@/pages/check/newCheckFinance";

const CheckFinance=()=>{
    const [activeKey, setActiveKey] = useState(sessionStorage.getItem('activecheckfinancialData') || '1');
    const onChange = (key) => {
        setActiveKey(key);
        sessionStorage.setItem('activecheckfinancialData', key);
    };
    return(
        <PageLayout
            title="审核财务数据"
            onBack={()=>history.push('/dashboard/')}
        >
            <Tabs activeKey={activeKey} onChange={onChange} >
                <Tabs.TabPane tab="报销单" key="1">
                    <OldCheckFinance />
                </Tabs.TabPane>
                <Tabs.TabPane tab="财务单" key="2">
                    <NewCheckFinance/>
                </Tabs.TabPane>
            </Tabs>
        </PageLayout>
    )
}

export default CheckFinance