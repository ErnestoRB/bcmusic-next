import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Alert from "../components/Alert";

describe("Alert component", () => {
  it("Should render", () => {
    render(<Alert>Hello BC!</Alert>);

    const alertElement = screen.getByText(/Hello/);
    expect(alertElement).toBeDefined();
  });
});
