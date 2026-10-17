import {Button, Image, InputNumber, Select, Table} from 'antd';
import {useMemo} from 'react';
import {
    getPurchaseQuantityUpdate,
    getPurchaseUnitName,
    hasPurchaseUnitConversions,
    mergePurchaseProductDetails,
    preservePurchaseUnitSelection,
} from '@/utils/purchaseUnitConversion';
import * as ThingListService from '@/services/thingList';
import {message} from 'antd';

interface GoodsTableProps {
    goods: any[];
    setGoods: (goods: any[]) => void;
    thingList: any[];
    unitSettings: any[];
    quantityLabel?: string;
    priceLabel?: string;
    showStock?: boolean;
}

const PurchaseFormGoodsTable = ({goods, setGoods, thingList, unitSettings, quantityLabel = '采购数量', priceLabel = '单价(元)', showStock = false}: GoodsTableProps) => {
    const normalizeUnitsListPrice = (product: any, baseUnitId?: number) => {
        const unitsList = Array.isArray(product?.unitsList) ? product.unitsList : [];
        if (!baseUnitId || unitsList.length === 0) return unitsList;
        const normalized = unitsList.map((item: any) => ({...item, price: 0}));
        const basePrice = Number(product?.costPrice || product?.price || 0);
        const unitPriceMap = new Map<number, number>();
        const visited = new Set<number>();
        const fillPrice = (currentUnitId: number, currentPrice: number) => {
            if (visited.has(currentUnitId)) return;
            visited.add(currentUnitId);
            unitPriceMap.set(currentUnitId, currentPrice);
            normalized.forEach((unit: any) => {
                if (unit.from_unit_id === currentUnitId && unit.to_unit_id !== currentUnitId) {
                    fillPrice(unit.to_unit_id, currentPrice / (unit.conversion_rate || 1));
                }
                if (unit.to_unit_id === currentUnitId && unit.from_unit_id !== currentUnitId) {
                    fillPrice(unit.from_unit_id, currentPrice * (unit.conversion_rate || 1));
                }
            });
        };
        fillPrice(baseUnitId, basePrice);
        return normalized.map((unit: any) => ({...unit, price: Number(unitPriceMap.get(unit.from_unit_id) ?? 0)}));
    };

    const handleProductSelect = async (recordId: number, productId: number) => {
        const selectedProduct = thingList.find(item => item.id === productId);
        if (!selectedProduct) return;
        const listUnitId = Number(selectedProduct.unitsId || selectedProduct.unitsList?.[0]?.from_unit_id || 0);
        const listUnitName = getPurchaseUnitName(listUnitId, unitSettings, selectedProduct.unitsName || '');
        setGoods(goods.map(item => item.id === recordId ? {
            ...item,
            productsId: selectedProduct.id || 0,
            productsName: selectedProduct.productsName,
            productsCode: selectedProduct.productsCode || '',
            productsImage: selectedProduct.productsImage || '',
            unitsId: listUnitId,
            unitsName: listUnitName,
            unitsList: Array.isArray(selectedProduct.unitsList) ? selectedProduct.unitsList : [],
            isHs: selectedProduct.isHs || 0,
            quantity: selectedProduct.quantity || 0,
            price: Number(selectedProduct.costPrice || selectedProduct.price || 0),
            totalPrice: Number((Number(selectedProduct.quantity || 0) * Number(selectedProduct.costPrice || selectedProduct.price || 0)).toFixed(2)),
        } : item));
        const detailResponse: any = await ThingListService.one(productId);
        if (detailResponse?.ErrorCode !== 0 || !detailResponse.Data) return;
        const product = mergePurchaseProductDetails(selectedProduct, detailResponse.Data);
        const baseUnitId = product.unitsId || product.unitsList?.[0]?.from_unit_id || 0;
        const normalizedUnits = normalizeUnitsListPrice(product, baseUnitId);
        const selectedUnit = normalizedUnits.find((item: any) => item.from_unit_id === baseUnitId) || normalizedUnits[0];
        const newPrice = Number(selectedUnit?.price ?? product.costPrice ?? product.price ?? 0);
        setGoods(goods.map(item => {
            if (item.id === recordId) {
                const currentSelection = preservePurchaseUnitSelection(item, normalizedUnits, baseUnitId);
                return {
                    ...item,
                    productsId: product.id || 0,
                    productsName: product.productsName,
                    productsCode: product.productsCode || '',
                    productsImage: product.productsImage || '',
                    specifications: product.specifications || '',
                    barcode: product.barcode || '',
                    remark: product.remark || '',
                    unitsList: normalizedUnits,
                    isHs: product.isHs || 0,
                    ...currentSelection,
                    unitsName: getPurchaseUnitName(currentSelection.unitsId, unitSettings, product.unitsName || selectedProduct.unitsName || ''),
                };
            }
            return item;
        }));
    };

    const changproductsNum = (value: number | null, recordId: number) => {
        setGoods(goods.map(item => {
            if (item.id !== recordId) return item;
            const updatedItem = getPurchaseQuantityUpdate(item, value);
            const selectedUnit = unitSettings?.find((unit: any) => Number(unit.id) === updatedItem.unitsId);
            return {...updatedItem, unitsName: selectedUnit?.unitsName || item.unitsName};
        }));
    };

    const changproductsPrice = (value: number | null, recordId: number) => {
        setGoods(goods.map(item => item.id === recordId ? {
            ...item,
            price: value || 0,
            totalPrice: Number(((item.quantity || 0) * (value || 0)).toFixed(2)),
        } : item));
    };

    const changeUnitsId = (value: number, recordId: number) => {
        setGoods(goods.map(item => {
            if (item.id === recordId) {
                const selectedUnit = Array.isArray(item.unitsList) ? item.unitsList.find((unit: any) => unit.from_unit_id === value) : null;
                const nextPrice = Number(selectedUnit?.price ?? item.price ?? 0);
                return {...item, unitsId: value || 0, quantity: 0, price: nextPrice, totalPrice: 0};
            }
            return item;
        }));
    };

    const isDel = (id: number) => {
        setGoods(goods.filter(item => item.id !== id));
    };

    const addEmptyRecord = () => {
        const maxId = goods.length > 0 ? Math.max(...goods.map(item => item.id)) : 0;
        setGoods([...goods, {
            id: maxId + 1,
            productsImage: '',
            productsName: '',
            productsCode: '',
            unitsId: 0,
            unitsName: '',
            unitsList: [],
            isHs: 0,
            quantity: 0,
            price: 0,
            totalPrice: 0,
            productsId: 0,
            quantityKc: 0,
        }]);
    };

    const columns = useMemo(() => [
        {
            title: '物品图片',
            dataIndex: 'productsImage',
            width: 80,
            render: (text: string) => {
                const textStr = String(text || '');
                const imageUrl = textStr && textStr.endsWith('.png') ? `${window.ServerConfig.imgServer}${textStr}` : `${window.ServerConfig.imgServer}${textStr}.png`;
                return textStr ? <Image src={imageUrl} style={{width: 50, height: 50}} fallback="https://placeholder.pics/svg/50x50/EEEEEE/999999/暂无图片" /> : '';
            },
        },
        {
            title: '选择物品',
            dataIndex: 'productsName',
            width: 200,
            render: (text: string, record: any) => (
                <Select
                    showSearch
                    optionFilterProp="children"
                    placeholder="搜索物品名称"
                    style={{width: '100%'}}
                    value={text || undefined}
                    onChange={(value) => handleProductSelect(record.id, value)}
                    filterOption={(input, option) => {
                        if (!Array.isArray(thingList) || thingList.length === 0) return false;
                        const item = thingList.find(unit => unit.id == option.value);
                        if (!item) return false;
                        const searchInput = input.toLowerCase();
                        return item.productsName?.toLowerCase().includes(searchInput) || item.abbreviation?.toLowerCase().includes(searchInput);
                    }}
                    options={Array.isArray(thingList) ? thingList.map(item => ({label: item.productsName, value: item.id})) : []}
                />
            ),
        },
        {title: '物品编号', dataIndex: 'productsCode', width: 120},
        {
            title: '单位',
            dataIndex: 'unitsId',
            width: 120,
            render: (text: number, record: any) => {
                if (!hasPurchaseUnitConversions(record.isHs, record.unitsList)) {
                    return <span>{record.unitsName}</span>;
                }
                return (
                    <Select
                        placeholder="选择单位"
                        disabled={record.isHs == 0}
                        style={{width: 120}}
                        value={record.unitsId || undefined}
                        options={Array.isArray(unitSettings) && Array.isArray(record.unitsList)
                            ? unitSettings.filter((unit: any) => record.unitsList.some((conversion: any) =>
                                Number(conversion.from_unit_id) === Number(unit.id) || Number(conversion.to_unit_id) === Number(unit.id)
                            )).map((unit: any) => ({label: unit.unitsName, value: unit.id}))
                            : []}
                        onChange={(value) => changeUnitsId(value, record.id)}
                    />
                );
            },
        },
        {
            title: quantityLabel,
            dataIndex: 'quantity',
            width: 100,
            render: (text: number, record: any) => (
                <InputNumber min={0} value={text} onChange={(value) => changproductsNum(value, record.id)} style={{width: '100%'}} />
            ),
        },
        ...(showStock ? [{title: '库存数量', dataIndex: 'quantityKc', width: 100}] : []),
        {
            title: priceLabel,
            dataIndex: 'price',
            width: 100,
            render: (text: number, record: any) => (
                <InputNumber min={0} value={text} onChange={(value) => changproductsPrice(value, record.id)} style={{width: '100%'}} />
            ),
        },
        {
            title: '总价(元)',
            dataIndex: 'totalPrice',
            width: 100,
            render: (text: number) => <InputNumber min={0} disabled value={text} style={{width: '100%'}} />,
        },
        {
            title: '操作',
            width: 80,
            render: (_: any, record: any) => <Button type="primary" danger size="small" onClick={() => isDel(record.id)}>删除</Button>,
        },
    ], [goods, thingList, unitSettings, quantityLabel, priceLabel, showStock]);

    return (
        <div>
            <Table
                columns={columns}
                dataSource={goods}
                rowKey="id"
                pagination={false}
                scroll={{x: 'max-content'}}
                size="small"
            />
            <Button type="dashed" onClick={addEmptyRecord} style={{width: '100%', marginTop: 8}}>+ 添加物品</Button>
        </div>
    );
};

export default PurchaseFormGoodsTable;
