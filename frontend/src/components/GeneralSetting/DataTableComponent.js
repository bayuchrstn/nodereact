import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { connect } from "react-redux";
import {
  Modal,
  ModalHeader, DropdownItem,
  ModalBody, DropdownMenu,
  Col, Button, Dropdown, DropdownToggle
} from "reactstrap";
import swal from "sweetalert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit, faPlus, faFileImport, faFileDownload } from "@fortawesome/free-solid-svg-icons";
import { delSetting, getSettingDetail, addSetting, getSettingsList } from "../../actions/getsetAction";
import styled from "styled-components";
import AddForm from "./AddForm";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx'
import ImportExcel from "./ImportExcel";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";

const mapStateToProps = (state) => {
  return {
    getSettingsList: state.getset.getSettingsList,
    getSettingsList_totalItems: state.getset.getSettingsList_totalItems,
    getSettingsList_currentPage: state.getset.getSettingsList_currentPage,
    getSettingsList_totalPages: state.getset.getSettingsList_totalPages,
    getResponDataSetting: state.getset.getResponDataSetting,
    errorResponDataSetting: state.getset.errorResponDataSetting,
    getSettingDetail: state.getset.getSettingDetail,
  };
};

const TextField = styled.input`
  height: 32px;
  width: 200px;
  border-radius: 3px;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border: 1px solid #e5e5e5;
  padding: 0 32px 0 16px;

  &:hover {
    cursor: pointer;
  }
`;

