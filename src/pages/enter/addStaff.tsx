import {
    Button,
    Form,
    Pagination,
    Table,
    Modal,
    Select,
    DatePicker,
    Input,
    InputNumber,
    message,
    Image,
    Space, Tag, Spin
} from "antd";
import {useEffect, useState} from "react";
import {connect,history,useNavigate} from "umi";
import {
    addNewData,
    removeLastData,
    checkEndTime,
    splitDataByEndTimeAndRentPeriod,
    calculateTotalRentalDays,
    replaceEnglishCommasWithChinese,
    calculateTimePeriods,
    contractsDz,
    getHouseNameById,
    getNamesByIds
} from "@/utils/OpenTool";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import dayjs from "dayjs";
import * as CheckCompanyService from '@/services/checkCompany';
import * as contractTypeListServer from "@/services/contractTypeList";
import * as UnitService from '@/services/unit';
import ImageUploader from "@/components/ImageUploader";
import {PlusOutlined, ReloadOutlined} from "@ant-design/icons";
import NoyasuoImgCmp from "@/components/NoyasuoImgCmp";
import {NavBar} from "antd-mobile";
import DateRangePicker from "@/components/DateRangePickerProps";
const tailLayout = {
    wrapperCol: { offset: 3 },
};
const AddStaff=(props:any)=>{
    const navigate=useNavigate();
    const [form] = Form.useForm();
    const [disb,setdisb]=useState(true);
    const [deposit,setdeposit]=useState(0);
    const [unitstutes,setunitstutes]=useState(1);
    const [selectedPhone,setSelectedPhone]=useState('');
    // 合同编号房屋名称
    const [houseName,sethouseName]=useState('');
    // 合同编号数字
    const [numNo,setNumNo]=useState('');
    //合同编号单元名称
    const [unitNamess,setunitNamess]=useState('');
    // 递增
    // const [formItems, setFormItems] = useState([{ key: 1, beginTime: null, endTime: null, rentBeginTime: null,rentEndTime:null,incremental:1}]);
    const [formItems, setFormItems] = useState([]);
    // 免租期
    const [mzformItems,setmzFormItems]=useState([]);
    // 勾选的单元id数组
    const [unitarrList,setUnitarrList]=useState([]);
    // 补充协议内容
    const [remark,setremark]=useState('');
    // 物品清单
    const [wupinList, setwupinList] = useState([
        { key: 1,wupinName:null,wupininfo:null,wupinNuber:''},
    ]);
    // 客户列表
    const [kehuList,setKehuList]=useState([]);
    // 单元列表
    const [unitList,setUnitList]=useState([]);
    // 房屋列表
    const [houseList,sethouseList]=useState([]);
    // 开始时间
    const [startDate,setStartDate]=useState('');
    // 结束时间
    const [endDate,setEndDate]=useState('');
    // 交付日
    const [deliveryDate,setDeliveryDate]=useState('');
    // 租户证件图片
    const [documentImages,setImgName]=useState([]);
    // 证件图片B64
    const [b64,setB64]=useState([]);
    // 单元图片
    const [unitImages,setunitImgName]=useState([]);
    // 补充协议图片名字
    const [xyimgnames,setxyimgnames]=useState([]);
    // 补充协议图片b64
    const [xyimgb64,setxyimgb64]=useState([]);
    // 单元平面图
    const [unitB64,setuintB64]=useState([]);
    // 合同类型ID  1定金合同，2正式合同
    const [contractType,setcontractType]=useState(0);
    // 合同类型列表
    const [ctyList,setCtyList]=useState([]);
    // 合同类型列表ID
    const [contractTypeid,setcontractTypeid]=useState(0);
    // 手动输入免租期天数
    const [mzq,setMzq]=useState(0);
    // 计算出来的免租期天数
    const [summzqDay,setsummzqDay]=useState(0);
    // 最小租金
    const [minzujin,setminzujin]=useState(0);
    // 面积
    const [mianji,setmianji]=useState(0);
    // 签订日期
    const [dayDate,setDayDate]=useState('');
    const [spinning,setspinning]=useState(false);
    // 房屋id
    const [house_id,sethouse_id]=useState(0);
    // 单元禁选状态
    const [unitStutes,setunitStutes]=useState(true);
    // 租金
    const [zuMoney,setzuMoney]=useState(0);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    // 删除递增表单项
    const removeFormItemByKey = key => {
        if (formItems.length<=1){
            message.warning('不可删除最后一项');
        }else {
            setFormItems(prevItems => prevItems.filter(item => item.key !== key));
            let newarr=removeLastData(formItems);
            setFormItems(newarr);
        }
    };
    // 删除免租期
    const removedzFormItemByKey = key => {
        setmzFormItems(prevItems => prevItems.filter(item => item.key !== key));
    };
    // 删除物品表单项
    const removeqingdan = key => {
        setwupinList(prevItems => prevItems.filter(item => item.key !== key));
    };
    const onFinish= (values)=>{
        let identifier=`${houseName}-${numNo}-${unitNamess}`;
        setspinning(true);
        let unit_id=unitarrList.join("|");
        if (contractType==2){
            let dayNoe=calculateTotalRentalDays(mzformItems);
            let datearr=splitDataByEndTimeAndRentPeriod(formItems,endDate);
            if (dayNoe!=mzq){
                message.warning('免租期天数与填写天数不相等');
                setspinning(false);
            }if (zuMoney<minzujin){
                message.warning(`租金不能低于${minzujin}元`);
                setspinning(false);
            } else {
                let formItemsjson=JSON.stringify(datearr);
                let wupinListjson=JSON.stringify(wupinList);
                let mzqJson=JSON.stringify(mzformItems);
                let imgs=xyimgnames.join('|');
                let unitImage=unitImages.join('|');
                let documentImage=documentImages.join('|');
                let date={dzJson:formItemsjson,rentJson:mzqJson,goodsJson:wupinListjson};
                let jsonDate=JSON.stringify(date);
                props.dispatch({
                    type:'Staff/addzs',
                    payload:{...values,deposit,identifier,endDate,startDate,jsonDate,deliveryDate,documentImage,unitImage,imgs,contractTypeid,unit_id,remark,house_id,zuMoney}
                }).then((res:TypeErrorCode)=>{
                    if (res.ErrorCode==0){
                        setspinning(false);
                        message.success('添加成功');
                        history.push('/enter/staff');
                    }else {
                        setspinning(false);
                        message.error(res.Data);
                    }
                })
            }
        }else if (contractType==1){
            props.dispatch({
                type:'Staff/adddj',
                payload:{...values,identifier,deposit,dayDate,contractTypeid,unit_id,house_id,zuMoney}
            }).then((res:TypeErrorCode)=>{
                if (res.ErrorCode==0){
                    setspinning(false);
                    message.success('添加成功');
                    history.push('/enter/staff');
                }else {
                    setspinning(false);
                    message.error(res.Data);
                }
            })
        }else {
            message.warning('请选择合同类型进行填写数据');
            setspinning(false);
        }
    };
    useEffect(() => {
        getCheckCompanyList();
        getCtyList();
        getHouseList();
    }, []);
    const changeData=(start,end)=>{
        setStartDate(start);
        setEndDate(end);
        let dataArr=calculateTimePeriods(start,end,zuMoney);
        setFormItems(dataArr);
    };
    // 更新起租日
    const updateqizuDate = (key, updates) => {
        setFormItems(prevItems => prevItems.map(item => item.key === key ? { ...item, ...updates } : item));
    };
    // 更新免租期
    const updatemz = (key, updates) => {
        setmzFormItems(prevItems => prevItems.map(item => item.key === key ? { ...item, ...updates } : item));
    };
    // 更新递增
    const updatedz = (key, updates) => {
        setFormItems(prevItems => {
            // 1. 更新对应的 item
            const updatedItems = prevItems.map(item =>
                item.id === key ? { ...item, ...updates } : item
            );
            // 2. 计算 contractsDz
            const newItems = contractsDz(zuMoney, updatedItems);
            // 3. 返回最终结果
            return newItems;
        });
    };
    // 监听免租期天数
    useEffect(() => {
        setsummzqDay(calculateTotalRentalDays(mzformItems));
    }, [mzformItems]);
    // 添加递增表单项
    const addFormItem = () => {
        if (startDate&&endDate){
            let isAdd=checkEndTime(formItems,endDate);
            if (isAdd){
                const newKey = formItems.length ? Math.max(...formItems.map(item => item.key)) + 1 : 1;
                let FormItems=[...formItems, { key: newKey, beginTime: null, endTime: null, incremental:0}]
                newArr(FormItems);
            }else {
                message.warning('您已不能在继续添加');
            }
        }else {
            message.warning('请选择起租日开始时间跟结束时间')
        }
    };
    // 新增免租期
    const addDzFromItem=()=>{
        const newKey = mzformItems.length ? Math.max(...mzformItems.map(item => item.key)) + 1 : 1;
        setmzFormItems([...mzformItems, { key: newKey,  rentBeginTime: null,rentEndTime:null}]);
    };
    const newArr=(FormItems)=>{
        let arr=addNewData(FormItems,endDate);
        if (arr.bllo){
            setFormItems(arr.updatedData);
        }else {
            message.warning('不能再添加');
        }
    };
    // 添加物品表单项
    const addwuping = () => {
        const newKey = wupinList.length ? Math.max(...wupinList.map(item => item.key)) + 1 : 1;
        setwupinList([...wupinList, { key: newKey,wupinName: null,wupininfo: null,wupinNuber: ''}]);
    };
    // 获取单元列表
    const getUnitList=()=>{
        UnitService.stutesUnit({house_id:house_id}).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                console.log('单元列表',res);
                setUnitList(res.Data);
            }else {
                message.error(res.Data)
            }
        })
    };
    // 获取房屋列表
    const getHouseList=()=>{
        props.dispatch({
            type:'House/fetch'
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                sethouseList(res.Data);
            }else {
                message.error(res.Data)
            }
        })
    };
    // 监听勾选的单元
    const changeunit=(e)=>{
        CheckCompanyService.companyorUnitList(e.join("|")).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setUnitarrList(e);
            }else {
                message.error(res.Data);
            }
        })
    };
    // 筛选过滤掉的租金跟面积
    const filterzuArea=(item:any)=>{
        const filteredHouses = unitList.filter(house => item.includes(house.id));
        const totalPrice = filteredHouses.reduce((accumulator, currentHouse) => accumulator + currentHouse.price, 0);
        const totalrentable_area = filteredHouses.reduce((accumulator, currentHouse) => accumulator + currentHouse.rentable_area, 0);
        setminzujin(totalPrice);
        setmianji(totalrentable_area);
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
    // 租户证件图片名字
    const oldImgName=(e:string)=>{
        setImgName((prevItems=>[...prevItems,e]))
    };
    // 租户证件图片B64
    const onB64=(e:string)=>{
        // setB64(e);
        setB64((prevItems=>[...prevItems,e]))
    };
    // 删除租户证件图片
    const handleDeletezuhu=(index:number)=>{
        const newImages = [...b64];
        newImages.splice(index, 1);
        setB64(newImages);
        const newB64 = [...documentImages];
        newB64.splice(index, 1);
        setImgName(newB64);
    };
    // 单元图片名字
    const getunitImgName=(e:string)=>{
        setunitImgName((prevItems=>[...prevItems,e]))
    };
    // 单元图片B64
    const getunitB64=(e:string)=>{
        setuintB64((prevItems=>[...prevItems,e]))
    };
    // 删除单元图片
    const handleDeleteunitImg=(index:number)=>{
        const newImages = [...unitImages];
        newImages.splice(index, 1);
        setunitImgName(newImages);
        const newB64 = [...unitB64];
        newB64.splice(index, 1);
        setuintB64(newB64);
    };
    const changedeliveryDate=(_:any,item:any)=>{
        setDeliveryDate(item);
    };
    // 修改物品清单的数量
    const updateMiber=(key, updates)=>{
        setwupinList(prevItems => prevItems.map(item => item.key === key ? { ...item, ...updates } : item));
    };
    // 修改物品清单的标准
    const updatebiaozhun=(key, updates)=>{
        setwupinList(prevItems => prevItems.map(item => item.key === key ? { ...item, ...updates } : item));
    };
    // 修改物品清单的名称
    const updateName=(key, updates)=>{
        setwupinList(prevItems => prevItems.map(item => item.key === key ? { ...item, ...updates } : item));
    };
    // 补充协议图片名字
    const imgNames=(e:string)=>{
        setxyimgnames((prevItems=>[...prevItems,e]))
    };
    // 补充协议图片
    const xyB64=(e:string)=>{
        setxyimgb64((prevItems=>[...prevItems,e]))
    };
    // 删除补充协议图片
    const handleDelete=(index:number)=>{
        const newImages = [...xyimgnames];
        newImages.splice(index, 1);
        setxyimgnames(newImages);
        const newB64 = [...xyimgb64];
        newB64.splice(index, 1);
        setxyimgb64(newB64);
    };
    function findById(array, id) {
        return array.find(item => item.id === id);
    };
    const changecontractType=(e)=>{
        let result=findById(ctyList,e);
        setcontractType(result.templateType);
        setcontractTypeid(result.id);
    };
    const changeDayDate=(_:any,item:any)=>{
        setDayDate(item);
    };
    // 获取合同类型列表
    const getCtyList=()=>{
        contractTypeListServer.contractTypeList().then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setCtyList(res.Data);
            }else {
                message.error(res.Data);
            }
        })
    };

    // 限制开始时间
    const disabledDate = (current) => {
        return (
            current && (current.isBefore(startDate, "day") || current.isAfter(endDate, "day"))
        );
    };
    // 禁用日期函数
    const disabledDate1 = (current) => {
        // 禁用在起始日期之前或在结束日期之后的日期
        return current && (current < dayjs(startDate) || current > dayjs(endDate));
    };
    // 离开当前页面
    const onLikai=()=>{
        history.push('/enter/staff/');
    };
    const changeremark=(e)=>{
        let a=replaceEnglishCommasWithChinese(e.target.value);
        setremark(a);
    };
    // 监听房屋
    const changeHouse=(e)=>{
        let retunName=getHouseNameById(houseList,e);
        sethouseName(retunName);
        sethouse_id(e);
        setunitStutes(false);
        getUnitList();
    };
    // 监听单元输入的名字
    useEffect(() => {
        getUnitList();
    }, [house_id]);
    const changeMoney=(e)=>{
        setzuMoney(e);
        setFormItems(contractsDz(e,formItems));
    };
    const changeKehu=(e)=>{
        getcokuInfo(e);
        const selectedCustomer = kehuList.find(item => item.id === e);
        setSelectedPhone(selectedCustomer.custom_phone);
    };
    const getcokuInfo=(e:number)=>{
        CheckCompanyService.companyorDj(e).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                if (res.Data.houseId>0){
                    setdeposit(res.Data.deposit);
                    setdisb(true);
                    setzuMoney(res.Data.zuMoney)
                    sethouse_id(res.Data.houseId);
                    setunitStutes(true);
                    setUnitarrList(res.Data.unitIds.split("|").map(item => parseInt(item, 10)));
                    let retunName=getHouseNameById(houseList,res.Data.houseId);
                    sethouseName(retunName);

                }else {
                    setdisb(false);
                    setzuMoney(0);
                    sethouse_id(0);
                    setUnitarrList([]);
                    setunitStutes(true);
                    sethouseName('');
                    setunitNamess('');
                    setdeposit(0);
                }
            }
        })
    };
    useEffect(() => {
        filterzuArea(unitarrList);
        setunitNamess(getNamesByIds(unitList,unitarrList))
    }, [unitList,unitarrList]);
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
            <NavBar
                onBack={() => navigate(-1)}
                style={getNavBarStyle()}
            >
                录入合同
            </NavBar>
            <div style={getContainerStyle()}>
                <Form
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 14 }}
                    form={form}
                    layout="horizontal"
                    size={'large'}
                    initialValues={{remark: '',manageFeeRent:0,prepayment:0,decorationCost:0,customCard:'',depositFee:0,dispatchName:'',dispatchCard:'',businessEntity:'',businessScope:'',legalPerson:''}}
                    onFinish={onFinish}
                >
                    <Form.Item >
                        <Form.Item name='contractType'>
                            <Select onChange={changecontractType} placeholder='合同类型'>
                                {
                                    ctyList.map((item:any,index:number)=>{
                                        return(
                                            <Select.Option value={item.id} key={index}>
                                                {item.templateType==1?'定金合同':'正式合同'}
                                            </Select.Option>
                                        )
                                    })
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item>
                            <Input addonBefore="合同编号:" value={numNo} onChange={(e)=>setNumNo(e.target.value)}/>
                        </Form.Item>
                        <Form.Item name='clientId'  rules={[{required: true, message: ''}]}>
                            <Select
                                notFoundContent={false}
                                showSearch
                                placeholder='客户'
                                onChange={changeKehu}
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
                        <Form.Item >
                            <Input addonBefore="手机号:" value={selectedPhone} disabled/>
                        </Form.Item>
                        {
                            contractType==1?<Form.Item>
                                签订日期：<DatePicker onChange={changeDayDate}/>
                            </Form.Item>:''
                        }
                        <Form.Item>
                            <Select placeholder='房屋'
                                    value={house_id}
                                    disabled={disb}
                                    onChange={changeHouse}
                            >
                                <Select.Option value={0} key={-1}>
                                    请选择房屋
                                </Select.Option>
                                {houseList.map((item:any,index:any)=>{
                                    return(
                                        <Select.Option value={item.id} key={index}>
                                            {item.house_name}
                                        </Select.Option>
                                    )
                                })}
                            </Select>
                        </Form.Item>
                        {
                            contractType==2?<Form.Item name='customCard' rules={[{required: true, message: ''}]}>
                                <Input addonBefore="身份证:"/>
                            </Form.Item>:''
                        }
                    </Form.Item>
                    <Form.Item>
                        <Select placeholder='请选择单元,注:选择第一个单元决定合同用途'
                                mode="multiple"
                                value={unitarrList}
                                onChange={changeunit}
                                disabled={unitStutes}
                                showSearch
                                optionFilterProp="children"
                                filterOption={(input, option) => {
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
                    <Form.Item>
                        <InputNumber addonBefore="租金/月(元):" value={zuMoney} onChange={changeMoney} disabled={disb}/>
                        {disb?'':<div style={{fontSize:"12px",color:'#555'}}>租金不能低于{minzujin}元</div>}
                    </Form.Item>
                    <Form.Item>
                        <InputNumber addonBefore="租金押金(元):" value={deposit} onChange={(e)=>setdeposit(e)} disabled={disb}/>
                    </Form.Item>
                    {
                        contractType==2?<>
                            <Form.Item name='manageFee'  rules={[{required: true, message: ''}]}>
                                <InputNumber addonBefore="管理费(元):"/>
                            </Form.Item>
                            <Form.Item  name='depositFee' rules={[{required: true, message: ''}]}>
                                <InputNumber min={0} addonBefore="管理费押金(元):"/>
                            </Form.Item>
                            <Form.Item name='manageFeeRent' rules={[{required: true, message: ''}]}>
                                <InputNumber addonBefore="管理费递增%:" min={0}/>
                            </Form.Item>
                        </>:''
                    }
                    {
                        contractType==2?(
                            <>
                                <Form.Item  name='businessEntity'>
                                    <Input addonBefore="经营主体:"/>
                                </Form.Item>
                                <Form.Item name='businessScope'>
                                    <Input addonBefore="经营范围:"/>
                                </Form.Item>
                                <Form.Item name='legalPerson'>
                                    <Input addonBefore="法定代表人:"/>
                                </Form.Item>
                                <Form.Item>
                                    <InputNumber addonBefore="面积:" value={mianji} disabled/>
                                </Form.Item>
                                <Form.Item name='prepayment' rules={[{required: true, message:'请填写预付费'}]}>
                                    <InputNumber min={0} addonBefore="预付费:"/>
                                </Form.Item>
                                <Form.Item name='dispatchName' >
                                    <Input addonBefore="派遣人:"/>
                                </Form.Item>
                                <Form.Item name='dispatchCard'>
                                    <Input addonBefore="派遣人身份证:"/>
                                </Form.Item>
                                <Form.Item>
                                    交付日：<DatePicker onChange={changedeliveryDate}/>
                                </Form.Item>
                                <Form.Item name='decorationCost' >
                                    <InputNumber addonBefore="装修费用(元):"/>
                                </Form.Item>
                                <Form.Item>
                                   <Space>
                                       起租日<DateRangePicker onDateSelected={changeData}/>
                                   </Space>
                                </Form.Item>
                                {formItems.map((item:any,index:number) => (
                                    <div key={item.id}>
                                        <Form.Item>
                                            <DatePicker.RangePicker
                                                disabled={[true, true]}
                                                disabledDate={disabledDate}
                                                value={item.beginTime&&item.endTime?[dayjs(item.beginTime), dayjs(item.endTime)]:''}
                                                onChange={(dates,data) => updateqizuDate(item.id,{beginTime: data[0], endTime: data[1]})}
                                            />
                                        </Form.Item>
                                        <Form.Item>
                                            <InputNumber
                                                addonBefore="递增%:"
                                                value={item.incremental}
                                                onChange={(value) => updatedz(item.id,{incremental:value})}
                                            />
                                            <span style={{fontSize:"12px",color:"#555"}}>租金:{item.zuMoney}元</span>
                                        </Form.Item>
                                    </div>
                                ))}
                                <Form.Item>
                                    <Space>
                                        <span style={{fontSize:"12px",color:'#555'}}>已选择{summzqDay}天免租期</span>
                                        <InputNumber min={0} onChange={(e)=>setMzq(e)} value={mzq}/>
                                        <Button type="primary" onClick={addDzFromItem} >
                                            <PlusOutlined />
                                        </Button>
                                    </Space>
                                </Form.Item>
                                <Form.Item >
                                    {mzformItems.map((item:any)=>(
                                        <Space style={{ display: 'flex'}} key={item.key}>
                                            <DateRangePicker
                                                disabledDate={disabledDate1}
                                                onDateSelected={(start,end) => updatemz(item.key,{rentBeginTime: start, rentEndTime: end})}/>
                                            <Button onClick={() => removedzFormItemByKey(item.key)} type="link" style={{ marginLeft: 'auto' }}>
                                                删除
                                            </Button>
                                        </Space>
                                    ))
                                    }
                                </Form.Item>
                                <Form.Item style={{display:'flex'}}>
                                    <Space size='large'>
                                        <Form.Item label='单元平面图'  >
                                            <NoyasuoImgCmp onImageUpload={getunitImgName} oldBase64={getunitB64}/>
                                            <Space style={{display:'flex',flexWrap:'wrap',marginTop:'25px'}}>
                                                {unitB64.length>0?unitB64.map((item:any,index:number)=>{
                                                    return(
                                                        <div key={index} style={{ display: 'flex', alignItems: 'center', position: 'relative',marginLeft:'20px'}}>
                                                            <Image src={item} style={{ width: '80px', height: '80px' }} />
                                                            <Button
                                                                type="primary"
                                                                danger
                                                                onClick={() => handleDeleteunitImg(index)}
                                                                style={{
                                                                    position: 'absolute',
                                                                    top: '0',
                                                                    left: '0',
                                                                    zIndex: 1,
                                                                    padding: '2px 4px',
                                                                    transform: 'translate(-50%, -50%)',
                                                                }}
                                                            >
                                                                删除
                                                            </Button>
                                                        </div>
                                                    )
                                                }):''}
                                            </Space>
                                        </Form.Item>
                                        <Form.Item label='租户证件图片' >
                                            <NoyasuoImgCmp onImageUpload={oldImgName} oldBase64={onB64}/>
                                            <Space style={{display:'flex',flexWrap:'wrap',marginTop:'25px'}}>
                                                {b64.length>0?b64.map((item:any,index:number)=>{
                                                    return(
                                                        <div key={index} style={{ display: 'flex', alignItems: 'center', position: 'relative',marginLeft:'20px'}}>
                                                            <Image src={item} style={{ width: '80px', height: '80px' }} />
                                                            <Button
                                                                type="primary"
                                                                danger
                                                                onClick={() => handleDeletezuhu(index)}
                                                                style={{
                                                                    position: 'absolute',
                                                                    top: '0',
                                                                    left: '0',
                                                                    zIndex: 1,
                                                                    padding: '2px 4px',
                                                                    transform: 'translate(-50%, -50%)',
                                                                }}
                                                            >
                                                                删除
                                                            </Button>
                                                        </div>
                                                    )
                                                }):''}
                                            </Space>
                                            {/*<div style={{marginTop:'25px'}}>*/}
                                            {/*    {b64?<Image src={b64} style={{width:'80px',height:'80px'}}/>:''}*/}
                                            {/*</div>*/}
                                        </Form.Item>
                                        <Form.Item label='补充协议图片' >
                                            <ImageUploader onImageUpload={imgNames} oldBase64={xyB64}/>
                                            <Space style={{display:'flex',flexWrap:'wrap'}}>
                                                <Space style={{display:'flex',flexWrap:'wrap',marginTop:'25px'}}>
                                                    {xyimgb64.length>0?xyimgb64.map((item:any,index:number)=>{
                                                        return(
                                                            <div key={index} style={{ display: 'flex', alignItems: 'center', position: 'relative',marginLeft:'20px'}}>
                                                                <Image src={item} style={{ width: '80px', height: '80px' }} />
                                                                <Button
                                                                    type="primary"
                                                                    danger
                                                                    onClick={() => handleDelete(index)}
                                                                    style={{
                                                                        position: 'absolute',
                                                                        top: '0',
                                                                        left: '0',
                                                                        zIndex: 1,
                                                                        padding: '2px 4px',
                                                                        transform: 'translate(-50%, -50%)',
                                                                    }}
                                                                >
                                                                    删除
                                                                </Button>
                                                            </div>
                                                        )
                                                    }):''}
                                                </Space>
                                            </Space>
                                        </Form.Item>
                                    </Space>
                                </Form.Item>
                                <Form.Item style={{display:'flex'}}>
                                    <Space size='large'>
                                        <Form.Item >
                                            <Button type="primary" onClick={addwuping}>
                                                新增物品清单
                                            </Button>
                                            {wupinList.map((item:any,index:number) => (
                                                <div style={{ display: 'flex'}} key={item.key}>
                                                    <Form.Item label="物品名称">
                                                        <Input
                                                            value={item.wupinName}
                                                            onChange={(value) => updateName(item.key,{wupinName:value.target.value})}
                                                        />
                                                    </Form.Item>
                                                    <Form.Item label="交付标准">
                                                        <Input
                                                            value={item.wupininfo}
                                                            onChange={(value) => updatebiaozhun(item.key,{wupininfo:value.target.value})}
                                                        />
                                                    </Form.Item>
                                                    <Form.Item label="数量">
                                                        <Input
                                                            value={item.wupinNuber}
                                                            onChange={(value) => updateMiber(item.key,{wupinNuber:value.target.value})}
                                                        />
                                                    </Form.Item>
                                                    <Form.Item>
                                                        <Button onClick={() => removeqingdan(item.key)} type="link" style={{ marginLeft: 'auto' }}>
                                                            删除
                                                        </Button>
                                                    </Form.Item>
                                                </div>
                                            ))}
                                        </Form.Item>
                                    </Space>
                                </Form.Item>
                                <Form.Item style={{display:'flex'}}>
                                    <Form.Item label='补充协议' name='remark'>
                                        <Input.TextArea value={remark} onChange={changeremark}/>
                                    </Form.Item>
                                </Form.Item>
                            </>
                        ):''
                    }
                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                确定
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </div>
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        CheckCompanyList: state.CheckCompany.list,
        UnitList: state.Unit.list,
    }
};
export default connect(mapStateToProps) (AddStaff)