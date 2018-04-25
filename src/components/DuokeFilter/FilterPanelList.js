import React from 'react';
import styles from './index.less';

class FilterPanelList extends React.Component {
  onClick = (option, e) => {
    e.preventDefault();
    this.props.onItemClick(option, e);
  };

  checkSelect = (option) => {
    const { items } = this.props;
    return items.findIndex((cv) => cv.value === option.value) !== -1;
  };

  render() {
    const { options } = this.props;
    return (
      <div className={styles.panelList}>
        <ul>
          {options.length &&
            options.map((option) => (
              <li
                key={option.name}
                className={this.checkSelect(option) ? styles.panelListItemActive : ''}
                onClick={this.onClick.bind(this, option)}>
                <a>{option.name}</a>
              </li>
            ))}
        </ul>
      </div>
    );
  }
}

export default FilterPanelList;
