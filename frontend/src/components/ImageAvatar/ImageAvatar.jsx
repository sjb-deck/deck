import { Avatar, Skeleton, Stack, useMediaQuery } from '@mui/material';
import { useState } from 'react';

import { useMediaImage } from '../../hooks/queries/useMediaImage';

export const ImageAvatar = ({ src, size, alt, isS3Image = false }) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const isMobile = useMediaQuery('(max-width:600px)');

  const { data: imageUrl, isLoading } = useMediaImage(isS3Image ? src : null);

  const finalSrc = isS3Image ? imageUrl : src;

  return (
    <Stack
      direction={isMobile ? 'row' : 'column'}
      justifyContent='center'
      alignItems='center'
      spacing={1}
    >
      <>
        {(!imgLoaded || isLoading) && (
          <Skeleton variant='circular' width={size} height={size} />
        )}
        <Avatar
          alt={alt}
          src={finalSrc}
          sx={{
            width: size,
            height: size,
            display: imgLoaded ? 'inline-flex' : 'none',
          }}
          onLoad={() => setImgLoaded(true)}
        />
      </>
    </Stack>
  );
};
