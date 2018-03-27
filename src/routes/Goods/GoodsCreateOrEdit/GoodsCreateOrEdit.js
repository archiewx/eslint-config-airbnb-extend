import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Button, Form, Input, InputNumber, Select, Menu, Dropdown, Icon, Popconfirm, Spin } from 'antd';
import { routerRedux } from 'dva/router';
import pathToRegexp from 'path-to-regexp';
import classNames from 'classnames/bind';
import FooterToolbar from '../../../components/antd-pro/FooterToolbar';
import PriceTable from '../../../components/PriceTable/PriceTable';
import BarCodeTable from '../../../components/BarCodeTable/BarCodeTable';
import StockTable from '../../../components/StockTable/StockTable';
import SelectMultiple from '../../../components/SelectMultiple/SelectMultiple';
import GoodsPictureModal from '../../../components/GoodsPictureModal/GoodsPictureModal';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import styles from './GoodsCreateOrEdit.less';
import { DelayRunner } from '../../../utils/utils';

const validateDelay = new DelayRunner();
const breadcrumbList = [{
  title: '商品',
}];
const FormItem = Form.Item;
const Option = Select.Option;
const cx = classNames.bind(styles);
const formItemLayout = {
  labelCol: {
    span: 1,
  },
  wrapperCol: {
    span: 11,
  },
};
const pictureItemLayout = {
  labelCol: {
    span: 2,
  },
  wrapperCol: {
    offset: 1,
    span: 21,
  },
};
@Form.create()
@connect(({ configSetting, goodsCreateOrEdit, goodsGroup, color, size, unit, priceGrade, priceQuantityStep, shop, warehouse }) => ({
  configSetting,
  goodsCreateOrEdit,
  goodsGroup,
  color,
  size,
  unit,
  priceGrade,
  priceQuantityStep,
  shop,
  warehouse,
}))
export default class GoodsCreateOrEdit extends PureComponent {
  state = {
    defaultSelectUnits: [], // 多选框的默认单位
    selectUnits: [], // 单位
    selectColors: [], // 颜色
    selectSizes: [], // 尺码
    selectQuantityStep: [], 
    priceTableValue: {},
    skuImages: {},
    skuStocks: {},
    skuBarcodes: {},
    selectWarehouseId: '',
    selecStockUnitNum: '',
    isNeedIcon: false, // 是否展示icon
  }

  componentDidMount() {
    (async () => {
      this.props.dispatch({ type: 'goodsCreateOrEdit/setState',
        payload: {
          showData: {},
        } });
      if (this.props.history.location.pathname.indexOf('/goods-edit') > -1) {
        const match = pathToRegexp('/goods-edit/:id').exec(this.props.history.location.pathname);
        this.props.dispatch({ type: 'goodsCreateOrEdit/getSingleGoods', payload: { id: match[1] } });
      }
    })().then(() => {
      this.props.dispatch({ type: 'color/getList' });
      this.props.dispatch({ type: 'size/getSizeLibrary' });
      this.props.dispatch({ type: 'priceGrade/getList' });
      this.props.dispatch({ type: 'unit/getList' });
      this.props.dispatch({ type: 'shop/getList' });
      this.props.dispatch({ type: 'warehouse/getList' });
      this.props.dispatch({ type: 'goodsGroup/getList' });
      this.props.dispatch({ type: 'priceQuantityStep/getList' });
    });
  }

