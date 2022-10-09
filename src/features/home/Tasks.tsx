import { Button, TableBody, TableCell, TableRow } from "@mui/material";
import { useAppSelector } from "../../app/hooks";
import { selectAccountUserAddress } from "../account/accountSlice";
import IETable from "../../components/IETable.tsx";
import { useGetTasksQuery, useLazyFetchTaskResultQuery } from "./homeSlice";
import { useCallback, useEffect } from "react";

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
                  {task.status === "COMPLETED" && <DownloadAction taskId={task.id} />}
                  {task.status !== "COMPLETED" && task.status}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </IETable>
    </>
  );
}

function DownloadAction(props: { taskId: string }) {
  const [trigger, { data, isLoading, isError, isSuccess, error }] = useLazyFetchTaskResultQuery();

  const startFileDownload = useCallback((url: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", props.taskId + ".zip");
    document.body.appendChild(link);
    link.click();
  },[props.taskId])

  useEffect(() => {
    if (isSuccess && data) {
      startFileDownload(data);
    }
  }, [data, isSuccess, startFileDownload]);
  
  return (
    <>
      <Button disabled={isLoading || isError} size="small" onClick={() => trigger(props.taskId)}>
        Download
      </Button>
    </>
  );
}
