import { render, screen, fireEvent } from "@testing-library/react";
import PrimaryButton from "@/components/buttons/PrimaryButton";

describe("PrimaryButton", () => {
  it("renders children correctly", () => {
    render(<PrimaryButton>Click Me</PrimaryButton>);
    expect(screen.getByText("Click Me")).toBeInTheDocument();
  });

  it("handles click events", () => {
    const handleClick = jest.fn();
    render(<PrimaryButton onClick={handleClick}>Click Me</PrimaryButton>);
    fireEvent.click(screen.getByText("Click Me"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("matches snapshot", () => {
    const { asFragment } = render(<PrimaryButton>Snapshot</PrimaryButton>);
    expect(asFragment()).toMatchSnapshot();
  });
});
