import {useEffect, useState} from "react";
import {connect} from "umi";
import {Button, DatePicker, Input, InputNumber, List, message, Pagination, Space, Spin, Table, Tag} from "antd";
import * as FinanceService from "@/services/finance";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import dayjs from "dayjs";
import * as HireService from "@/services/hire";
import {StaticInfo} from "@/StaticInfo";
import {NavBar} from "antd-mobile";
import {history} from "@@/core/history";

const Hire=(props:any)=>{
    const [spinning,setspinning]=useState(false);
    const [name,setName]=useState('');
    const [beginRents,setBeginRents]=useState(0);
    const [endRents,setEndRents]=useState(9999999999);
    const [uqx,setUqx]=useState([]);
    const [floor_area,setfloor_area]=useState(0);// 建筑面积总和
    const [rentable_area,setrentable_area]=useState(0);// 可租面积总和
    const [residue_add_area,setresidue_add_area]=useState(0);// 可增加面积总和
    const [unitCount,setunitCount]=useState(0);// 单元数量总和
    const [rentable_areaSum,setrentable_areaSum]=useState(0);// 已租面积总和
    const [priceSum,setpriceSum]=useState(0);// 已租总和
    const [manageFee,setmanageFee]=useState(0);// 已租管理费总和
    const [tenantCount,settenantCount]=useState(0);// 租户数量总和
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const calculateSums=(sumDate)=>{
        // 初始化四个求和变量
        let floor_area = 0;
        let rentable_area = 0;
        let residue_add_area = 0;
        let unitCount = 0;
        let rentable_areaSum = 0;
        let priceSum = 0;
        let manageFee = 0;
        let tenantCount = 0;
        // 遍历数组，累加每个属性的值
        sumDate.map(transaction => {
            floor_area += transaction.floor_area || 0; // 使用||0确保未定义或null值不会破坏计算
            rentable_area += transaction.rentable_area || 0;
            residue_add_area += transaction.residue_add_area || 0;
            unitCount += transaction.unitCount || 0;
            rentable_areaSum += transaction.rentable_areaSum || 0;
            priceSum += transaction.priceSum || 0;
            manageFee += transaction.manageFee || 0;
            tenantCount += transaction.tenantCount || 0;
        });
        // 返回一个对象，包含四个求和结果
        return {
            floor_area: floor_area.toFixed(2)*1,
            rentable_area: rentable_area.toFixed(2)*1,
            residue_add_area: residue_add_area.toFixed(2)*1,
            unitCount: unitCount.toFixed(2)*1,
            rentable_areaSum: rentable_areaSum.toFixed(2)*1,
            priceSum: priceSum.toFixed(2)*1,
            manageFee: manageFee.toFixed(2)*1,
            tenantCount: tenantCount.toFixed(2)*1
        };
    }
    useEffect(() => {
        logFenye();
        let uq=StaticInfo.uqx.split('');
        setUqx(uq);
    }, []);
    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"Hire/fetch",
            payload:{name,beginRents,endRents}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                let sum=calculateSums(res.Data);
                setfloor_area(sum.floor_area);
                setrentable_area(sum.rentable_area);
                setresidue_add_area(sum.residue_add_area);
                setunitCount(sum.unitCount);
                setrentable_areaSum(sum.rentable_areaSum);
                setpriceSum(sum.priceSum);
                setmanageFee(sum.manageFee);
                settenantCount(sum.tenantCount);
            }
        })
    };
    // 搜索按钮
    const shousuo=()=>{
        logFenye()
    };
    const changeBeginRents=(e)=>{
        if (e){
            setBeginRents(e);
        }else {
            setBeginRents(0);
        }
    };
    const changeEndRents=(e)=>{
        if (e<beginRents){
            setEndRents(beginRents);
        }else if(e>0){
            setEndRents(e);
        }else {
            setEndRents(999999);
        }
    };
    const getContainerStyle = () => {
        return {
            padding: windowWidth <= 480 ? '1rem' : '2rem',
            maxWidth: windowWidth <= 480 ? '100%' : '1200px',
            margin: '0 auto',
            backgroundColor: '#f5f6fa',
            minHeight: '90vh'
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
                    出租报表
                </NavBar>
                <div style={{ display: 'flex', flexDirection: 'column', height: '80vh', overflowY: 'auto' }}>
                    {props.HireList&&props.HireList.length>0?props.HireList.map((item:any)=>(
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
                            <div style={getTextStyle()}>房屋名称: {item.house_name}</div>
                            <div style={getTextStyle()}>总楼层: {item.floors}</div>
                            <div style={getTextStyle()}>建筑面积㎡: {item.floor_area.toFixed(2)}</div>
                            <div style={getTextStyle()}>可租面积㎡: {item.rentable_area.toFixed(2)}</div>
                            <div style={getTextStyle()}>剩余可增加面积㎡: {item.residue_add_area.toFixed(2)}</div>
                            <div style={getTextStyle()}>单元数量(间): {item.unitCount}</div>
                            <div style={getTextStyle()}>已租面积㎡: {item.rentable_areaSum.toFixed(2)}</div>
                            <div style={getTextStyle()}>已租租金元: {item.priceSum.toFixed(2)}元</div>
                            <div style={getTextStyle()}>已租管理费: {item.manageFee.toFixed(2)}元</div>
                            <div style={getTextStyle()}>租户数量: {item.tenantCount}</div>
                            <div style={getTextStyle()}>平均单价: {
                                (item.rentable_areaSum!==0)?(item.priceSum/item.rentable_areaSum).toFixed(2):0
                            }</div>
                        </div>
                    )):''}
                </div>
                <div style={{display:'flex',justifyContent:'space-around',marginTop:'5px',flexWrap:'wrap'}}>
                    {/*<div>建筑面积:{floor_area.toFixed(2)}㎡</div>*/}
                    <div>可租面积:{rentable_area.toFixed(2)}㎡</div>
                    {/*<div>可增加面积:{residue_add_area.toFixed(2)}㎡</div>*/}
                    {/*<div>单元数量:{unitCount.toFixed(2)}间</div>*/}
                    <div>已租面积:{rentable_areaSum.toFixed(2)}㎡</div>
                    <div>已租租金:{priceSum.toFixed(2)}元</div>
                    <div>已租管理费:{manageFee.toFixed(2)}元</div>
                    {/*<div>租户:{tenantCount.toFixed(2)}个</div>*/}
                </div>
            </div>
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        HireList: state.Hire.list,
    }
};
export default connect(mapStateToProps) (Hire)