import { Modal as MaterialModal, Box } from '@mui/material';
import { PropTypes } from 'prop-types';
import React, { useState } from 'react';

const Modal = ({ children, control, isOpen, onClose, maxWidth }) => {
  const controlled =
    typeof isOpen === 'boolean' && typeof onClose === 'function';
  const [_opened, setOpened] = useState(false);
  const opened = controlled ? isOpen : _opened;
  console.log(opened);

  const helper = {
    close: () => (controlled ? onClose() : setOpened(false)),
  };

  return (
    <div>
      {control && <div onClick={() => setOpened(true)}>{control}</div>}
      <div>
        <MaterialModal open={opened}>
          <Box
            sx={{
              width: 1,
              height: 1,
              p: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            <Box
              sx={{
                width: 1,
                bgcolor: 'background.paper',
                m: 2,
                boxShadow: 24,
                maxWidth: maxWidth ?? 800,
                height: 'auto',
              }}
            >
              {typeof children === 'function' ? children(helper) : children}
            </Box>
          </Box>
        </MaterialModal>
      </div>
    </div>
  );
};

export default Modal;

Modal.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
  control: PropTypes.node,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  maxWidth: PropTypes.number,
};
