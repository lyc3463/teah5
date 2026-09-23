import {
    Button,
    DatePicker,
    Form,
    Input,
    List,
    message,
    Modal,
    Pagination,
    Select,
    Space,
    Spin,
    Table,
    Tabs,
    Tag
} from "antd";
import {history,connect} from "umi";
import {useEffect, useState} from "react";
import {StaticInfo} from "@/StaticInfo";
import ZsContract from "@/pages/enter/zsContract";
import DjContract from "@/pages/enter/DjContract";
import {NavBar} from "antd-mobile";
import PageLayout from "@/components/PageLayout ";

const Staff=(props:any)=>{
    const [activeKey, setActiveKey] = useState(sessionStorage.getItem('activecontract') || '1');
    const onChange = (key) => {
        setActiveKey(key);
        sessionStorage.setItem('activecontract', key);
    };
    const [uqx,setUqx]=useState([]);
    useEffect(() => {
        let uq=StaticInfo.uqx.split('');
        setUqx(uq);
    }, []);

    return(
        <PageLayout
            title="合同录入"
            onBack={()=>history.push('/dashboard/')}
        >
            <Tabs activeKey={activeKey} onChange={onChange} >
                <Tabs.TabPane tab='正式合同'  key='1'>
                    <ZsContract/>
                </Tabs.TabPane>
                {uqx[387]=='1'? <Tabs.TabPane tab='定金合同'  key='2'>
                    <DjContract/>
                </Tabs.TabPane>:''
                }
            </Tabs>
        </PageLayout>
    )
}

export default connect() (Staff)