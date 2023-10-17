import { getTypeUser } from "../utils/database/querys";

jest.mock("../utils/database/models", () => {
  //Mock the default export and named export 'foo'
  return {
    __esModule: true,
    TipoUsuario: {
      findByPk: jest.fn().mockResolvedValueOnce({
        dataValues: {
          nombre: "admin",
        },
      }),
    },
    User: {
      findByPk: jest.fn().mockResolvedValueOnce({
        dataValues: {
          tipoUsuarioId: 1,
        },
      }),
    },
  };
});

describe("User type validation", () => {
  it("Return the user type", async () => {
    const type = await getTypeUser("0");
    expect(type).toMatch("admin");
  });
  it("Return 'default when no type was defined'", async () => {
    const type = await getTypeUser("0");
    expect(type).toMatch("default");
  });
});
