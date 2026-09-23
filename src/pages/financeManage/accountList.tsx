import {Button, Form, Input, List, message, Modal, Select, Space, Table} from "antd";
import {history,connect} from "umi";
import {useEffect, useState} from "react";
import * as CompanService from "@/services/compan";
import {StaticInfo} from "@/StaticInfo";

const AccountList=(props:any)=>{
    const [uid,setUid]=useState(0);
    const [isDeleteOpen,setIsDeleteOpen]=useState(false);
    const [name,setName]=useState('');
    const [account_type,setAccount_type]=useState(2);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    // 用户权限
    const [uqx,setUqx]=useState([]);
    const toadd=()=>{
        history.push('/financeManage/addAccountList')
    };
    const toedit=(e:number)=>{
        history.push(`/financeManage/editAccountList?id=${e}`)
    };
    // 删除的弹窗
    const isDelete=async (e:number)=>{
        setUid(e);
        setIsDeleteOpen(true);
    };
    const determineDelete=()=>{
        props.dispatch({
            type:'Account/remove',
            payload:uid
        }).then((res)=>{
            if (res.ErrorCode==0){
                message.success('删除成功');
                setIsDeleteOpen(false);
            }else {
                message.error(res.Data);
            }
        })
    };
    // 列表
    const getList=()=>{
        props.dispatch({
            type:'Account/fetch',
            payload:{name,account_type}
        })
    };
    useEffect(() => {
        getList();
    }, []);

    // 搜索按钮
    const sousuo=()=>{
        getList()
    };
    // 监听类型变换
    const changeType=(e)=>{
        setAccount_type(e);
    };
    useEffect(() => {
        let uq=StaticInfo.uqx.split('');
        setUqx(uq);
    }, []);
    const changeName=(e)=>{
        setName(e.target.value);
    };

    const getTextStyle = () => {
        return {
            fontSize: windowWidth <= 480 ? '0.9rem' : '1rem',
            color: '#333',
            marginBottom: windowWidth <= 480 ? '0.4rem' : '0.8rem',
            display: 'flex',
            alignItems: 'center'
        };
    };
    const getCardHoverStyle = () => {
        return {
            transform: 'translateY(-3px)',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)'
        };
    };
    const getCardStyle = () => {
        return {
            marginBottom: windowWidth <= 480 ? '0.8rem' : '1.6rem',
            borderRadius: '12px',
            backgroundColor: '#fff',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
            padding: windowWidth <= 480 ? '1rem' : '1.5rem',
            transition: 'all 0.3s ease',
            position: 'relative'
        };
    };
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    return(
        <div>
            <List>
                <List.Item>
                    <Space>
                        <Input
                            addonBefore="账户名称:"
                            onChange={changeName}
                            value={name}
                        />
                        {uqx[158]=='1'?
                            <Button type="primary"  onClick={toadd}>
                                添加账户
                            </Button>
                            :''}
                    </Space>
                </List.Item>
                <List.Item>
                    <Space>
                        <Space.Compact>
                            <div
                                style={{
                                    borderRadius: '6px',
                                    borderStartEndRadius: 0,
                                    borderEndEndRadius: 0,
                                    padding: '0 11px',
                                    border: '1px solid #d9d9d9',
                                    display: 'flex',
                                    alignItems: 'center',
                                    borderInlineEnd: 0,
                                }}
                            >
                                类型:
                            </div>
                            <Select
                                onChange={changeType}
                                defaultValue={account_type}
                                style={{ width: 120 }}
                                options={[
                                    { value:2, label: '全部' },
                                    { value:1, label: '公账' },
                                    { value:0, label: '私账' },
                                ]}
                            />
                        </Space.Compact>
                        <Button type="primary" onClick={sousuo}>
                            搜索
                        </Button>
                    </Space>
                </List.Item>
            </List>
            <div style={{ display: 'flex', flexDirection: 'column', height: '60vh', overflowY: 'auto' }}>
                {props.AccountList&&props.AccountList.length>0?props.AccountList.map((item)=>(
                    <div
                        key={item.id}
                        style={{ ...getCardStyle(), ...getCardHoverStyle() }}
                        onMouseEnter={(e) => {
                            const target = e.currentTarget as HTMLElement;
                            Object.assign(target.style, getCardHoverStyle());
                        }}
                        onMouseLeave={(e) => {
                            const target = e.currentTarget as HTMLElement;
                            Object.assign(target.style, getCardStyle());
                        }}
                    >
                        <div style={getTextStyle()}>账户名称: {item.account_name}</div>
                        <div style={getTextStyle()}>公司: {item.company_name}</div>
                        <div style={getTextStyle()}>项目: {item.project_name}</div>
                        <div style={getTextStyle()}>余额(元): {item.balance.toFixed(2)}</div>
                        <div style={getTextStyle()}>账户类型: {item.account_type==1? <div>公账</div>: <div>私账</div>}</div>
                        <div style={getTextStyle()}>
                            <Space>
                                {uqx[159]=='1'?<Button type='primary' onClick={()=>{toedit(item.id)}}>编辑</Button>:''}
                                {uqx[160]=='1'?<Button type='primary' danger onClick={()=>isDelete(item.id)}>删除</Button>:''}
                            </Space>
                        </div>
                    </div>
                )):''}
            </div>
            {/*<Table*/}
            {/*    rowKey={(columns) => columns.id}*/}
            {/*    columns={columns}*/}
            {/*    style={{border:'1px solid #ddd',borderRadius:'4px'}}*/}
            {/*    pagination={false}*/}
            {/*    size='small'*/}
            {/*    scroll={{y:'60vh'}}*/}
            {/*    dataSource={props.AccountList}*/}
            {/*/>*/}
            {/*删除的弹窗*/}
            <Modal open={isDeleteOpen} onOk={determineDelete} onCancel={()=>setIsDeleteOpen(false)}>
                <div>确定要删除吗？</div>
            </Modal>
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        AccountList: state.Account.list
    }
};
export default connect(mapStateToProps) (AccountList)