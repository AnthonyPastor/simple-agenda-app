import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useAuthStore } from "../../src/hooks/useAuthStore";
import { AppRouter } from "../../src/routes/AppRouter";

// import "../mocks/stylesMock";

jest.mock("../../src/hooks/useAuthStore");

describe("Pruebas en <AppRouter/>", () => {
	const mockCheckAuthToken = jest.fn();

	beforeEach(() => jest.clearAllMocks());

	test("debe de mostrar al pantalla de carga y llamar checkAuthToken", () => {
		useAuthStore.mockReturnValue({
			status: "checking",
			checkAuthToken: mockCheckAuthToken,
		});
		render(<AppRouter />);

		expect(mockCheckAuthToken).toHaveBeenCalled();
		expect(screen.getByText("Cargando...")).toBeTruthy();
	});

	test("debe de mostrar al pantalla de Login si no estoy autenticado", () => {
		useAuthStore.mockReturnValue({
			status: "not-authenticated",
			checkAuthToken: mockCheckAuthToken,
		});
		const { container } = render(
			<MemoryRouter>
				<AppRouter />
			</MemoryRouter>
		);

		expect(mockCheckAuthToken).toHaveBeenCalled();
		expect(screen.getByText("Ingreso")).toBeTruthy();
		expect(container).toMatchSnapshot();
	});
});
