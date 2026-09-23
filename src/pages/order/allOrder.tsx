import {useEffect, useState} from "react";
import * as OrderServer from '@/services/order';
import {StaticInfo} from "@/StaticInfo";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {Button, message, Space, Tag} from "antd";
import {joinUnitNames} from "@/utils/OpenTool";
import {NavBar} from "antd-mobile";
import {history} from "@@/core/history";
import dayjs from "dayjs";
const AllOrder = () => {
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    const [name,setname]=useState('');
    const [state,setstate]=useState(0);
    const [phone,setPhone]=useState('');
    // const [userId,setUserId]=useState(StaticInfo.userId);
    const [userId,setUserId]=useState(0);
    const [startDate,setstartDate]=useState('2000-01-01');
    const [endDate,setendDate]=useState('2099-01-01');
    const [loading, setLoading] = useState(false);
    const [isOpen,setIsOpen]=useState(false);
    const [uid,setUid]=useState(0);
    const [list,setList]=useState([]);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const getList=()=>{
      OrderServer.fetch(page,name,phone,state,userId,startDate,endDate,pageSize).then((res:TypeErrorCode)=>{
          if (res.ErrorCode===0){
              console.log('res',res);
              setList(res.Data);
          }else {
              message.error(res.Data);
          }
      })
    };
    useEffect(() => {
        getList();
    }, []);
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
    const getContainerStyle = () => {
        return {
            padding: windowWidth <= 480 ? '1rem' : '2rem',
            maxWidth: windowWidth <= 480 ? '100%' : '1200px',
            margin: '0 auto',
            backgroundColor: '#f5f6fa',
            minHeight: '90vh'
        };
    };
    const getSearchContainerStyle = () => {
        return {
            marginBottom: windowWidth <= 480 ? '1rem' : '2rem',
            padding: windowWidth <= 480 ? '0.8rem' : '1.6rem',
            backgroundColor: '#fff',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
            display: 'flex',
            flexDirection: windowWidth <= 480 ? 'column' : 'row',
            gap: windowWidth <= 480 ? '1rem' : '2rem'
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
    const getButtonStyle = () => {
        return {
            marginTop: windowWidth <= 480 ? '0.6rem' : '1.2rem',
            borderRadius: '8px',
            textTransform: 'capitalize'
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
    const getInputStyle = () => {
        return {
            width: windowWidth <= 480 ? '100%' : 'auto',
            borderRadius: '8px',
            borderColor: '#e0e0e0'
        };
    };
    const getSearchButtonStyle = () => {
        return {
            borderRadius: '8px',
            backgroundColor: '#1890ff',
            color: '#fff',
            transition: 'background-color 0.3s ease',
            '&:hover': {
                backgroundColor: '#40a9ff'
            }
        };
    };
    return (
         <div style={getContainerStyle()}>

             <NavBar
                 onBack={() => history.back()}
                 style={{
                     '--height': '48px',
                     '--border-bottom': 'none',
                     '--background-color': '#fff'
                 }}
             />
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
                    <p style={getTextStyle()}>日期:{dayjs(item.created).format('YYYY-MM-DD')}</p>
                    <p style={getTextStyle()}>房屋:{item.house_name}</p>
                    <p style={getTextStyle()}>单元: {joinUnitNames(item.unitList)}</p>
                    <p style={getTextStyle()}>报修类型: {item.repairGood}</p>
                    <p style={getTextStyle()}>报修内容: {item.repair_content}</p>
                    <p style={getTextStyle()}>租户名称: {item.tenant_name}</p>
                    <p style={getTextStyle()}>租户手机号: {item.tenant_phone}</p>
                    <p style={getTextStyle()}>状态:{item.repair_status==1?<Tag color='red'>未处理</Tag>:<Tag color='green'>已审核</Tag>}</p>
                </div>
            ))}
        </div>
    );
}
export default AllOrder