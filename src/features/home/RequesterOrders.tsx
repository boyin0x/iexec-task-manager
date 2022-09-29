import { Button, TableBody, TableCell, TableRow } from "@mui/material";
import { useAppSelector } from "../../app/hooks";
import { selectAccountUserAddress } from "../account/accountSlice";
import IETable from "../../components/IETable.tsx";
import {
  useCancelRequestorderMutation,
  useGetRequestOrderbookQuery,
} from "./homeSlice";

export default function RequestOrders() {
  const acuunt = useAppSelector(selectAccountUserAddress);
  const { data } = useGetRequestOrderbookQuery(acuunt);

  return (
    <>
      <IETable columnNames={["Hash", "App", "Status", ""]}>
        <TableBody sx={{}}>
          {data &&
            data.map((order) => (
              <TableRow key={order.orderHash}>
                <TableCell component="th" scope="row">
                  {order.orderHash}
                </TableCell>
                <TableCell style={{ width: 10 }} align="right">
                  {order.order.app}
                </TableCell>
                <TableCell style={{ width: 10 }} align="right">
                  {order.status}
                </TableCell>
                <TableCell style={{ width: 10 }} align="right">
                  <CancelOrderAction hash={order.orderHash} />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </IETable>
    </>
  );
}

function CancelOrderAction(props: { hash: string }) {
  const [cancel, { isLoading, isError }] = useCancelRequestorderMutation();
  return (
    <>
      <Button
        disabled={isLoading || isError}
        size="small"
        onClick={() => cancel(props.hash)}
      >
        Cancel
      </Button>
    </>
  );
}
