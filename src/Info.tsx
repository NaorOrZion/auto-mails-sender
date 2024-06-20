import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";

export default function Info() {
    // This component is the info section placed on top of the card
    // It is a simple component with a title and a paragraph

    return (
        <>
            <Box className="mb-3" sx={{marginTop: "5vh"}}> 
                <Typography
                    color={"#383838"}
                    variant="h1"
                    className="rubik-regular"
                    fontSize={45}
                    fontWeight={"bold"}
                >
                    שולח המיילים האוטומטיטרון
                </Typography>
                <Typography
                    color={"#383838"}
                    className="rubik-regular"
                    fontSize={16}
                    fontWeight={"regular"}
                >
                    מדור ליב"ה שולח בעזרת האתר הזה מיילים עם הודעה מוצמדת
                </Typography>
            </Box>
        </>
    );
}
