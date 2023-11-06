const useStyles = {
  paper: {
    border: '1px solid',
    borderRadius: 10,
    display: 'flex',
    flexWrap: 'wrap',
    maxWidth: '308px',
    overflow: 'auto',
    '& .gradient-result': {
      display: 'none'
    },
    '& .input_rgba': {
      display: 'none'
    },
    '& .gradient-interaction': {
      order: -1,
      marginBottom: '1rem'
    },
    '& .colorpicker': {
      display: 'flex',
      flexDirection: 'column'
    },
    '& .color-picker-panel, & .popup_tabs-header, & .popup_tabs, & .colorpicker, & .colorpicker .color-picker-panel, & .popup_tabs-header .popup_tabs-header-label-active':
      {
        backgroundColor: 'transparent'
      },
    '& .popup_tabs-body': {
      paddingBottom: 4
    }
  }
}

export default useStyles
