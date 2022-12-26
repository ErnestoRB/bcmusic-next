import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Alert from "../components/Alert";
import { ErrorBoundary } from "../components/errors/ErrorBoundary";
import Throwing from "../components/errors/Throwing";

describe("ErrorBoundry component", () => {
  it("Should render fallback on error", () => {
    render(
      <ErrorBoundary fallback={<Alert>Catching error</Alert>}>
        <Throwing></Throwing>
      </ErrorBoundary>
    );

    const alertElement = screen.getByText(/Catching/);
    expect(alertElement).toBeDefined();
  });

  it("Should render children on normal op", () => {
    render(
      <ErrorBoundary fallback={<Alert>Catching error</Alert>}>
        <div>Hello world</div>
      </ErrorBoundary>
    );

    const alertElement = screen.getByText(/Hello world/);
    expect(alertElement).toBeDefined();
  });
});
