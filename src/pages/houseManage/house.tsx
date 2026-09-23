import {Button, Input, InputNumber, List, message, Modal, Select, Space, Spin, Table, Tag} from "antd";
import {history,connect} from "umi";
import {useEffect, useState} from "react";
import {StaticInfo} from "@/StaticInfo";
const House=(props:any)=>{
    const [name,setName]=useState('');
    const [beginRents,setBeginRents]=useState(0);
    const [endRents,setEndRents]=useState(9999999999);
    const [open,setOpne]=useState(false);
    const [uid,setUid]=useState(0);
    const [uname,setUname]=useState('');
    const [spinning,setspinning]=useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    // 用户权限
    const [uqx,setUqx]=useState([]);
    const toadd=()=>{
        history.push('/houseManage/addHouse')
    };
    const toedit=(e:number)=>{
        history.push(`/houseManage/editHouse?id=${e}`)
    };
    useEffect(() => {
        getList();
    }, []);
    const getList=()=>{
        props.dispatch({
            type:'House/fetch',
            payload:{name,beginRents,endRents}
        })
    };
    const changeName=(e:any)=>{
        setName(e.target.value);
    };
    const sousuo=()=>{
        getList();
    };
    const deleteOpen=(e:any)=>{
        setOpne(true);
        setUid(e.id);
        setUname(e.house_name);
    };
    const onOK=()=>{
        setspinning(true);
        props.dispatch({
            type:'House/remove',
            payload:uid
        }).then((res:any)=>{
            if (res.ErrorCode==0){
                setspinning(false);
                message.success('删除成功');
                setOpne(false);
            }else {
                message.error(res.Data);
                setspinning(false);
            }
        })
    };
    useEffect(() => {
        let uq=StaticInfo.uqx.split('');
        setUqx(uq);
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
    return(
        <Spin spinning={spinning}>
            <List>
                <List.Item>
                    <div style={{marginBottom:'10px'}}>
                        {uqx[244]=='1'?<Button type="primary" onClick={toadd}>新增房屋</Button> :''}
                    </div>
                    <Space>
                        <Input
                            onChange={changeName}
                            addonBefore="房屋名称:"
                            value={name}
                        />
                        <Button type="primary" onClick={sousuo}>
                            搜索
                        </Button>
                    </Space>
                </List.Item>
            </List>
            <div style={{ display: 'flex', flexDirection: 'column', height: '60vh', overflowY: 'auto' }}>
                {props.HouseList&&props.HouseList.length>0?props.HouseList.map((item) => (
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
                        <p style={getTextStyle()}>房屋名称: {item.house_name}</p>
                        <p style={getTextStyle()}>建筑面积㎡: {item.floor_area}</p>
                        <p style={getTextStyle()}>可租面积㎡: {item.rentable_area}</p>
                        <p style={getTextStyle()}>总租金: {item.rents}元</p>
                        <p style={getTextStyle()}>单价: {item.price}元</p>
                        <p style={getTextStyle()}>详细地址: {item.address}</p>
                        <p style={getTextStyle()}>总楼层: {item.floors}层</p>
                        <p style={getTextStyle()}>剩余可增加面积: {item.residue_add_area}㎡</p>
                        <Space>
                            {uqx[245]=='1'?<Button type='primary' onClick={()=>toedit(item.id)}>编辑</Button> :''}
                            {uqx[243]=='1'?<Button type='primary' danger onClick={()=>deleteOpen(item)}>删除</Button> :''}
                        </Space>
                    </div>
                )):''}
            </div>
            <Modal onOk={onOK} title='删除' onCancel={()=>setOpne(false)} open={open} loading={spinning}>
                <div>
                    <span>是否要删除:</span><span style={{color:'red'}}>{uname}</span>
                </div>
            </Modal>
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        HouseList: state.House.list
    }
};
export default connect(mapStateToProps) (House)