import { getByTestId, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Dropdown } from "../components/Dropdown";
import { act } from "react-dom/test-utils";

describe("Dropdown component", () => {
  let container: HTMLElement | undefined;
  beforeEach(() => {
    container = render(
      <Dropdown>
        <h1>Heading</h1>
        <p>Paragraph</p>
      </Dropdown>
    ).baseElement;
  });

  it("Should render", () => {
    const dropdownElement = screen.getByText(/Menú/);
    expect(dropdownElement).toBeDefined();
  });

  it("Should show not menu on startup", () => {
    const dropdownElement = getByTestId(container!, "menu-wrapper");
    expect(dropdownElement).toHaveStyle({ display: "none" });
  });

  it("Should show menu on click", () => {
    const dropdownElement = getByTestId(container!, "menu-wrapper");
    act(() => {
      dropdownElement.click();
    });
    expect(dropdownElement).toHaveStyle({ display: "flex" });
  });
});
