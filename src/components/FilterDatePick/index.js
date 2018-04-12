import React, { PureComponent } from 'react';
import { DatePicker, Form } from 'antd';
import TagSelect from '../DuokeTagSelect';
import moment from 'moment';
import StandardFormRow from '../antd-pro/StandardFormRow';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const agoSevenDays = new Date((new Date()).getTime() - 7 * 24 * 60 * 60 * 1000);
@Form.create()

export default class FilterDatePick extends PureComponent {
  handleChange = (value) => {
    const { form, onChange } = this.props;
    setTimeout(() => {
      form.validateFields((err, value) => {
        if (!err) {
          onChange && onChange(value);
        }
      });
    }, 4);
  }

  render() {
    const { filterOptions, defaultDate = [moment(agoSevenDays, 'YYYY-MM-DD'), moment(new Date(), 'YYYY-MM-DD')], tagLabel = '', dateLabel = '' } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Form layout="inline">
          {
            filterOptions.map((n, i) => {
              return n.options.length ? (
                <StandardFormRow key={`${i}`} title={`${n.name}`} block>
                  <FormItem>
                    {getFieldDecorator(`${tagLabel}${tagLabel ? '_' : ''}${n.code}`)(
                      <TagSelect expandable onChange={this.handleChange} multi={n.multi}>
                        {
                          n.options.map((m, j) => {
                            return <TagSelect.Option key={`${j}`} value={`${m.value}`}>{m.name}</TagSelect.Option>;
                          })
                        }
                      </TagSelect>
                    )}
                  </FormItem>
                </StandardFormRow>
              ) : null;
            })
          }
          <FormItem label="选择日期" >
            {getFieldDecorator(`${dateLabel}${dateLabel ? '_' : ''}datePick`, {
              initialValue: defaultDate,
            })(
              <RangePicker style={{ width: 542 }} onChange={this.handleChange} />
            )}
          </FormItem>
        </Form>
      </div>
    );
  }
}
