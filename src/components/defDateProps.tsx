import React, { useState, useEffect } from 'react';
import { List, Calendar, Popup, Button } from 'antd-mobile';
import dayjs from 'dayjs';

interface DateRangePickerProps {
    // 默认展示的时间范围（字符串格式）
    defaultStart?: string;
    defaultEnd?: string;
    // 回调函数
    onDateSelected: (start: string, end: string) => void;
    // 列表标题
    title?: string;
    // 占位文本
    placeholder?: string;
}

const DefDateProps: React.FC<DateRangePickerProps> = ({
                                                             defaultStart,
                                                             defaultEnd,
                                                             onDateSelected,
                                                             title = "",
                                                             placeholder = "请选择日期范围"
                                                         }) => {
    const [visible, setVisible] = useState(false);
    const [selectedRange, setSelectedRange] = useState<[Date, Date] | null>(null);
    const [displayText, setDisplayText] = useState(placeholder);

    // 初始化显示文本和选中范围
    useEffect(() => {
        const isValidStart = dayjs(defaultStart).isValid();
        const isValidEnd = dayjs(defaultEnd).isValid();

        if (isValidStart && isValidEnd) {
            const start = dayjs(defaultStart).format('YYYY-MM-DD');
            const end = dayjs(defaultEnd).format('YYYY-MM-DD');
            setDisplayText(`${start} 至 ${end}`);
            setSelectedRange([dayjs(defaultStart).toDate(), dayjs(defaultEnd).toDate()]);
        } else {
            setDisplayText(placeholder);
            setSelectedRange(null);
        }
    }, [defaultStart, defaultEnd, placeholder]);

    const handleDateChange = (val: [Date, Date] | null) => {
        if (val) {
            setSelectedRange(val);
            const start = dayjs(val[0]).format('YYYY-MM-DD');
            const end = dayjs(val[1]).format('YYYY-MM-DD');
            setDisplayText(`${start} 至 ${end}`);
        }
    };

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
            <List.Item onClick={() => setVisible(true)}>
                {title}
                <div style={{ marginLeft: 8, color: '#666', fontSize: '14px' }}>
                    {displayText}
                </div>
            </List.Item>

            <Popup
                visible={visible}
                onClose={() => setVisible(false)}
                position="bottom"
                bodyStyle={{ height: '80%', maxHeight: '500px' }}
            >
                <div style={{
                    padding: '16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid #eee'
                }}>
                    <Button variant="text" onClick={() => setVisible(false)}>取消</Button>
                    <Button variant="text" onClick={handleConfirm} style={{ color: '#1677ff' }}>确定</Button>
                </div>

                <Calendar
                    selectionMode="range"
                    value={selectedRange}
                    onChange={handleDateChange}
                    style={{ padding: '16px' }}
                />
            </Popup>
        </>
    );
};

export default DefDateProps;