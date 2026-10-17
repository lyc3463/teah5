import {Button, Card, Form, Image, Input, InputNumber, Radio, Select, Space, Spin, message} from 'antd';
import {useEffect, useState} from 'react';
import {history} from 'umi';
import * as ThingListService from '@/services/thingList';
import * as BrandListService from '@/services/brandList';
import * as UnitSettingService from '@/services/unitSetting';
import * as UnitCalculationService from '@/services/unitCalculation';
import * as WarehouseTypeService from '@/services/warehouseType';
import * as YearSettingService from '@/services/yearSetting';
import * as TextureService from '@/services/texture';
import {firstLetterUpperCase} from '@/utils/OpenTool';
import ImageUploadPng from '@/components/ImageUploadPng';

const AddThingList = () => {
    const [form] = Form.useForm();
    const [spinning, setSpinning] = useState(false);
    const [productsImage, setImgName] = useState('');
    const [b64, setB64] = useState('');
    const [productsCode, setProductsCode] = useState(Date.now().toString());
    const [abbreviation, setAbbreviation] = useState('');
    const [goodsList, setGoodsList] = useState<any[]>([]);
    const [isHs, setIsHs] = useState(0);
    const [groupId, setGroupId] = useState(0);
    const [unitsId, setUnitsId] = useState(0);
    const [textureId, setTextureId] = useState(0);
    const [yearId, setYearId] = useState(0);
    const [goodsTypeId, setGoodsTypeId] = useState(0);
    const [brandList, setBrandList] = useState<any[]>([]);
    const [unitList, setUnitList] = useState<any[]>([]);
    const [calcList, setCalcList] = useState<any[]>([]);
    const [typeList, setTypeList] = useState<any[]>([]);
    const [yearList, setYearList] = useState<any[]>([]);
    const [textureList, setTextureList] = useState<any[]>([]);

    const loadData = async () => {
        const [brandRes, unitRes, calcRes, typeRes, yearRes, textureRes]: any[] = await Promise.all([
            BrandListService.fetch({name: ''}),
            UnitSettingService.fetch({name: ''}),
            UnitCalculationService.fetch({name: ''}),
            WarehouseTypeService.fetch({name: ''}),
            YearSettingService.fetch({name: ''}),
            TextureService.fetch({name: ''}),
        ]);
        if (brandRes?.ErrorCode === 0) setBrandList(brandRes.Data?.data || []);
        if (unitRes?.ErrorCode === 0) setUnitList(unitRes.Data?.data || []);
        if (calcRes?.ErrorCode === 0) setCalcList(calcRes.Data?.data || []);
        if (typeRes?.ErrorCode === 0) setTypeList(typeRes.Data?.data || []);
        if (yearRes?.ErrorCode === 0) setYearList(yearRes.Data?.data || []);
        if (textureRes?.ErrorCode === 0) setTextureList(textureRes.Data?.data || []);
    };

    useEffect(() => { loadData(); }, []);

    const changeThingName = (event: any) => {
        const auxiliaryCode = firstLetterUpperCase(event.target.value);
        setAbbreviation(auxiliaryCode);
    };

    const changeGroupId = (value: number, option: any) => {
        setGroupId(value);
        setGoodsList(option?.children || []);
    };

    const onFinish = (values: any) => {
        if (unitsId === 0) return message.error('请选择单位');
        if (isHs === 1 && groupId === 0) return message.warning('请选择换算分组单位');
        if (isHs === 1) {
            const unitExists = goodsList.some(item => item.from_unit_id === unitsId);
            if (!unitExists) return message.error('选择的单位不在换算分组中，请重新选择');
        }
        setSpinning(true);
        const jsonData = JSON.stringify(goodsList);
        ThingListService.add({...values, productsImage, abbreviation, productsCode, isHs, unitsId, jsonData, yearId, textureId, goodsTypeId}).then((res: any) => {
            setSpinning(false);
            if (res.ErrorCode === 0) {
                message.success('添加成功');
                history.push('/warehouse/thingList');
            } else {
                message.error(res.Data);
            }
        });
    };

    return <Spin spinning={spinning}>
        <Card title="新增物品" bordered={false} style={{borderRadius: 8, margin: 10}}>
            <Form form={form} layout="horizontal" labelCol={{span: 4}} wrapperCol={{span: 14}} onFinish={onFinish}>
                <Form.Item label="物品图片"><ImageUploadPng onImageUpload={setImgName} oldBase64={setB64} /></Form.Item>
                <Form.Item label="物品名称" name="productsName" rules={[{required: true, message: '请输入物品名称'}]}><Input placeholder="物品名称" onChange={changeThingName} /></Form.Item>
                <Form.Item label="物品编码"><Input disabled value={productsCode} /></Form.Item>
                <Form.Item label="助查码"><Input disabled value={abbreviation} /></Form.Item>
                <Form.Item label="品牌方" name="brandId" rules={[{required: true, message: '请选择品牌方'}]}><Select placeholder="请选择品牌方" options={brandList.map(item => ({label: item.brandName, value: item.id}))} /></Form.Item>
                <Form.Item label="单位" required><Select placeholder="单位" onChange={setUnitsId} showSearch optionFilterProp="children" filterOption={(input, option) => { const item = unitList.find(unit => unit.id == option?.value); return item?.unitsName?.toLowerCase().includes(input.toLowerCase()); }} options={unitList.map(item => ({label: item.unitsName, value: item.id}))} /></Form.Item>
                <Form.Item label="物品类型"><Select placeholder="物品类型" onChange={setGoodsTypeId} showSearch optionFilterProp="children" filterOption={(input, option) => { const item = typeList.find(unit => unit.id == option?.value); return item?.typeName?.toLowerCase().includes(input.toLowerCase()); }} options={typeList.map(item => ({label: item.typeName, value: item.id}))} /></Form.Item>
                <Form.Item label="口感"><Select placeholder="口感" onChange={setTextureId} showSearch optionFilterProp="children" filterOption={(input, option) => { const item = textureList.find(unit => unit.id == option?.value); return item?.remark?.toLowerCase().includes(input.toLowerCase()); }} options={textureList.map(item => ({label: item.remark, value: item.id}))} /></Form.Item>
                <Form.Item label="年份"><Select placeholder="年份" onChange={setYearId} showSearch optionFilterProp="children" filterOption={(input, option) => { const item = yearList.find(unit => unit.id == option?.value); return item?.ytName?.toLowerCase().includes(input.toLowerCase()); }} options={yearList.map(item => ({label: item.ytName, value: item.id}))} /></Form.Item>
                <Form.Item label="规格" name="specifications"><Input placeholder="规格" /></Form.Item>
                <Form.Item label="条码" name="barcode"><Input placeholder="条码" /></Form.Item>
                <Form.Item label="预警库存数" name="number"><InputNumber min={0} style={{width: '100%'}} /></Form.Item>
                <Form.Item label="成本价" name="costPrice"><InputNumber min={0} style={{width: '100%'}} /></Form.Item>
                <Form.Item label="预售价" name="presalePrice"><InputNumber min={0} style={{width: '100%'}} /></Form.Item>
                <Form.Item label="零售价" name="retailPricce"><InputNumber min={0} style={{width: '100%'}} /></Form.Item>
                <Form.Item label="备注" name="remark"><Input.TextArea rows={3} /></Form.Item>
                <Form.Item label="是否换算分组"><Radio.Group value={isHs} onChange={event => { setIsHs(event.target.value); if (event.target.value === 0) setGroupId(0); }}><Radio value={0}>否</Radio><Radio value={1}>是</Radio></Radio.Group></Form.Item>
                {isHs === 1 && <Form.Item label="换算分组"><Select placeholder="请选择换算分组" onChange={changeGroupId} options={calcList.map(item => ({label: item.groupName, value: item.id, children: item.unitsList || []}))} /></Form.Item>}
                <Form.Item wrapperCol={{offset: 4}}>
                    <Space>
                        <Button type="primary" htmlType="submit">提交</Button>
                        <Button onClick={() => history.back()}>返回</Button>
                    </Space>
                </Form.Item>
            </Form>
        </Card>
    </Spin>;
};

export default AddThingList;
