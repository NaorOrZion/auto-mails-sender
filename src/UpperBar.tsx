import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import MinimizeIcon from "@mui/icons-material/Minimize";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import AppBar from "@mui/material/AppBar";
import { Grid } from "@mui/material";

export default function UpperBar() {
    // This component is the upper bar of the paper

    const paperHeader: string = "New Message";

    return (
        <>
            <AppBar
                position="static"
                sx={{
                    borderTopRightRadius: 3,
                    borderTopLeftRadius: 3,
                    backgroundColor: "#F2F2F2",
                    boxShadow: "none",
                    height: 35,
                    justifyContent: "center",
                    bottom: 0,
                }}
            >
                <Grid
                    container
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Grid item>
                        <CloseIcon color={"action"} className="m-2" />
                        <OpenInFullIcon color={"action"} className="m-1" />
                        <MinimizeIcon color={"action"} className="m-1" />
                    </Grid>
                    <Grid item></Grid>
                    <Grid item>
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{
                                flexGrow: 1,
                                display: "flex",
                                alignItems: "center",
                                marginLeft: 2,
                                color: "#041E49",
                            }}
                            color={"#444746"}
                            fontWeight={"regular"}
                            fontSize={15}
                        >
                            {paperHeader}
                        </Typography>
                    </Grid>
                </Grid>
            </AppBar>
        </>
    );
}
