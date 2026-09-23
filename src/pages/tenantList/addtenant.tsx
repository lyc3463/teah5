import {Button, DatePicker, Form, Input, message, Select, Space, Spin, Tooltip} from "antd";
import {useEffect, useState} from "react";
import {connect, history,useNavigate} from "umi";
import {getCurrentDate, phonePattern,replaceEnglishCommasWithChinese} from "@/utils/OpenTool";
import {NavBar} from 'antd-mobile'
import dayjs from "dayjs";
const tailLayout = {
    wrapperCol: { offset: 4 },
};

const Addtenant=(props:any)=>{
    const navigate=useNavigate();
    const [form] = Form.useForm();
    const [custom_date, setCustom_date] = useState(getCurrentDate());
    const [windowWidth, setWindowWidth] = useState(window.innerWidth); // 新增：窗口宽度状态
    // 来访渠道
    const [visitor_channels,setvisitor_channels]=useState(1);
    // 客户类别
    const [visitor_type,setvisitor_type]=useState(1);
    // 租赁原因
    const [reason_lease,setreason_lease]=useState(1);
    // 需求面积
    const [required_area,setrequired_area]=useState(1);
    // 监听产品需求
    const [demands,setdemands]=useState(1);
    const [disp,setDisp]=useState(false);
    const [remark,setremarks]=useState('');
    const [spinning,setspinning]=useState(false);
    // 客户名字
    const [custom_name,setcustom_name]=useState('');
    // 公司名称
    const [company_name,setcompany_name]=useState('');
    // 行业
    const [industry,setindustry]=useState('');
    // 目前办公区域
    const [office_area,setoffice_area]=useState('');
    // 中介公司名称
    const [intermediary_company,setintermediary_company]=useState('');
    // 中介联系人
    const [intermediary_name,setintermediary_name]=useState('');
    // 中介联系电话
    const [intermediary_phone,setintermediary_phone]=useState('');
    // 联系方式
    const [phone,setPhone]=useState('');
    // 访客职位
    const [visitor_position,setvisitor_position]=useState('');
    useEffect(() => {
        setCustom_date(getCurrentDate());
    }, []);
    const onFinish=async ()=>{
        setDisp(true);
        setspinning(true);
        let res=await props.dispatch({
            type:'Custom/add',
            payload:{visitor_position,phone,intermediary_phone,intermediary_name,intermediary_company,office_area,custom_date,visitor_channels,visitor_type,reason_lease,required_area,demands,remark,custom_name,company_name,industry}
        });
        if (res.ErrorCode==0){
            setDisp(false);
            setspinning(false);
            message.success('添加成功')
            history.back()
        }else {
            setDisp(false);
            setspinning(false);
            message.error(res.Data);
        }
    }
    const getDataInfo=(_,value)=>{
        setCustom_date(value)
    };
    // 监听来访渠道
    const changechannels=(e)=>{
        setvisitor_channels(e);
    };
    // 监听客户类别
    const  changevisitor_type=(e)=>{
        setvisitor_type(e);
    };
    // 监听客户类别
    const changereason_lease=(e)=>{
        setreason_lease(e);
    };
    // 监听需求面积
    const changerequired_area=(e)=>{
        setrequired_area(e);
    };
    // 监听产品需求
    const changedemands=(e)=>{
        setdemands(e);
    };
    // 监听输入的文本
    const changeremarks=(e)=>{
        let a=replaceEnglishCommasWithChinese(e.target.value);
        setremarks(a);
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

    // 新增：响应式容器样式（参考water/index.tsx实现）
    const getContainerStyle = () => {
        return {
            padding: windowWidth <= 480 ? '12px' : '20px',
            maxWidth: windowWidth <= 480 ? '100%' : '800px',
            margin: '0 auto',
            backgroundColor: '#fff',
            minHeight: '100vh'
        };
    };

    // 新增：导航栏样式（复用water/index.tsx的实现）
    const getNavBarStyle = () => {
        return {
            '--height': windowWidth <= 480 ? '40px' : '48px',
            '--border-bottom': 'none',
            '--background-color': '#fff',
            '--font-size': windowWidth <= 480 ? '16px' : '18px'
        };
    };

    // 优化：表单字段容器样式（垂直布局）
    const getFormItemStyle = () => {
        return {
            marginBottom: windowWidth <= 480 ? '12px' : '16px',
            width: '100%'
        };
    };

    // 优化：标签样式（固定宽度确保对齐）
    const getLabelStyle = () => {
        return {
            width: windowWidth <= 480 ? '80px' : '100px',
            fontSize: windowWidth <= 480 ? '14px' : '16px',
            color: '#333',
            textAlign: 'left'
        };
    };

    // 优化：输入框容器样式（占满剩余宽度）
    const getControlContainerStyle = () => {
        return {
            flex: 1,
            minWidth: 0 // 解决flex子元素溢出问题
        };
    };
    return(
        <Spin spinning={spinning}>
            <div style={getContainerStyle()}>
                <NavBar
                    onBack={() => history.back()}
                    style={getNavBarStyle()}
                >
                    添加客户
                </NavBar>

                {/* 重构：使用antd-mobile Form组件，优化移动端布局 */}
                <Form
                    form={form}
                    initialValues={{ /* 保留原有初始值 */ }}
                    layout="horizontal" // 水平布局（标签+输入框一行）
                    onFinish={onFinish}
                    style={{ marginTop: '1rem' }}
                >
                    <Space direction="vertical" style={{ width: '100%' }}>
                        {/* 登记日期行 */}
                        <div style={getFormItemStyle()}>
                            <Space style={{ width: '100%' }}>
                                <div style={getLabelStyle()}>登记日期</div>
                                <div style={getControlContainerStyle()}>
                                    <DatePicker
                                        value={dayjs(custom_date)}
                                        onChange={(date) => date && setCustom_date(date.format('YYYY-MM-DD'))}
                                        format="YYYY-MM-DD"
                                    />
                                </div>
                            </Space>
                        </div>

                        {/* 客户姓名行 */}
                        <div style={getFormItemStyle()}>
                            <Space style={{ width: '100%' }}>
                                <div style={getLabelStyle()}>客户姓名</div>
                                <div style={getControlContainerStyle()}>
                                    <Tooltip title={custom_name}>
                                        <Input
                                            placeholder="请输入客户姓名"
                                            onChange={(e) => setcustom_name(e.target.value)}
                                        />
                                    </Tooltip>
                                </div>
                            </Space>
                        </div>
                        {/* 联系方式行 */}
                        <div style={getFormItemStyle()}>
                            <Space style={{ width: '100%' }}>
                                <div style={getLabelStyle()}>联系方式</div>
                                <div style={getControlContainerStyle()}>
                                    <Input
                                        placeholder="请输入手机号"
                                        onChange={(e)=>setPhone(e.target.value)}
                                    />
                                </div>
                            </Space>
                        </div>
                        {/*访客职位*/}
                        <div style={getFormItemStyle()}>
                            <Space style={{ width: '100%' }}>
                                <div style={getLabelStyle()}>访客职位</div>
                                <div style={getControlContainerStyle()}>
                                    <Input
                                        placeholder="访客职位"
                                        onChange={(e)=>setvisitor_position(e.target.value)}
                                    />
                                </div>
                            </Space>
                        </div>
                        {/* 来访渠道行 */}
                        <div style={getFormItemStyle()}>
                            <Space style={{ width: '100%' }}>
                                <div style={getLabelStyle()}>来访渠道</div>
                                <div style={getControlContainerStyle()}>
                                    <Select
                                        value={visitor_channels}
                                        onChange={changechannels}
                                        options={[
                                            { label: '中介', value: 1 },
                                            { label: '自来', value: 2 },
                                            { label: '全民营销', value: 3 },
                                            { label: '线上', value: 4 },
                                        ]}
                                    />
                                </div>
                            </Space>
                        </div>
                        {/* 公司名称 */}
                        <div style={getFormItemStyle()}>
                            <Space style={{ width: '100%' }}>
                                <div style={getLabelStyle()}>公司名称</div>
                                <div style={getControlContainerStyle()}>
                                    <Input placeholder='请填写公司' onChange={(e)=>setcompany_name(e.target.value)}/>
                                </div>
                            </Space>
                        </div>
                        {/* 行业 */}
                        <div style={getFormItemStyle()}>
                            <Space style={{ width: '100%' }}>
                                <div style={getLabelStyle()}>行业</div>
                                <div style={getControlContainerStyle()}>
                                    <Input placeholder='行业' onChange={(e)=>setindustry(e.target.value)}/>
                                </div>
                            </Space>
                        </div>
                        {/* 需求面积 */}
                        <div style={getFormItemStyle()}>
                            <Space style={{ width: '100%' }}>
                                <div style={getLabelStyle()}>需求面积</div>
                                <div style={getControlContainerStyle()}>
                                    <Select
                                        value={required_area}
                                        onChange={changerequired_area}
                                        options={[
                                            { label: '100以下', value: 1 },
                                            { label: '101-200', value: 2 },
                                            { label: '201-350', value: 3 },
                                            { label: '351-500', value: 4 },
                                            { label: '501-1000', value: 5 },
                                            { label: '1000以上', value: 6 },
                                        ]}
                                    />
                                </div>
                            </Space>
                        </div>
                        {/* 原因 */}
                        <div style={getFormItemStyle()}>
                            <Space style={{ width: '100%' }}>
                                <div style={getLabelStyle()}>租赁原因</div>
                                <div style={getControlContainerStyle()}>
                                    <Select
                                        value={reason_lease}
                                        onChange={changereason_lease}
                                        options={[
                                            { label: '首次经营', value: 1 },
                                            { label: '平迁', value: 2 },
                                            { label: '合同到期', value: 3 },
                                            { label: '扩大', value: 4 },
                                            { label: '缩小', value: 5 },
                                            { label: '开设分点', value: 6 },
                                        ]}
                                    />
                                </div>
                            </Space>
                        </div>
                        {/* 产品需求 */}
                        <div style={getFormItemStyle()}>
                            <Space style={{ width: '100%' }}>
                                <div style={getLabelStyle()}>产品需求</div>
                                <div style={getControlContainerStyle()}>
                                    <Select
                                        value={demands}
                                        onChange={changedemands}
                                        options={[
                                            { label: '精装修', value: 1 },
                                            { label: '简装', value: 2 },
                                            { label: '毛坯', value: 3 },
                                        ]}
                                    />
                                </div>
                            </Space>
                        </div>
                        {/* 目前办公室 */}
                        <div style={getFormItemStyle()}>
                            <Space style={{ width: '100%' }}>
                                <div style={getLabelStyle()}>目前办公区域</div>
                                <div style={getControlContainerStyle()}>
                                    <Input placeholder='目前办公区域' onChange={(e)=>setoffice_area(e.target.value)}/>
                                </div>
                            </Space>
                        </div>
                        {/* 备注 */}
                        <div style={getFormItemStyle()}>
                            <Space style={{ width: '100%' }}>
                                <div style={getLabelStyle()}>备注</div>
                                <div style={getControlContainerStyle()}>
                                    <Input placeholder='备注' value={remark} onChange={changeremarks}/>
                                </div>
                            </Space>
                        </div>
                        {
                            visitor_channels==1?
                                <>
                                    <div style={getFormItemStyle()}>
                                        <Space style={{ width: '100%' }}>
                                            <div style={getLabelStyle()}>中介公司名称</div>
                                            <div style={getControlContainerStyle()}>
                                                <Input placeholder='中介公司名称' onChange={(e)=>setintermediary_company(e.target.value)}/>
                                            </div>
                                        </Space>
                                    </div>
                                    <div style={getFormItemStyle()}>
                                        <Space style={{ width: '100%' }}>
                                            <div style={getLabelStyle()}>中介联系人</div>
                                            <div style={getControlContainerStyle()}>
                                                <Input placeholder='中介联系人' onChange={(e)=>setintermediary_name(e.target.value)}/>
                                            </div>
                                        </Space>
                                    </div>
                                    <div style={getFormItemStyle()}>
                                        <Space style={{ width: '100%' }}>
                                            <div style={getLabelStyle()}>中介联系电话</div>
                                            <div style={getControlContainerStyle()}>
                                                <Input placeholder='中介联系电话' onChange={(e)=>setintermediary_phone(e.target.value)}/>
                                            </div>
                                        </Space>
                                    </div>
                                </>
                            :null
                        }
                        {/* 底部按钮区域（优化为移动端全屏样式） */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '10px',
                            marginTop: '20px',
                            padding: '0 10px'
                        }}>
                            <Button
                                type="primary"
                                htmlType="submit"
                                disabled={disp}
                                style={{ flex: 1 }} // 按钮占满宽度
                            >
                                添加
                            </Button>
                            <Button
                                onClick={() => history.back()}
                                style={{ flex: 1 }} // 按钮占满宽度
                            >
                                返回
                            </Button>
                        </div>
                    </Space>
                </Form>
            </div>
        </Spin>
    )
}
export default connect() (Addtenant)