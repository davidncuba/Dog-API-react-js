import { Alert, AlertColor, Snackbar } from "@mui/material";
import { useEffect, useState } from "react";
interface SnackBarProps {
  openSnack: boolean;
  setOpenSnack: React.Dispatch<React.SetStateAction<boolean>>;
  message: string;
  severity: AlertColor | undefined;
}
export const SnackBar = ({
  openSnack,
  setOpenSnack,
  message,
  severity,
}: SnackBarProps) => {
  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnack(false);
  };

  return (
    <>
      <Snackbar
        open={openSnack}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ horizontal: "right", vertical: "top" }}
      >
        <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    </>
  );
};
