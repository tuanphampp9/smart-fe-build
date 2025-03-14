import { Drawer, styled, TextField } from '@mui/material'

export const StyledDrawer = styled(Drawer)({
  '& .MuiDrawer-paper': {
    backgroundColor: '#24272C',
    width: '16.666667%',
  },
})

export const StyledTextField = styled(TextField)(({ placeholder }) => ({
  '& .MuiOutlinedInput-root': {
    fontSize: '16px',
    color: '#000',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#E0E0E0',
  },
  '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: '#E0E0E0', // Màu viền khi hover, vẫn giữ màu giống như trạng thái bình thường
  },
  '& .MuiOutlinedInput-input': {
    padding: '8px',
  },
  '& .MuiInputBase-input.Mui-disabled': {
    WebkitTextFillColor: '#616467',
  },
  '& input[type=number]': {
    MozAppearance: 'textfield',
  },
  '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
    display: 'none',
    margin: 0,
  },
}))

export const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
})