  componentWillReceiveProps(nextProps) {
    const { usePricelelvel, priceModel, itemBarcodeLevel, itemImageLevel } = nextProps.configSetting;
    const { priceGrades } = nextProps.priceGrade;
    const { colors } = nextProps.color;
    const { sizeLibrarys } = nextProps.size;
    const { shops } = nextProps.shop;
    const { units } = nextProps.unit;
    const { warehouses } = nextProps.warehouse;
    const { showData } = nextProps.goodsCreateOrEdit; // showData 判断是否是编辑或新建
    let priceTableValue = {};
    // 单位的初始化
    if (showData.selectUnits) {
      if (!!units.length) {
        this.setState({ selectUnits: [...showData.selectUnits] });
      }
    } else if (!!units.length && !this.state.selectUnits.length) {
      const selectUnits = [],
        defaultSelectUnits = [];
      const defaultUnit = units.find(n => n.default == 1) || {};
      selectUnits.push({
        name: `${defaultUnit.name} x ( ${defaultUnit.number} )`,
        number: `${defaultUnit.number}`,
        id: defaultUnit.id,
      });
      defaultSelectUnits.push((defaultUnit.id).toString()); // 多选框的默认单位
      this.setState({ selectUnits, defaultSelectUnits });
    }
    // 编辑时，颜色的初始化
    if (showData.selectColors && !this.state.selectColors.length) {
      this.setState({ selectColors: [...showData.selectColors] });
    }
    // 编辑时，尺码的初始化
    if (showData.selectSizes && !this.state.selectSizes.length) {
      this.setState({ selectSizes: [...showData.selectSizes] });
    }
    // 价格等级&价格组成的初始化
    if (showData.prices) {
      if (!!priceGrades.length && !!shops.length ) {
        //判断策略生成数据
        if (usePricelelvel === 'yes') {
          if (priceModel === '') {
            priceGrades.forEach((item) => {
              priceTableValue[`${item.id}`] = {
                pricelevel_id: item.id,
                price: (showData.prices[`${item.id}`] || {}).price || showData.prices.price,
              };
            });
          } else if (priceModel === 'shop') {
            shops.forEach((item) => {
              priceGrades.forEach((subItem) => {
                priceTableValue[`${item.id}_${subItem.id}`] = {
                  shop_id: item.id,
                  pricelevel_id: subItem.id,
                  price: (showData.prices[`${item.id}_${subItem.id}`] || {}).price || showData.prices.price,
                };
              });
            });
          } else if (priceModel === 'unit') {
            showData.selectUnits.forEach((item) => {
              priceGrades.forEach((subItem) => {
                priceTableValue[`${item.id}_${subItem.id}`] = {
                  unit_id: item.id,
                  pricelevel_id: subItem.id,
                  price: (showData.prices[`${item.id}_${subItem.id}`] || {}).price || showData.prices.price,
                };
              });
            });
          } else if (priceModel === 'quantityrange') {
            showData.selectQuantityStep.forEach((item) => {
              priceGrades.forEach((subItem) => {
                priceTableValue[`${item.id}_${subItem.id}`] = {
                  quantityrange_id: item.id,
                  pricelevel_id: subItem.id,
                  price: (showData.prices[`${item.id}_${subItem.id}`] || {}).price || showData.prices.price,
                };
              });
            });
          }
        } else if (priceModel === '') {

        } else if (priceModel === 'shop') {
          shops.forEach((item) => {
            priceTableValue[`${item.id}`] = {
              shop_id: item.id,
              price: (showData.prices[`${item.id}`] || {}).price || showData.prices.price,
            };
          });
        } else if (priceModel === 'unit') {
          showData.selectUnits.forEach((item) => {
            priceTableValue[`${item.id}`] = {
              unit_id: item.id,
              price: (showData.prices[`${item.id}`] || {}).price || showData.prices.price,
            };
          });
        } else if (priceModel === 'quantityrange') {
          showData.selectQuantityStep.forEach((item) => {
            priceTableValue[`${item.id}`] = {
              quantityrange_id: item.id,
              price: (showData.selectQuantityStep[`${item.id}`] || {}).price || showData.prices.price,
            };
          });
        }
        this.setState({ priceTableValue });
      }
    } else if (!!priceGrades.length && !!shops.length && !!units.length && !Object.values(this.state.priceTableValue).length) {
      //使用价格等级
      if (usePricelelvel === 'yes') { 
        if (priceModel === '') { // 基本价格组成为空
          priceGrades.forEach((item) => {
            priceTableValue[`${item.id}`] = {
              pricelevel_id: item.id,
              price: null,
            };
          });
        } else if (priceModel === 'shop') { // 基本价格组成为店铺
          shops.forEach((item) => {
            priceGrades.forEach((subItem) => {
              priceTableValue[`${item.id}_${subItem.id}`] = {
                shop_id: item.id,
                pricelevel_id: subItem.id,
                price: null,
              };
            });
          });
        } else if (priceModel === 'unit') { // 基本价格组成为单位
          const selectUnits = [].concat(units.find(n => n.default == 1));
          selectUnits.forEach((item) => {
            priceGrades.forEach((subItem) => {
              priceTableValue[`${item.id}_${subItem.id}`] = {
                unit_id: item.id,
                pricelevel_id: subItem.id,
                price: null,
              };
            });
          });
        } 
      }  else if (priceModel === 'shop') { // 关闭价格等级并价格基本组成为店铺
        shops.forEach((item) => {
          priceTableValue[`${item.id}`] = {
            shop_id: item.id,
            price: null,
          };
        });
      } else if (priceModel === 'unit') { // 关闭价格等级并价格基本组成为单位
        const selectUnits = [].concat(units.find(n => n.default == 1));
        selectUnits.forEach((item) => {
          priceTableValue[`${item.id}`] = {
            unit_id: item.id,
            price: null,
          };
        });
      }
      this.setState({ priceTableValue });
    }
    // 库存的初始化
    if (showData.selectColors && showData.selectSizes && showData.stocks) {
      if (!!warehouses.length && (Object.values(this.state.skuStocks).length == 0 || Object.values(this.state.skuStocks).length == warehouses.length || Object.values(this.state.skuStocks).length == (warehouses.length * this.state.selectColors.length) || Object.values(this.state.skuStocks).length == (warehouses.length * this.state.selectColors.length * this.state.selectSizes.length))) {
        const skuStocks = {};
        if (showData.selectColors.length == 0) {
          warehouses.forEach((item) => {
            skuStocks[`${item.id}`] = {
              warehouse_id: item.id,
              store_quantity: (showData.stocks[`${item.id}`] || {}).store_quantity,
            };
          });
        } else if (showData.selectSizes.length == 0) {
          warehouses.forEach((item) => {
            showData.selectColors.forEach((colorItem) => {
              skuStocks[`${item.id}_${colorItem.id}`] = {
                warehouse_id: item.id,
                store_quantity: (showData.stocks[`${item.id}_${colorItem.id}`] || {}).store_quantity,
              };
            });
          });
        } else {
          warehouses.forEach((item) => {
            showData.selectColors.forEach((colorItem) => {
              showData.selectSizes.forEach((sizeItem) => {
                skuStocks[`${item.id}_${colorItem.id}_${sizeItem.id}`] = {
                  warehouse_id: item.id,
                  store_quantity: (showData.stocks[`${item.id}_${colorItem.id}_${sizeItem.id}`] || {}).store_quantity,
                };
              });
            });
          });
        }
        this.setState({ skuStocks });
      }
    } else if (!!warehouses.length && !Object.values(this.state.skuStocks).length) {
      let skuStocks = {};
      warehouses.forEach((item) => {
        skuStocks[`${item.id}`] = {
          warehouse_id: item.id,
          store_quantity: null,
        };
      });
      this.setState({ skuStocks });
    }
    // 条码的初始化
    if (showData.selectColors && showData.selectSizes && showData.barcodes) {
      if (!this.state.selectColors.length && (Object.values(this.state.skuBarcodes).length == 0 || Object.values(this.state.skuBarcodes).length == 1 || Object.values(this.state.skuBarcodes).length == this.state.selectColors.length || Object.values(this.state.skuBarcodes).length == (this.state.selectColors.length * this.state.selectSizes.length))) {
        let skuBarcodes = {};
        if (showData.selectColors.length == 0 || itemBarcodeLevel == 0) {
          skuBarcodes = {
            barcode: showData.barcodes.barcode || '',
          };
        } else if (!showData.selectColors.length) {
          showData.selectColors.forEach((item) => {
            skuBarcodes[`${item.id}`] = {
              barcode: showData.barcodes[`${item.id}`].barcode || '',
            };
          });
        } else {
          showData.selectColors.forEach((item) => {
            showData.selectSizes.forEach((subItem) => {
              skuBarcodes[`${item.id}_${subItem.id}`] = {
                barcode: showData.barcodes[`${item.id}_${subItem.id}`].barcode || '',
              };
            });
          });
        }
        this.setState({ skuBarcodes });
      }
    } else if (!Object.values(this.state.skuBarcodes).length) {
      let skuBarcodes = {};
      skuBarcodes = {
        barcode: '',
      };
      this.setState({ skuBarcodes });
    }
    // 库存单位的默认选择
    if (this.state.selecStockUnitNum == '' && !!units.length) {
      this.setState({
        selecStockUnitNum: Number(units.find(n => n.default == '1').number),
      });
    }
    // 库存的默认选择
    if (this.state.selectWarehouseId == '' && !!warehouses.length) {
      this.setState({
        selectWarehouseId: warehouses[0].id,
      });
    }
    if (itemImageLevel && itemImageLevel == 'item') {
      if (showData.imageFile) {
        let skuImages = {};
        skuImages = {
          fileList: showData.imageFile,
        };
        this.setState({ skuImages });
      } else if (!Object.values(this.state.skuImages).length) {
        let skuImages = {};
        skuImages = {
          fileList: [],
        };
        this.setState({ skuImages });
      }
    } else if (showData.imageFile) {
      const skuImages = {};
      for (const key in showData.imageFile) {
        skuImages[key] = {
          fileList: [],
        };
        skuImages[key].fileList = showData.imageFile[key];
      }
      this.setState({ skuImages });
    } else if (!Object.values(this.state.skuImages).length) {
      const skuImages = {};
      this.state.selectColors.forEach((item) => {
        skuImages[`${item.id}`] = {
          fileList: [],
        };
      });
      this.setState({ skuImages });
    }
  }

