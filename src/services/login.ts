import {getData, postData} from '@/network/http';

//登录
export function login(yhm: string, mm: string,device:string,biaoshi:number,yzm:string,checkSms:number) {
    return getData(1002, [yhm, mm,device,biaoshi,yzm,checkSms]);
}
export function loginIsSms(yhm: string, mm: string,device:string,biaoshi:number,yzm:string,checkSms:number) {
    return getData(1002, [yhm, mm,device,biaoshi,yzm,checkSms]);
}
// 获取验证码
export function loginYzm(phone:string,type:number,shebei:string,is_zb:number) {
    return getData(1059, [phone,type,shebei,is_zb])
}
//退出登录
export function outLogin(id) {
    return getData(1005, [id])
}
// 使用手机号获取企业微信的userid
export function getUserId(phone:string) {
    return getData(1592, [phone]);
}
export function duanxinyanzhen(phone,yzm) {
    return getData(1256, [phone,yzm])
}
export function editPwd(editpwdPhone,md5Pwd,iszb=1) {
    return getData(1249, [editpwdPhone,md5Pwd,iszb])
}
export function swPark(e) {
    return getData(1831, [e])
}