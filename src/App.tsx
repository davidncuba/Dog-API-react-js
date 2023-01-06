import Page from "./components/Page";
import { Container } from "@mui/material";
import { FormDogs } from "./sections/FormDogs";

function App() {
  return (
    <Page title="Images DOG API">
      <Container maxWidth="lg">
        <FormDogs />
      </Container>
    </Page>
  );
}

export default App;
