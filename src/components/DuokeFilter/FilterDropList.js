import React from 'react';
import { Icon } from 'antd';
import propTypes from 'prop-types';
import styles from './index.less';

class FilterDropList extends React.Component {
  onItemClick = (option, e) => {
    e.preventDefault();
    this.props.onItemClick(option);
  };

  checkSelect = (option) => {
    const { items } = this.props;
    return items.findIndex((cv) => cv.value === option.value) !== -1 ? 'visible' : 'hidden';
  };

  render() {
    const { options } = this.props;
    return (
      <div className={styles.dropList}>
        <ul>
          {options.map((option) => (
            <li key={option.value} onClick={this.onItemClick.bind(this, option)}>
              <a>
                {option.name}{' '}
                <Icon
                  type="check"
                  style={{ visibility: this.checkSelect(option) }}
                  className={styles.itemIcon}
                />
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

FilterDropList.propTypes = {
  items: propTypes.array,
  onItemClick: propTypes.func,
};

FilterDropList.defaultProps = {
  items: [],
  onItemClick: () => {},
};

export default FilterDropList;
