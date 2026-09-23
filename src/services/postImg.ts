import { postData } from '@/network/http';

export function fetch(vals:string,isYs:number) {
    return postData(1042, [isYs],vals);
}
// png 图片上传
export function fetch1078(vals:string,isYs:number) {
    return postData(1805, [isYs],vals);
}