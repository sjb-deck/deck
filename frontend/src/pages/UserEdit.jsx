import PhotoCamera from '@mui/icons-material/PhotoCamera';
import {
  Button,
  Box,
  Container,
  TextField,
  Typography,
  IconButton,
} from '@mui/material';
import { useFormik } from 'formik';
import { useRef, useState } from 'react';
import * as Yup from 'yup';

import { ImageAvatar, LoadingSpinner } from '../components';
import { IMG_USER } from '../globals/urls';
import { getUser } from '../hooks/auth/authHook';
import { useEditAccount } from '../hooks/mutations';
import { isImage, processImageFile } from '../utils';

const validationSchema = Yup.object({
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

export const UserEdit = () => {
  const user = getUser();

  if (!user) return <LoadingSpinner />;

  return <User user={user} />;
};

const User = ({ user }) => {
  const [hover, setHover] = useState(false);
  const fileInputRef = useRef(null);
  const { mutate, isLoading } = useEditAccount();
  const [isS3Image, setIsS3Image] = useState(!!user.extras.profile_pic);
  const [previewImage, setPreviewImage] = useState(
    user.extras.profile_pic || IMG_USER,
  );

  const formik = useFormik({
    initialValues: {
      username: user.username,
      password: '',
      confirmPassword: '',
      image: previewImage,
    },
    validationSchema,
    onSubmit: (values) => {
      mutate(values);
    },
  });

  const onFileSelect = async (e) => {
    if (
      !e.target.files ||
      e.target.files.length === 0 ||
      !isImage(e.target.files[0])
    ) {
      e.target.value = '';
      return;
    }

    const file = e.target.files[0];
    const processedFile = await processImageFile(file, user.id);

    setPreviewImage(URL.createObjectURL(processedFile));
    formik.setFieldValue('image', processedFile);
    setIsS3Image(false);
  };

  return (
    <Container component='main' maxWidth='xs'>
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 3,
        }}
      >
        <Typography component='h1' variant='h5' sx={{ mb: 2 }}>
          Edit Profile
        </Typography>
        <IconButton
          sx={{
            width: 80,
            height: 80,
            mb: 2,
          }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={() => fileInputRef.current.click()}
        >
          <ImageAvatar src={previewImage} size={80} isS3Image={isS3Image} />
          {hover && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.3)', // Gray tint on hover
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <PhotoCamera sx={{ color: 'white' }} />
            </Box>
          )}
        </IconButton>
        <input
          type='file'
          hidden
          accept='image/*'
          ref={fileInputRef}
          onChange={onFileSelect}
        />
        <TextField
          label='Username'
          name='username'
          variant='outlined'
          fullWidth
          sx={{ mb: 2 }}
          value={formik.values.username}
          onChange={formik.handleChange}
          error={formik.touched.username && Boolean(formik.errors.username)}
          helperText={formik.touched.username && formik.errors.username}
        />
        <TextField
          label='Password'
          name='password'
          type='password'
          variant='outlined'
          fullWidth
          sx={{ mb: 2 }}
          value={formik.values.password}
          onChange={formik.handleChange}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />
        <TextField
          label='Confirm password'
          name='confirmPassword'
          type='password'
          variant='outlined'
          fullWidth
          sx={{ mb: 2 }}
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          error={
            formik.touched.confirmPassword &&
            Boolean(formik.errors.confirmPassword)
          }
          helperText={
            formik.touched.confirmPassword && formik.errors.confirmPassword
          }
        />
        <Button
          variant='contained'
          disabled={isLoading}
          onClick={formik.handleSubmit}
          sx={{ mt: 2 }}
        >
          Save Changes
        </Button>
      </Box>
    </Container>
  );
};
