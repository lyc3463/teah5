import {
    Effect,
    Reducer,
    Subscription,
    history as UmiHistorty,
} from 'umi';
import * as CheckHetongService from '@/services/checkHetong';
import { message } from 'antd';
import _ from 'lodash';
import { StaticInfo } from '@/StaticInfo';
import CheckHetongType from '@/ModelTypes/TypeCable';
import { fixPathname } from '@/utils/common';


export interface SeleHetongCountState {
    count: number;
    ScoreSum: number;
    pageTotal: number;
}

export interface SeleHetongInterface {
    namespace: 'SeleHetong';
    state: Object;
    effects: {
        fetch: Effect;
    };
    reducers: {
        list: Reducer<CheckHetongType[]>;
        one: Reducer<CheckHetongType>;
        count: Reducer<SeleHetongCountState>;
    };
    subscriptions: { setup: Subscription };
}
const CheckHetongModels: SeleHetongInterface = {
    namespace: 'SeleHetong',
    state: {},
    effects: {
        *fetch({ type, payload }, { put, call, select }): any {
            const res = yield call(CheckHetongService.seleHetong);
            if (res.ErrorCode == 0) {
                yield put({
                    type: 'list',
                    payload: { list: res.Data },
                });
            } else {
                message.error(res.ErrorCode + res.Data);
            }
            return res;
        },
    },
    reducers: {
        list(state, action) {
            return {
                ...state,
                ...action.payload,
            };
        },
        one(state, action) {
            return {
                ...state,
                ...action.payload,
            };
        },
        count(state, action) {
            return {
                ...state,
                ...action.payload,
            };
        },
    },
    subscriptions: {
        setup({ dispatch, history }, done) {
            return history.listen(({ location, action }) => {
                const pathname = fixPathname(location.pathname);

            });
        },
    },
};

export default CheckHetongModels;
