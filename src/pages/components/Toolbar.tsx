import React from 'react';
import { styled } from '@mui/material/styles';
import { GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Magnify from 'mdi-material-ui/Magnify';
import Close from 'mdi-material-ui/Close';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { Box } from '@mui/material';
import { ExportVariant } from 'mdi-material-ui';

const StyledGridToolbarContainer = styled(GridToolbarContainer)(({ theme }) => ({
  padding: theme.spacing(2, 0, 0, 2),
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

interface ToolbarProps {
  searchValue: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void;
  onClearSearch: () => void;
  onAddRow?: () => void; // Optional Add Row handler
  disableExport?: boolean; // Option to disable export button
}

const Toolbar: React.FC<ToolbarProps> = ({
  searchValue,
  onSearchChange,
  onSearch,
  onClearSearch,
  onAddRow,
  disableExport = false,
}) => {
  return (
    <StyledGridToolbarContainer sx={{ mx: '0px', my: "15px", p: "0px"}}>
       {/* Left Section: Export Button (Optional) */}
       {!disableExport && (
        <GridToolbarContainer>
              <GridToolbarExport startIcon={<ExportVariant/>} sx={{
        backgroundColor: 'transparent',
        color: 'primary.main',
        padding: '8px 16px',
        borderRadius: '4px',
        border: '1px solid',
        borderColor: 'primary.main',
        fontWeight: 'bold',
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.04)', // Light gray hover effect (standard for MUI outlined buttons)
        },
      }}
      />
        </GridToolbarContainer>
      )}
     
      <Box>

      {/* Middle Section: Search Field */}
      <TextField
        variant="standard"
        value={searchValue}
        onChange={onSearchChange}
        placeholder="Search"
        InputProps={{
          onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => {
            if (event.key === 'Enter') {
              onSearch();
            }
          },
          startAdornment: <Magnify fontSize="small" />,
          endAdornment: (
            <>
              {searchValue && (
                <IconButton
                  size="small"
                  title="Clear"
                  aria-label="Clear"
                  onClick={onClearSearch}
                >
                  <Close fontSize="small" />
                </IconButton>
              )}
              <IconButton
                size="small"
                title="Search"
                aria-label="Search"
                onClick={onSearch}
              >
                <ArrowForwardIcon fontSize="small" />
              </IconButton>
            </>
          ),
        }}
        sx={{
          width: {
            xs: 1,
            sm: 'auto',
          },
          margin: theme => theme.spacing(1, 0.5, 1.5),
          '& .MuiSvgIcon-root': {
            marginRight: 0.5,
          },
          '& .MuiInput-underline:before': {
            borderBottom: 1,
            borderColor: 'divider',
          },
        }}
      />

     {/* Right Section: Add Row (Optional) */}
     {onAddRow && (
       <Button
       variant="contained"
       color="primary"
       startIcon={<AddIcon />}
       onClick={onAddRow}
       sx={{ mx: 2 }}
       >
        Add Row
      </Button>
    )}
      </Box>
    </StyledGridToolbarContainer>
  );
};

export default Toolbar;
