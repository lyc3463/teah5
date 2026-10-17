import {getData, postData} from '@/network/http';

// 添加退货订单
export function addReturn(vals:any) {
    return postData(1753, [vals.orderCode,vals.orderTime,vals.warehouseId,vals.paidAmount,vals.totalAmount,vals.remark,vals.pmId,vals.orderStatus ?? 1],vals.jsonData);
}