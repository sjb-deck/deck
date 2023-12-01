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
  const firstHistoryId = histories[0].id;
  const { mutate, isLoading } = useRevertHistory(firstHistoryId);

  const displayHistory = (history) => () => {
    setSelectedHistory(history);
    setOpen(true);
  };

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
          <TimelineItem key={history.id}>
            <TimelineOppositeContent
              sx={{ py: '12px', px: 2, cursor: 'pointer' }}
              onClick={displayHistory(history)}
            >
              <Typography variant='h6' component='span'>
                {history.type}
              </Typography>
              <br />
              <Typography variant='caption'>{typeToInfo(history)}</Typography>
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineConnector sx={{ bgcolor: typeToColor[history.type] }} />
              <TimelineDot
                color={typeToDotColor[history.type]}
                onClick={displayHistory(history)}
                style={{ cursor: 'pointer' }}
              >
                {typeToIcon[history.type]}
              </TimelineDot>
              <TimelineConnector sx={{ bgcolor: typeToColor[history.type] }} />
            </TimelineSeparator>
            <TimelineContent
              sx={{ m: 'auto 0', cursor: 'pointer' }}
              align='right'
              variant='body2'
              color='text.secondary'
              onClick={displayHistory(history)}
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
                  paginationModel: { page: 0, pageSize: 10 },
                },
              }}
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
