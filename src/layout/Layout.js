import React from 'react';
import PropTypes from 'prop-types';
import FlashMessage from '../components/FlashMessage/FlashMessage';

const Layout = ({ children }) => {
  return (
    <>
      <FlashMessage />
      {children}
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
