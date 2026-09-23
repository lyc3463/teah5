import {Button, Input, InputNumber, List, message, Modal, Pagination, Select, Space, Spin, Table, Tag} from "antd";
import {history,connect} from "umi";
import {useEffect, useState} from "react";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {StaticInfo} from "@/StaticInfo";

const Unit=(props:any)=>{
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    const [name,setName]=useState('');
    const [beginRents,setBeginRents]=useState(0);
    const [endRents,setEndRents]=useState(999999999);
    const [status,setstatus]=useState(0);
    const [house_id,sethouse_id]=useState(0);
    const [uid,setUid]=useState(0);
    const [open,setOpen]=useState(false);
    const [spinning,setspinning]=useState(false);
    const [hounsList,sethounsList]=useState([]);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    // 用户权限
    const [uqx,setUqx]=useState([]);
    const toadd=()=>{
        history.push('/houseManage/addUnit')
    };
    const toedit=(e:number)=>{
        history.push(`/houseManage/editUnit?id=${e}`)
    };
    const isdelete=(e)=>{
        setUid(e);
        setOpen(true);
    };
    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"Unit/fetch",
            payload:{page,name,beginRents,endRents,status,house_id,pageSize}
        })
    };
    // 监听页数
    const onChange=(page,pageSize)=>{
        setPage(page);
        setPageSize(pageSize);
    };
    useEffect(() => {
        logFenye();
    }, [page,pageSize]);

    const changeName=(e:any)=>{
        setName(e.target.value);
    };
    const sousuo=()=>{
        setPage(1);
        getFenyeInfo();
        logFenye();
    };
    const getFenyeInfo=()=>{
        props.dispatch({
            type:"Unit/fetchFenye",
            payload:{name,beginRents,endRents,status,house_id,pageSize}
        });
    };
    const changeBeginRents=(e)=>{
        if (e){
            setBeginRents(e);
        }else {
            setBeginRents(0);
        }
    };
    const onOK=()=>{
        setspinning(true);
        props.dispatch({
            type:'Unit/remove',
            payload:uid
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('删除成功');
                setspinning(false);
                setOpen(false);
            }else {
                message.error(res.Data);
                setspinning(false);
                setOpen(false);
            }
        })
    };
    const changestatus=(e)=>{
        setstatus(e);
    };
    useEffect(() => {
        let uq=StaticInfo.uqx.split('');
        setUqx(uq);
        getList();
        getFenyeInfo();
    }, []);
    const getList=()=>{
        props.dispatch({
            type:'House/fetch',
            // payload:{name,beginRents,endRents}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                sethounsList(res.Data);
            }else {
                message.error(res.Data);
            }
        })
    };
    const changeHouse=(e)=>{
        sethouse_id(e);
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
            <List>
                <List.Item>
                    <Space style={{marginBottom:'10px'}}>
                        <Input
                            onChange={changeName}
                            addonBefore="单元名称:"
                            value={name}
                        />
                        {uqx[247]=='1'?<Button type="primary" onClick={toadd}>新增单元</Button> :''}
                        <Button type="primary" onClick={sousuo}>
                            搜索
                        </Button>
                    </Space>
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
                                    width:'40px'
                                }}
                            >
                                房屋:
                            </div>
                            <Select
                                value={house_id}
                                onChange={changeHouse}
                                showSearch
                                optionFilterProp="children"
                                filterOption={(input, option) => {
                                    // 假设每个 option 都有一个与数据项对应的 value 属性
                                    const item = hounsList.find(unit => unit.id == option.value); // 您可能需要优化这个查找过程
                                    return item?.house_name?.toLowerCase().includes(input.toLowerCase());
                                }}
                            >
                                <Select.Option value={0} key={0}>
                                    全部
                                </Select.Option>
                                {hounsList.map((item:any,index:any)=>{
                                    return(
                                        <Select.Option value={item.id} key={item.id}>
                                            {item.house_name}
                                        </Select.Option>
                                    )
                                })}
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
                                状态:
                            </div>
                            <Select
                                onChange={changestatus}
                                defaultValue={status}
                                style={{ width: 80 }}
                                options={[
                                    { value: 2, label: '已租' },
                                    { value: 1, label: '未租' },
                                    { value: 0, label: '全部' },
                                ]}
                            />
                        </Space.Compact>

                    </Space>
                </List.Item>
            </List>
            <div style={{ display: 'flex', flexDirection: 'column', height: '60vh', overflowY: 'auto' }}>
                {props.UnitList&&props.UnitList.length>0?props.UnitList.map((item) => (
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
                        <p style={getTextStyle()}>房屋: {item.house_name}</p>
                        <p style={getTextStyle()}>单元名称: {item.unit_name}</p>
                        <p style={getTextStyle()}>建筑面积㎡: {item.floor_area}</p>
                        <p style={getTextStyle()}>可租面积㎡: {item.rentable_area}</p>
                        <p style={getTextStyle()}>租金: {item.price}元</p>
                        <p style={getTextStyle()}>每平方单价: {item.rent}㎡/元</p>
                        <p style={getTextStyle()}>单元类型: {item.unit_type==1?<Tag color="lime">商业</Tag>:<Tag color="gold">办公</Tag>}</p>
                        <p style={getTextStyle()}>所属楼层: {item.floor}层</p>
                        <p style={getTextStyle()}>状态: {item.status==2?<Tag color="green">已租</Tag>:<Tag color="blue">未租</Tag>}</p>
                        <Space>
                            {uqx[245]=='1'?<Button type='primary' onClick={()=>toedit(item.id)}>编辑</Button> :''}
                            {uqx[249]=='1'?<Button type='primary' danger onClick={()=>isdelete(item.id)}>删除</Button>:''}
                        </Space>
                    </div>
                )):''}
            </div>
            {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
            <Modal open={open} onCancel={()=>setOpen(false)} onOk={onOK} title='删除单元' loading={spinning}>
                <div>
                    是否要删除？
                </div>
            </Modal>
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        UnitList: state.Unit.list,
        count: state.Unit.count
    }
};
export default connect(mapStateToProps) (Unit)