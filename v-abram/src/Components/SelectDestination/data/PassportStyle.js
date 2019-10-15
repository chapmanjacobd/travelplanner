export const styles = (theme) => ({
  root: {
    display: 'inline-flex',
    flexWrap: 'wrap',
    // minWidth: 120,
    // maxWidth: 200,
    // margin: '6px 8px 6px 4px',
    alignItems: 'center',
  },
  icon: {
    paddingRight: '3px',
  },
  iconButton: {
    // display: 'block',
    // marginTop: theme.spacing.unit * 2,
    // margin: 2,
    // padding: 4,
  },
  paper: {
    maxWidth: 200,
    margin: 'auto',
  },
  searchbar: {
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
  },
  searchinput: {
    fontSize: theme.typography.fontSize,
  },
  block: {
    display: 'block',
  },
  contentWrapper: {
    margin: '20px 16px',
  },
  formControl: {
    margin: 0,
    width: 0,
    height: 0,
    visibility: 'hidden',
    position: 'relative',
    right: '7%',
  },
  listText: {
    padding: '0 8px 0 0 !important',
  },
});
