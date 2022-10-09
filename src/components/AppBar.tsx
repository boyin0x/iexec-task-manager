import { useEffect } from "react";
import {
  styled,
  AppBar as MuiAppBar,
  Box,
  IconButton,
  Toolbar,
  Typography,
  LinearProgress,
  Button,
} from "@mui/material";
import logo from "../logo.svg";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  connect,
  selectAccountError,
  selectAccountIsConnected,
  selectAccountStatus,
  selectAccountUserAddress,
  selectthereIsSomeRequestPending,
} from "../features/account/accountSlice";
import { useNavigate } from "react-router-dom";
import { truncateAddress } from "../helpers/utils";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import toast from "react-hot-toast";

const Gradient = styled(Box)(({ theme }) => ({
  background:
    "linear-gradient(90deg, #CE2C68 0.01%, #FCD15A 27.6%, #FCD15A 67.71%, #CE2C68 99.98%);",
  height: "5px",
}));

export default function AppBar() {
  const dispatch = useAppDispatch();
  const isConnected = useAppSelector(selectAccountIsConnected);
  const accountStatus = useAppSelector(selectAccountStatus);
  const accountError = useAppSelector(selectAccountError);

  const accountAddress = useAppSelector(selectAccountUserAddress);
  const navigate = useNavigate();

  const handleConnect = () => dispatch(connect());
  const handleAccount = () => navigate("/account");

  useEffect(() => {
    dispatch(connect());
  }, [dispatch]);

  useEffect(() => {
    if (accountStatus === "failed") {
      toast.error(accountError && accountError.length > 0 ? accountError : "Connection error");
      navigate("/");
    }
  }, [accountStatus, accountError, navigate]);

  return (
    <>
      <MuiAppBar
        position="sticky"
        sx={{
          backgroundColor: "#000",
          borderRadius: 0,
        }}
      >
        <Toolbar
          variant="dense"
          sx={{
            height: "70px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Box display="flex" alignItems="center">
            <Box
              component="img"
              sx={{
                height: 33,
                paddingRight: "7px",
              }}
              alt="iExec"
              src={logo}
            />
            <Typography
              sx={{
                fontFamily: "'Mulish', sans-serif",
                fontStyle: "normal",
                fontWeight: "700",
                fontSize: "20px",
                lineHeight: "24px",
                letterSpacing: "0.4px",
                color: "white",
                width: "200px",
              }}
              color="inherit"
            >
              iExec Task Manager
            </Typography>
          </Box>

          {isConnected && (
            <Box
              alignItems="center"
              display="flex"
              flexDirection="row"
              justifyContent="flex-end"
              gap={2}
            >
              <Typography
                sx={{
                  fontFamily: "'Mulish', sans-serif",
                  fontStyle: "normal",
                  fontWeight: "700",
                  fontSize: "20px",
                  lineHeight: "24px",
                  letterSpacing: "0.4px",
                  color: "white",
                }}
                variant="h6"
                color="inherit"
                component="div"
              >
                {truncateAddress(accountAddress)}
              </Typography>

              <IconButton
                onClick={handleAccount}
                color="primary"
                aria-label="show account"
                component="label"
              >
                <AccountCircleIcon />
              </IconButton>
            </Box>
          )}
          {!isConnected && (
            <Button variant="contained" onClick={handleConnect}>
              Connect
            </Button>
          )}
        </Toolbar>
        {!useAppSelector(selectthereIsSomeRequestPending) ? (
          <Gradient> </Gradient>
        ) : (
          <LinearProgress
            sx={{
              backgroundColor: "FCD15A",
              "& .MuiLinearProgress-barColorPrimary": {
                backgroundColor: "#c4c4c4",
              },
            }}
          />
        )}
      </MuiAppBar>
    </>
  );
}