  // 确认
  handleSubmit = (e) => {
    const { validateFields } = this.props.form;
    e.preventDefault();
    validateFields((err, value) => {
      if (!err) {
        // 把库存转化为单位1的数据
        const skuStocks = this.state.skuStocks;
        for (const key in skuStocks) {
          if (skuStocks[key].store_quantity) { skuStocks[key].store_quantity = Number(skuStocks[key].store_quantity) * Number(this.state.selecStockUnitNum); }
        }
        value.stock = this.state.skuStocks;
        //转化数据
        this.props.dispatch({ type: 'goodsCreateOrEdit/setServerData',
          payload: {
            value,
            selectColors: this.state.selectColors,
            selectUnits: this.state.selectUnits,
            selectQuantityStep: this.state.selectQuantityStep,
            warehouses: this.props.warehouse.warehouses,
            priceModel: this.props.configSetting.priceModel,
            itemBarcodeLevel: this.props.configSetting.itemBarcodeLevel,
            itemImageLevel: this.props.configSetting.itemImageLevel,
          } });
        //提交
        if (this.props.goodsCreateOrEdit.showData.id) {
          this.props.dispatch({ type: 'goodsCreateOrEdit/editSingleGoods',
            payload: {
              serverData: this.props.goodsCreateOrEdit.serverData,
              id: this.props.goodsCreateOrEdit.showData.id,
              imageFile: this.props.goodsCreateOrEdit.imageFile,
            } }).then(() => {
            this.props.history.goBack();
          });
        } else {
          this.props.dispatch({ type: 'goodsCreateOrEdit/createSingleGoods',
            payload: {
              serverData: this.props.goodsCreateOrEdit.serverData,
              imageFile: this.props.goodsCreateOrEdit.imageFile,
            } }).then(() => {
            this.props.dispatch(routerRedux.push('/goods-list'));
          });
        }
      }
    });
  }

