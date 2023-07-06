import React, { useEffect, useState } from 'react'
import Head from 'next/head';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import TableSortLabel from '@mui/material/TableSortLabel';
import styles from '../styles/Home.module.css'
import { TableHead, TextField } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { isSameDay, parse } from 'date-fns';


const TablePaginationActions = (props) => {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = event => onPageChange(event, 0);

  const handleBackButtonClick = event => onPageChange(event, page - 1);

  const handleNextButtonClick = event => onPageChange(event, page + 1);

  const handleLastPageButtonClick = event => onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));

  return (
    <Box sx={{ flexShrink: 0, ml: 4 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

const headCells = [
  {
    id: 'id',
    numeric: true,
    disablePadding: true,
    label: 'ID',
  },
  {
    id: 'firstName',
    numeric: false,
    disablePadding: false,
    label: 'First Name',
  },
  {
    id: 'lastName',
    numeric: false,
    disablePadding: false,
    label: 'Last Name',
  },
  {
    id: 'dateOfBirth',
    numeric: false,
    disablePadding: false,
    label: 'Date of Birth',
  },
  {
    id: 'function',
    numeric: false,
    disablePadding: false,
    label: 'Function',
  },
  {
    id: 'experience',
    numeric: true,
    disablePadding: false,
    label: 'Experience',
  },
];

const EnhancedTableHead = (props) => {
  const { order, orderBy, onRequestSort } = props;

  const createSortHandler = (property) => (event) => onRequestSort(event, property);

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
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
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const descendingComparator = (a, b, orderBy) => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

const dateDescendingComparator = (a, b, orderBy) => {
  const aDate = parse(a[orderBy], 'd.M.yyyy H:mm', new Date());
  const bDate = parse(b[orderBy], 'd.M.yyyy H:mm', new Date());
  if (bDate < aDate) {
    return -1;
  }
  if (bDate > aDate) {
    return 1;
  }
  return 0;
}


const getComparator = (order, orderBy) => {
  if (orderBy === 'dateOfBirth') {
    return order === 'desc'
    ? (a, b) => dateDescendingComparator(a, b, orderBy)
    : (a, b) => -dateDescendingComparator(a, b, orderBy);
  }
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

const propertySort = (array, comparator) => {
  const mappedArray = array.map((el, index) => [el, index]);
  mappedArray.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return mappedArray.map((el) => el[0]);
}

export const FiltersHeader = (props) => {
  const { filter, setFilter } = props;
  return (
    <Box display='flex' m={1} gap={1}>
      <TextField
        id="idFilter"
        label="ID"
        value={filter.id}
        type='number'
        onChange={(event) => setFilter((prev) => ({ ...prev, id: parseInt(event.target.value) }))}
      />
      <TextField
        id="firstNameFilter"
        label="First Name"
        value={filter.firstName}
        onChange={(event) => setFilter((prev) => ({ ...prev, firstName: event.target.value }))}
      />
      <TextField
        id="lastNameFilter"
        label="Last Name"
        value={filter.lastName}
        onChange={(event) => setFilter((prev) => ({ ...prev, lastName: event.target.value }))}
      />
      <DatePicker 
        id="dateFilter"
        label="Date of Birth"
        value={filter.dateOfBirth}
        onChange={(value) => setFilter((prev) => ({ ...prev, dateOfBirth: value }))}
      />
      <TextField
        id="functionFilter"
        label="Function"
        value={filter.function}
        onChange={(event) => setFilter((prev) => ({ ...prev, function: event.target.value }))}
      />
      <TextField
        id="experienceFilter"
        label="Experience"
        value={filter.experience}
        type='number'
        onChange={(event) => setFilter((prev) => ({ ...prev, experience: parseInt(event.target.value) }))}
      />
    </Box>
  );
}

const filterPeople = (people, filter) => people.filter(person => Object.keys(filter).every(
  key => {
    if (filter[key]) {
      if(key === 'experience' || key === 'id') {
        return person[key].toString().includes(filter[key].toString());
      }
      if (key === 'dateOfBirth') {
        const date = parse(person[key], 'd.M.yyyy H:mm', new Date());
        return isSameDay(filter[key], date);
      }
      return person[key].toLowerCase().includes(filter[key].toLowerCase());
    }
    return true;
  }
))

export default function Home() {
  const [page, setPage] = useState(0);
  const [people, setPeople] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('firstName');
  const [filter, setFilter] = useState({
    id: '',
    firstName: '',
    lastName: '',
    dateOfBirth: null,
    function: '',
    experience: '',
  });

  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const response = await fetch('/sluzba.json');
        const data = await response.json();
        setPeople(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchPeople();
  }, []);

  const filteredPeople = React.useMemo(
    () => filterPeople(people, filter),
    [people, filter],
  )

  const visiblePeople = React.useMemo(
    () =>
      propertySort(filteredPeople, getComparator(order, orderBy)).slice(
        page * 5,
        page * 5 + 5,
      ),
    [order, orderBy, page, filteredPeople],
  );

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * 5 - filteredPeople.length) : 0;

  const handleChangePage = (event, newPage) => setPage(newPage);
  
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <TableContainer component={Paper} sx={{ maxWidth: 1200 }}>
        <FiltersHeader filter={filter} setFilter={setFilter} />
          <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
          <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {visiblePeople.map((row) => (
                <TableRow key={row.id}>
                  <TableCell component="th" scope="row">
                    {row.id}
                  </TableCell>
                  <TableCell style={{ width: 160 }} align="right">
                    {row.firstName}
                  </TableCell>
                  <TableCell style={{ width: 160 }} align="right">
                    {row.lastName}
                  </TableCell>
                  <TableCell style={{ width: 160 }} align="right">
                    {row.dateOfBirth}
                  </TableCell>
                  <TableCell style={{ width: 160 }} align="right">
                    {row.function}
                  </TableCell>
                  <TableCell style={{ width: 160 }} align="right">
                    {row.experience}
                  </TableCell>
                </TableRow>
              ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  colSpan={6}
                  count={filteredPeople.length}
                  rowsPerPage={5}
                  rowsPerPageOptions={[{ label: '5', value: 5}]}
                  page={page}
                  SelectProps={{
                    inputProps: {
                      'aria-label': 'rows per page',
                    },
                    native: true,
                  }}
                  onPageChange={handleChangePage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </main>
    </div>
  );
}
