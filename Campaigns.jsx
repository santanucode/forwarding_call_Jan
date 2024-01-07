import React, { useEffect, useMemo, useState } from "react";
import { Box, Fab, Tooltip, Typography, useTheme } from "@mui/material";
import { TbHome2, TbBrandCampaignmonitor } from "react-icons/tb";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { Pagination } from "rsuite";
import { Add } from "iconsax-react";
import Breadcrumb from "../../../../components/breadcrumb/BreadCrumb";
import StatusChip from "../../../../components/chip/StatusChip";
import { tokens } from "../../../../assets/color/theme";
import { FormModal as Modal } from "../../../../components/modal/FormModal";
import CampaignForm from "../../../../components/form/campaignForm/CampaignForm";
import RecordChip from "../../../../components/chip/RecordChip";
import DefaultTable from "../../../../components/tables/DefaultTable";
import Copyright from "../../../../components/footer/Footer";
import Loader from "../../../../components/Loader/Loader";
import {
  createCampRequest,
  getAllCampaignRequest,
  getCampaignByIdRequest,
  updateCampaignRequest,
  updateCampaignStatusRequest,
} from "../service/campaign.request";
import {
  CREATE_CAMPAIGN,
  STATUS_CAMPAIGN,
  UPDATE_CAMPAIGN,
} from "../../../../utility/constant";
import { isAuthorizedFunc } from "../../../../utility/utilty";
import { useNavigate } from "react-router-dom";

