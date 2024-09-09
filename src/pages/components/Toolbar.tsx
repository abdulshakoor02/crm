import { styled } from '@mui/material/styles'
import { GridToolbarContainer } from '@mui/x-data-grid'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Magnify from 'mdi-material-ui/Magnify'
import Close from 'mdi-material-ui/Close'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

const StyledGridToolbarContainer = styled(GridToolbarContainer)({
  p: 2,
  pb: 0,
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-start',
  justifyContent: 'space-between'
})

const Toolbar = (props: any) => {
  return (
    <StyledGridToolbarContainer>
      <TextField
        variant='standard'
        value={props.value}
        onChange={props.onChange}
        placeholder='Search'
        InputProps={{
          onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => {
            if (event.key === 'Enter') {
              {
                props.doSearch()
              }
            }
          },
          startAdornment: <Magnify fontSize='small' />,
          endAdornment: (
            <>
              <IconButton size='small' title='Clear' aria-label='Clear' onClick={props.clearSearch}>
                <Close fontSize='small' />
              </IconButton>
              <IconButton size='small' title='Clear' aria-label='Clear' onClick={props.doSearch}>
                <ArrowForwardIcon fontSize='small' />
              </IconButton>
            </>
          )
        }}
        sx={{
          width: {
            xs: 1,
            sm: 'auto'
          },
          m: theme => theme.spacing(1, 0.5, 1.5),
          '& .MuiSvgIcon-root': {
            mr: 0.5
          },
          '& .MuiInput-underline:before': {
            borderBottom: 1,
            borderColor: 'divider'
          }
        }}
      />
    </StyledGridToolbarContainer>
  )
}

export default Toolbar