  // 验证货号是否重复
  handleCheckItemRef = (rule, value, callback) => {
    // 300ms一次请求，避免每次输入立刻请求的次数过多
    validateDelay.run(() => {
      if (value) {
        // 编辑时，货号与输入框的货号相同时不展示icon
        if (this.props.goodsCreateOrEdit.showData.item_ref && this.props.goodsCreateOrEdit.showData.item_ref == value) {
          callback();
          this.setState({
            isNeedIcon: false,
          });
        } else {
          this.props.dispatch({ type: 'goodsCreateOrEdit/checkItemRef', payload: value }).then((result) => {
            if (result.request.item_ref == value) {
              if (result.code != 0) {
                callback('货号已存在');
                this.setState({
                  isNeedIcon: true,
                });
              } else {
                callback();
                this.setState({
                  isNeedIcon: true,
                });
              }
            } else {
              callback();
            }
          });
        }
      } else {
        callback();
        this.setState({
          isNeedIcon: true,
        });
      }
    }, 300);
  }

  handleCancel = () => {
    this.props.form.resetFields();
    if (this.props.goodsCreateOrEdit.showData.id) {
      this.props.history.goBack();
    } else {
      this.props.dispatch(routerRedux.push('/goods-list'));
    }
  }

  // 使得价格等级&价格组成的数据与标准价相同
  handleGetStandardPrice = (e) => {
    const { form } = this.props;
    const priceTableValue = form.getFieldValue('prices_table');
    const oldstandardPrice = form.getFieldValue('standard_price'); //旧的标准价
    setTimeout(() => {
      const standardPrice = form.getFieldValue('standard_price'); //新的标准价
      let isAutoInput = true; // 判断价格等级&价格组成是否跟随标准价
      // 判断标准价的格式
      if(typeof standardPrice == 'string' && standardPrice.indexOf('.') > -1 && standardPrice.match(/\./g).length == 1) {
        if( standardPrice[standardPrice.length-1] != '.' && !Number.isInteger(Number(standardPrice[standardPrice.length-1]))) {
          form.setFieldsValue({standard_price: oldstandardPrice});
          isAutoInput = false;
        }
      }else if(typeof standardPrice == 'string' && standardPrice !== '') {
        form.setFieldsValue({standard_price: oldstandardPrice});
        isAutoInput = false;
      }
      if(isAutoInput) {
        for (let key in priceTableValue) {
          // 基本组成价格为单位时，价格应为 标准价 x 该单位数量
          if (this.props.configSetting.priceModel == 'unit') {
            if ( Number(priceTableValue[key].price) == Number(oldstandardPrice)*Number(this.state.selectUnits.find( n => n.id == priceTableValue[key].unit_id).number )  || priceTableValue[key].price == null) {
              priceTableValue[key].price =( Number(standardPrice) * Number(this.state.selectUnits.find( n => n.id == priceTableValue[key].unit_id).number )).toString();
            }
          } else if (priceTableValue[key].price == oldstandardPrice || priceTableValue[key].price == null) {
            priceTableValue[key].price = standardPrice;
          }
        }
        form.setFieldsValue({ prices_table: priceTableValue });
      }
      // 标准价为null或undenfined时，价格等级价格组成为null
      if(!standardPrice) {
        for(let key in priceTableValue) {
          priceTableValue[key].price = null;
        }
        form.setFieldsValue({prices_table: priceTableValue})
      }
    }, 0);
  }

