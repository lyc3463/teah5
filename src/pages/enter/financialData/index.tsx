import {Tabs} from "antd";
import {useState} from "react";
import {history} from "umi";
import PageLayout from "@/components/PageLayout ";
import ExpenseReport from "@/pages/enter/financialData/expenseReport";
import FinancialReport from "@/pages/enter/financialData/FinancialReport";

const financialData=()=>{
    const [activeKey, setActiveKey] = useState(sessionStorage.getItem('activefinancialData') || '1');
    const onChange = (key) => {
        setActiveKey(key);
        sessionStorage.setItem('activefinancialData', key);
    };
    return(
        <PageLayout
            title="财务数据"
            onBack={()=>history.push('/dashboard/')}
        >
            <Tabs activeKey={activeKey} onChange={onChange} >
                <Tabs.TabPane tab='报销单'  key='1'>
                    <ExpenseReport/>
                </Tabs.TabPane>
                <Tabs.TabPane tab='财务单'  key='2'>
                    <FinancialReport/>
                </Tabs.TabPane>
            </Tabs>
        </PageLayout>
    )
}

export default financialData