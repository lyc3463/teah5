import React, { useState } from 'react';
import { List, Calendar, Popup, Button } from 'antd-mobile';
import dayjs from 'dayjs';

interface MonthRangePickerProps {
    onMonthSelected: (startMonth: string, endMonth: string) => void;
    title?: string;
    placeholder?: string;
}

const MonthRangePicker: React.FC<MonthRangePickerProps> = ({
                                                               onMonthSelected,
                                                               title = "月份范围",
                                                               placeholder = "请选择月份范围"
                                                           }) => {
    const [visible, setVisible] = useState(false);
    const [selectionMode, setSelectionMode] = useState<'start' | 'end'>('start');
    const [startMonth, setStartMonth] = useState<string | null>(null);
    const [endMonth, setEndMonth] = useState<string | null>(null);
    const [tempMonth, setTempMonth] = useState<string | null>(null);
    const [currentYear, setCurrentYear] = useState(dayjs().year());

    // 生成当前年份的12个月份
    const months = Array.from({ length: 12 }, (_, i) =>
        dayjs(`${currentYear}-${i + 1}-01`).format('YYYY-MM'));

    const handleMonthSelect = (month: string) => {
        setTempMonth(month);

        if (selectionMode === 'start') {
            setStartMonth(month);
            setSelectionMode('end');
        } else {
            setEndMonth(month);
        }
    };

    const handleConfirm = () => {
        if (startMonth && tempMonth) {
            // 确保开始月份不大于结束月份
            const sortedMonths = [startMonth, tempMonth].sort();
            const finalStart = sortedMonths[0];
            const finalEnd = sortedMonths[1];

            setStartMonth(finalStart);
            setEndMonth(finalEnd);
            onMonthSelected(finalStart, finalEnd);
        }
        setVisible(false);
        setSelectionMode('start');
    };

    const handleCancel = () => {
        setVisible(false);
        setSelectionMode('start');
        setTempMonth(null);
    };

    const resetSelection = () => {
        setStartMonth(null);
        setEndMonth(null);
        setTempMonth(null);
        setSelectionMode('start');
    };

    const changeYear = (increment: number) => {
        setCurrentYear(prev => prev + increment);
    };

    const displayText = startMonth && tempMonth
        ? `${startMonth} 至 ${tempMonth}`
        : placeholder;

    return (
        <>
            <List.Item onClick={() => setVisible(true)}>
                {title}
                <span style={{
                    marginLeft: 8,
                    color: startMonth ? '#666' : '#999',
                    fontSize: '14px'
                }}>
          {displayText}
        </span>
            </List.Item>

            <Popup
                visible={visible}
                onClose={handleCancel}
                position="bottom"
                bodyStyle={{
                    height: 'auto',
                    maxHeight: '70vh',
                    paddingBottom: 'env(safe-area-inset-bottom)'
                }}
            >
                <div style={{
                    padding: '16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid #eee'
                }}>
                    <Button variant="text" onClick={resetSelection}>重置</Button>
                    <div>
                        <Button variant="text" onClick={handleCancel} style={{ marginRight: 16 }}>取消</Button>
                        <Button
                            variant="text"
                            onClick={handleConfirm}
                            style={{ color: '#1677ff' }}
                            disabled={!startMonth || !tempMonth}
                        >
                            确定
                        </Button>
                    </div>
                </div>

                <div style={{ padding: '8px 16px' }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 16
                    }}>
                        <Button size='small' onClick={() => changeYear(-1)}>上一年</Button>
                        <div style={{ fontSize: 18, fontWeight: 'bold' }}>{currentYear}年</div>
                        <Button size='small' onClick={() => changeYear(1)}>下一年</Button>
                    </div>

                    <div style={{ marginBottom: 8 }}>
                        当前选择: {selectionMode === 'start' ? '开始月份' : '结束月份'}
                    </div>
                    {startMonth && (
                        <div style={{ marginBottom: 8 }}>
                            已选开始: {startMonth}
                        </div>
                    )}
                    {selectionMode === 'end' && tempMonth && (
                        <div style={{ marginBottom: 16 }}>
                            已选结束: {tempMonth}
                        </div>
                    )}
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 8,
                    padding: 16
                }}>
                    {months.map(month => {
                        const isSelected = month === startMonth || month === tempMonth;
                        const isInRange = startMonth && tempMonth &&
                            dayjs(month).isBetween(startMonth, tempMonth, 'month', '[]');

                        return (
                            <div
                                key={month}
                                onClick={() => handleMonthSelect(month)}
                                style={{
                                    padding: '12px 8px',
                                    textAlign: 'center',
                                    borderRadius: 8,
                                    backgroundColor: isSelected
                                        ? '#1677ff'
                                        : isInRange
                                            ? '#e6f7ff'
                                            : '#f5f5f5',
                                    color: isSelected ? '#fff' : '#333',
                                    cursor: 'pointer'
                                }}
                            >
                                {dayjs(month).format('MM月')}
                            </div>
                        );
                    })}
                </div>
            </Popup>
        </>
    );
};

export default MonthRangePicker;