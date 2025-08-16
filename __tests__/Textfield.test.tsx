import { render, screen } from "@testing-library/react";
import Textfield from "@/components/Textfield";

describe("Textfield component", () => {
  it("renders a label and input by default", () => {
    render(<Textfield label="Name" id="name" name="name" />);
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
  });

  it("renders a textarea if multiline is true", () => {
    render(<Textfield label="Description" id="desc" name="desc" multiline />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("renders error messages if provided", () => {
    render(
      <Textfield
        label="Email"
        id="email"
        name="email"
        error={["Invalid email"]}
      />
    );
    expect(screen.getByText("Invalid email")).toBeInTheDocument();
  });

  it("matches snapshot", () => {
    const { asFragment } = render(
      <Textfield label="Password" id="pwd" name="pwd" />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
