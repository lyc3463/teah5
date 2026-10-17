import React from 'react';
import { Card, List, Pagination, Space, Button } from 'antd';
// import { useHistory } from 'react-router-dom';
import './TableMoblie.css';

/**
 * 手机端卡片式表格组件
 * 直接兼容 PC 端 Table 的 columns 和 dataSource 配置
 */
const MobileTableCard = (props) => {
    const {
        columns = [],
        dataSource = [],
        rowKey = 'id',
        pagination = false,
        total,
        current,
        pageSize,
        onChange,
        pageSizeOptions = [10, 20, 50, 100],
        onDel,
        list,
    } = props;

    // const history = useHistory();

    // 兼容 props.list 和 dataSource
    const data = list || dataSource;

    // 获取行 key
    const getRowKey = (record, index) => {
        if (typeof rowKey === 'function') {
            return rowKey(record);
        }
        return record[rowKey] || index;
    };

    // 渲染单个字段内容
    const renderField = (col, record, index) => {
        const value = record[col.dataIndex];
        
        // 如果列定义了 render 函数，执行 render
        if (col.render && typeof col.render === 'function') {
            // 注意：这里做了个小适配，原本PC端render里用的history.push和isDelOpen
            // 你可以选择在外部传onDel回调，或者保持原render逻辑（确保组件内能访问到history）
            // 为了最大兼容性，我们直接执行render函数，但传入record
            return col.render(value, record, index);
        }

        // 处理文本超长省略
        const ellipsisStyle = col.ellipsis ? {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
        } : {};

        return (
            <span style={ellipsisStyle} className="mobile-card-value">
                {value || '-'}
            </span>
        );
    };

    // 判断是否是操作列
    const isOperationColumn = (col) => {
        return col.dataIndex === 'operation' || col.title === '操作' || col.isOperation;
    };




    return (
        <div className="mobile-table-card-container">
            {/* 卡片列表 */}
            <List
                itemLayout="horizontal"
                dataSource={data}
                split={false}
                grid={{ gutter: 16, column: 1 }}
                renderItem={(record, index) => {
                    const key = getRowKey(record, index);
                    const isOdd = index % 2 === 1;

                    // 分离普通列和操作列
                    const normalColumns = columns.filter(col => !isOperationColumn(col));
                    const operationColumns = columns.filter(col => isOperationColumn(col));

                    return (
                        <Card
                            key={key}
                            className={`mobile-card ${isOdd ? 'card-odd' : 'card-even'}`}
                            size="small"
                            bordered={false}
                        >
                            {/* 普通数据字段 */}
                            <div className="mobile-card-content">
                                {normalColumns.map((col, colIndex) => (
                                    <div 
                                        key={col.dataIndex || colIndex} 
                                        className="mobile-card-row"
                                    >
                                        <span className="mobile-card-label">
                                            {col.title}：
                                        </span>
                                        {renderField(col, record, index)}
                                    </div>
                                ))}
                            </div>

                            {/* 操作按钮区域 */}
                            {operationColumns.length > 0 && (
                                <div className="mobile-card-footer">
                                    {operationColumns.map((col, colIndex) => (
                                        <div key={col.dataIndex || colIndex}>
                                            {renderField(col, record, index)}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Card>
                    );
                }}
            />

            {/* 分页器 */}
            {pagination !== false && total > 0 && (
                <div className="mobile-pagination">
                    <Pagination
                        size="small"
                        total={total}
                        current={current}
                        pageSize={pageSize}
                        onChange={onChange}
                        pageSizeOptions={pageSizeOptions}
                        showSizeChanger={false} // 手机端建议隐藏每页条数选择，简化操作
                        simple // 启用简单模式，更适合手机
                    />
                    <div className="page-info">
                        共 {total} 条
                    </div>
                </div>
            )}
        </div>
    );
};

export default MobileTableCard;