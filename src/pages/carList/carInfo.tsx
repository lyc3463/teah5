import {connect} from "umi";
import * as CarManageService from '@/services/carManage';
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {EventMgr} from "@/Event/EventMgr";
import {info_event} from "@/Event/EventEnum";
import {Button, Form, Image, Input, InputNumber, message, Spin, Tag} from "antd";
import {useEffect, useRef, useState} from "react";
import {history} from "@@/core/history";
import {NavBar} from "antd-mobile";

const  CarInfo=(props)=>{
    const [spinning,setspinning]=useState(false);
    const formRef=useRef();
    const [carNoColor,setcarNoColor]=useState('');// 车辆颜色
    const [carType,setcarType]=useState('');// 车辆类型
    const [driverLicenseBase64,setdriverLicenseBase64]=useState('');//驾驶证
    const [drivingLicenseBase64,setdrivingLicenseBase64]=useState('');//行驶证
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    const getCarInfo=(e:string)=>{
        setspinning(true);
        CarManageService.one(e).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                formRef.current.setFieldsValue(res.Data);
                setspinning(false);
                setdriverLicenseBase64(res.Data.driverLicenseBase64);
                setdrivingLicenseBase64(res.Data.drivingLicenseBase64);
                setcarNoColor(res.Data.carNoColor);
                setcarType(res.Data.carType);
            }else {
                message.error(res.Data);
                setspinning(false);
            }
        })
    };
    const colorText=(item)=>{
        let consumptionTypeText;
        switch (item) {
            case 'BLUE':
                consumptionTypeText ='蓝色';
                break;
            case 'GREEN':
                consumptionTypeText = '绿色';
                break;
            case 'WHITE':
                consumptionTypeText = "白色";
                break;
            case 'YELLOW':
                consumptionTypeText ='黄色';
                break;
            case 'BLACK':
                consumptionTypeText = '黑色';
                break;
            default:
                consumptionTypeText ='其余颜色';
        }
        return (
            consumptionTypeText
        );
    };
    const carTypeList=(item)=>{
        let consumptionTypeText;
        switch (item) {
            case 'CAR':
                consumptionTypeText = '小车';
                break;
            case 'LARGE':
                consumptionTypeText = '大车';
                break;
            case 'EXTRA_LARGE':
                consumptionTypeText = '超大车';
                break;
            default:
                consumptionTypeText = '其余类型';
        }
        return (
            consumptionTypeText
        );
    };
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        getCarInfo(id);
    }, []);
    const getContainerStyle = () => {
        return {
            padding: windowWidth <= 480 ? '12px' : '16px',
            maxWidth: windowWidth <= 480 ? '100%' : '600px',
            margin: '0 auto'
        };
    };
    const getNavBarStyle = () => {
        return {
            '--height': windowWidth <= 480 ? '40px' : '48px',
            '--border-bottom': 'none',
            '--background-color': '#fff',
            '--font-size': windowWidth <= 480 ? '16px' : '18px'
        };
    };
    const getFormItemStyle = () => {
        return {
            '--label-width': windowWidth <= 480 ? '80px' : '100px',
            '--label-font-size': windowWidth <= 480 ? '14px' : '16px',
            '--input-font-size': windowWidth <= 480 ? '14px' : '16px',
            marginBottom: windowWidth <= 480 ? '12px' : '16px'
        };
    };
    const getButtonStyle = () => {
        return {
            '--font-size': windowWidth <= 480 ? '14px' : '16px',
            marginTop: windowWidth <= 480 ? '12px' : '16px'
        };
    };
    return(
        <Spin spinning={spinning}>
            <div style={getContainerStyle()}>
                <NavBar
                    onBack={() => history.back()}
                    style={getNavBarStyle()}
                >
                    车辆详情
                </NavBar>
                <Form
                    ref={formRef}
                    initialValues={{remark:'',minimum_recharge:1}}
                    layout="horizontal"
                    size={'large'}
                    style={getButtonStyle()}
                >
                    <Form.Item name='carNo'>
                        <Input addonBefore="车牌:"/>
                    </Form.Item>
                    <Form.Item>
                        <Input addonBefore="颜色:" value={colorText(carNoColor)}/>
                    </Form.Item>
                    <Form.Item>
                        <Input  value={colorText(carType)}/>
                    </Form.Item>
                    <Form.Item>
                        驾驶证:<Image src={driverLicenseBase64} style={{height:'80px',width:'80px'}}/>
                    </Form.Item>
                    <Form.Item>
                        行驶证:<Image src={drivingLicenseBase64} style={{height:'80px',width:'80px'}}/>
                    </Form.Item>
                </Form>
            </div>
        </Spin>
    )
}
export default connect() (CarInfo)