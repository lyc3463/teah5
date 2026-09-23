//11位手机号正则
import {StaticInfo} from "@/StaticInfo";
import TypeMenu from "@/ModelTypes/TypeMenu";
import Compressor from 'compressorjs';
import dayjs from "dayjs";
import isBetween from 'dayjs/plugin/isBetween'; // 引入插件
import {pinyin} from "pinyin-pro";

dayjs.extend(isBetween);


export  const phonePattern = /^1(3|4|5|6|7|8|9)\d{9}$/;
export function replaceEnglishCommasWithChinese(input) {
    // 检查输入是否为字符串
    if (typeof input !== 'string') {
        // 如果不是字符串，则直接返回原始输入
        return input;
    }
    // 如果是字符串，则使用replace方法和正则表达式替换所有英文逗号为中文逗号
    return input.replace(/,/g, '，');
}

// 获取当前时间加2小时
export const getTime=()=>{
    let currentTime = new Date();
    let futureTimeMillis = currentTime.getTime() + (2 * 60 * 60 * 1000);
    return new Date(futureTimeMillis);
};
export function numberToRMB(n) {
    const fraction = ['角', '分'];  // 角分
    const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];  // 数字
    const unit = ['', '拾', '佰', '仟', '万', '拾万','佰万','仟万','亿', '兆'];  // 单位
    const isNegative = n < 0;  // 判断是否为负数
    n = Math.abs(n);  // 获取绝对值

    let result = '';
    let parts = [];

    // 处理小数部分（角分），确保小数部分为两位
    let fractionPart = (n % 1).toFixed(2).slice(2); // 获取小数部分并确保两位
    if (fractionPart !== '00') {  // 如果小数部分有非零值，处理角分
        for (let i = 0; i < fractionPart.length; i++) {
            if (fractionPart[i] !== '0') {  // 只有当是非零值时，才拼接角分
                parts.push(digit[parseInt(fractionPart[i])] + fraction[i]);
            }
        }
    }

    // 处理整数部分
    let unitIndex = 0;
    let integerPart = Math.floor(n);
    while (integerPart > 0) {
        let section = integerPart % 10;
        if (section !== 0) {
            result = digit[section] + unit[unitIndex] + result;
        } else {
            // 连续的零只保留一个零
            if (result.charAt(0) !== '零') {
                result = '零' + result;
            }
        }
        integerPart = Math.floor(integerPart / 10);
        unitIndex++;
    }

    // 处理负数情况
    if (isNegative) {
        result = '负' + result;
    }

    // 拼接完整的人民币大写（圆替代元）
    result += '元';  // 确保整数部分后面有“圆”而不是“元”
    result += parts.join(''); // 加上小数部分的“角分”

    // 如果小数部分为空，去掉“零”
    if (result.indexOf('零') > 0) {
        result = result.replace(/零/g, ''); // 可以根据需求保留或者删除零
    }

    return result;
}

export function joinUnitNames(arr: Array<{ unit_name: string }> | null | undefined): string {
    if (!arr || arr.length === 0) {
        return '';
    }
    return arr.map(item => item.unit_name).join('，');
}
// 过滤当前用户的是否有权限读取消息的数据
export function filtermessageData(array) {
    // 如果传入的不是数组或者是一个空数组，直接返回原参数
    if (!Array.isArray(array) || array.length === 0) {
        return array;
    }
    let uqx = StaticInfo.uqx.split('');
    // 定义 tmType 与 uqx 索引的映射关系
    const tmTypeToIndexMap = {
        1: 321,
        2: 339,
        3: 366,
        4: 219,
        5: 221,
        6: 222,
        7: 223,
        8: 224,
        9: 185,
        10: 271,
        12: 83,
        13: 420,
        14: 399,
        15: 426
    };
    // 过滤数组元素
    const newArr = array.filter(item => {
        const index = tmTypeToIndexMap[item.tmType];
        if (index !== undefined && uqx[index] === "1") {
            return true; // 不过滤
        }
        return false; // 过滤掉
    });
    return newArr;
};
// 压缩图片
export async function compressBase64(base64: any) {
    if (!base64) return  ''
    const options = {
        quality: 0.8, // 压缩质量
        maxWidth: 700, // 最大宽度
        maxHeight: 350, // 最大高度
    };
    // 将 base64 转换为 Blob 对象
    const byteString = atob(base64.split(',')[1]);
    const mimeString = base64.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: mimeString });

    // 使用 Compressorjs 库进行压缩处理
    return new Promise((resolve, reject) => {
        new Compressor(blob, {
            ...options,
            success(result) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    const compressedDataUrl = e.target.result;
                    resolve(compressedDataUrl); // 返回压缩后的 base64 字符串
                };
                reader.readAsDataURL(result);
            },
            error(err) {
                console.error('压缩失败:', err.message);
                reject(err);
            },
        });
    });
}
// base64
export  const getBase64 = file =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = e => resolve(e.target.result);
        reader.onerror = error => reject(error);
    });
