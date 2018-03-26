import React from 'react';
import './index.less';

const DuokeIcon = (props) => {
  const { type, style } = props;
  return <i className={`duokefont duoke-duoke_${type}`} style={style} />;
};
export default DuokeIcon;
