import './homePage.less';
import {Button, message, Space, Table} from "antd";
import {useEffect, useState} from "react";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {connect,history} from "umi";
import {filtermessageData} from "@/utils/OpenTool";
import baseMapimg from "../../public/staticfiles/底图.png";
import {StaticInfo} from "@/StaticInfo";
const Order = (props) => {
    const [list,setList]=useState([]);
    const [listLength,setListLength]=useState(0);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const columns = [
        {
            title: '内容',
            dataIndex: 'tmContent',
            key: 'tmContent',
            align:'center'
        },
        {
            title: '操作',
            dataIndex: 'x',
            key: 'x',
            align:'center',
            render: (text: any, record: any) => {
                return <Space>
                    <Button type='primary' onClick={()=>toHandle(record.tmType)}>前往处理</Button>
                </Space>;
            }
        }
    ];
    const toHandle=(e)=>{
        if (e==3){
            history.push('/carList')
        }else if (e==1){
            history.push('/invoiceLookUp')
        }else if (e==2){
            history.push('/invoice')
        }else if (e==4){
            history.push('/changeName')
        }else if (e==5){
            history.push('/changeRenew')
        }else if (e==6){
            history.push('/changeRenewOut')
        }else if (e==7){
            history.push('/changePreferential')
        }else if (e==8){
            history.push('/changePreferentialOut')
        }else if (e==9){
            history.push('/check/checkStaff')
        }else  if (e==10) {
            history.push('/fault');
        }else if (e==12) {
            history.push('/order');
        }else if (e==14) {
            history.push('/releaseSlip');
        }else if (e==15) {
            history.push('/renovationList');
        }else {
            message.warning('请前往后台处理，此功能暂未开放');
        }
    };
    useEffect(() => {
        getNotificationList();
    }, []);
    const getNotificationList=()=>{
        props.dispatch({
            type: 'NotificationList/fetch',
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                let isTask=StaticInfo.isTask.split("|").map(Number);
                let filteredData=filterDataByType(res.Data,isTask);
                let newarr=filtermessageData(filteredData);
                setList(newarr);
                if (newarr.length>0){
                    setListLength(newarr.length);
                }else {
                    setListLength(0);
                }
            }else {
                message.error(res.ErrorCode + res.Data);
            }
        })
    };
    const filterDataByType=(dataArray, filterArray)=>{
        if (!Array.isArray(dataArray) || !Array.isArray(filterArray) ||
            dataArray.length === 0 || filterArray.length === 0) {
            return [];
        }

        // 过滤数据
        return dataArray.filter(item => filterArray.includes(item.tmType));
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
    const getContainerStyle = () => {
        return {
            padding: windowWidth <= 480 ? '1rem' : '2rem',
            maxWidth: windowWidth <= 480 ? '100%' : '1200px',
            margin: '0 auto',
            backgroundColor: '#f5f6fa',
            minHeight: '70vh',
            overflowY: 'auto'
        };
    };
    // 新增：背景容器样式
    const getBackgroundContainerStyle = () => {
        return {
            backgroundImage: `url(${baseMapimg})`,
            backgroundSize: 'cover', // 背景图覆盖容器
            backgroundPosition: 'center', // 背景图居中
            backgroundRepeat: 'no-repeat', // 不重复
            padding: '20px 0', // 内边距，避免内容紧贴边缘
        };
    };
    const getTitleStyle = () => {
        return {
            fontSize: windowWidth <= 480 ? '20px' : '24px',
            marginBottom: windowWidth <= 480 ? '8px' : '12px',
            textAlign: 'center'
        };
    };
    return (
        <div className="page">
            <div style={getBackgroundContainerStyle()}>
                <h1 className="title" style={getTitleStyle()}>消息</h1>
            </div>
            <div style={getContainerStyle()}>
                <Table
                    columns={columns}
                    rowKey={(columns) => columns.id}
                    dataSource={list}
                    pagination={false}
                    size='small'
                    scroll={{y:'65vh',x:'100%'}}
                    rowClassName={(record, index) =>
                        index % 2 === 1 ? 'tbodd' : 'tbeven'
                    }
                />
            </div>
        </div>
    )
};
export default connect() (Order);