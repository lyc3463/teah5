import dayjs from "dayjs";
import {Button, Input, List, message, Modal, Pagination, Space, Tag} from "antd";
import {history,connect} from "umi";
import {useEffect, useState} from "react";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";

const ChangeName=(props:any)=>{
    // 当前页数
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    // 手机号
    const [phone,setPhone]=useState('');
    // 状态 0全部，1未审核，2审核通过
    const [stutes,setStutes]=useState(1);
    // 开始时间
    const [startDate,setStartDate]=useState('2000-01-01');
    // 结束时间
    const [endDate,setEndDate]=useState('2099-01-01');
    // 审核弹窗
    const [isOpen,setOpen]=useState(false);
    // 更名的手机号
    const [uphone,setUphone]=useState('');
    const [list,setList]=useState([]);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    // id
    const [uid,setUid]=useState(0);
    // 监听页数
    const onChange=(e:number,pageSize:number)=>{
        setPage(e);
        setPageSize(pageSize);
    };
    // 时间选择
    const changeDate=(_:any,data:string[])=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setStartDate('2000-01-01');
            setEndDate('2099-01-01');

        } else {
            setStartDate(data[0]);
            setEndDate(data[1]);

        }
    };
    // 监听姓名
    const changePhone=(e)=>{
        setPhone(e.target.value);
    };
    // 监听状态
    const changeStutes=(e:number)=>{
        setStutes(e);
    };
    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"Rename/fetch",
            payload:{page,phone,stutes,startDate,endDate,pageSize}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setList(res.Data);
            }
        })
    };
    useEffect(() => {
        logFenye();
    }, [page,pageSize]);
    // 搜索
    const suosou=()=>{
        setPage(1);
        fenyeinfo();
        logFenye();
    };
    const fenyeinfo=()=>{
        props.dispatch({
            type:'Rename/fenye',
            payload:{phone,stutes,startDate,endDate,pageSize}
        })
    };
    // 审核弹窗
    const isCheck=(e:any)=>{
        setOpen(true);
        setUid(e.id);
        setUphone(e.tenant_phone)
    };
    const onOk=()=>{
        props.dispatch({
            type:'Rename/check',
            payload:uid
        }).then((res:any)=>{
            if (res.ErrorCode==0){
                message.success('审核通过');
                setOpen(false);
                logFenye();
            }else {
                message.error(res.Data);
            }
        })
    };
    useEffect(() => {
        fenyeinfo();
    }, []);
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
    const toedit=(e)=>{
        history.push(`/enter/editRename?id=${e}`);
    };
    const toadd=()=>{
        history.push('/enter/addRename');
    };
    const isDelete=(e)=>{
        setUid(e);
        setOpen(true);
    };
    return(
        <div>
            <List>
                <Button type='primary' onClick={toadd}>录入更名</Button>
                <List.Item>
                    <Space>
                        <Button type="primary" onClick={suosou}>
                            搜索
                        </Button>
                        <Input
                            addonBefore="原手机号:"
                            onChange={changePhone}
                            value={phone}
                        />
                    </Space>
                </List.Item>
            </List>
            <div style={{ display: 'flex', flexDirection: 'column', height: '65vh', overflowY: 'auto' }}>
                {list.map((item) => (
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
                        <p style={getTextStyle()}>申请日期: {dayjs(item.created).format('YYYY-MM-DD')}</p>
                        <p style={getTextStyle()}>合同编号: {item.identifier}</p>
                        <p style={getTextStyle()}>原名称: {item.tenant_name}</p>
                        <p style={getTextStyle()}>更改后的名称: {item.rename}</p>
                        <p style={getTextStyle()}>原手机号: {item.tenant_phone}</p>
                        <p style={getTextStyle()}>更改后手机号: {item.rephone}</p>
                        <p style={getTextStyle()}>原身份证: {item.customCard}</p>
                        <p style={getTextStyle()}>更改后身份证: {item.reCard}</p>
                        <p style={getTextStyle()}>状态:{item.renameStatus==1?<Tag color='red'>未审核</Tag>:<Tag color='green'>已审核</Tag>}</p>
                        <Space>
                            {
                                item.renameStatus==1?<>
                                    <Button type='primary' onClick={()=>toedit(item.id)}>编辑</Button>
                                    {/*<Button type='primary' danger onClick={()=>isDelete(item.id)}>删除</Button>*/}
                                </>:''
                            }
                        </Space>
                    </div>
                ))}
            </div>
            {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
            {/*    审核弹窗*/}
            <Modal open={isOpen} onOk={onOk} onCancel={()=>setOpen(false)} title='审核更名'>
                <span>是否审核通过手机号:<span style={{color:'red'}}>{uphone}</span>的用户吗?</span>
            </Modal>
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        RenameList: state.Rename.list,
        count: state.Rename.count
    }
};
export default connect(mapStateToProps) (ChangeName)