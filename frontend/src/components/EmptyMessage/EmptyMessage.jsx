import { Stack, Typography } from '@mui/material';

export const EmptyMessage = ({ message, fullscreen = true }) => {
  return (
    <Stack
      justifyContent='center'
      alignItems='center'
      minHeight={fullscreen ? '100vh' : null}
    >
      <div
        className='nav-margin-compensate'
        style={{
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-around',
          alignItems: 'center',
          width: '75%',
        }}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='16'
          height='16'
          fill='currentColor'
          className='bi bi-emoji-dizzy-fill'
          viewBox='0 0 16 16'
          style={{ width: '15vw', height: '15vh', marginBottom: '5vw' }}
        >
          <path d='M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zM4.146 5.146a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 1 1 .708.708l-.647.646.647.646a.5.5 0 1 1-.708.708L5.5 7.207l-.646.647a.5.5 0 1 1-.708-.708l.647-.646-.647-.646a.5.5 0 0 1 0-.708zm5 0a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708.708l-.647.646.647.646a.5.5 0 0 1-.708.708l-.646-.647-.646.647a.5.5 0 1 1-.708-.708l.647-.646-.647-.646a.5.5 0 0 1 0-.708zM8 13a2 2 0 1 1 0-4 2 2 0 0 1 0 4z' />
        </svg>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginBottom: '5vw',
          }}
        >
          <Typography variant='h3' gutterBottom>
            Nothing found!
          </Typography>
          <Typography variant='body'>
            {message || 'Seems like there is nothing to display here'}
          </Typography>
        </div>
      </div>
    </Stack>
  );
};
