import {QRCodeCanvas} from 'qrcode.react';
import {useEffect, useState} from "react";
import * as InviteService from '@/services/invite';
import {getTime} from "@/utils/OpenTool";
import dayjs from "dayjs";
import {NavBar, Toast} from "antd-mobile";
import {history} from "umi";
import {StaticInfo} from "@/StaticInfo";
const InviteQrcode = () => {
    const [qrValue,setQrValue]=useState('');
    const [endDate,setEndDate]=useState(dayjs(getTime()).format("YYYY-MM-DD HH:mm:ss"));
    const getQRCode =() => {
        let timestamp=Date.parse(`${endDate}`)/1000;
        let obj={id:StaticInfo.park_id,ts:timestamp}
        InviteService.getQrcoede(JSON.stringify(obj)).then((res:any)=>{
            if (res.ErrorCode==0){
                setQrValue(res.Data);
            }else {
                Toast.show({
                    content: res.Data,
                });
            }
        })
    };

    useEffect(() => {
        getQRCode();
    }, []);
    return (
        <div style={{backgroundColor:'#257FF5',height:'100vh'}}>
            <NavBar
                onBack={() => history.back()}
                style={{
                    '--height': '48px',
                    '--border-bottom': 'none',
                    '--background-color': '#fff'
                }}
            />
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                height:'35vh'
            }}>
                <div style={{
                    backgroundColor:"#fff",
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems:'center',
                    borderRadius: '10px',
                }}>
                    <div style={{
                        width: '70%',
                        maxWidth: '300px', // 可选：设置最大宽度
                        aspectRatio: '1/1' // 保持正方形
                    }}>
                        <QRCodeCanvas
                            value={qrValue}
                            size={300} // 设置二维码大小
                            style={{
                                width: '100%',
                                height: 'auto'
                            }}
                        />
                        <div style={{textAlign:'center',paddingTop:'12px'}}>
                            有效时间{endDate}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default InviteQrcode