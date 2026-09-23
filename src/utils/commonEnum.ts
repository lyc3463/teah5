export enum PurStatus {
    DRAFT = 1,
    APPROVED = 2,
    PENDING_REIMBURSEMENT = 3,
    REIMBURSED = 4,
    PENDING_INBOUND = 5,
    INBOUNDED = 6,
    REJECTED = 7,
    AUDITING = 8,
    DEFAULT = 99,
}

export enum InStatus {
    PENDING_IN = 1,
    AUDITING = 2,
    APPROVED = 3,
    REJECTED = 4,
    DEFAULT = 99,
}

export const PUR_STATUS: Record<number, {text: string; color: string}> = {
    1: {text: '待送审', color: 'blue'},
    2: {text: '已审核', color: 'green'},
    3: {text: '已提交报销', color: 'orange'},
    4: {text: '已报销', color: 'purple'},
    5: {text: '采购入库审核', color: 'orange'},
    6: {text: '已入库', color: 'orange'},
    7: {text: '已驳回', color: 'red'},
    8: {text: '采购审核', color: 'orange'},
    99: {text: '未知状态', color: 'default'},
};

export const IN_STATUS: Record<number, {text: string; color: string}> = {
    1: {text: '未入库', color: 'blue'},
    2: {text: '已提交', color: 'green'},
    3: {text: '已入库', color: 'orange'},
    4: {text: '已驳回', color: 'purple'},
    99: {text: '未知状态', color: 'default'},
};
