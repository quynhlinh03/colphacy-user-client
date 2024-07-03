import { Container, Grid } from "@mantine/core";
import { Outlet } from "react-router-dom";
import Tab from "./Tab";

const PersonalLayout: React.FC = () => {
  return (
    <Container className="personal-layout-container" p={100}>
      <Grid>
        <Grid.Col span="content">
          <Tab />
        </Grid.Col>
        <Grid.Col span="auto" className="outlet-ctn">
          <Outlet></Outlet>
        </Grid.Col>
      </Grid>
    </Container>
  );
};
export default PersonalLayout;
