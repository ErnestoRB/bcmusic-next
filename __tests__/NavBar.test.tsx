import { cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { SessionContextValue } from "next-auth/react";
import NavBar from "../components/Nav/NavBar";

let useMediaQueryMock: jest.Mock = jest.fn();

jest.mock("next-auth/react", () => {
  return {
    __esModule: true,
    useSession: jest.fn(
      (): SessionContextValue => ({
        status: "authenticated",
        data: {
          user: {
            email: "testing@email.com",
            id: "1",
          },
          expires: new Date().toISOString(),
        },
      })
    ),
    signOut: jest.fn(),
  };
});

jest.mock("../utils/hooks/useMediaQuery.tsx", () => {
  return {
    __esModule: true,
    useMediaQuery: () => useMediaQueryMock(),
  };
});

describe("Navbar component", () => {
  let container: HTMLElement | undefined;
  beforeEach(() => {
    useMediaQueryMock.mockReturnValue(false);
    container = render(<NavBar />).baseElement;
  });

  it("Should render", () => {
    const navbarElement = screen.getByText(/BCMusic App/);
    expect(navbarElement).toBeDefined();
  });

  it("Should render mobile menu when width < 1000px", () => {
    const dropdownElement = screen.getByText(/Menú/);
    expect(dropdownElement).toBeDefined();
  });

  it("Should not render mobile menu when width >= 1000px", () => {
    cleanup();
    useMediaQueryMock.mockReturnValue(true);
    render(<NavBar></NavBar>);
    expect(() => screen.getByText(/Menú/)).toThrow(/Unable to find an element/);
  });
});