  handleSelectQuantityStep = ({ item, key, keyPath }) => {
    const { form } = this.props;
    const { priceQuantitySteps } = this.props.priceQuantityStep;
    const { priceGrades } = this.props.priceGrade;
    const currentQuantityRange = priceQuantitySteps.find(n => n.id == item.props.eventKey);
    const priceTableValue = form.getFieldValue('prices_table');
    const current = currentQuantityRange.quantityranges.map((item) => {
      let name;
      if (item.max == -1) {
        name = `${item.min} ~`;
      } else {
        name = `${item.min} ~ ${item.max - 1}`;
      }
      return {
        id: item.id,
        name,
      };
    });
    this.setState({ selectQuantityStep: [...current] });
    if (this.props.configSetting.priceModel == 'quantityrange') {
      const isOnlySame = current.every((item) => {
        return Object.values(priceTableValue).some(subItem => subItem.quantityrange_id == item.id);
      });
      if (this.props.configSetting.usePricelelvel === 'yes') {
        if (!isOnlySame) {
          current.forEach((item) => {
            priceGrades.forEach((subItem) => {
              priceTableValue[`${item.id}_${subItem.id}`] = {
                quantityrange_id: item.id,
                pricelevel_id: subItem.id,
                price: form.getFieldValue('standard_price') || null,
              };
            });
          });
          form.setFieldsValue({ prices_table: priceTableValue });
        }
      } else if (!isOnlySame) {
        current.forEach((item) => {
          priceTableValue[`${item.id}`] = {
            quantityrange_id: item.id,
            price: form.getFieldValue('standard_price') || null,
          };
        });
        form.setFieldsValue({ prices_table: priceTableValue });
      }
    }
  }

  handleGetUnitSelect = (arr, e) => {
    const { form } = this.props;
    let selectUnits = [],
      isOnlySame = false;
    const priceTableValue = form.getFieldValue('prices_table');
    setTimeout(() => {
      // 基本价格组成为单位时，获得单位数据已生成价格组成&价格等级
      arr.forEach((item) => {
        if (form.getFieldValue('unit_select').some(n => n == item.id)) {
          selectUnits.push({
            name: `${item.name} ( x ${item.number} )`,
            number: `${item.number}`,
            id: item.id,
          });
        }
      });
      this.setState({ selectUnits });
       // 基本价格组成为单位时，生成价格等级&价格组成的价格数据
      if (this.props.configSetting.priceModel == 'unit') {
        // 取出最后一个单位的id
        const current = [].concat(form.getFieldValue('unit_select')[form.getFieldValue('unit_select').length - 1]);
        // 选中的最后一个单位是不是已经存在在价格数据中
        isOnlySame = Object.values(priceTableValue).some(item => item.unit_id == current[0]);
        if (this.props.configSetting.usePricelelvel === 'yes') {
          if (!isOnlySame) {
            this.props.priceGrade.priceGrades.forEach((subItem) => {
              priceTableValue[`${current[0]}_${subItem.id}`] = {
                unit_id: currennt[0],
                pricelevel_id: subItem.id,
                price: Number(form.getFieldValue('standard_price')) * Number(arr.find(n => current[0] == n.id).number) || null,
              };
            });
            form.setFieldsValue({ prices_table: priceTableValue });
          }
        } else if (!isOnlySame) {
          priceTableValue[`${current[0]}`] = {
            unit_id: current[0],
            price: Number(form.getFieldValue('standard_price')) * Number(arr.find(n => current[0] == n.id).number) || null,
          };
          form.setFieldsValue({ prices_table: priceTableValue });
        }
      }
    }, 0);
  }

