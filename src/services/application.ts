import {getData, postData} from '@/network/http';

export function fetch(vals: any) {
    return getData(1739, [vals.page, vals.orderCode, vals.warehouseName, vals.supplierName, vals.startDate, vals.endDate, vals.orderStatus, vals.billStatus, vals.pageSize, vals.orderType, vals.uName]);
}

export function fenye(vals: any) {
    return getData(1740, [vals.orderCode, vals.warehouseName, vals.supplierName, vals.startDate, vals.endDate, vals.orderStatus, vals.billStatus, vals.pageSize, vals.orderType]);
}

export function one(id: string | number) {
    return getData(1738, [id]);
}

export function check(vals: any) {
    return getData(1741, [vals.uid, vals.orderStatus, vals.Reason]);
}

export function checkOrType(vals: any) {
    return getData(1741, [vals.uid, vals.orderStatus, vals.Reason]);
}

export function orderList(vals: any) {
    return getData(2117, [vals.page, vals.orderCode, vals.woCode, vals.productsName, vals.startDate, vals.endDate, vals.unitsId, vals.warehouseId, vals.orderStatus, vals.pageSize, vals.userId]);
}

export function warehousingInspection(vals: any) {
    return getData(1744, [vals.checkWoCode, vals.checkStutes, vals.rejectReason]);
}

export function sendCheck(vals: any) {
    return postData(2120, [vals.uid], vals.jsonData);
}