const ClearButton = styled(Button)`
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  height: 34px;
  width: 32px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FilterComponent = ({ filterText, onFilter, onClear }) => (
  <>
    <TextField
      id="search"
      type="text"
      placeholder="Search"
      aria-label="Search Input"
      value={filterText}
      onChange={onFilter}
    />
    <ClearButton type="button" onClick={onClear}>
      X
    </ClearButton>
  </>
);

const DataTableComponent = (props) => {
  const dispatch = useDispatch();
  const [dataResult, setData] = useState(props.getSettingsList);
  const [modal, setModal] = useState(false);
  const [modalImport, setModalImport] = useState(false);
  const [totalrows, setTotalRows] = useState(props.getSettingsList_totalItems);
  const [currentPage, setCurrentPage] = useState(props.getSettingsList_currentPage);
  const [sortname, setSort] = useState('');
  const [direction, setDirection] = useState('');
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);



  const toggle = () => {
    setModal(!modal);
  };
  const toggleImport = () => {
    setModalImport(!modalImport);
  };
  const [backdrop] = useState("static");
  const [filterText, setFilterText] = useState("");
  const filteredItems = Object.values(dataResult).filter(
    (item) =>
      (item.name &&
        item.name.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.value &&
        item.value.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.desc && item.desc.toLowerCase().includes(filterText.toLowerCase()))
  );
  const [resetPaginationToggle, setResetPaginationToggle] =
    useState(false);

  const subHeaderComponentMemo = React.useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText("");
        dispatch(getSettingsList(page, size, '', sortname, direction));
      }
    };

    return (
      <FilterComponent
        onFilter={(e) => setFilterText(e.target.value)}
        onClear={handleClear}
        filterText={filterText}
      />
    );
  }, [filterText, resetPaginationToggle]);

  const handleClick = (dispatch, id) => {
    swal({
      title: "Apakah Anda yakin akan menghapus data ini ?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        dispatch(delSetting(id));
        swal("Data Sukses dihapus", {
          icon: "success",
        });
      } else {
      }
    });
  };

  const handleEdit = (dispatch, id) => {
    dispatch(getSettingDetail(id));
    toggle();
  };

  const handleCreate = (dispatch) => {
    dispatch(addSetting());
    toggle();
  }

  const handleImport = () => {
    toggleImport();
  }

  const columns = [
    {
      id: "1",
      name: "No",
      selector: (row) => row.row_num,
      maxWidth: "50px",
      sortable: false,
    },
    {
      id: "2",
      name: "Nama",
      selector: (row) => row.name,
      sortable: true,
      sortField: 'name',
    },
    {
      id: "3",
      name: "Value",
      selector: (row) => row.value,
      sortable: true,
      sortField: 'value',
    },
    {
      id: "4",
      name: "Keterangan",
      selector: (row) => row.desc,
      sortable: true,
      sortField: 'desc',
    },
    {
      id: "5",
      name: "Action",
      width: "col col-lg-1",
      cell: (row) => (
        <div>
          <Button
            color="warning"
            className="mr-2"
            onClick={() => handleEdit(props.dispatch, row.id)}
          >
            <FontAwesomeIcon icon={faEdit} />
            Edit
          </Button>
          <Button
            color="danger"
            className="mr-2"
            onClick={() => handleClick(props.dispatch, row.id)}
          >
            <FontAwesomeIcon icon={faTrash} /> Delete
          </Button>
        </div>
      ),
      sortable: false
    },
  ];

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(prevState => !prevState);

  const exportPDF = () => {
    const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    const orientation = "portrait"; // portrait or landscape

    const marginLeft = 40;
    const doc = new jsPDF(orientation, unit, size);

    doc.setFontSize(15);

    const title = "My Awesome Report";
    const headers = [["No", "Nama", "Value", "Desc"]];

    const data = filteredItems.map(elt => [elt.row_num, elt.name, elt.value, elt.desc]);
    let content = {
      startY: 50,
      head: headers,
      body: data
    };

    doc.text(title, marginLeft, 40);
    doc.autoTable(content);
    doc.save("report.pdf")
  }

  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = '.xlsx';
  var Heading = [
    ["No", "Name", "Value", "Desc"],
  ];

  const exportToCSV = (csvData, fileName) => {
    const dataExport = filteredItems.map(csvData => [csvData.row_num, csvData.name, csvData.value, csvData.desc]);
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet([]);
    XLSX.utils.sheet_add_aoa(ws, Heading);
    XLSX.utils.sheet_add_json(ws, dataExport, { origin: 'A2', skipHeader: true });
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  const DownloadFormat = () => {
    var header = [["Name", "Value", "Desc"]];
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet([]);
    XLSX.utils.sheet_add_aoa(ws, header);
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, 'FormatGeneralSetting' + fileExtension);
  }

  const handleSort = async (column, sortDirection) => {
    setSort(column.sortField);
    setDirection(sortDirection);
  };

  const handlePageChange = page => {
    dispatch(getSettingsList(page, size, filterText, sortname, direction));
    setCurrentPage(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    dispatch(getSettingsList(page, newPerPage, filterText, sortname, direction));
    setSize(newPerPage);
  };

  useEffect(() => {
    setTotalRows(props.getSettingsList_totalItems);
    setCurrentPage(props.getSettingsList_currentPage);
    setPage(1);
    setSize(10);
    setData(props.getSettingsList);
  }, [props]);

  useEffect(() => {
    if (direction) {
      dispatch(getSettingsList(page, size, filterText, sortname, direction));
    }

  }, [direction,setDirection]);

  useEffect(() => {
      dispatch(getSettingsList(page, size, filterText, sortname, direction));

  }, [setFilterText, filterText]);


  return (
    <div>
      <ToastContainer autoClose={1000} />
      <Col className="pl-0">
        <Button
          onClick={() => handleCreate(props.dispatch)}
          color="primary"
          className="mb-2"
          data-toggle="modal"
        >
          <FontAwesomeIcon icon={faPlus} /> Create
        </Button>
        <Button
          onClick={() => handleImport(props.dispatch)}
          color="info"
          className="float-right"
          data-toggle="modal"
        >
          <FontAwesomeIcon icon={faFileImport} /> Import Excel
        </Button>
        <Button
          onClick={() => DownloadFormat()}
          color="dark"
          className="float-right mr-2"
          data-toggle="modal"
        >
          <FontAwesomeIcon icon={faFileDownload} /> Format
        </Button>
      </Col>
      <Col className="pl-0" >
        <Dropdown className=" float-right" isOpen={dropdownOpen} toggle={toggleDropdown}>
          <DropdownToggle caret>
            Export
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem header>Export File</DropdownItem>
            <DropdownItem onClick={() => exportPDF()}>PDF</DropdownItem>
            <DropdownItem onClick={() => exportToCSV(filteredItems, 'GeneralSetting')}>Excel</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </Col>
      <Modal
        isOpen={modal}
        toggle={toggle}
        size="lg"
        backdrop={backdrop}
        style={{ maxWidth: "900px", width: "100%" }}
      >
        <ModalHeader>General Setting</ModalHeader>
        <ModalBody>
          <AddForm toggle={toggle} />
        </ModalBody>
      </Modal>
      <ImportExcel toggle={toggleImport} modal={modalImport} />
      <DataTable
        columns={columns}
        data={filteredItems}
        noHeader
        pagination
        paginationServer
        paginationTotalRows={totalrows}
        paginationDefaultPage={currentPage}
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
        sortFunction={row => row}
        onSort={handleSort}
        fixedHeader
        fixedHeaderScrollHeight="500px"
        subHeader
        subHeaderComponent={subHeaderComponentMemo}
      />
    </div>
  );
};

export default connect(mapStateToProps, null)(DataTableComponent);