  handleGetColorSelect = (arr, e) => {
    const { form } = this.props;
    let selectColors = [],
      isOnlySame = false,
      alreadySelect = [];
    const skuStocks = form.getFieldValue('stock');
    const skuBarcodes = form.getFieldValue('barcode');
    const skuImages = form.getFieldValue('picture');
    setTimeout(() => {
      // 获得颜色数据包括名称和id
      arr.forEach((item) => {
        if (form.getFieldValue('color_select').some(n => n == item.id)) {
          selectColors.push({
            name: `${item.name}`,
            id: item.id,
          });
        }
      });
      this.setState({ selectColors });
      //当前选中的颜色
      const current = [].concat(form.getFieldValue('color_select')[form.getFieldValue('color_select').length - 1]);
      // 当库存key的长度为2，即只有颜色的情况下获取已经在库存中的颜色属性
      for (const key in skuStocks) {
        const changeKey = key.split('_');
        if (changeKey.length == 2) {
          alreadySelect.push(changeKey[1]);
        }
      }
      // 判断当前选中的颜色是否已经存在库存中
      isOnlySame = alreadySelect.some(n => n == current[0]);
      if (!isOnlySame && current[0]) {
        this.props.warehouse.warehouses.forEach((item) => {
          skuStocks[`${item.id}_${current[0]}`] = {
            warehouse_id: item.id,
            store_quantity: null,
          };
        });
        form.setFieldsValue({ stock: skuStocks });
      }
      //尺码同理
      if (this.props.configSetting.itemBarcodeLevel == 1 && !isOnlySame && current[0]) {
        skuBarcodes[`${current[0]}`] = {
          barcode: '',
        };
        form.setFieldsValue({ barcode: skuBarcodes });
      }
      //图片同理
      if (!isOnlySame && current[0]) {
        skuImages[`${current[0]}`] = {
          fileList: [],
        };
        form.setFieldsValue({ picture: skuImages });
      }
    }, 0);
  }

  handleGetSizeSelect = (arr, e) => {
    const { form } = this.props;
    let selectSizes = [],
      isOnlySame = false,
      alreadySelect = [];
    const skuStocks = form.getFieldValue('stock');
    const skuBarcodes = form.getFieldValue('barcode');
    setTimeout(() => {
      // 获得尺码数据包括名称和id
      arr.forEach((item) => {
        if (form.getFieldValue('size_select').some(n => n == item.id)) {
          selectSizes.push({
            name: `${item.name}`,
            id: item.id,
          });
        }
      });
      this.setState({ selectSizes });
      //当前选中的尺码
      const current = [].concat(form.getFieldValue('size_select')[form.getFieldValue('size_select').length - 1]);
      //当库存的key是既有颜色又有尺码的情况下，获取已经在库存中的尺码
      for (const key in skuStocks) {
        const changeKey = key.split('_');
        if (changeKey.length == 3) {
          alreadySelect.push(changeKey[2]);
        }
      }
      //判断当前尺码是否已经存在库存
      isOnlySame = alreadySelect.some(n => n == current[0]);
      //不存在
      if (!isOnlySame && current[0]) {
        this.props.warehouse.warehouses.forEach((item) => {
          this.state.selectColors.forEach((colorItem) => {
            skuStocks[`${item.id}_${colorItem.id}_${current[0]}`] = {
              warehouse_id: item.id,
              store_quantity: null,
            };
          });
        });
        form.setFieldsValue({ stock: skuStocks });
      }
      //不存在且条码策略为以商品级别
      if (this.props.configSetting.itemBarcodeLevel == 1 && !isOnlySame && current[0]) {
        this.state.selectColors.forEach((colorItem) => {
          skuBarcodes[`${colorItem.id}_${current[0]}`] = {
            barcode: '',
          };
        });
        form.setFieldsValue({ barcode: skuBarcodes });
      }
    }, 0);
  }

  handleGetStocks = (e) => {
    const { form } = this.props;
    setTimeout(() => {
      const skuStocks = form.getFieldValue('stock');
      this.setState({ skuStocks });
    }, 0);
  }

  handleUnitStockSelect = (value) => {
    const { form } = this.props;
    // 获取单位数量
    const selecStockUnitNum = value.match(/\d+/)[0];
    this.setState({ selecStockUnitNum });
    // 保证最后的数据为单位1时的数据
    const onlyStcok = JSON.parse(JSON.stringify(this.state.skuStocks));
    // 显示的库存数据
    const stock = JSON.parse(JSON.stringify(this.state.skuStocks));
    for (let key in stock) {
      if (stock[key].store_quantity) {
        onlyStcok[key].store_quantity = Number(stock[key].store_quantity) * Number(this.state.selecStockUnitNum) / Number(selecStockUnitNum);
        stock[key].store_quantity = Math.floor(Number(stock[key].store_quantity) * Number(this.state.selecStockUnitNum) / Number(selecStockUnitNum));
      }
    }
    this.setState({
      skuStocks: onlyStcok,
    });
    form.setFieldsValue({ stock });
  }

