import { TextField, TableBody, TableRow, TableCell } from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import { useAppDispatch } from "../../app/hooks";
import { AppModal, setOpenModal } from "../application/applicationSlice";
import IETable from "../../components/IETable.tsx";
import IEModal from "../application/IEModal";
import {
  setSelectedWorkerpool,
  useLazySearchWorkerpoolsQuery,
} from "./newTaskSlice";

export default function WorkerpoolLookUpModal() {
  const [trigger, result] = useLazySearchWorkerpoolsQuery();
  const [searchText, setSearchText] = useState("");
  const handleSearchTextChange = (e: ChangeEvent<HTMLInputElement>) =>
    setSearchText(e.target.value);

  const dispatch = useAppDispatch();

  useEffect(() => {
    trigger(searchText);
  }, [searchText]);

  const handleSelected = (workerpoolid: string) => {
    dispatch(setSelectedWorkerpool(workerpoolid));
    dispatch(setOpenModal(null));
  };

  return (
    <>
      <IEModal kind={AppModal.LOOKUP_WORKERPOOL_MODAL}>
        <TextField
          fullWidth
          label="Search for a workerpool..."
          type="search"
          variant="filled"
          onChange={handleSearchTextChange}
        />

        <IETable columnNames={[]}>
          <TableBody>
            {result?.data?.workerpools &&
              result.data?.workerpools.map((workerpool) => (
                <TableRow
                  hover
                  key={workerpool.id}
                  onClick={() => handleSelected(workerpool.id)}
                >
                  <TableCell component="th" scope="row">
                    {workerpool.id}
                  </TableCell>
                  <TableCell align="right">{workerpool.description}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </IETable>
      </IEModal>
      )
    </>
  );
}
