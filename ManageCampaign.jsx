import React, { useState, useEffect } from "react";
import { useTheme } from "@emotion/react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Divider,
  Grid,
  Typography,
  Snackbar,
  IconButton,
  InputLabel,
  Table,
  TableContainer,
  Paper,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  styled,
  tableCellClasses,
  Button,
  TextField,
  InputBase,
  Tooltip,
  Zoom,
  Input,
  CardContent,
  Card,
  CardActions,
  FormControl,
} from "@mui/material";
import { TbAssembly, TbBrandCampaignmonitor, TbHome2 } from "react-icons/tb";
import Breadcrumb from "../../../../components/breadcrumb/BreadCrumb";
import { tokens } from "../../../../assets/color/theme";
import { MdDeleteForever, MdExpandMore } from "react-icons/md";
import { FcCallTransfer } from "react-icons/fc";
import {
  getAllActiveNumber,
  getAllCompanyRequest,
  getAllTargetReq,
  getCampaignByIdRequest,
} from "../service/campaign.request";
import Loader from "../../../../components/Loader/Loader";
import { PiCopySimpleThin } from "react-icons/pi";
import FormTextDropdown from "../../../../components/dropdown/FormTextDropdown";
import FormTextField from "../../../../components/textfield/FormTextField";
import FreeSolo from "../../../../components/dropdown/SearchableDropdown";
import SwitchCall from "../../../../components/chip/SwichCall";
import { useLocation, useNavigate } from "react-router-dom";
import QuantityInput from "../../../../components/textfield/numberField";
import { SiWebmoney } from "react-icons/si";
import { FaMobileRetro } from "react-icons/fa6";
import { FaCircle } from "react-icons/fa";
import "./styles.css";
import axios from "axios";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const paths = [
  {
    name: "Dashboard",
    path: "",
    icon: <TbHome2 />,
  },
  {
    name: "Campaign",
    icon: <TbBrandCampaignmonitor />,
    path: "campaigns",
  },
  {
    name: "Campaign",
    icon: <TbAssembly />,
  },
];

const fakeData = [
  {
    destination: "+18001500501",
    id: 1,
    name: "Air Deal1",
    status: 2,
    type: "Number",
  },
  {
    destination: "+18001500502",
    id: 2,
    name: "Air Deal2",
    status: 0,
    type: "Number",
  },
  {
    destination: "+18001500503",
    id: 3,
    name: "Air Deal3",
    status: 1,
    type: "Number",
  },
];

