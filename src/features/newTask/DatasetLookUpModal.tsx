import { TextField, TableBody, TableRow, TableCell } from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import { useAppDispatch } from "../../app/hooks";
import { AppModal, setOpenModal } from "../application/applicationSlice";
import IETable from "../../components/IETable.tsx";
import IEModal from "../application/IEModal";
import { setSelectedDataset, useLazySearchDatasetsQuery } from "./newTaskSlice";

export default function DatasetLookUpModal() {
  const [trigger, result] = useLazySearchDatasetsQuery();
  const [searchText, setSearchText] = useState("");
  const handleSearchTextChange = (e: ChangeEvent<HTMLInputElement>) =>
    setSearchText(e.target.value);

  const dispatch = useAppDispatch();

  useEffect(() => {
    trigger(searchText);
  }, [searchText]);

  const handleSelected = (datasetid: string) => {
    dispatch(setSelectedDataset(datasetid));
    dispatch(setOpenModal(null));
  };

  return (
    <>
      <IEModal kind={AppModal.LOOKUP_DATASET_MODAL}>
        <TextField
          fullWidth
          label="Search for a dataset..."
          type="search"
          variant="filled"
          onChange={handleSearchTextChange}
        />

        <IETable columnNames={[]}>
          <TableBody>
            {result?.data?.datasets &&
              result.data?.datasets.map((dataset) => (
                <TableRow
                  hover
                  key={dataset.id}
                  onClick={() => handleSelected(dataset.id)}
                >
                  <TableCell component="th" scope="row">
                    {dataset.id}
                  </TableCell>
                  <TableCell align="right">{dataset.name}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </IETable>
      </IEModal>
      )
    </>
  );
}
