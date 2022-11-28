import {useEffect, useState} from 'react';
import clsx from 'clsx';
import {createStyles, makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

import AdminChangeUserWithdrawalLimitDialog from './AdminChangeUserWithdrawalLimit'

// import {stringToHex} from './analytics.utils';
import { api } from '../api/api';
import { includes, omit, pickBy, reject } from 'ramda';

export const mapUsersToData = user => createData (
  user.userId,
  user.email,
  user.firstName,
  user.lastName,
  user.withdrawalLimit,
  user.accounts
);

function createData (
  userId,
  email,
  firstName,
  lastName,
  withdrawalLimit,
  accounts
) {
  return {userId, email, firstName, lastName, withdrawalLimit, accounts};
}

function descendingComparator (a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator (order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort (array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {id: 'userId', numeric: false, disablePadding: false, label: 'User ID'},
  {id: 'email', numeric: false, disablePadding: false, label: 'Email'},
  {id: 'firstName', numeric: false, disablePadding: false, label: 'First name'},
  {id: 'lastName', numeric: false, disablePadding: false, label: 'Last name'},
  {id: 'withdrawalLimit', numeric: false, disablePadding: false, label: 'Daily withdrawal limit'},
  {id: 'accounts', numeric: false, disablePadding: false, label: '# of Accounts'}
];

function EnhancedTableHead (props) {
  const {classes, order, orderBy, onRequestSort, toOmit} = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  const finalHeadCells = reject(c => includes(c.id, toOmit), headCells);

  return (
    <TableHead>
      <TableRow className={'analytics-table-head'}>
        {finalHeadCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    paper: {
      width: '100%',
      height: '100%',
      position: 'relative'
    },
    table: {
      //minWidth: 750,
    },
    tableContainer: {
      [theme.breakpoints.down('md')]: {
        marginTop: 70,
        width: 'calc(100vw - 60px)'
      },
      // [theme.breakpoints.down('md')]: {
      //   width: 'calc(100vw - 80px)'
      // },
    },
    visuallyHidden: {
      border: 0,
      clip: 'rect(0 0 0 0)',
      height: 1,
      margin: -1,
      overflow: 'hidden',
      padding: 0,
      position: 'absolute',
      top: 20,
      width: 1,
    },
    tablePagination: {
      position: 'absolute',
      bottom: -12,
      right: 0
    },
    changeLimitButton: {
      color: '#fff',
      background: theme.palette.primary.main,
      '&:hover': {
        color: theme.palette.primary.main,
      },
    },
    dialogRootStyles: {
      padding: 40,
      minWidth: 300
    },
    dialogInputContainer: {

    },
    dialogConfirmButton: {
      color: '#fff',
      background: theme.palette.primary.main,
      '&:hover': {
        color: theme.palette.primary.main,
      },
    },
    dialogCancelButton: {

    }
  }),
);

export default function AdminUsersList({
  data,
  adminScopes,
  selectedUser,
  setSelectedUser,
  refreshData,
  handleRefreshList,
  style = {}
}) {
  const classes = useStyles();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('id');
  const [page, setPage] = useState(0);
  const [dense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [changeLimitDialogOpen, setChangeLimitDialogOpen] = useState(false);
  const [changeLimitSuccessData, setChangeLimitSuccessData] = useState(null);
  const [changeLimitApiError, setChangeLimitApiError] = useState('');
  const [currentUserActionData, setCurrentUserActionData] = useState({});
  const [refreshList, initRefreshList] = useState(false);

  const canReadUserWithdrawalLimit = includes('withdrawal.read', adminScopes?.scp || []);
  const canUpdateUserWithdrawalLimit = includes('withdrawal.update', adminScopes?.scp || []);

  const handleOpenChangeLimitDialog = (userData) => {
    setCurrentUserActionData(userData);
    setChangeLimitDialogOpen(true);
  }

  const clearChangeLimitData = () => {
    setChangeLimitDialogOpen(false);
    setCurrentUserActionData({});
    setChangeLimitSuccessData(null);
    setChangeLimitApiError('');
    handleRefreshList();
  }

  const handleCloseChangeLimitDialog = (action, data) => {
    if (action === 'cancel') {
      clearChangeLimitData();
    }
    if (action === 'confirm') {
      api.adminChangeWithdrawalLimit(data)
        .then(res => {
          setChangeLimitSuccessData(res);
        })
        .catch((err) => {
          console.log('API error', err);
          setChangeLimitApiError('Sorry, an error occured.');
        });
    }
  };

  useEffect(() => {
    const rootHeight = document.getElementById('analytics-table-root')?.clientHeight;
    const headHeight = document.getElementsByClassName('analytics-table-head')?.item(0)?.clientHeight;
    const rowHeight = document.getElementsByClassName('analytics-table-row')?.item(0)?.clientHeight;
    const paginationHeight = document.getElementsByClassName('analytics-table-pagination')?.item(0)?.clientHeight;

    if (rootHeight && headHeight && rowHeight && paginationHeight) {
      setRowsPerPage(Math.floor((rootHeight - headHeight - paginationHeight) / rowHeight))
    }
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = data.map((n) => n.id);
      setSelectedUser(newSelecteds);
      return;
    }
    setSelectedUser([]);
  };

  const handleSelectUser = (id) => {
    if (selectedUser.length) {
      setSelectedUser([]);
      return;
    }
    setSelectedUser([id]);
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id) => selectedUser.indexOf(id) !== -1;

  return (
    <div className={classes.root} id="users-table-root" style={style}>
      <Paper className={classes.paper}>
        <TableContainer className={classes.tableContainer}>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
            aria-label="enhanced table"
            sx={{
              width: 'max-content'
            }}
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selectedUser.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={data.length}
              toOmit={canReadUserWithdrawalLimit ? [] : ['withdrawalLimit']}
            />
            <TableBody>
              {stableSort(data, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.userId);
                  const labelId = `enhanced-analytics-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      className={'analytics-table-row'}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.userId + index}
                      selected={isItemSelected}
                    >
                      <TableCell id={labelId} scope="row" align="left">
                        <span style={{background: '#ECECEC', padding: 4}}>{row.userId}</span>
                      </TableCell>
                      <TableCell align="left">{row.email}</TableCell>
                      <TableCell align="left">{row.firstName}</TableCell>
                      <TableCell align="left">{row.lastName}</TableCell>
                      {canReadUserWithdrawalLimit && (
                        <TableCell align="left">
                          <div style={{display: 'flex'}}>
                            <div style={{marginRight: 30, marginTop: 8}}>
                              {`$${row.withdrawalLimit}`}
                            </div>
                            {canUpdateUserWithdrawalLimit && (
                              <div>
                                <Button className={classes.changeLimitButton} onClick={() => handleOpenChangeLimitDialog(row)}>
                                  Change limit
                                </Button>
                              </div>
                            )}
                          </div>
                        </TableCell>
                      )}
                      <TableCell align="left">{row.accounts?.length}</TableCell>
                    </TableRow>
                  );
                })}
              {data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6}>No users found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          className={clsx(['analytics-table-pagination', classes.tablePagination])}
          rowsPerPageOptions={[]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <AdminChangeUserWithdrawalLimitDialog
        open={changeLimitDialogOpen}
        handleClose={handleCloseChangeLimitDialog}
        userData={currentUserActionData}
        apiError={changeLimitApiError}
        successData={changeLimitSuccessData}
        classes={classes}
      />
    </div>
  );
}
