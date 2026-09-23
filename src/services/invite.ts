import {getData, postData} from '@/network/http';

// 闸机列表
export function fetch(page:number,deviceSn:string,pageSize:number) {
    return getData(1179, [page,deviceSn,pageSize]);
}
// 远程开门
export function remoteOpen(deviceSn:any) {
    return getData(1191, [deviceSn]);
}
// 生成二维码
export function getQrcoede(endDate:string) {
    return getData(1192, [endDate]);
}