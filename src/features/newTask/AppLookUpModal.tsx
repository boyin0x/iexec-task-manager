import { TextField, TableBody, TableRow, TableCell, Typography, Box, Button } from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import { useAppDispatch } from "../../app/hooks";
import { AppModal, setOpenModal } from "../application/applicationSlice";
import IETable from "../../components/IETable.tsx";
import IEModal from "../application/IEModal";
import {
  setSelectedApp,
  useLazyFetchAppOrderbookQuery,
  useLazySearchAppsQuery,
} from "./newTaskSlice";
import { App } from "../../generated/graphql";

export default function AppLookUpModal() {
  const [trigger, result] = useLazySearchAppsQuery();
  const [searchText, setSearchText] = useState("");
  const handleSearchTextChange = (e: ChangeEvent<HTMLInputElement>) =>
    setSearchText(e.target.value);

  useEffect(() => {
    trigger(searchText);
  }, [searchText, trigger]);

  return (
    <>
      <IEModal kind={AppModal.LOOKUP_APP_MODAL}>
        <TextField
          fullWidth
          label="Search for an app..."
          type="search"
          variant="filled"
          onChange={handleSearchTextChange}
        />

        <IETable columnNames={[]}>
          <TableBody>
            {result?.data &&
              result.data?.apps.map((app) => (
                <TableRow hover key={app.id}>
                  <CollapsibleCell app={app} />
                </TableRow>
              ))}
          </TableBody>
        </IETable>
      </IEModal>
      )
    </>
  );
}

function CollapsibleCell(props: { app: App }) {
  const dispatch = useAppDispatch();
  const [showOrders, setShowOrders] = useState(false);
  const [fetch, { isUninitialized, isSuccess, data, isLoading }] = useLazyFetchAppOrderbookQuery();
  useEffect(() => {
    if (showOrders && isUninitialized) {
      fetch(props.app.id);
    }
  }, [fetch, showOrders, isUninitialized, props.app.id]);

  const thereAreOrders = isSuccess && data && data.length > 0;
  const handleAppSelected = () => {
    dispatch(setSelectedApp(props.app.id));
    dispatch(setOpenModal(null));
  };
  return (
    <TableCell key={props.app.id} onClick={() => setShowOrders(true)} component="th" scope="row">
      <Box display="flex" flexDirection="row" justifyContent="space-between">
        <Typography>{props.app.id}</Typography>
        <Typography>{props.app.name}</Typography>
      </Box>

      <Box>
        {thereAreOrders && (
          <Typography color="secondary" variant="body2">
            Available orders:
          </Typography>
        )}
        {isLoading && (
          <Typography color="secondary" variant="body2">
            Looking for orders...
          </Typography>
        )}
        {showOrders && thereAreOrders && (
          <IETable columnNames={["Price", "Remaining", "Status"]}>
            <TableBody sx={{}}>
              {data &&
                data.map((order, idx) => (
                  <TableRow key={props.app.id + Math.random()}>
                    <TableCell component="th" scope="row">
                      {order.order.appprice}
                    </TableCell>
                    <TableCell component="th" scope="row" align="center">
                      {order.remaining}
                    </TableCell>
                    <TableCell component="th" scope="row" align="center">
                      {order.status}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </IETable>
        )}
        {thereAreOrders && (
          <Button fullWidth onClick={handleAppSelected}>
            SELECT
          </Button>
        )}
        {isSuccess && !thereAreOrders && (
          <Typography color="secondary" variant="body2">
            There are no orders available.
          </Typography>
        )}
      </Box>
    </TableCell>
  );
}
