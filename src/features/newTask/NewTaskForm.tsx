import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectAccountUserAddress } from "../account/accountSlice";
import { Controller, useForm } from "react-hook-form";
import {
  selectSelectedApp,
  selectSelectedDataset,
  selectSelectedWorkerpool,
  useCreateRequestOrderMutation,
  useGetCategoriesQuery,
} from "./newTaskSlice";
import Grid from "@mui/material/Unstable_Grid2";
import { AppModal, setOpenModal } from "../application/applicationSlice";
import { Form, Card, CardHeader } from "../../components/styled";
import Breadcumbs from "../../components/Breadcrumbs";
import toast from "react-hot-toast";
import { Navigate } from "react-router-dom";

export interface RequestOrderFields {
  app: string;
  dataset: string;
  workerpool: string;
  category: string;
  inputFiles: string;
  args: string;
  limitPrice: boolean;
  appmaxprice: string;
  datasetmaxprice: string;
  workerpoolmaxprice: string;
}

export default function NewTaskForm() {
  const userAddress = useAppSelector(selectAccountUserAddress);
  const dispatch = useAppDispatch();
  const [limitPrice, setLimitPrice] = useState(false);

  const [createRequestOrder, result] = useCreateRequestOrderMutation();

  const selectedApp = useAppSelector(selectSelectedApp);
  const selectedDataset = useAppSelector(selectSelectedDataset);
  const selectedWorkerpool = useAppSelector(selectSelectedWorkerpool);
  const { data: categoriesData, error } = useGetCategoriesQuery();

  useEffect(() => {
    if (result.error) {
      toast.error(result.error.toString());
    }
  }, [result.error]);

  const {
    register,
    handleSubmit,
    setError,
    control,
    resetField,
    reset,
    formState: { errors },
  } = useForm<RequestOrderFields>({
    defaultValues: {
      app: selectedApp,
      dataset: selectedDataset,
      workerpool: selectedWorkerpool,
    },
  });

  useEffect(() => {
    reset({
      app: selectedApp,
      dataset: selectedDataset,
      workerpool: selectedWorkerpool,
    });
  }, [selectedApp, selectedDataset, selectedWorkerpool]);

  const validateInputFiles = (value: string) => {
    let files = value.split(",");
    const wrongUrl = (v: string) => v.trim().indexOf(" ") !== -1;
    return !files.some(wrongUrl) || "Please provide a coma separated URLs";
  };

  const onLimitPriceChange = () => {
    setLimitPrice(!limitPrice);
    resetField("appmaxprice");
    resetField("workerpoolmaxprice");
    resetField("datasetmaxprice");
  };

  const onSubmit = async (data: RequestOrderFields) => {
    try {
      const payload = await createRequestOrder(data);
    } catch (error) {
      setError("app", { message: "Order creation error" });
    }
  };

  const handleBrowseApp = () => {
    dispatch(setOpenModal(AppModal.LOOKUP_APP_MODAL));
  };

  const handleBrowseDataset = () => {
    dispatch(setOpenModal(AppModal.LOOKUP_DATASET_MODAL));
  };

  const handleBrowseWorkerpool = () => {
    dispatch(setOpenModal(AppModal.LOOKUP_WORKERPOOL_MODAL));
  };

  return (
    <>
      {result.isSuccess && <Navigate to="/" />}
      <Grid container spacing={1}>
        {/* PAGE HEADER */}
        <Grid xs={12}>
          <Breadcumbs title="Request Execution" />
        </Grid>
        <Grid container spacing={1}>
          <Grid xs={12}>
            <Card>
              <Grid container spacing={0}>
                <Grid xs={12} md={6}>
                  <CardHeader
                    title="Request Execution"
                    description="Run an iExec application at market price or buy computation at limit price on the Marketplace"
                  />
                </Grid>
                <Grid xs={12} md={6}>
                  <Form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={1} alignItems="center" justifyContent={"center"}>
                      <Grid xs={8}>
                        <Controller
                          name="app"
                          control={control}
                          render={({ field: { ref, ...field } }) => (
                            <TextField
                              {...field}
                              inputRef={ref}
                              fullWidth
                              placeholder="app address"
                              required
                              label={"App"}
                              variant="outlined"
                              error={Boolean(errors.app)}
                              helperText={errors.app?.message ?? ""}
                            />
                          )}
                        />
                      </Grid>
                      <Grid xs={4}>
                        <Button
                          fullWidth
                          color="secondary"
                          variant="contained"
                          onClick={handleBrowseApp}
                        >
                          Apps...
                        </Button>
                      </Grid>
                      <Grid xs={8}>
                        <Controller
                          name="dataset"
                          control={control}
                          render={({ field: { ref, ...field } }) => (
                            <TextField
                              {...field}
                              inputRef={ref}
                              fullWidth
                              placeholder="dataset address"
                              label={"Dataset"}
                              variant="outlined"
                              error={Boolean(errors.dataset)}
                              helperText={errors.dataset?.message ?? ""}
                            />
                          )}
                        />
                      </Grid>
                      <Grid xs={4}>
                        <Button
                          fullWidth
                          color="secondary"
                          variant="contained"
                          onClick={handleBrowseDataset}
                        >
                          Datasets...
                        </Button>
                      </Grid>
                      <Grid xs={8}>
                        <Controller
                          name="workerpool"
                          control={control}
                          render={({ field: { ref, ...field } }) => (
                            <TextField
                              {...field}
                              inputRef={ref}
                              fullWidth
                              placeholder="workerpool address"
                              label={"Workerpool"}
                              variant="outlined"
                              error={Boolean(errors.workerpool)}
                              helperText={errors.workerpool?.message ?? ""}
                            />
                          )}
                        />
                      </Grid>

                      <Grid xs={4}>
                        <Button
                          fullWidth
                          color="secondary"
                          variant="contained"
                          onClick={handleBrowseWorkerpool}
                        >
                          Workerpools...
                        </Button>
                      </Grid>
                      <Grid xs={12}>
                        <FormControl fullWidth>
                          <InputLabel id="categoryL">Category</InputLabel>
                          <Controller
                            render={({ field: { ref, ...field }, fieldState }) => (
                              <>
                                <Select
                                  inputRef={ref}
                                  {...field}
                                  labelId={"categoryL"}
                                  label={"Category"}
                                >
                                  <MenuItem key="" value="">
                                    Choose a task category...
                                  </MenuItem>
                                  {categoriesData &&
                                    categoriesData?.categories.map((c) => (
                                      <MenuItem key={c.id} value={c.id}>
                                        {c.name}
                                      </MenuItem>
                                    ))}
                                </Select>
                                {fieldState.error && (
                                  <FormHelperText error>{fieldState.error?.message}</FormHelperText>
                                )}
                              </>
                            )}
                            name={"category"}
                            rules={{ required: true }}
                            control={control}
                            defaultValue={""}
                          />
                        </FormControl>
                      </Grid>
                      <Grid xs={12}>
                        <TextField
                          label={"Args"}
                          variant="outlined"
                          fullWidth
                          placeholder="the arguments to pass to the app"
                          {...register("args", {})}
                          error={Boolean(errors.args)}
                          helperText={errors.args?.message ?? ""}
                        />
                      </Grid>
                      <Grid xs={12}>
                        <TextField
                          label={"Input Files"}
                          variant="outlined"
                          fullWidth
                          placeholder="the URL of input files to be used by the app"
                          {...register("inputFiles", {
                            validate: validateInputFiles,
                          })}
                          error={Boolean(errors.inputFiles)}
                          helperText={errors.inputFiles?.message ?? ""}
                        />
                      </Grid>
                      <Grid xs={12}>
                        <FormControlLabel
                          control={<Checkbox color="secondary" name="limitPrice" value="yes" />}
                          label="Place order at limit price"
                          {...register("limitPrice", {})}
                          onChange={onLimitPriceChange}
                        />
                      </Grid>

                      {limitPrice && (
                        <Grid xs={12}>
                          <Box display={"flex"} flexDirection={"row"} gap={1}>
                            <TextField
                              label={"App Max Price"}
                              variant="outlined"
                              fullWidth
                              type={"number"}
                              {...register("appmaxprice", {})}
                              error={Boolean(errors.appmaxprice)}
                              helperText={errors.appmaxprice?.message ?? ""}
                            />

                            <TextField
                              label={"Dataset Max Price"}
                              variant="outlined"
                              fullWidth
                              type={"number"}
                              {...register("datasetmaxprice", {})}
                              error={Boolean(errors.datasetmaxprice)}
                              helperText={errors.datasetmaxprice?.message ?? ""}
                            />

                            <TextField
                              label={"Workerpool Max Price"}
                              variant="outlined"
                              fullWidth
                              type={"number"}
                              {...register("workerpoolmaxprice", {})}
                              error={Boolean(errors.workerpoolmaxprice)}
                              helperText={errors.workerpoolmaxprice?.message ?? ""}
                            />
                          </Box>
                        </Grid>
                      )}

                      <Grid xs={12}>
                        <Button
                          fullWidth
                          color="primary"
                          type="submit"
                          variant="contained"
                          size="large"
                          data-testid="submit"
                        >
                          {"create order"}
                        </Button>
                      </Grid>
                    </Grid>
                  </Form>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
