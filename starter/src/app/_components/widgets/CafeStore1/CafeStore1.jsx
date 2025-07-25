import { ASSET_IMAGES } from "@app/_utilities/constants/paths";
import { Div, Span } from "@jumbo/shared";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import {
  CardContent,
  CardMedia,
  Chip,
  Rating,
  Stack,
  Typography,
} from "@mui/material";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";

const CafeStore1 = () => {
  return (
    <Card>
      <CardMedia
        component="img"
        height="165"
        image={`${ASSET_IMAGES}/coffee.png`}
        alt="Coffee"
      />
      <CardContent>
        <Typography variant={"h4"}>Café Coffee Day</Typography>
        <Typography variant={"h6"} color={"text.secondary"}>
          Italian Cafe
        </Typography>
        <Div sx={{ mb: 2 }}>
          <Rating
            defaultValue={3}
            precision={0.5}
            sx={{ verticalAlign: "middle" }}
          />
          <Span sx={{ ml: 0.5 }}>(52)</Span>
        </Div>
        <Typography variant={"h6"} mb={2}>
          {`Tonight's availability`}
        </Typography>
        <Stack spacing={1} alignItems={"flex-start"} mb={3}>
          <Chip
            size={"small"}
            color={"success"}
            label={"02:00 AM - 02:30 PM"}
            icon={<AccessTimeIcon fontSize={"small"} />}
          />
          <Chip
            size={"small"}
            color={"success"}
            label={"04:00 AM - 05:00 PM"}
            icon={<AccessTimeIcon />}
          />
        </Stack>
        <Button variant={"contained"}>Reserve</Button>
      </CardContent>
    </Card>
  );
};

export { CafeStore1 };