const UpdateCampaign = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const getId = JSON.parse(localStorage.getItem("user"));
  const company_id = getId.user_data.company_id;

  const [expanded, setExpanded] = useState("panel1");

  const [rows, setRows] = useState(fakeData);
  const [searchTargetData, setSearchTargetData] = useState([]);
  const [searchCampaignData, setSearchCampaignData] = useState([]);

  const [searchTargetParams, setSearchTargetParams] = useState("");
  const [searchCampaignParams, setSearchCampaignParams] = useState("");

  const [initialValue, setInitValue] = useState({});

  const campaign_id = location?.state?.campaign_id;

  const ivr_list = [
    { label: "IVR 1", value: "IVR 1" },
    { label: "IVR 2", value: "IVR 2" },
  ];
  const format_list = [
    { id: 1, label: "(###) #### ### ###", value: 1 },
    { id: 2, label: "(##) ### ### ####", value: 2 },
  ];
  const calls_types = [
    { id: 1, label: "Send target", value: 1 },
    { id: 2, label: "Different target", value: 2 },
    { id: 3, label: "Different target", value: 3 },
  ];

  const [open, setOpen] = useState(false);
  const [isLoader, setIsLoader] = useState(false);

  const [companyList, setCompanyList] = useState([]);
  const [companyId, setCompanyId] = useState({
    value: "",
    error: false,
    success: false,
  });

  const [randomId, setRandomId] = useState({
    value: "",
  });

  const [name, setName] = useState({
    value: "",
    error: false,
    success: false,
  });

  const [description, setDescription] = useState({
    value: "",
    error: false,
    success: false,
  });

  const [timeout, setTimeout] = useState({
    value: "",
    error: false,
    success: false,
  });

  const [tfnList, setTFNList] = useState([]);
  const [tfnNo, setTFNNo] = useState({
    value: "",
    error: false,
    success: false,
  });

  const [selectIvr, setSelectIvr] = useState({
    value: "",
    error: false,
    success: false,
  });

  const [callsType, setCallsType] = useState({
    value: null,
    error: false,
    success: false,
  });

  const [numberFormat, setNumberFormat] = useState({
    value: "",
    error: false,
    success: false,
  });

  const [isRecording, setIsRecording] = useState(false);

  const [isStrict, setIsStrict] = useState(false);
  const [isDuplicatesCalls, setIsDuplicatesCalls] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [isSilent, setIsSilent] = useState(false);
  const [dialAttempt, setDialAttempt] = useState(null);

  const [targetList, setTargetList] = useState([]);
  const [campaignTarget, setCampaignTarget] = useState([]);

  const [prevData, setPrevData] = useState([]);
  const [renderTimes, setRenderTimes] = useState(0);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  useEffect(() => {
    if (!searchTargetParams) {
      setSearchTargetData(targetList);
    }
    const filteredData = targetList?.filter((item) => {
      return (
        item.name.toLowerCase().includes(searchTargetParams.toLowerCase()) ||
        item.destination
          .toLowerCase()
          .includes(searchTargetParams.toLowerCase())
      );
    });
    setSearchTargetData(filteredData);
  }, [searchTargetParams, targetList]);

  useEffect(() => {
    if (!searchCampaignParams) {
      setSearchCampaignData(campaignTarget);
    }
    const filteredData = campaignTarget?.filter((item) => {
      return (
        item.name.toLowerCase().includes(searchCampaignParams.toLowerCase()) ||
        item.destination
          .toLowerCase()
          .includes(searchCampaignParams.toLowerCase())
      );
    });
    setSearchCampaignData(filteredData);
  }, [searchCampaignParams, campaignTarget]);

  const handleChangeSearch = (e) => {
    setSearchTargetParams(e.target.value);
  };
  const handleChangeCampaignSearch = (e) => {
    setSearchCampaignParams(e.target.value);
  };

  useEffect(() => {
    setIsLoader(true);
    getAllActiveNumber()
      .then((res) => {
        setIsLoader(false);
        const result = res?.data?.data?.map((ele) => {
          return {
            value: ele.id,
            label: ele.did_number,
          };
        });
        setTFNList(result);
      })
      .catch((err) => {
        setIsLoader(false);
      });
  }, []);

  useEffect(() => {
    getAllCompanyRequest()
      .then((res) => {
        const result = res.data?.data?.data?.map((ele) => {
          return {
            value: ele.id,
            label: ele.company_name,
          };
        });
        setCompanyList(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleChangeCompany = (value) => {
    setCompanyId(value);
  };
  const handleChangeName = (value) => {
    setName(value);
  };
  const handleChangeDescription = (value) => {
    setDescription(value);
  };
  const handleChangeTimeout = (value) => {
    setTimeout(value);
  };
  const handleChangeTFN = (value) => {
    setTFNNo(value);
  };
  const handleChangeStrict = (value) => {
    setIsStrict(value);
  };
  const handleChangeRecord = (value) => {
    setIsRecording(value);
  };
  const handleChangeDuplicateCalls = (value) => {
    setIsDuplicatesCalls(value);
  };
  const handleChangeWaitCall = (value) => {
    setIsWaiting(value);
  };
  const handleChangeSilentCall = (value) => {
    setIsSilent(value);
  };
  const handleChangeDialAttempt = (value) => {
    setDialAttempt(value);
  };

  const handleChangeCallsType = (value) => {
    setCallsType(value);
  };
  const handleChangeFormat = (value) => {
    setNumberFormat(value);
  };

  useEffect(() => {
    if (campaign_id) {
      getCampaignByIdRequest(campaign_id)
        .then((res) => {
          setInitValue(res.data.data[0]);
          const tfn_name = tfnList.find(
            (item) => item.value === res.data.data[0]?.did_number_id
          );
          const init_targets_list =
            res.data.data[0]?.campaign_members &&
            res.data.data[0].campaign_members.map((ele) => ({
              id: parseInt(ele.target_id),
              name: ele.target_name,
              weightage: ele.weightage,
              priorities: ele.priority,
            }));

          setCompanyId({ value: res.data.data[0]?.company_id });
          setRandomId({ value: res.data.data[0]?.campaign_random_id });
          setName({ value: res.data.data[0]?.name });
          setDescription({ value: res.data.data[0]?.description });
          setTimeout({ value: res.data.data[0]?.connection_timeout });
          setTFNNo({ value: tfn_name?.label });
          setSelectIvr({ value: res.data.data[0]?.ivr?.id });
          // setCallsType({ value: res.data.data[0].name });
          // setNumberFormat({ value: res.data.data[0].name });
          setIsRecording({ value: res.data.data[0].isRecording });
          // setCampaignTarget(init_targets_list);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [campaign_id]);

  useEffect(() => {
    if (initialValue) {
      getAllTargetReq()
        .then((res) => {
          const result_data = res.data?.data?.map((ele) => ({
            id: ele.id,
            name: ele.name,
            destination: ele.forwarding_number,
            type: ele.type,
            status: ele.status,
            weightage: null,
            priority: null,
          }));
          setTargetList(result_data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [initialValue]);
  // const user = JSON.parse(localStorage.getItem("user"));
  // let headers = {
  //   "Content-Type": "application/json",
  // };
  // headers["Authorization"] = `Bearer ${user.token}`;
  // axios
  //   .get(
  //     "http://139.84.169.123/portalforwarding/backend/public/api/target/active",
  //     {
  //       timeout: 7000, // Set a timeout of  seconds
  //       headers,
  //     }
  //   )
  //   .then((response) => {
  //     console.log(response.data.data);
  //     const result_data = response?.data?.data?.map((ele) => ({
  //       id: ele.id,
  //       name: ele.name,
  //       destination: ele.forwarding_number,
  //       type: ele.type,
  //       status: ele.status,
  //       weightage: null,
  //       priority: null,
  //     }));
  //     setTargetList(result_data);
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   });

  const handleClick = () => {
    setOpen(true);
    navigator.clipboard.writeText(randomId.value);
  };

  const handleClickCart = (val) => {
    const filter_target_list = targetList?.filter((ele) => ele.id !== val.id);
    setTargetList(filter_target_list);
    setCampaignTarget([...campaignTarget, val]);
  };

  const handleClickRemove = (val) => {
    const filter_campaign_targets = campaignTarget?.filter(
      (ele) => ele.id !== val.id
    );
    setTargetList([...targetList, val]);
    setCampaignTarget(filter_campaign_targets);
  };

  const handleChangePriority = (value, id) => {
    let change_priority_data = campaignTarget?.map((ele) => {
      return {
        ...ele,
        priority: ele.id === id ? value : null,
      };
    });
    setCampaignTarget(change_priority_data);
  };

  const handleChangeWeightage = (value, id) => {
    let change_weightage_data = campaignTarget?.map((ele) => {
      return {
        ...ele,
        weightage: ele.id === id ? value : null,
      };
    });
    setCampaignTarget(change_weightage_data);
  };

  return (
    <>
      {isLoader && <Loader />}
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
        <Box
          sx={{
            mt: 1,
          }}
        >
          <Box>
            <Typography variant="h5">{"Update Campaigns"}</Typography>
          </Box>

          <Box
            component="div"
            p={1}
            sx={{
              "&css-1pttoqb-MuiPaper-root-MuiCard-root": {
                backgroundColor: "inherit",
                backgroundImage: "none",
              },
            }}
          >
            <Accordion
              expanded={expanded === "panel1"}
              onChange={handleChange("panel1")}
            >
              <AccordionSummary
                expandIcon={<MdExpandMore />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography variant="h6">{"Campaign Info"}</Typography>
              </AccordionSummary>
              <Divider />

              <AccordionDetails>
                <Grid container spacing={1}>
                  <Grid item xs={4} md={2}>
                    <Typography gutterBottom variant="body1" component="div">
                      Random ID
                    </Typography>
                  </Grid>
                  <Grid item xs={8} md={4}>
                    <Grid container alignItems="center">
                      <Grid item>
                        <Typography
                          gutterBottom
                          variant="subtitle2"
                          component="div"
                        >
                          {randomId.value}
                          <IconButton size="small" onClick={handleClick}>
                            <PiCopySimpleThin />
                          </IconButton>
                          <Snackbar
                            message="Copied to clibboard"
                            anchorOrigin={{
                              vertical: "top",
                              horizontal: "center",
                            }}
                            autoHideDuration={2000}
                            onClose={() => setOpen(false)}
                            open={open}
                          />
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid container spacing={1}>
                  {company_id === "0" && (
                    <Grid item xs={12} md={6}>
                      <FormTextDropdown
                        Value={companyId.value}
                        onSelect={handleChangeCompany}
                        label={"Company *"}
                        CustomErrorLine={"Choose one"}
                        Required={true}
                        Options={companyList}
                      />
                    </Grid>
                  )}
                  <Grid item xs={12} md={6}>
                    <FormTextField
                      type="alpha"
                      placeholder={"Enter Campaign Name"}
                      label={"Name"}
                      Value={name.value}
                      onChangeText={handleChangeName}
                      Required={true}
                      CustomErrorLine={"Enter proper name"}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormTextField
                      type="textarea"
                      placeholder={"Enter Description"}
                      label={"Description"}
                      Value={description.value}
                      onChangeText={handleChangeDescription}
                      Required={false}
                      CustomErrorLine={"Enter proper description"}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormTextField
                      type="num"
                      placeholder={"Enter connection time out"}
                      label={"Connection timeout"}
                      Value={timeout.value}
                      onChangeText={handleChangeTimeout}
                      Required={false}
                      CustomErrorLine={"Enter proper description"}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormTextDropdown
                      Value={numberFormat.value}
                      onSelect={handleChangeFormat}
                      placeholder={"Select one"}
                      label={"Number Format" + " *"}
                      CustomErrorLine={"Choose one"}
                      multiSelect={false}
                      Required={true}
                      disable={false}
                      Options={format_list}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FreeSolo
                      Value={tfnNo.value}
                      Options={tfnList}
                      onSelect={handleChangeTFN}
                      label={"TFN Number *"}
                      CustomErrorLine={"Choose one"}
                      Required={false}
                      disable={false}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormTextDropdown
                      Value={callsType.value}
                      onSelect={handleChangeCallsType}
                      placeholder={"Select one"}
                      label={"Send duplicate calls to" + " *"}
                      CustomErrorLine={"Choose one"}
                      multiSelect={false}
                      Required={true}
                      disable={false}
                      Options={calls_types}
                    />
                  </Grid>
                  {callsType.value !== 1 && (
                    <>
                      <Grid item xs={6} md={3}>
                        <InputLabel
                          id="demo-select-small-label"
                          sx={{ color: colors.btn[100], marginTop: 1 }}
                        >
                          Strict Mode
                        </InputLabel>
                      </Grid>

                      <Grid item xs={6} md={3}>
                        <SwitchCall
                          isChecked={isStrict}
                          handleSwitch={handleChangeStrict}
                        />
                      </Grid>
                    </>
                  )}
                  <Grid item xs={6} md={3}>
                    <InputLabel
                      id="demo-select-small-label"
                      sx={{ color: colors.btn[100], marginTop: 1 }}
                    >
                      Handle Anonymous Calls as Duplicate
                    </InputLabel>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <SwitchCall
                      isChecked={isDuplicatesCalls}
                      handleSwitch={handleChangeDuplicateCalls}
                    />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <InputLabel
                      id="demo-select-small-label"
                      sx={{ color: colors.btn[100], marginTop: 1 }}
                    >
                      Call Recording
                    </InputLabel>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <SwitchCall
                      isChecked={isRecording}
                      handleSwitch={handleChangeRecord}
                    />
                  </Grid>
                  {isRecording && (
                    <>
                      <Grid item xs={6} md={3}>
                        <InputLabel
                          id="demo-select-small-label"
                          sx={{ color: colors.btn[100], marginTop: 1 }}
                        >
                          Call Waiting
                        </InputLabel>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <SwitchCall
                          isChecked={isWaiting}
                          handleSwitch={handleChangeWaitCall}
                        />
                      </Grid>
                    </>
                  )}
                  {isRecording && (
                    <>
                      <Grid item xs={6} md={3}>
                        <InputLabel
                          id="demo-select-small-label"
                          sx={{ color: colors.btn[100], marginTop: 1 }}
                        >
                          Call Silent
                        </InputLabel>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <SwitchCall
                          isChecked={isSilent}
                          handleSwitch={handleChangeSilentCall}
                        />
                      </Grid>
                    </>
                  )}
                  <Grid item xs={6} md={3}>
                    <InputLabel
                      id="demo-select-small-label"
                      sx={{ color: colors.btn[100], marginTop: 1 }}
                    >
                      Target Dial Attempts
                    </InputLabel>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <QuantityInput
                      min={0}
                      max={100}
                      value={dialAttempt}
                      onChangeValue={(val) => handleChangeDialAttempt(val)}
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
              <Divider sx={{ mt: 1, mb: 1 }} />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  m: 1.5,
                }}
              >
                <Button
                  size="medium"
                  variant="contained"
                  onClick={() => navigate("/campaigns")}
                >
                  {"Cancel"}
                </Button>
                <Button
                  size="medium"
                  type="submit"
                  onClick={() => {}}
                  sx={{ backgroundColor: colors.greenAccent[500] }}
                  variant="contained"
                >
                  Update
                </Button>
              </Box>
            </Accordion>
            <Accordion
              expanded={expanded === "panel2"}
              onChange={handleChange("panel2")}
            >
              <AccordionSummary
                expandIcon={<MdExpandMore />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography variant="h6">{"Call Routing"}</Typography>
                <Divider />
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={3}>
                  <Grid item md={5} sm={12}>
                    <div>
                      <div>
                        <Paper
                          component="form"
                          sx={{
                            p: "2px 4px",
                            display: "flex",
                            alignItems: "center",
                            width: "50%",
                            border: `1px solid  ${colors.blueAccent[700]}`,
                          }}
                        >
                          <InputBase
                            sx={{ ml: 1, flex: 1 }}
                            placeholder="Search ..."
                            inputProps={{ "aria-label": "search..." }}
                            value={searchTargetParams}
                            onChange={handleChangeSearch}
                          />
                        </Paper>
                      </div>
                      <div>
                        <TableContainer
                          sx={{
                            width: "100%",
                            bgcolor: colors.blueAccent[900],
                            maxHeight: 400,
                          }}
                        >
                          <Table
                            size={"small"}
                            sx={{ width: "100%" }}
                            aria-label="Target table"
                            stickyHeader
                          >
                            <TableHead>
                              <TableRow>
                                <StyledTableCell align="center">
                                  Name
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                  Type
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                  Destination
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                  Status
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                  Action
                                </StyledTableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {searchTargetData.length > 0 ? (
                                searchTargetData.map((row) => (
                                  <StyledTableRow key={row.id}>
                                    <StyledTableCell align="center">
                                      <Tooltip
                                        placement="right-start"
                                        TransitionComponent={Zoom}
                                        arrow
                                        title={row.name}
                                      >
                                        {row.name}
                                      </Tooltip>
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                      <Tooltip
                                        TransitionComponent={Zoom}
                                        title={row.type}
                                        arrow
                                        placement="right-start"
                                      >
                                        <IconButton
                                          aria-label="add"
                                          size="small"
                                          disableRipple
                                          sx={{ cursor: "default" }}
                                        >
                                          {row.type === "Number" ? (
                                            <FaMobileRetro size="18px" />
                                          ) : (
                                            <SiWebmoney size="18px" />
                                          )}
                                        </IconButton>
                                      </Tooltip>
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                      <Tooltip
                                        TransitionComponent={Zoom}
                                        title={row.destination}
                                        arrow
                                        placement="right-start"
                                      >
                                        {row.destination}
                                      </Tooltip>
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                      <Tooltip
                                        title={
                                          row.status === 1
                                            ? "Live"
                                            : row.status === 2
                                            ? "Pause"
                                            : "Inactive"
                                        }
                                        arrow
                                        placement="right-start"
                                        TransitionComponent={Zoom}
                                      >
                                        <IconButton
                                          aria-label="add"
                                          size="small"
                                          disableRipple
                                          sx={{ cursor: "default" }}
                                        >
                                          {row.status === 1 ? (
                                            <FaCircle
                                              size="15px"
                                              color={colors.green[100]}
                                            />
                                          ) : row.status === 2 ? (
                                            <FaCircle
                                              size="15px"
                                              color="yellow"
                                            />
                                          ) : (
                                            <FaCircle size="15px" color="red" />
                                          )}
                                        </IconButton>
                                      </Tooltip>
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                      <Tooltip
                                        placement="right-start"
                                        TransitionComponent={Zoom}
                                        arrow
                                        title="Add"
                                      >
                                        <IconButton
                                          aria-label="add"
                                          size="18px"
                                          onClick={(e) => handleClickCart(row)}
                                        >
                                          <FcCallTransfer
                                            color={colors.greenAccent[300]}
                                          />
                                        </IconButton>
                                      </Tooltip>
                                    </StyledTableCell>
                                  </StyledTableRow>
                                ))
                              ) : (
                                <TableRow>
                                  <StyledTableCell>
                                    No records found
                                  </StyledTableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </div>
                    </div>
                  </Grid>
                  <Grid item md={7} sm={12}>
                    <div>
                      <div>
                        <Paper
                          component="form"
                          sx={{
                            p: "2px 4px",
                            display: "flex",
                            alignItems: "center",
                            width: "50%",
                            border: `1px solid  ${colors.blueAccent[700]}`,
                          }}
                        >
                          <InputBase
                            sx={{ ml: 1, flex: 1 }}
                            placeholder="Search ..."
                            inputProps={{ "aria-label": "search..." }}
                            value={searchCampaignParams}
                            onChange={handleChangeCampaignSearch}
                          />
                        </Paper>
                      </div>
                      <div>
                        <TableContainer
                          sx={{
                            width: "100%",
                            maxHeight: 400,
                            bgcolor: colors.blueAccent[900],
                          }}
                        >
                          <Table
                            size={"small"}
                            sx={{ width: "100%" }}
                            aria-label="Campaign target table"
                            stickyHeader
                          >
                            <TableHead>
                              <TableRow>
                                <StyledTableCell>Name</StyledTableCell>
                                <StyledTableCell align="center">
                                  Type
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                  Destination
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                  Priority
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                  Weightage
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                  Status
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                  Action
                                </StyledTableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {searchCampaignData.length > 0 ? (
                                searchCampaignData.map((row) => (
                                  <StyledTableRow key={row.id}>
                                    <StyledTableCell component="th" scope="row">
                                      <Tooltip
                                        placement="right-start"
                                        TransitionComponent={Zoom}
                                        arrow
                                        title={row.name}
                                      >
                                        {row.name}
                                      </Tooltip>
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                      <Tooltip
                                        TransitionComponent={Zoom}
                                        title={row.type}
                                        arrow
                                        placement="right-start"
                                      >
                                        <IconButton
                                          aria-label="add"
                                          size="small"
                                          disableRipple
                                          sx={{ cursor: "default" }}
                                        >
                                          {row.type === "Number" ? (
                                            <FaMobileRetro size="18px" />
                                          ) : (
                                            <SiWebmoney size="18px" />
                                          )}
                                        </IconButton>
                                      </Tooltip>
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                      <Tooltip
                                        TransitionComponent={Zoom}
                                        title={row.destination}
                                      >
                                        {row.destination}
                                      </Tooltip>
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                      <QuantityInput
                                        value={row.priority}
                                        onChangeValue={(val) =>
                                          handleChangePriority(val, row.id)
                                        }
                                        min={1}
                                        max={99}
                                      />
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                      <QuantityInput
                                        value={row.weightage}
                                        onChangeValue={(val) =>
                                          handleChangeWeightage(val, row)
                                        }
                                        min={1}
                                        max={99}
                                      />
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                      <Tooltip
                                        title={
                                          row.status === 1
                                            ? "Live"
                                            : row.status === 2
                                            ? "Pause"
                                            : "Inactive"
                                        }
                                        arrow
                                        placement="right-start"
                                        TransitionComponent={Zoom}
                                      >
                                        <IconButton
                                          aria-label="add"
                                          size="small"
                                          disableRipple
                                          sx={{ cursor: "default" }}
                                        >
                                          {row.status === 1 ? (
                                            <FaCircle
                                              size="15px"
                                              color={colors.green[100]}
                                            />
                                          ) : row.status === 2 ? (
                                            <FaCircle
                                              size="15px"
                                              color="yellow"
                                            />
                                          ) : (
                                            <FaCircle size="15px" color="red" />
                                          )}
                                        </IconButton>
                                      </Tooltip>
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                      <Tooltip
                                        placement="right-start"
                                        TransitionComponent={Zoom}
                                        title="Delete"
                                      >
                                        <IconButton
                                          aria-label="add"
                                          size="small"
                                          onClick={() => handleClickRemove(row)}
                                        >
                                          <MdDeleteForever
                                            fontSize="inherit"
                                            color={colors.redAccent[400]}
                                          />
                                        </IconButton>
                                      </Tooltip>
                                    </StyledTableCell>
                                  </StyledTableRow>
                                ))
                              ) : (
                                <TableRow>
                                  <StyledTableCell>
                                    No records found
                                  </StyledTableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </div>
                    </div>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
            <CardActions sx={{ justifyContent: "space-between", m: 1 }}>
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => navigate("/campaigns")}
                >
                  {"Cancel"}
                </Button>
                <Button
                  size="small"
                  type="submit"
                  onClick={() => {}}
                  sx={{ backgroundColor: colors.greenAccent[500] }}
                  variant="contained"
                >
                  Update
                </Button>
              </CardActions>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default UpdateCampaign;