const paths = [
  {
    name: "Dashboard",
    path: "",
    icon: <TbHome2 />,
  },
  {
    name: "Campaign",
    icon: <TbBrandCampaignmonitor />,
  },
];

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Campaign = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const getId = JSON.parse(localStorage.getItem("user"));
  const company_id = getId.user_data.company_id;
  const [rows, setRows] = useState([]);
  const [isLoader, setLoader] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [clickedBtn, setClickedBtn] = useState("");
  const [currentType, setCurrentType] = useState();
  const [errorMessage, setErrorMessage] = useState();
  const [message, setMessage] = useState("");
  const [total, setTotal] = useState(0);
  const [activePage, setActivePage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [snackbarOpen, setSnackbarOpen] = useState({
    open: false,
    vertical: "top",
    horizontal: "right",
  });
  const [barVariant, setBarVariant] = useState("");
  const [timer, setTimer] = useState(0);
  const { vertical, horizontal, open } = snackbarOpen;
  const colors = tokens(theme.palette.mode);

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        size: 100,
        enableColumnDragging: false,
        enableGlobalFilter: true,
        enableColumnFilter: false,
        enableColumnActions: false,
        muiTableHeadCellProps: {
          align: "left",
        },
        muiTableBodyCellProps: {
          align: "left",
        },
      },
      {
        accessorKey: "description",
        header: "Description",
        enableColumnDragging: false,
        enableGlobalFilter: true,
        enableColumnFilter: false,
        enableColumnActions: false,
        size: 100,
        muiTableHeadCellProps: {
          align: "left",
        },
        muiTableBodyCellProps: {
          align: "left",
        },
      },
      {
        accessorKey: "recording",
        header: "Recording",
        enableColumnDragging: false,
        enableGlobalFilter: false,
        enableColumnFilter: false,
        enableColumnActions: false,
        size: 50,
        Cell: ({ cell }) => <RecordChip value={cell.getValue()} />,
        muiTableBodyCellProps: {
          align: "left",
        },
        muiTableHeadCellProps: {
          align: "left",
        },
      },

      {
        accessorKey: "status",
        header: "Status",
        size: 100,
        enableColumnDragging: false,
        enableGlobalFilter: false,
        enableColumnFilter: false,
        enableColumnActions: false,
        Cell: ({ cell }) => <StatusChip value={cell.getValue()} />,
        muiTableHeadCellProps: {
          align: "left",
        },
        muiTableBodyCellProps: {
          align: "left",
        },
      },
    ],
    []
  );
  const targetColumn = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        enableEditing: false,
        enableColumnFilter: false,
        enableColumnActions: false,
      },
      {
        accessorKey: "weightage",
        size: 50,
        enableColumnFilter: false,
        enableColumnActions: false,
        editSelectOptions: [
          { text: 1, value: 1 },
          { text: 2, value: 2 },
          { text: 3, value: 3 },
          { text: 4, value: 4 },
          { text: 5, value: 5 },
          { text: 6, value: 6 },
          { text: 7, value: 7 },
          { text: 8, value: 8 },
          { text: 9, value: 9 },
          { text: 10, value: 10 },
        ],
        editVariant: "select",
        header: "Weightage",
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "priority",
        size: 50,
        enableColumnFilter: false,
        enableColumnActions: false,
        editSelectOptions: [
          { text: 1, value: 1 },
          { text: 2, value: 2 },
          { text: 3, value: 3 },
          { text: 4, value: 4 },
          { text: 5, value: 5 },
          { text: 6, value: 6 },
          { text: 7, value: 7 },
          { text: 8, value: 8 },
          { text: 9, value: 9 },
          { text: 10, value: 10 },
        ],
        editVariant: "select",
        header: "Priorities",
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellProps: {
          align: "center",
        },
      },
    ],
    []
  );
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen({ ...snackbarOpen, open: false });
  };
  const openAddModal = () => {
    setIsOpen(true);
  };
  const handleModalClose = () => {
    setCurrentId(null);
    setIsOpen(false);
  };
  const handleSelectBtn = (btn) => {
    setClickedBtn(btn);
  };

  const getAllCampaigns = (activePage, limit) => {
    setLoader(true);
    getAllCampaignRequest(activePage, limit)
      .then((res) => {
        let getData = res.data.data.length === 0 ? [] : res.data.data.data;
        setRows(getData);
        setTotal(res.data.data.length === 0 ? 0 : res.data.data?.total);
        setLoader(false);
      })
      .catch(() => {
        setLoader(false);
      });
  };

  useEffect(() => {
    getAllCampaigns(activePage, limit);
  }, [activePage, limit]);

  const getTargetData = (id) => {
    setLoader(true);
    getCampaignByIdRequest(id)
      .then((res) => {
        setLoader(false);
        const currentData = {
          id: res.data.data[0].id,
          company_id: res.data.data[0].company_id,
          randomId: res.data.data[0].campaign_random_id,
          name: res.data.data[0].name,
          description: res.data.data[0].description,
          campaign_rate: res.data.data[0].campaign_rate,
          timeout: res.data.data[0].connection_timeout,
          isRecording: res.data.data[0].recording === 0 ? false : true,
          status: res.data.data[0].status,
          ivr: {
            id: res.data.data[0].dail_ivr_options,
            name: res.data.data[0].dail_ivr_options,
          },
          targets:
            res.data.data[0].campaign_members &&
            res.data.data[0].campaign_members.map((ele) => ({
              id: parseInt(ele.target_id),
              name: ele.target_name,
              weightage: ele.weightage,
              priorities: ele.priority,
            })),
          number: res.data.data[0].did_number_id,
        };
        setCurrentType(currentData);
        setIsOpen(true);
      })
      .catch((err) => {
        setLoader(false);
        setMessage(err.message);
      });
  };

  const getTargetCampaignList = () => {
    if (currentId !== null) {
      setLoader(true);
      getCampaignByIdRequest(currentId)
        .then((res) => {
          setLoader(false);
          const currentData = {
            id: res.data.data[0].id,
            randomId: res.data.data[0].campaign_random_id,
            name: res.data.data[0].name,
            description: res.data.data[0].description,
            campaign_rate: res.data.data[0].campaign_rate,
            timeout: res.data.data[0].connection_timeout,
            isRecording: res.data.data[0].recording === 0 ? false : true,
            status: res.data.data[0].status,
            ivr: {
              id: res.data.data[0].dail_ivr_options,
              name: res.data.data[0].dail_ivr_options,
            },
            targets:
              res.data.data[0].campaign_members &&
              res.data.data[0].campaign_members.map((ele) => ({
                id: parseInt(ele.target_id),
                name: ele.target_name,
                weightage: ele.weightage,
                priorities: ele.priority,
              })),
            number: res.data.data[0].did_number_id,
          };
          setCurrentType(currentData);
          setIsOpen(true);
        })
        .catch((err) => {
          setLoader(false);
          console.log(err);
        });
    }
  };

  useEffect(() => {
    if (currentId !== null) {
      getTargetCampaignList();
    }
  }, [timer]);

  useEffect(() => {
    const interval = setInterval(() => setTimer(timer + 1), 10000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChangeEdit = (ele) => {
    // setClickedBtn("edit");
    // setCurrentId(ele.id);
    // getTargetData(ele.id);
    navigate("/manage-campaigns", { state: { campaign_id: ele.id } });
  };
  const handleStatusChange = (value) => {
    setLoader(true);
    const params = {
      id: value.id,
      data: {
        status: value.status === 1 ? 0 : 1,
      },
    };
    updateCampaignStatusRequest(params)
      .then((res) => {
        getAllCampaigns(activePage, limit);
        setLoader(false);
        setBarVariant("success");
        setMessage(res.data.message);
        setSnackbarOpen({ ...snackbarOpen, open: true });
        setIsOpen(false);
      })
      .catch((err) => {
        setLoader(false);
        setErrorMessage(err.message);
      });
  };
  const handleAddCampaign = (value) => {
    setLoader(true);
    createCampRequest(value)
      .then((res) => {
        getAllCampaigns(activePage, limit);
        setLoader(false);
        setBarVariant("success");
        setMessage(res.data.message);
        setSnackbarOpen({ ...snackbarOpen, open: true });
        setIsOpen(false);
      })
      .catch((err) => {
        setLoader(false);
        setErrorMessage(err.message);
      });
  };
  const handleUpdateCampaign = (value) => {
    setLoader(true);
    const reqData = {
      id: currentType.id,
      data: value,
    };
    updateCampaignRequest(reqData)
      .then((res) => {
        getAllCampaigns(activePage, limit);
        setLoader(false);
        setBarVariant("success");
        setMessage(res.data.message);
        setSnackbarOpen({ ...snackbarOpen, open: true });
        setCurrentId(null);
        setIsOpen(false);
      })
      .catch((err) => {
        setLoader(false);
        setErrorMessage(err.message);
      });
  };

  const selectModal = () => {
    return (
      <CampaignForm
        handleFormData={
          clickedBtn === "add" ? handleAddCampaign : handleUpdateCampaign
        }
        onHandleClose={handleModalClose}
        clickedBtn={clickedBtn}
        initialValue={clickedBtn === "edit" ? currentType : {}}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
        targetColumn={targetColumn}
        company_id={company_id}
      />
    );
  };

  return (
    <>
      {isLoader && <Loader />}
      <Snackbar
        open={open}
        anchorOrigin={{ vertical, horizontal }}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={barVariant}
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
      <Box
        sx={{
          "& .rs-pagination-group": {
            color: colors.layoutColor[200],
          },
          "& .MuiTypography-root": {
            color: colors.layoutColor[200],
          },
          mt: 1,
          ml: 2,
          mr: 2,
          mb: 2,
          height: "80%",
          backgroundColor: "inherit",
        }}
      >
        <Breadcrumb pathList={paths} />
        <Box>
          <Modal modal_width={"50%"} isOpen={isOpen}>
            {selectModal()}
          </Modal>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <div>
              <Typography variant="h5">{"Manage Campaigns"}</Typography>
            </div>
            <div style={{ zIndex: 1 }}>
              {isAuthorizedFunc(CREATE_CAMPAIGN) && (
                <Fab
                  aria-label="add"
                  size="small"
                  sx={{
                    boxShadow: "none",
                    backgroundColor: colors.greenAccent[500],
                  }}
                  onClick={() => {
                    openAddModal();
                    handleSelectBtn("add");
                  }}
                >
                  <Tooltip title="Add">
                    <Add />
                  </Tooltip>
                </Fab>
              )}
            </div>
          </Box>
          <Box>
            <DefaultTable
              isLoading={isLoader}
              data={rows}
              column={columns}
              handleEditAction={handleChangeEdit}
              handleStatusAction={handleStatusChange}
              isSearchable={true}
              isEditable={isAuthorizedFunc(UPDATE_CAMPAIGN)}
              isDeletable={false}
              isStatusChangable={isAuthorizedFunc(STATUS_CAMPAIGN)}
            />
            <Pagination
              style={{
                marginTop: 5,
              }}
              layout={["total", "-", "pager", "skip"]}
              size={"xs"}
              prev={true}
              next={true}
              first={true}
              last={true}
              ellipsis={true}
              boundaryLinks={true}
              total={total}
              limit={limit}
              maxButtons={5}
              activePage={activePage}
              onChangePage={setActivePage}
              limitOptions={[5, 10, 25, 50, 100]}
              onChangeLimit={setLimit}
            />
          </Box>
        </Box>
      </Box>
      <Copyright />
    </>
  );
};

export default Campaign;
