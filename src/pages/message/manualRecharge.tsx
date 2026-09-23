import {useState,useEffect} from "react";
import {connect} from "umi";
import {Button, DatePicker, Input, List, Pagination, Select, Space, Table, Tag} from "antd";
import dayjs from "dayjs";
import DateRangePicker from "@/components/DateRangePickerProps";

const ManualRecharge=(props)=>{
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    // 审核状态
    const [stutes,setStutes]=useState(0);
    const [startDate,setStartDate]=useState('2000-01-01');
    const [endDate,setEndDate]=useState('2099-01-01');
    const columns =[
        {
            title: '日期',
            dataIndex: 'created',
            key: 'created',
            render:(_:any,record:any)=>{
                return(
                    <div>
                        {dayjs(record.created).format("YYYY-MM-DD")}
                    </div>
                )
            }
        },
        {
            title: '金额(元)',
            dataIndex: 'smsAmount',
            key: 'smsAmount',
        },
        {
            title: '条数(条)',
            dataIndex: 'smsNumber',
            key: 'smsNumber',
        },
        {
            title: '状态',
            dataIndex: 'smsStatus',
            key: 'smsStatus',
            render:(text:any,record:any)=>{
                return(
                    <div>{record.smsStatus==1?<Tag color='red'>未审核</Tag>:<Tag color='green'>已审核</Tag>}</div>
                )
            }
        }
    ];
    const onChange=(e,pageSize)=>{
        setPage(e);
        setPageSize(pageSize);
    };
    const fenye=()=>{
        props.dispatch({
            type:'Recharge/fetch',
            payload:{page,startDate,endDate,stutes,pageSize}
        })
    };
    useEffect(() => {
        fenye();
    }, [page,pageSize]);
    const changeType=(e)=>{
        setStutes(e);
    };
    // 监听日期
    const changeDate=(start:any,end:any)=>{
        setStartDate(start);
        setEndDate(end);
    };
    const sousuo=()=>{
        setPage(1);
        getFenYeInfo();
        fenye();
    };
    const getFenYeInfo=()=>{
        props.dispatch({
            type:'Recharge/fenye',
            payload:{startDate,endDate,stutes,pageSize}
        });
    };
    useEffect(() => {
        getFenYeInfo();
    }, []);
    return(
        <div>
            <div>
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
                                    状态:
                                </div>
                                <Select
                                    onChange={changeType}
                                    value={stutes}
                                    style={{ width: 120 }}
                                    options={[
                                        { value:0, label: '全部' },
                                        { value:1, label: '未审核' },
                                        { value:2, label: '已审核' },
                                    ]}
                                />
                            </Space.Compact>
                            <Button type="primary" onClick={sousuo}>
                                搜索
                            </Button>
                        </Space>
                    </List.Item>
                    <Space>
                        <DateRangePicker  onDateSelected={changeDate}/>

                    </Space>
                </List>
                <Table
                    columns={columns}
                    rowKey={(columns) => columns.id}
                    pagination={false}
                    dataSource={props.RechargeList}
                    scroll={{y:'60vh'}}
                    size='small'
                    rowClassName={(record, index) =>
                        index % 2 === 1 ? 'tbodd' : 'tbeven'
                    }
                />
                {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
            </div>
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        RechargeList: state.Recharge.list,
        count: state.Recharge.count
    }
};
export default connect(mapStateToProps) (ManualRecharge)