// 获取当前时间
export function getCurrentDate() {
    const today = new Date();

    // 获取年份（四位数）
    let year = today.getFullYear();

    // 获取月份（0-11），因此加1并转为两位数
    let month = String(today.getMonth() + 1).padStart(2, '0');

    // 获取日期（1-31），并转为两位数
    let day = String(today.getDate()).padStart(2, '0');

    // 组合成日期字符串
    return `${year}-${month}-${day}`;
}
export function buildTree(items: TypeMenu[]): TypeMenu[] {
    const map = new Map<number, TypeMenu>();
    items.forEach(item => {
        map.set(item.id, { ...item, children: [] });
    });
    items.forEach(item => {
        if (item.parentId !== undefined && map.has(item.parentId)) {
            map.get(item.parentId)!.children!.push(map.get(item.id)!);
        }
    });
    // 过滤出顶级节点
    return Array.from(map.values()).filter(item => item.parentId === undefined);
}
export function ensureArrayLength(array, length, fillValue) {
    // 如果数组长度小于指定长度，则在末尾添加 fillValue 以达到指定长度
    while (array.length < length) {
        array.push(fillValue);
    }
    // 如果数组长度大于指定长度，则截断数组到指定长度
    if (array.length > length) {
        array.length = length;
    }
    return array;
}
export  const fuzzySearch=(tenantList, ziti)=>{
    if (ziti=='') {
        return tenantList;
    }
    return tenantList.filter(item => {
        // 检查 unitList 是否存在
        if (item.unitList && item.unitList.length > 0) {
            // 遍历 unitList，检查是否有任意一条 unit_name 包含关键字
            return item.unitList.some(unit =>
                unit.unit_name && unit.unit_name.includes(ziti)
            );
        }
        return false;
    });
}
export  const calculateSums=(sumDate)=>{
    // 初始化四个求和变量
    let balanceSum = 0;
    let billMoneySum = 0;
    let depositSum = 0;
    let integralSum = 0;
    let moneySum = 0;
    // 遍历数组，累加每个属性的值
    sumDate.map(transaction => {
        balanceSum += transaction.balance || 0; // 使用||0确保未定义或null值不会破坏计算
        billMoneySum += transaction.billMoney || 0;
        depositSum += transaction.deposit || 0;
        integralSum += transaction.integral || 0;
        moneySum += transaction.consumptionMoney || 0;
    });

    // 返回一个对象，包含四个求和结果
    return {
        balanceSum: balanceSum.toFixed(4)*1,
        billMoneySum: billMoneySum.toFixed(2)*1,
        depositSum: depositSum.toFixed(2)*1,
        integralSum: integralSum.toFixed(2)*1,
        moneySum: moneySum.toFixed(2)*1
    };
}
// 过滤调不是没有unitList的数组
export  function filterItemsWithUnitList(array) {
    // 如果传入的不是数组或者是一个空数组，直接返回原参数
    if (!Array.isArray(array) || array.length === 0) {
        return array;
    }

    // 过滤出 unitList 是非空数组的元素
    return array.filter(item =>
        Array.isArray(item.unitList) && item.unitList.length > 0
    );
}
// 获取当前月份 YYYY-MM
export function cropDateStringToYearMonth(dateString) {
    // 检查字符串中是否包含至少一个 '-' 字符
    if (dateString.indexOf('-') === -1) {
        // 如果没有 '-'，则直接返回原字符串
        return dateString;
    }

    // 尝试按 '-' 分割字符串，并获取前两个部分（年和月）
    const parts = dateString.split('-');
    if (parts.length < 2) {
        // 如果分割后得到的数组长度小于2，也直接返回原字符串
        // 这种情况理论上不应该发生，除非传入的字符串非常特殊（例如只包含一个 '-'）
        return dateString;
    }

    // 返回年和月组成的字符串
    return `${parts[0]}-${parts[1]}`;
}

