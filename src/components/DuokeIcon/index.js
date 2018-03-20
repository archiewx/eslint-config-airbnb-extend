import React from 'react';
// import './index.css'
const DuokeIcon = (props) => {
  const { type } = props;
  return <i className={`duokefont duoke-duoke_${type}`} />;
};
export default DuokeIcon;