  // 切换仓库
  handleStockTabChange = (key) => {
    this.setState({
      selectWarehouseId: key,
    });
  }

  render() {
    const { getFieldDecorator, getFieldValue, setFieldsValue } = this.props.form;
    const { goodsGroup: { goodsGroups }, color: { colors }, size: { sizeLibrarys }, unit: { units }, priceGrade: { priceGrades }, priceQuantityStep: { priceQuantitySteps }, shop: { shops }, warehouse: { warehouses } } = this.props;
    const { usePricelelvel, priceModel, itemBarcodeLevel, itemImageLevel } = this.props.configSetting;
    const { showData } = this.props.goodsCreateOrEdit;
    const { isNeedIcon, defaultSelectUnits, selectUnits, selectColors, selectSizes, selectQuantityStep, priceTableValue, skuStocks, skuBarcodes, selectWarehouseId, selecStockUnitNum, skuImages } = this.state;

    const stockTabList = warehouses.map((item) => {
      return { key: item.id, tab: item.name };
    });

    const quantityStepMenu = (
      <Menu onClick={this.handleSelectQuantityStep}>
        {
          priceQuantitySteps.map((item) => {
            return <Menu.Item key={item.id} >{item.name}</Menu.Item>;
          })
        }
      </Menu>
    );

    const unitStockSelect = (
      <Select style={{ width: 200 }} defaultValue="库存单位：件 ( x 1 )" onChange={this.handleUnitStockSelect} type="combobox" optionLabelProp="value">
        {
          units.map((item) => {
            return (
              <Option key={(item.id).toString()} value={`库存单位：${item.name} ( x ${item.number} )`}>{`${item.name} ( x ${item.number} )`}</Option>
            );
          })
        }
      </Select>
    );

    return (
      <PageHeaderLayout
        title={showData.item_ref ? '编辑商品' : '新建商品'}
        breadcrumbList={breadcrumbList}
      >
        <Spin size="large" spinning={!units.length || !priceGrades.length || !shops.length || !warehouses.length}>
          <Card title="属性" bordered={false} className={styles.bottomCardDivided}>
            <Form layout="vertical">
              <Row gutter={64}>
                <Col span={8}>
                  <FormItem label="货号" hasFeedback={isNeedIcon} >
                    {getFieldDecorator('item_ref', {
                      initialValue: showData.item_ref || '',
                      rules: [{ required: true, message: '货号不能为空' }, { validator: this.handleCheckItemRef }],
                    })(
                      <Input placeholder="请输入" />
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="标准价" hasFeedback={!getFieldValue('standard_price')} >
                    {getFieldDecorator('standard_price', {
                      initialValue: showData.standard_price || null,
                      rules: [{ required: true, message: '标准价不能为空' }],
                    })(
                      <InputNumber placeholder="请输入" style={{ width: '100%' }} precision={2} min={0} onChange={this.handleGetStandardPrice} />
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="进货价">
                    {getFieldDecorator('purchase_price', {
                      initialValue: showData.purchase_price || null,
                    })(
                      <InputNumber placeholder="请输入" style={{ width: '100%' }} precision={2} min={0} />
                    )}
                  </FormItem>
                </Col>
              </Row>
            </Form>
            <Form>
              <div>
                <div style={{paddingBottom: 10}}>
                  {usePricelelvel === 'yes' ? <label className={styles.priceGradeLabelTitle}>价格等级 & 价格组成:</label> :  <label className={styles.priceGradeLabelTitle}>价格组成 (零售价):</label>}
                  {
                    priceModel === 'quantityrange' ? (
                      <Dropdown overlay={quantityStepMenu} >
                        <Button className={styles.quantityStepPostion}>
                          选择价格阶梯 <Icon type="down" />
                        </Button>
                      </Dropdown>
                    ) : null
                  }
                </div>
                <div>
                  <FormItem>
                    {getFieldDecorator('prices_table', {
                      initialValue: priceTableValue,
                    })(
                      <PriceTable priceGrades={priceGrades} shops={shops} selectUnits={selectUnits} selectQuantityStep={selectQuantityStep} usePricelelvel={usePricelelvel} priceModel={priceModel} />
                    )}
                  </FormItem>
                </div>
              </div>
            </Form>
            <Form layout="horizontal" className={styles.leftLabelTitle}>
              <FormItem label="单位" {...formItemLayout}>
                {getFieldDecorator('unit_select', {
                  initialValue: showData.units || defaultSelectUnits,
                })(
                  <Select mode="multiple" placeholder="请输入单位" onChange={this.handleGetUnitSelect.bind(null, units)}>
                    {
                    units.map((item) => {
                      return (
                        <Option key={item.id} value={(item.id).toString()} disabled={item.default == '1'}>{`${item.name} ( x ${item.number} )`}</Option>
                      );
                    })
                  }
                  </Select>
                )}
              </FormItem>
              <FormItem label="颜色" {...formItemLayout}>
                {getFieldDecorator('color_select', {
                  initialValue: showData.colors || [],
                })(
                  <Select mode="multiple" placeholder="请选择颜色" onChange={this.handleGetColorSelect.bind(null, colors)}>
                    {
                    colors.map((item) => {
                      return (
                        <Option key={item.id} value={(item.id).toString()}>{`${item.name}`}</Option>
                      );
                    })
                  }
                  </Select>
                )}
              </FormItem>
              <FormItem label="尺码" {...formItemLayout}>
                {getFieldDecorator('size_select', {
                  initialValue: showData.sizes || [],
                })(
                  <Select mode="multiple" onChange={this.handleGetSizeSelect.bind(null, sizeLibrarys)} placeholder={selectColors.length == 0 ? '请先选择颜色' : '请选择尺码'} disabled={selectColors.length == 0}>
                    {
                    sizeLibrarys.map((item) => {
                      return (
                        <Option key={item.id} value={(item.id).toString()}>{`${item.name}`}</Option>
                      );
                    })
                  }
                  </Select>
                )}
              </FormItem>
            </Form>
          </Card>
          <Card title="描述" bordered={false} className={styles.bottomCardDivided}>
            <Form layout="vertical">
              <Row gutter={64}>
                <Col span={8}>
                  <FormItem label="名称">
                    {getFieldDecorator('name', {
                      initialValue: showData.name || '',
                    })(
                      <Input placeholder="请输入商品名称" />
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="备注">
                    {getFieldDecorator('desc', {
                      initialValue: showData.desc || '',
                    })(
                      <Input placeholder="请输入" />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <FormItem>
                {getFieldDecorator('goods_group', {
                  initialValue: showData.goodsGroup || {},
                })(
                  <SelectMultiple goodsGroups={goodsGroups} />
                )}
              </FormItem>
            </Form>
          </Card>
          <Card title="图片" bordered={false} className={styles.bottomCardDivided}>
            <Form layout="horizontal">
              <FormItem>
                {getFieldDecorator('picture', {
                  initialValue: skuImages,
                })(
                  <GoodsPictureModal itemImageLevel={itemImageLevel} selectColors={selectColors} />
                )}
              </FormItem>
            </Form>
          </Card>
          <Card title="库存" bordered={false} className={cx({ bottomCardDivided: true, cardOuterTab: true })} extra={unitStockSelect}>
            {
              warehouses.length === 0 ? (
                <Form>
                  <FormItem>
                    {getFieldDecorator('stock', {
                      initialValue: skuStocks,
                    })(
                      <StockTable onChange={this.handleGetStocks} selectWarehouseId={selectWarehouseId}  warehouses={warehouses} selectColors={selectColors} selectSizes={selectSizes} />
                    )}
                  </FormItem>
                </Form>
              ) : (
                <Card tabList={stockTabList} onTabChange={this.handleStockTabChange} type="inner" bordered={false} className={styles.cardInnerTab} >
                  <Form>
                    <FormItem>
                      {getFieldDecorator('stock', {
                        initialValue: skuStocks,
                      })(
                        <StockTable onChange={this.handleGetStocks} selectWarehouseId={selectWarehouseId} warehouses={warehouses} selectColors={selectColors} selectSizes={selectSizes} />
                      )}
                    </FormItem>
                  </Form>
                </Card>
              )
            }
          </Card>
          {
            itemBarcodeLevel !== -1 ? (
              <Card title="条码" bordered={false}>
                <Form>
                  <FormItem>
                    {getFieldDecorator('barcode', {
                      initialValue: skuBarcodes,
                    })(
                      <BarCodeTable selectColors={selectColors} selectSizes={selectSizes} itemBarcodeLevel={itemBarcodeLevel} />
                    )}
                  </FormItem>
                </Form>
              </Card>
            ) : null
          }
          <FooterToolbar>
            <div id="noScroll">
              <Popconfirm getPopupContainer={() => document.getElementById('noScroll')} title={showData.item_ref ? '确认放弃编辑商品?' : '确认放弃新建商品?'} onConfirm={this.handleCancel}><Button>取消</Button></Popconfirm>
              <Button type="primary" onClick={this.handleSubmit}>
                确认
              </Button>
            </div>
          </FooterToolbar>
        </Spin>
      </PageHeaderLayout>
    );
  }
}
