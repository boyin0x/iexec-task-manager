import { TableBody, TableCell, TableRow } from "@mui/material";
import { useAppSelector } from "../../app/hooks";
import { selectAccountUserAddress } from "../account/accountSlice";
import IETable from "../../components/IETable.tsx";
import { useGetTasksQuery } from "./homeSlice";

export default function Tasks() {
  const userAddress = useAppSelector(selectAccountUserAddress);
  const { data } = useGetTasksQuery(userAddress);

  return (
    <>
      <IETable columnNames={["Id", "Deadline", "Status"]}>
        <TableBody sx={{}}>
          {data &&
            data.tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell component="th" scope="row">
                  {task.id}
                </TableCell>
                <TableCell style={{ width: 10 }} align="right">
                  {new Date(task.finalDeadline * 1000).toLocaleDateString()}
                </TableCell>
                <TableCell style={{ width: 10 }} align="right">
                  {task.status}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </IETable>
    </>
  );
}
