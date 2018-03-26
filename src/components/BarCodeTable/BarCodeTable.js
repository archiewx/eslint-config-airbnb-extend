import React, { PureComponent } from 'react';
import { connect } from 'dva';
import classNames from 'classnames/bind';
import { Row, Col, Input } from 'antd';
import styles from './BarCodeTable.less';

export default class BarCodeTable extends PureComponent {
  state = {
    skuBarcodes: {},
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      skuBarcodes: nextProps.value,
    });
  }

  handleBarcodeInput = (colorId = '', sizeId = '', event) => {
    const { selectColors, selectSizes, itemBarcodeLevel } = this.props;
    const skuBarcodes = this.state.skuBarcodes;
    if (selectColors.length === 0 || itemBarcodeLevel === 0) {
      skuBarcodes.barcode = event.target.value;
    } else if (selectSizes.length === 0) {
      skuBarcodes[`${colorId}`].barcode = event.target.value;
    } else {
      skuBarcodes[`${colorId}_${sizeId}`].barcode = event.target.value;
    }
    this.setState({ skuBarcodes });
    this.props.onChange(skuBarcodes);
  }

  render() {
    const { selectColors, selectSizes, itemBarcodeLevel } = this.props;
    const tableWidth = ((1 / (selectSizes.length + 1)) * 100).toFixed(1);
    const { skuBarcodes } = this.state;
    return (
      <div>
        {
          selectColors.length === 0 || itemBarcodeLevel === 0 ? (
            <div>
              <Row gutter={64}>
                <Col span={8}>
                  <label className={styles.barCodeTableLabelTitle}>条码</label>
                  <Input value={skuBarcodes.barcode} onChange={this.handleBarcodeInput.bind(null, -1, -1)} placeholder="请输入" />
                </Col>
              </Row>
            </div>
          ) : (
            selectSizes.length === 0 ? (
              <div>
                <Row gutter={64}>
                  {
                    selectColors.map((item) => {
                      return (
                        <Col key={item.id} span={8}>
                          <label className={styles.barCodeTableLabelTitle}>{item.name}</label>
                          <Input value={(skuBarcodes[`${item.id}`] || {}).barcode} onChange={this.handleBarcodeInput.bind(null, item.id, -1)} placeholder="请输入" />
                        </Col>
                      );
                    })
                  }
                </Row>
              </div>
            ) : (
              <div>
                <table className={styles.barCodeTable} style={{ width: '100%' }}>
                  <thead className={styles.barCodeTableHead}>
                    <tr>
                      <td style={{ width: `${tableWidth}%` }} />
                      {
                        selectSizes.map((item) => {
                          return <td key={item.id} style={{ width: `${tableWidth}%` }}><span className={styles.spanRowTitlePostion}>{item.name}</span></td>;
                        })
                      }
                    </tr>
                  </thead>
                  <tbody>
                    {
                      selectColors.map((item) => {
                        return (
                          <tr key={item.id}>
                            <td className={styles.barCodeTableHead}><span className={styles.spanColTitlePostion}>{item.name}</span></td>
                            {
                              selectSizes.map((subItem) => {
                                return <td key={subItem.id}><Input value={(skuBarcodes[`${item.id}_${subItem.id}`] || {}).barcode} onChange={this.handleBarcodeInput.bind(null, item.id, subItem.id)} placeholder="请输入" className={styles.barCodeInput} /></td>;
                              })
                            }
                          </tr>
                        );
                      })
                    }
                  </tbody>
                </table>
              </div>
            )
          )
        }
      </div>
    );
  }
}
