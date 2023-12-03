import CancelIcon from '@mui/icons-material/Cancel';
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from '@mui/lab';
import { Box, Button, Modal, Typography, useMediaQuery } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React, { useState } from 'react';

import { useRevertHistory } from '../../hooks/mutations';
import { EmptyMessage } from '../EmptyMessage';
import { LoadingSpinner } from '../LoadingSpinner';

import {
  columns,
  options,
  typeToColor,
  typeToDotColor,
  typeToIcon,
  typeToInfo,
  typeToModalInfo,
} from './labels';

export const KitHistoryTimeline = ({ histories }) => {
  const [selectedHistory, setSelectedHistory] = useState({});
  const [open, setOpen] = useState(false);
  const firstHistoryId = histories.length ? histories[0].id : null;
  const { mutate, isLoading } = useRevertHistory(firstHistoryId);

  const displayHistory = (history) => () => {
    setSelectedHistory(history);
    setOpen(true);
  };

  if (histories.length === 0) {
    return (
      <EmptyMessage message={'There are no histories'} fullscreen={false} />
    );
  }

  return (
    <>
      <HistoryModal
        open={open}
        onClose={() => setOpen(false)}
        selectedHistory={selectedHistory}
        canDelete={firstHistoryId === selectedHistory.id}
        deleteHistory={() => {
          mutate();
          setOpen(false);
        }}
      />
      <Timeline>
        {histories.map((history) => (
          <TimelineItem
            key={history.id}
            aria-label={`history ${history.id}`}
            onClick={displayHistory(history)}
            style={{ cursor: 'pointer' }}
          >
            <TimelineOppositeContent sx={{ py: '12px', px: 2 }}>
              <Typography variant='h6' component='span'>
                {history.type}
              </Typography>
              <br />
              <Typography variant='caption'>{typeToInfo(history)}</Typography>
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineConnector sx={{ bgcolor: typeToColor[history.type] }} />
              <TimelineDot color={typeToDotColor[history.type]}>
                {typeToIcon[history.type]}
              </TimelineDot>
              <TimelineConnector sx={{ bgcolor: typeToColor[history.type] }} />
            </TimelineSeparator>
            <TimelineContent
              sx={{ m: 'auto 0' }}
              align='right'
              variant='body2'
              color='text.secondary'
            >
              {new Date(history.date).toLocaleString('en-US', options)}
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
      {isLoading && <LoadingSpinner />}
    </>
  );
};

const HistoryModal = ({
  open,
  onClose,
  selectedHistory,
  canDelete,
  deleteHistory,
}) => {
  const isMobile = useMediaQuery('(max-width: 800px)');
  if (!Object.keys(selectedHistory).length) return null;
  const snapshot = selectedHistory.snapshot.map((item) => ({
    id: item.item_expiry_id,
    quantity: item.quantity,
    name: item.item_expiry.item.name,
    expiry: item.item_expiry.expiry_date ?? 'No Expiry',
  }));
  const handleDelete = () => {
    if (
      window.confirm('Are you sure you want to delete this history?') &&
      canDelete
    ) {
      deleteHistory(selectedHistory.id);
    }
  };
  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      role='history-modal'
    >
      <Box
        sx={{
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
        }}
        className='dynamic-width'
      >
        <div
          style={{
            cursor: 'pointer',
            float: 'right',
            marginTop: '-10px',
            marginRight: '-10px',
          }}
          onClick={onClose}
          data-testid='close-history-modal-button'
        >
          <CancelIcon color='error' />
        </div>
        <Typography variant='h6' component='span'>
          History Details
        </Typography>
        <br />
        <Typography variant='caption'>
          {typeToModalInfo(selectedHistory)}
        </Typography>
        <div style={{ marginTop: '20px' }}>
          <Typography variant='h6' component='span'>
            Snapshot
          </Typography>
          {!!snapshot.length && (
            <DataGrid
              rows={snapshot}
              columns={columns(isMobile)}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 5 },
                },
              }}
              pageSizeOptions={[5]}
              disableRowSelectionOnClick
              disableColumnMenu
              disableColumnSelector
            />
          )}
        </div>
        {canDelete && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '20px',
            }}
          >
            <Button variant='contained' color='error' onClick={handleDelete}>
              Delete History
            </Button>
          </div>
        )}
      </Box>
    </Modal>
  );
};
