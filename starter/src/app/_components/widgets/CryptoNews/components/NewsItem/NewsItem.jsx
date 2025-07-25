import { useJumboTheme } from "@jumbo/components/JumboTheme/hooks";

import { Div } from "@jumbo/shared";
import LabelIcon from "@mui/icons-material/Label";
import {
  alpha,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import ListItemButton from "@mui/material/ListItemButton";
import React from "react";

const NewsItem = ({ item }) => {
  const { theme } = useJumboTheme();
  return (
    <React.Fragment>
      <ListItemButton
        disableRipple
        alignItems="flex-start"
        sx={{
          p: 3,
          transition: "all 0.2s",
          borderBottom: 1,
          borderBottomColor: "divider",

          [theme.breakpoints.down("md")]: {
            flexWrap: "wrap",
          },
          "&:hover": {
            boxShadow: `0 3px 10px 0 ${alpha("#000", 0.2)}`,
            transform: "translateY(-4px)",
            borderBottomColor: "transparent",
          },
        }}
      >
        <ListItemAvatar
          sx={{
            width: 220,
            mt: 0,
            mr: 3,
            [theme.breakpoints.down("md")]: {
              width: "100%",
              mr: 0,
              mb: 3,
            },
          }}
        >
          <Avatar
            src={item.image}
            variant={"rounded"}
            sx={{
              width: "100%",
              height: 146,
              [theme.breakpoints.down("md")]: {
                height: 260,
              },
            }}
          />
        </ListItemAvatar>
        <ListItemText>
          <Typography component={"div"}>
            <Typography variant={"h4"}>{item.title}</Typography>
            <Stack
              direction={"row"}
              divider={<Divider orientation="vertical" flexItem />}
              spacing={1}
              sx={{ mb: 2 }}
            >
              <Div>
                <Typography variant={"h6"} color={"primary.main"} mb={0}>
                  {item.author.name}
                </Typography>
              </Div>
              <Div>
                <Typography variant={"h6"} color={"text.secondary"} mb={0}>
                  {item.publishDate}
                </Typography>
              </Div>
              <Div>
                <Typography variant={"h6"} color={"text.secondary"} mb={0}>
                  {item.views} Views
                </Typography>
              </Div>
            </Stack>
            <Typography variant={"body1"} mb={2}>
              {item.description}
            </Typography>
            <Typography variant={"body1"} color={"text.secondary"}>
              <LabelIcon
                fontSize={"small"}
                sx={{ verticalAlign: "middle", mt: "-4px", mr: 1 }}
              />
              {item.tags.join(", ")}
            </Typography>
          </Typography>
        </ListItemText>
      </ListItemButton>
    </React.Fragment>
  );
};

export { NewsItem };
