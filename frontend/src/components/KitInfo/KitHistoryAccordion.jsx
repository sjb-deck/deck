import { ExpandMore } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  Pagination,
  Skeleton,
  Stack,
} from '@mui/material';
import React, { useState } from 'react';

import '../../globals/styles/inventoryBase.scss';
import { useKitHistory } from '../../hooks/queries';
import { LoadingSpinner } from '../LoadingSpinner';

import { KitHistoryTimeline } from './KitHistoryTimeline';

export const KitHistoryAccordion = ({ kitId }) => {
  const [page, setPage] = useState(1);
  const { data: kitHistoryData, isLoading: kitHistoryLoading } = useKitHistory({
    kitId: kitId,
    page: page,
  });
  return (
    <Accordion className='dynamic-width' defaultExpanded={true}>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Stack>
          <Grid item xs={2}>
            Kit History
          </Grid>
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        <Stack
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {kitHistoryLoading ? (
            <LoadingSpinner />
          ) : (
            kitHistoryData && (
              <KitHistoryTimeline histories={kitHistoryData.results} />
            )
          )}
          {kitHistoryData ? (
            <Pagination
              count={Math.ceil(kitHistoryData?.count / 10)}
              page={page}
              onChange={(event, value) => setPage(value)}
            />
          ) : (
            <Skeleton>
              <Pagination />
            </Skeleton>
          )}
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};
