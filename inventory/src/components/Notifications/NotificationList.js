import {
  Typography,
  Stack,
  useMediaQuery,
  createTheme,
  ThemeProvider,
  Divider,
} from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';

import { useCheckAlerts, useKitsExpiry } from '../../hooks/queries';
import { NotificationContext } from '../../providers';

import { NotificationItem } from './NotificationItem';

export const NotificationList = () => {
  const { notifications } = useContext(NotificationContext);
  const { setNotifications } = useContext(NotificationContext);
  const { data: kitsExpiryAlerts } = useKitsExpiry();
  const { data: itemsAlerts } = useCheckAlerts();
  const [sections, setSections] = useState([]);
  const isMobile = useMediaQuery('(max-width:600px)');

  const theme = createTheme({
    typography: {
      title1: {
        fontSize: isMobile ? 24 : 48,
      },
      subtitle1: {
        fontSize: isMobile ? 16 : 24,
      },
    },
  });

  const updateSections = () => {
    const sections = [];
    if (notifications.expired_items?.length > 0) {
      sections.push({
        title: 'The following items have expired:',
        data: notifications.expired_items,
        key: 'expired_items',
      });
    }
    if (notifications.expiring_items?.length > 0) {
      sections.push({
        title: 'The following items are expiring soon:',
        data: notifications.expiring_items,
        key: 'expiring_items',
      });
    }
    if (notifications.low_quantity_items?.length > 0) {
      sections.push({
        title: 'The following items are running low:',
        data: notifications.low_quantity_items,
        key: 'low_quantity_items',
      });
    }
    if (notifications.kits_expiries?.length > 0) {
      sections.push({
        title: 'The following kits have expiry issues:',
        data: notifications.kits_expiries,
        key: 'kits_expiries',
      });
    }
    setSections(sections);
  };

  useEffect(() => {
    if (
      sections.length === 0 &&
      kitsExpiryAlerts !== undefined &&
      itemsAlerts !== undefined
    ) {
      const noticount =
        (itemsAlerts.expired_items?.length > 0 ? 1 : 0) +
        +(itemsAlerts.expiring_items?.length > 0 ? 1 : 0) +
        (itemsAlerts.low_quantity_items?.length > 0 ? 1 : 0) +
        (kitsExpiryAlerts.length > 0 ? 1 : 0);

      setNotifications({
        ...itemsAlerts,
        kits_expiries: kitsExpiryAlerts,
        numberOfNotifications: noticount,
      });
      updateSections();
    }
    console.log('notifications', notifications);
  }, [kitsExpiryAlerts, itemsAlerts, notifications, setNotifications]);

  return (
    <>
      <Stack
        className='nav-margin-compensate'
        alignItems='center'
        spacing={3}
        width='100%'
        minHeight={'100vh'}
      >
        <ThemeProvider theme={theme}>
          <Typography variant='title1'>Notifications</Typography>
          <div style={{ margin: '24px' }}>
            {sections.map((section, index) => (
              <div
                key={index}
                style={{ marginBottom: { isMobile } ? '18px' : '28px' }}
              >
                <Typography variant='subtitle1'>{section.title}</Typography>
                <div style={{ marginBottom: { isMobile } ? '18px' : '28px' }}>
                  {section.data.map((issue, index) => (
                    <div key={index}>
                      <NotificationItem
                        sectionKey={section.key}
                        issue={issue}
                        isMobile={isMobile}
                      />
                    </div>
                  ))}
                </div>
                <Divider sx={{ borderColor: 'white' }} />
              </div>
            ))}
          </div>
        </ThemeProvider>
      </Stack>
    </>
  );
};
