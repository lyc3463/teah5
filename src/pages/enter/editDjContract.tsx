import {connect,history,useNavigate} from "umi";
import {useEffect, useRef, useState} from "react";
import * as StaffServer from "@/services/staff";
import {Button, DatePicker, Form, Image, Input, InputNumber, message, Select, Space, Tag} from "antd";
import dayjs from "dayjs";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import * as UnitService from "@/services/unit";
import * as CheckCompanyService from "@/services/checkCompany";
import {NavBar} from "antd-mobile";
const tailLayout = {
    wrapperCol: { offset: 3 },
};
const EditDjContract=(props:any)=>{
    const navigate=useNavigate();
    const formRef=useRef();
    // 路由参数
    const [uid,setUid]=useState('');
    // 客户列表
    const [kehuList,setKehuList]=useState([]);
    // 签订日期
    const [dayDate,setDayDate]=useState('');
    const [contractTypeid,setcontractTypeid]=useState(0);
    // 单元列表
    const [unitList,setUnitList]=useState([]);
    // 勾选的单元id数组
    const [unitarrList,setUnitarrList]=useState([]);
    // 最小租金
    const [minzujin,setminzujin]=useState(0);
    // 单元禁选状态
    const [unitStutes,setunitStutes]=useState(false);
    // 房屋id
    const [house_id,sethouse_id]=useState(0);
    // 房屋列表
    const [houseList,sethouseList]=useState([]);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        setUid(id);
        getOneStaff(id);
        getHouseList();
        getUnitList(house_id);
        getCheckCompanyList();
    }, []);

    // 获取单元列表
    const getUnitList=(e)=>{
        UnitService.stutesUnit({house_id:e}).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setUnitList(res.Data);
            }else {
                message.error(res.Data)
            }
        })
    };
    // 获取客户列表
    const getCheckCompanyList=()=>{
        CheckCompanyService.companyList({name:''}).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                const filteredArray = res.Data.map(item => item.contractStatus !== 2 ? item : null).filter(item => item !== null);
                setKehuList(filteredArray);
            }else {
                message.error(res.Data)
            }
        })
    };
    const changeunit=(e)=>{
        setUnitarrList(e);
    };
    // 获取房屋列表
    const getHouseList=()=>{
        props.dispatch({
            type:'House/fetch'
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                sethouseList(res.Data);
            }else {
                message.error(res.Data);
            }
        })
    };
    const getOneStaff= (id:string)=>{
        StaffServer.onedj(id).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                sethouse_id(res.Data.houseId);
                getUnitList(res.Data.houseId);
                formRef.current.setFieldsValue(res.Data);
                setDayDate(dayjs(res.Data.beginTime).format("YYYY-MM-DD"));
                setcontractTypeid(res.Data.contractType);
                setUnitarrList(res.Data.unitIds.split('|').map(item => parseInt(item, 10)));
            }else {
                message.error(res.Data)
            }
        })
    };
    const onFinish=(val:any)=>{
        let unit_id=unitarrList.join("|");
        props.dispatch({
            type:'Staff/editdj',
            payload:{...val,uid,contractTypeid,dayDate,unit_id,house_id}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('修改定金合同成功');
                history.push('/enter/staff');
            }else {
                message.error(res.Data);
            }
        })
    };
    const changeDayDate=(_:any,item:any)=>{
        setDayDate(item);
    };
    // 监听房屋
    const changeHouse=(e)=>{
        sethouse_id(e);
        setunitStutes(false);
        getUnitList(e);
    };
    const getContainerStyle = () => {
        return {
            padding: windowWidth <= 480 ? '12px' : '16px',
            maxWidth: windowWidth <= 480 ? '100%' : '600px',
            margin: '0 auto',
            height: '90vh',
            overflowY: 'auto',
            scrollbarWidth: 'thin',
        };
    };
    const getNavBarStyle = () => {
        return {
            '--height': windowWidth <= 480 ? '40px' : '48px',
            '--border-bottom': 'none',
            '--background-color': '#fff',
            '--font-size': windowWidth <= 480 ? '16px' : '18px',
            padding: windowWidth <= 480 ? '12px' : '16px',
            maxWidth: windowWidth <= 480 ? '100%' : '600px',
            margin: '0 auto',
        };
    };
    const getNavStyle = () => {
        return {
            padding: windowWidth <= 480 ? '12px' : '16px',
            maxWidth: windowWidth <= 480 ? '100%' : '600px',
            margin: '0 auto',
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
        <div style={getContainerStyle()}>
            <NavBar
                onBack={() => navigate(-1)}
                style={getNavBarStyle()}
            >
                修改定金合同
            </NavBar>
            <Form
                ref={formRef}
                onFinish={onFinish}
                layout="horizontal"
                size={'large'}
            >
                <Form.Item >
                    <Input value='定金合同' disabled addonBefore="定金合同:"/>
                </Form.Item>
                <Form.Item name='identifier' addonBefore="合同编号:">
                    <Input/>
                </Form.Item>
                <Form.Item>
                    签订日期： <DatePicker value={dayjs(dayDate)} onChange={changeDayDate}/>
                </Form.Item>

                <Form.Item  name='clientId'>
                    <Select
                        placeholder='客户'
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) => {
                            // 假设每个 option 都有一个与数据项对应的 value 属性
                            const item = kehuList.find(unit => unit.id == option.value); // 您可能需要优化这个查找过程
                            return item?.custom_name?.toLowerCase().includes(input.toLowerCase());
                        }}
                    >
                        {kehuList.map((item:any,index:any)=>{
                            return(
                                <Select.Option value={item.id} key={index}>
                                    {item.custom_name}
                                </Select.Option>
                            )
                        })}
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Select placeholder='房屋'
                            value={house_id}
                            onChange={changeHouse}
                    >
                        {houseList.map((item:any,index:any)=>{
                            return(
                                <Select.Option value={item.id} key={index}>
                                    {item.house_name}
                                </Select.Option>
                            )
                        })}
                    </Select>
                </Form.Item>
                <Form.Item >
                    <Select placeholder='单元'
                            mode="multiple"
                            onChange={changeunit}
                            value={unitarrList}
                            disabled={unitStutes}
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) => {
                                // 假设每个 option 都有一个与数据项对应的 value 属性
                                const item = unitList.find(unit => unit.id == option.value); // 您可能需要优化这个查找过程
                                return item?.unit_name?.toLowerCase().includes(input.toLowerCase());
                            }}
                    >
                        {unitList.map((item:any,index:any)=>{
                            let statusText;
                            if (item.status === 1) {
                                statusText = <Tag color="green">未租</Tag>; // 假设使用Ant Design的Tag组件来显示状态
                            } else if (item.status === 2) {
                                statusText = <Tag color="blue">已租</Tag>;
                            } else if (item.status === 3) {
                                statusText = <Tag color="red">退租</Tag>;
                            } else {
                                // 处理未知状态，或显示原始文本
                                statusText = <span>未知状态</span>;
                            }
                            return(
                                <Select.Option value={item.id} key={index}>
                                    {item.unit_name}-{statusText}
                                </Select.Option>
                            )
                        })}
                    </Select>
                </Form.Item>
                <Form.Item name='zuMoney'>
                    <InputNumber min={minzujin} addonBefore="租金/月(元):"/>
                </Form.Item>
                <Form.Item name='deposit'>
                    <InputNumber addonBefore="押金(元):"/>
                </Form.Item>
                <Form.Item>
                    <Space>
                        <Button type="primary" htmlType="submit">
                            修改
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        CheckCompanyList: state.CheckCompany.list,
        UnitList: state.Unit.list,
    }
};
export default connect(mapStateToProps) (EditDjContract)