export function processBills(data) {
    const bills = data;
    // 分离bill_status为0和1的账单
    const pendingBills = bills.filter(bill => bill.bill_status === 0);
    const otherBills = bills.filter(bill => bill.bill_status === 1);

    // 按account_id分组待处理的账单
    const groupedBills = {};
    pendingBills.reverse();

    pendingBills.forEach(bill => {
        if (!groupedBills[bill.account_id]) {
            groupedBills[bill.account_id] = [];
        }
        groupedBills[bill.account_id].push(bill);
    });

    // 对每个账户进行处理
    for (const accountId in groupedBills) {
        const group = groupedBills[accountId];

        // 获取该组的第一个balance值
        let balance = group[0].accountBalance;

        // 遍历该组账单进行累加或减去
        group.forEach((bill, index) => {
            // 每次都更新当前账单的balance，依赖前一项的结果
            if (bill.money_type === 1) {
                balance -= bill.billMoney;
            } else if (bill.money_type === 0) {
                balance += bill.billMoney;
            }

            // 更新当前账单的balance
            bill.accountBalance = balance;
        });
    }
    // 返回更新后的账单数据
    return {
        ErrorCode: 0,
        Data: [...otherBills, ...pendingBills]
    };
}
// 过滤客户名字  例如:[{"id": 2,"custom_name": "301",},{"id": 1,"custom_name": "123"}],[1] 返回123
export function getUserNamesById(data, id) {
    // 使用filter方法筛选出与给定ID匹配的对象，然后使用map方法提取user_name
    return data
        .filter(item => item.id === id) // 注意这里使用===来确保类型匹配（number与number）
        .map(item => item.custom_name);
}
// 压缩图片
export async function compressBase642(base64: any) {
    const options = {
        quality: 0.8, // 压缩质量
        maxWidth: 2000, // 最大宽度
        maxHeight: 1500, // 最大高度
    };
    // 将 base64 转换为 Blob 对象
    const byteString = atob(base64.split(',')[1]);
    const mimeString = base64.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: mimeString });

    // 使用 Compressorjs 库进行压缩处理
    return new Promise((resolve, reject) => {
        new Compressor(blob, {
            ...options,
            success(result) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    const compressedDataUrl = e.target.result;
                    resolve(compressedDataUrl); // 返回压缩后的 base64 字符串
                };
                reader.readAsDataURL(result);
            },
            error(err) {
                console.error('压缩失败:', err.message);
                reject(err);
            },
        });
    });
}
export const addNewData = (data, endData) => {
    const updatedData = [...data];
    const finalEndTime = dayjs(endData); // 转换为 dayjs 对象

    // 处理第一项数据的结束时间
    const firstItem = updatedData[0];
    const firstBeginTime = dayjs(firstItem.beginTime);
    const firstEndTime = firstBeginTime.add(1, 'year').subtract(1, 'day'); // 加一年再减一天得到结束时间
    updatedData[0].endTime = firstEndTime.format("YYYY-MM-DD");

    // 遍历后续数据
    for (let i = 1; i < updatedData.length; i++) {
        const prevItem = updatedData[i - 1];
        const prevEndTime = dayjs(prevItem.endTime);
        const newBeginTime = prevEndTime.add(1, 'day'); // 下一天作为新的开始时间
        const newEndTime = newBeginTime.add(1, 'year').subtract(1, 'day'); // 开始时间加一年再减一天得到结束时间

        // 更新当前项的开始时间和结束时间
        updatedData[i].beginTime = newBeginTime.format("YYYY-MM-DD");
        updatedData[i].endTime = newEndTime.format("YYYY-MM-DD");

        // 检查是否超出传入的结束时间（理论上这里不应该超出，因为我们是在循环内部计算的）
        // 但为了保险起见，我们还是保留这个检查
        if (dayjs(newEndTime).isAfter(finalEndTime)) {
            console.warn(`Warning: ${newEndTime.format("YYYY-MM-DD")} is after the final end time ${finalEndTime.format("YYYY-MM-DD")}. Adjusting.`);
            // 如果超出（理论上不应该发生），则调整结束时间为finalEndTime
            updatedData[i].endTime = finalEndTime.format("YYYY-MM-DD");
            // 可能还需要调整开始时间以保持时间间隔的一致性，但这里我们假设不需要
        }
    }

    // 因为我们是在循环内部计算的，且已经考虑了不超过finalEndTime。
    // 但为了完全符合您的要求（尽管在逻辑上可能是多余的），我们还是再次检查。
    const lastItem = updatedData[updatedData.length - 1];
    const lastEndTime = dayjs(lastItem.endTime);
    if (lastEndTime.isBefore(finalEndTime)) {
        // 如果最后一项的结束时间早于传入的结束时间（理论上不应该发生，除非有额外的逻辑修改），则调整。
        // 但根据我们的计算逻辑，这里不会发生，因为我们在循环中已经确保了不超过finalEndTime。
        // 保留这个检查是为了防止未来可能的逻辑变更导致的错误。
        console.warn(`Unexpected: ${lastEndTime.format("YYYY-MM-DD")} is before the final end time ${finalEndTime.format("YYYY-MM-DD")}. Adjusting.`);
        lastItem.endTime = finalEndTime.format("YYYY-MM-DD");
    } else if (lastEndTime.isAfter(finalEndTime)) {
        // 同样，这个条件在当前的逻辑下也不会发生，因为我们在循环中已经处理过了。
        // 保留这个else if是为了展示完整的检查逻辑。
        console.error(`Error: This should not happen. ${lastEndTime.format("YYYY-MM-DD")} is after the final end time ${finalEndTime.format("YYYY-MM-DD")}.`);
    }

    // 返回更新后的数据和一个标志（虽然在这个函数里bllo似乎没有实际用途）
    return { updatedData, bllo: true }; // 注意：bllo始终为true，可能需要重新考虑其用途或移除
};
//
export const removeLastData = (data) => {
    const updatedData = [...data];  // 创建一个副本，避免直接修改原数组

    // 删除最后一项数据
    updatedData.pop();

    // 获取原数组中删除的最后一项的结束时间
    const lastEndTime = data[data.length - 1].endTime;

    // 如果新的数组不为空，将新的最后一项的结束时间设置为原最后一项的结束时间
    if (updatedData.length > 0) {
        updatedData[updatedData.length - 1].endTime = lastEndTime;
    }

    return updatedData;
};
export const checkEndTime = (data, endData) => {
    let istrue;
    const lastItem = data[data.length - 1];  // 获取最后一条数据
    const lastBeginTime = dayjs(lastItem.beginTime);  // 将最后一条的beginTime转为dayjs对象

    // 计算最后一条数据的结束时间（即beginTime加一年）
    const lastEndTime = lastBeginTime.add(1, 'year');

    // 转换传入的结束时间为dayjs对象
    const finalEndTime = dayjs(endData);

    // 判断最后的结束时间是否大于或等于传入的结束时间
    if (lastEndTime.isAfter(finalEndTime, 'day') || lastEndTime.isSame(finalEndTime, 'day')) {
        istrue = false;  // 如果lastEndTime >= finalEndTime，返回false
    } else {
        istrue = true;   // 否则返回true
    }
    return istrue;
};
// 拆分租赁日
export const splitDataByEndTimeAndRentPeriod = (data, endData) => {
    console.log("传入的时间",data);
    const result = []; // 存储拆分后的数据
    const finalEndTime = dayjs(endData); // 传入的结束时间
    // 获取原始数据的最后一条记录
    const lastItem = data[data.length - 1];
    let beginTime = dayjs(lastItem.beginTime); // 最后一条数据的开始时间
    let endTime = dayjs(lastItem.endTime); // 最后一条数据的结束时间
    let rentBeginTime = lastItem.rentBeginTime ? dayjs(lastItem.rentBeginTime) : null; // 最后一条数据的免租期开始时间
    let rentEndTime = lastItem.rentEndTime ? dayjs(lastItem.rentEndTime) : null; // 最后一条数据的免租期结束时间
    const incremental = lastItem.incremental; // 获取最后一条数据的incremental值
    // 处理跨年数据
    const newItems = [];

    // 如果结束时间超过传入的结束时间，就限制为传入的结束时间
    if (finalEndTime.isBefore(endTime)) {
        endTime = finalEndTime;
    }

    // 拆分数据：直到结束时间为止，按年拆分
    while (endTime.diff(beginTime, 'year') >= 1) {
        const newEndTime = beginTime.add(1, 'year'); // 生成新的结束时间
        const newItem = {
            ...lastItem,
            incremental,
            beginTime: beginTime.format('YYYY-MM-DD'),
            endTime: newEndTime.format('YYYY-MM-DD')
        };

        // 处理免租期
        if (rentBeginTime && rentEndTime) {
            if (rentBeginTime.isBetween(beginTime, newEndTime, null, '[]') && rentEndTime.isBetween(beginTime, newEndTime, null, '[]')) {
                newItem.rentBeginTime = rentBeginTime.format('YYYY-MM-DD');
                newItem.rentEndTime = rentEndTime.format('YYYY-MM-DD');
            } else {
                newItem.rentBeginTime = null;
                newItem.rentEndTime = null;
            }
        }

        newItems.push(newItem); // 将拆分后的数据放入 newItems 数组
        beginTime = newEndTime.add(1, 'day'); // 更新开始时间，准备拆分下一年
    }

    // 处理最后一段数据
    const lastSegment = {
        ...lastItem,
        incremental,
        beginTime: beginTime.format('YYYY-MM-DD'),
        endTime: endTime.format('YYYY-MM-DD')
    };

    // 处理免租期
    if (rentBeginTime && rentEndTime) {
        if (rentBeginTime.isBetween(beginTime, endTime, null, '[]') && rentEndTime.isBetween(beginTime, endTime, null, '[]')) {
            lastSegment.rentBeginTime = rentBeginTime.format('YYYY-MM-DD');
            lastSegment.rentEndTime = rentEndTime.format('YYYY-MM-DD');
        } else {
            lastSegment.rentBeginTime = null;
            lastSegment.rentEndTime = null;
        }
    }
    newItems.push(lastSegment); // 将最后一条数据加入到结果

    // 将处理过的 data 中的其他项（除了最后一条）添加到结果中
    result.push(...data.slice(0, data.length - 1)); // 保持前面的数据不变

    // 合并拆分后的数据和未拆分的前面数据
    return [...result, ...newItems];
};
// 计算出所有免租期天数
export function calculateTotalRentalDays(rentalPeriods) {
    return rentalPeriods.reduce((totalDays, period) => {
        const begin = period.rentBeginTime ? new Date(period.rentBeginTime) : null;
        const end = period.rentEndTime ? new Date(period.rentEndTime) : null;

        // 如果begin或end为null，则忽略该时间段
        if (!begin || !end) {
            return totalDays; // 不增加天数
        }
        const oneDay = 24 * 60 * 60 * 1000; // 一天的毫秒数
        // 注意：这里不需要+1，因为我们是在计算两个日期之间的完整天数
        const daysInPeriod = Math.ceil((end - begin+1) / oneDay); // 计算天数并向上取整

        return totalDays + daysInPeriod;
    }, 0);
}
export  const calculateTimePeriods = (start, end,zuMy) => {
    const periods = [];
    let currentStart = dayjs(start);
    const finalEnd = dayjs(end);
    let index = 0;
    while (currentStart.isBefore(finalEnd)) {
        // 下一个周期的结束时间是一年后，但不能超过总结束时间
        let nextEnd = currentStart.add(1, "year").subtract(1,'day');
        if (nextEnd.isAfter(finalEnd)) {
            nextEnd = finalEnd; // 最后一个周期不足一年
        }
        periods.push({
            id:index,
            beginTime: currentStart.format("YYYY-MM-DD"),
            endTime: nextEnd.format("YYYY-MM-DD"),
            rentBeginTime:null,
            rentEndTime:null,
            incremental:0,
            zuMoney:zuMy
        });
        index++;// 更新索引
        // currentStart = nextEnd;
        // 更新下一个周期的开始时间
        currentStart = nextEnd.add(1, "day");
    }
    return periods;
};
//租金递增
export const contractsDz=(initialRent,rentItems)=>{
    let previousRent =(rentItems.length>0?rentItems[0].incremental/100:0/100)*initialRent+initialRent; // 用传入的初始租金作为第一年租金
    return rentItems.map((item, index) => {
        // 第一年直接使用初始租金
        if (index === 0) {
            return {
                ...item,
                zuMoney:previousRent
            };
        }
        // 后续年份用前一年的租金计算
        const newRent = previousRent * (1 + item.incremental / 100);

        // 更新前一年的租金记录（虽然数组不可变，但这里为了演示逻辑）
        previousRent = newRent;

        return {
            ...item,
            zuMoney: newRent.toFixed(2)*1 // 保留两位小数
        };
    });
}
// 展示房屋名字
export const getHouseNameById=(array, id)=> {
    const item = array.find(element => element.id === id);
    if (item) {
        return item.house_name;
    }
    return '';
};
// 展示单元名称拼接
export const getNamesByIds=(itemArray, idArray)=> {
    // 使用 filter 和 map 方法结合，或者直接使用 reduce 来构建结果
    const names = idArray.map(id => {
        // 在 itemArray 中查找与当前 id 匹配的对象
        const item = itemArray.find(element => element.id === id);
        // 如果找到，返回其 name，否则返回空字符串（可以根据需要调整）
        return item ? item.unit_name : '';
    }).filter(name => name); // 过滤掉空字符串（如果需要）

    // 将名字数组用 '-' 连接成字符串
    return names.join('-');
}
export const pwdPattern= /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{6,}$/;
// 根据日期与月份生成新的日期
export function addMonthsToDate(dateString:string, monthsToAdd:any) {
    // 解析输入日期
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        throw new Error('无效的日期格式，请使用YYYY-MM-DD格式');
    }
    // 获取当前月份和年份
    const currentMonth = date.getMonth();
    const currentYear = date.getFullYear();

    // 计算新月份和年份
    const newMonth = currentMonth + monthsToAdd;
    const newYear = currentYear + Math.floor(newMonth / 12);
    const adjustedMonth = newMonth % 12;

    // 创建新日期对象
    const newDate = new Date(date);
    newDate.setFullYear(newYear, adjustedMonth, date.getDate());

    // 处理边缘情况（如1月31日加1个月应该是2月28/29日）
    if (newDate.getDate() !== date.getDate()) {
        newDate.setDate(0); // 设置为上个月的最后一天
    }

    // 格式化返回的日期为YYYY-MM-DD
    const year = newDate.getFullYear();
    const month = String(newDate.getMonth() + 1).padStart(2, '0');
    const day = String(newDate.getDate()-1).padStart(2, '0');

    return `${year}-${month}-${day}`;
}
export function getTimeRangeByMonths(months:number) {
    // 确保传入的月份数在1到12之间
    if (months < 1 || months > 12) {
        throw new Error('Months must be between 1 and 12');
    }

    // 获取当前时间
    const now = dayjs();

    // 计算开始时间（当前时间的 00:00:00）
    const startTime = now.startOf('day');

    // 计算结束时间（当前时间的开始时间加上指定月份数后的最后一天的 23:59:59）
    const endTime = startTime.add(months, 'month').subtract(1, 'day').endOf('day');

    return {
        startTime: startTime.format('YYYY-MM-DD'),
        endTime: endTime.format('YYYY-MM-DD')
    };
}
export function getTimeRangeByMonthsz(dateString:string, months:number) {
    // 确保传入的月份数在1到12之间
    if (months < 1 || months > 12) {
        throw new Error('Months must be between 1 and 12');
    }

    // 解析传入的日期字符串
    const date = dayjs(dateString);

    // 计算开始时间（传入日期的下一天的 00:00:00）
    const startTime = date.add(1, 'day').startOf('day');

    // 计算结束时间（开始时间加上指定月份数后的最后一天的 23:59:59）
    const endTime = startTime.add(months, 'month').subtract(1, 'day').endOf('day');

    return {
        startTime: startTime.format('YYYY-MM-DD HH:mm:ss'),
        endTime: endTime.format('YYYY-MM-DD HH:mm:ss')
    };
}
// 生成订单号 (园区名首字母拼音大写+当前时间+随机数)
export const  generate=(str:string)=>{
    const initialsOrderNumber = pinyin(str, { pattern: 'first', toneType: 'none',separator: '' }).toUpperCase();
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const dateStr = `${year}${month}${day}`;
    const randomNum = Math.floor(Math.random() * 10000000).toString().padStart(7, '0');
    return `${initialsOrderNumber}${dateStr}${randomNum}`;
};
export function newprocessBills(data) {
    const bills = data;
    // 分离bill_status为0和1的账单
    const pendingBills = bills.filter(bill => bill.orderStatus === 1 || bill.orderStatus === 100);
    const otherBills = bills.filter(bill => bill.orderStatus === 2);

    // 按account_id分组待处理的账单
    const groupedBills = {};
    pendingBills.reverse();

    pendingBills.forEach(bill => {
        if (!groupedBills[bill.accountId]) {
            groupedBills[bill.accountId] = [];
        }
        groupedBills[bill.accountId].push(bill);
    });

    // 对每个账户进行处理
    for (const accountId in groupedBills) {
        const group = groupedBills[accountId];

        // 获取该组的第一个balance值
        let balance = group[0].balance;

        // 遍历该组账单进行累加或减去
        group.forEach((bill, index) => {
            // 每次都更新当前账单的balance，依赖前一项的结果
            if (bill.moneyType === 2) {
                balance -= bill.totalAmount;
            } else if (bill.moneyType === 1) {
                balance += bill.totalAmount;
            }

            // 更新当前账单的balance
            bill.balance2 = balance;
        });
    }
    // 返回更新后的账单数据
    return {
        ErrorCode: 0,
        Data: [...otherBills, ...pendingBills]
    };
}
/**
 * 拼接图片地址，自动判断是否已带 .png
 * @param url 原始图片标识
 * @returns 完整图片地址
 */
export const getImgSrc = (url: string) => {
    const prefix = window.ServerConfig.imgServer;
    // 判断结尾是否是 .png（忽略大小写，如需严格匹配可去掉 toLowerCase()）
    const hasPngSuffix = url.toLowerCase().endsWith('.png');
    if (hasPngSuffix) {
        return `${prefix}${url}`;
    } else {
        return `${prefix}${url}.png`;
    }
};