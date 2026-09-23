import {connect} from 'umi'
import {Button, DatePicker, Input, List, message, Pagination, Select, Space, Spin, Table, Tag, Tooltip} from "antd";
import dayjs from "dayjs";
import {history} from "@@/core/history";
import {useEffect, useState} from "react";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import * as BillService from "@/services/billSum";
import {StaticInfo} from "@/StaticInfo";
import {NavBar} from "antd-mobile";
import DateRangePicker from "@/components/DateRangePickerProps";
const BillSum=(props:any)=>{
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    // 账单编号
    const [billAbstract,setBillAbstract]=useState('');
    // 开始时间
    const [billBgeinTime,setBillBgeinTime]=useState('2000-01-01');
    // 结束时间
    const [billEndTime,setBillEndTime]=useState('2099-01-01');
    // 账单状态 0 未审核 1已审核 2全查
    const [billStatus,setBillStatus]=useState(1);
    // 账单类型   1支出 0收入 2全部
    const [billMoneyType,setBillMoneyType]=useState(2);
    // 公司id
    const [companyId,setCompanyId]=useState(0);
    // 项目id
    const [projectId,setProjectId]=useState(0);
    // 科目id
    const [subjectId,setSubjectId]=useState(0);
    // 公司列表
    const [companyList,setCompanyList]=useState([]);
    // 科目项目
    const [subjList,setSubjList]=useState([]);
    // 项目列表
    const [projectlist,setProjectlist]=useState([]);
    // 账户卡号
    const [account_card,setaccount_card]=useState('');
    const [spinning,setspinning]=useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [list,setList]=useState([]);
    const [uqx,setUqx]=useState([]);
    const toInfo=(id:number)=>{
        history.push(`/enter/financialDataInfo?id=${id}`);
    };
    useEffect(() => {
        logFenye();
    }, [page,pageSize]);
    const onChange=(e:number,pageSize:number)=>{
        setPage(e);
        setPageSize(pageSize);
    };
    useEffect(() => {
        getProjectList();
        getSubjectList();
        getCompanList();
        getFenyeInfo();
        let uq=StaticInfo.uqx.split('');
        setUqx(uq);
    }, []);
    // 监听日期
    const changeDate=(start:any,end:any)=>{
        setBillBgeinTime(start);
        setBillEndTime(end);
    };
    // 监听类型
    const changeType=(e:number)=>{
        setBillMoneyType(e);
    };
    // 监听摘要名称
    const changeName=(e)=>{
        setBillAbstract(e.target.value);
    };
    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"BillSum/fetch",
            payload:{page,billAbstract,billBgeinTime,billEndTime,billStatus,billMoneyType,companyId,projectId,subjectId,account_card,pageSize}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setList(res.Data);
            }
        })
    };
    // 搜索
    const sousuo=()=>{
        setPage(1);
        getFenyeInfo();
        logFenye();
    };
    const getFenyeInfo=()=>{
        props.dispatch({
            type:'BillSum/fenye',
            payload:{billAbstract,billBgeinTime,billEndTime,billStatus,billMoneyType,companyId,projectId,subjectId,account_card,pageSize}
        });
    };
    // 获取公司列表
    const getCompanList=()=>{
        props.dispatch({
            type:'Compan/fetch',
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                conterCompay(res.Data);
            }else {
                conterCompay([])
            }
        })
    };
    // 获取项目列表
    const getProjectList=()=>{
        props.dispatch({
            type:'Project/fetch',
            payload:{name:'',companyId}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                conterproject(res.Data);
            }else {
                conterproject([]);
            }
        });
    };
    const ChangeProjectList=(e:number)=>{
        props.dispatch({
            type:'Project/fetch',
            payload:{name:'',companyId:e}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                conterproject(res.Data);
            }else {
                conterproject([]);
            }
        });
    };
    // 获取科目列表
    const getSubjectList=()=>{
        props.dispatch({
            type:'Subject/fetch',
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                contersubj(res.Data);
            }else {
                contersubj([]);
            }
        });
    };
    // 监听公司id
    const changeCompany=(e:number)=>{
        setCompanyId(e);
        ChangeProjectList(e);
    };
    // 监听项目id
    const changeProject=(e:number)=>{
        setProjectId(e);
    };
    // 监听项目id
    const changeSubject=(e:number)=>{
        setSubjectId(e);
    };
    // 公司拼接
    const conterCompay=(item)=>{
        let oldarr=[ {label:'全部',value:0}];
        let newarr=item.map((item:any)=>{
            return {
                label:item.company_name,
                value:item.id
            }
        });
        setCompanyList(oldarr.concat(newarr));
    };
    // 项目拼接
    const conterproject=(item)=>{
        let oldarr=[ {label:'全部',value:0}];
        let newarr=item.map((item:any)=>{
            return {
                label:item.project_name,
                value:item.id
            }
        });
        setProjectlist(oldarr.concat(newarr));
    };
    // 科目拼接
    const contersubj=(item)=>{
        let oldarr=[ {label:'全部',value:0}];
        let newarr=item.map((item:any)=>{
            return {
                label:item.subject_name,
                value:item.id
            }
        });
        setSubjList(oldarr.concat(newarr));
    };
    const changeAccountCard=(e)=>{
        setaccount_card(e.target.value);
    };
    const getContainerStyle = () => {
        return {
            padding: windowWidth <= 480 ? '1rem' : '2rem',
            maxWidth: windowWidth <= 480 ? '100%' : '1200px',
            margin: '0 auto',
            backgroundColor: '#f5f6fa',
            minHeight: '80vh'
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
    const getCardHoverStyle = () => {
        return {
            transform: 'translateY(-3px)',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)'
        };
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
    const getNavBarStyle = () => {
        return {
            '--height': windowWidth <= 480 ? '40px' : '48px',
            '--border-bottom': 'none',
            '--background-color': '#fff',
            '--color': '#333',
            '--font-size': windowWidth <= 480 ? '16px' : '18px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
        };
    };
    // 监听窗口大小变化
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
        <Spin spinning={spinning}>
            <div style={getContainerStyle()}>
                <NavBar
                    onBack={() => history.push('/dashboard/')}
                    style={getNavBarStyle()}
                >
                    财务统计
                </NavBar>
                <List>
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
                                    公司:
                                </div>
                                <Select
                                    onChange={changeCompany}
                                    value={companyId}
                                    options={companyList}
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) => {
                                        // 假设每个 option 都有一个与数据项对应的 value 属性
                                        const item = companyList.find(unit => unit.value == option.value);
                                        return item?.label?.toLowerCase().includes(input.toLowerCase());
                                    }}
                                >
                                </Select>
                            </Space.Compact>
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
                                    defaultValue={billMoneyType}
                                    style={{ width: 80 }}
                                    options={[
                                        { value: 1, label: '支出' },
                                        { value: 0, label: '收入' },
                                        { value: 2, label: '全部' },
                                    ]}
                                />
                            </Space.Compact>
                        </Space>
                    </List.Item>
                    <List.Item>
                        <Space>
                            <Input
                                onChange={changeName}
                                addonBefore="摘要:"
                                value={billAbstract}
                            />
                            <Input
                                onChange={changeAccountCard}
                                addonBefore="账户卡号:"
                                value={account_card}
                            />
                        </Space>
                        <Space>
                            <DateRangePicker  onDateSelected={changeDate}/>
                            <Button type="primary" onClick={sousuo}>
                                搜索
                            </Button>
                        </Space>
                    </List.Item>
                  
                </List>
                <div style={{ display: 'flex', flexDirection: 'column', height: '65vh', overflowY: 'auto' }}>
                    {list.map((item:any)=>(
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
                            <div style={getTextStyle()}>日期: {dayjs(item.billDate).format('YYYY-MM-DD')}</div>
                            <div style={getTextStyle()}>摘要: {item.billAbstract}</div>
                            <div style={getTextStyle()}>公司: {item.company_name}</div>
                            <div style={getTextStyle()}>项目: {item.project_name}</div>
                            <div style={getTextStyle()}>账户: {item.account_name}</div>
                            <div style={getTextStyle()}>账户卡号: {item.account_card}</div>
                            <div style={getTextStyle()}>科目: {item.subject_name}</div>
                            <div style={getTextStyle()}>收入/支出: {item.money_type==1?<Tag color="red">支出</Tag>:<Tag color="green">收入</Tag>}</div>
                            <div style={getTextStyle()}>收入/支出金额:<span style={{fontSize:'14px',color:'red'}}>{item.billMoney.toFixed(2)}<span style={{fontSize:'12px',color:'#555'}}>元</span></span></div>
                            <div style={getTextStyle()}>余额:
                                {
                                    item.bill_status==0?<>
                                        <span style={{fontWeight:700}}>{(item.accountBalance).toFixed(2)}</span><span>(元)</span>
                                    </>:<>
                                        <span style={{fontWeight:700}}>{(item.balance).toFixed(2)}</span><span>(元)</span>
                                    </>
                                }
                            </div>
                            <div style={getTextStyle()}>
                                <Space>
                                    <Button type='primary' onClick={()=>toInfo(item.id)}>详情</Button>
                                </Space>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div style={{display:'flex',justifyContent:'space-around',marginTop:'5px'}}>
                收入/支出总金额:{props.count?props.count.moneySum.toFixed(2):''}元
            </div>
            {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        BillSumList: state.BillSum.list,
        count: state.BillSum.count,
        CompanList: state.Compan.list,
        SubjectList: state.Subject.list,
        ProjectList: state.Project.list,
    }
};
export default connect(mapStateToProps) (BillSum)