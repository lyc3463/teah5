import React, { useState, useEffect } from 'react';
import { List, Calendar, Popup, Button } from 'antd-mobile';
import dayjs from 'dayjs';

// 定义组件的Props类型
interface DateRangePickerProps {
    // 初始日期范围
    defaultRange?: [Date, Date];
    // 回调函数，返回选中的日期范围
    onDateSelected: (start: string, end: string) => void;
    // 列表项显示的标题
    title?: string;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
                                                             defaultRange,
                                                             onDateSelected,
                                                             title = "日期"
                                                         }) => {
    // 控制弹窗显示状态
    const [visible, setVisible] = useState(false);
    // 存储选中的日期范围
    const [selectedRange, setSelectedRange] = useState<[Date, Date] | null>(defaultRange || null);
    // 格式化后的日期字符串
    const [startDate, setStartDate] = useState("2000-01-01");
    const [endDate, setEndDate] = useState("2099-01-01");

    // 初始化默认日期
    useEffect(() => {
        if (defaultRange) {
            setStartDate(dayjs(defaultRange[0]).format('YYYY-MM-DD'));
            setEndDate(dayjs(defaultRange[1]).format('YYYY-MM-DD'));
        }
    }, [defaultRange]);

    // 处理日期选择变化
    const handleDateChange = (val: [Date, Date] | null) => {
        if (val) {
            setSelectedRange(val);
            const start = dayjs(val[0]).format('YYYY-MM-DD');
            const end = dayjs(val[1]).format('YYYY-MM-DD');
            setStartDate(start);
            setEndDate(end);
            onDateSelected(start, end);
        }
    };

    // 确认选择并关闭弹窗
    const handleConfirm = () => {
        if (selectedRange) {
            const start = dayjs(selectedRange[0]).format('YYYY-MM-DD');
            const end = dayjs(selectedRange[1]).format('YYYY-MM-DD');
            onDateSelected(start, end);
        }
        setVisible(false);
    };

    return (
        <>
            {/* 触发弹窗的列表项 */}
            <List.Item
                onClick={() => setVisible(true)}
            >
                {title}
                {/* 显示已选择的日期范围 */}
                {startDate !== "2000-01-01" && endDate !== "2099-01-01" && (
                    <span style={{ marginLeft: 8, color: '#666', fontSize: '14px' }}>
            {startDate} 至 {endDate}
          </span>
                )}
            </List.Item>

            {/* 底部弹出的日历选择器 */}
            <Popup
                visible={visible}
                onClose={() => setVisible(false)}
                position="bottom"
                bodyStyle={{ height: '80%', maxHeight: '500px' }}
            >
                {/* 弹窗标题栏 */}
                <div style={{
                    padding: '16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid #eee'
                }}>
                    <Button variant="text" onClick={() => setVisible(false)}>关闭</Button>
                    <Button variant="text" onClick={handleConfirm} style={{ color: '#1677ff' }}>确认</Button>
                </div>

                {/* 日历组件 */}
                <Calendar
                    selectionMode="range"
                    defaultValue={defaultRange}
                    onChange={handleDateChange}
                    style={{ padding: '16px' }}
                />
            </Popup>
        </>
    );
};

export default DateRangePicker;
