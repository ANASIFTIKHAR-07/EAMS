import { getNavChildren } from "@jumbo/utilities/helpers";
import { Divider, ListSubheader } from "@mui/material";
import { JumboNavIdentifier } from "..";
import { useJumboNavbar } from "../../hooks";

function JumboNavSection({ item, isFirstSection }) {
  //TODO: this component depends on this useTranslations

  const { miniAndClosed } = useJumboNavbar();
  if (!item) return null;

  const subMenus = getNavChildren(item);

  return (
    <>
      {miniAndClosed ? (
        !isFirstSection && <Divider sx={{ mx: 2, my: 1 }} />
      ) : (
        <ListSubheader
          component="li"
          disableSticky
          sx={{
            fontSize: "80%",
            fontWeight: "400",
            lineHeight: "normal",
            textTransform: "uppercase",
            bgcolor: "transparent",
            p: (theme) => theme.spacing(3.75, 3.75, 1.875),
            letterSpacing: 2,
          }}
        >
          {item.label}
        </ListSubheader>
      )}
      {subMenus &&
        subMenus.map((child, index) => {
          return <JumboNavIdentifier item={child} key={index} />;
        })}
    </>
  );
}

export { JumboNavSection };
