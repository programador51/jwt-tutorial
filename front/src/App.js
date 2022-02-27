import "bootstrap/dist/css/bootstrap.css";
import { useState } from "react";
import axios from "axios";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";

function App() {
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });

  const setEmail = (email) =>
    setFormValues({
      ...formValues,
      email,
    });

  const setPassword = (password) =>
    setFormValues({
      ...formValues,
      password,
    });

  const login = async (e) => {
    e.preventDefault();

    try {
      const { data } = axios.post(
        `${process.env.REACT_APP_SERVER_URL_BASE}/usuarios/iniciar-sesion`,
        {
          email: formValues.email,
          password: formValues.password,
        }
      );

      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Form onSubmit={(e) => login(e)}>
        <FormGroup>
          <Label id="label-email">Email</Label>
          <Input
            id="email"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormGroup>

        <FormGroup>
          <Label id="label-password">Password</Label>
          <Input
            onChange={(e) => setPassword(e.target.value)}
            id="password"
            type="password"
          />
        </FormGroup>

        <Button>Login</Button>
      </Form>
    </>
  );
}

export default App;
