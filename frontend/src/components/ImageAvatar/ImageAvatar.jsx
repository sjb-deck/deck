import { Avatar, Skeleton, Stack, useMediaQuery } from '@mui/material';
import { useState } from 'react';

export const ImageAvatar = ({ src, size, alt }) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <Stack
      direction={isMobile ? 'row' : 'column'}
      justifyContent='center'
      alignItems='center'
      spacing={1}
    >
      <>
        {!imgLoaded && (
          <Skeleton variant='circular' width={size} height={size} />
        )}
        <Avatar
          alt={alt}
          src={src}
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
