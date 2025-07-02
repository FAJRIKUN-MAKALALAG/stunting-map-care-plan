import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ChildDataForm from "../ChildDataForm";
import "@testing-library/jest-dom";

jest.mock("@/integrations/supabase/client", () => ({
  getSupabaseClient: jest.fn().mockResolvedValue({
    from: () => ({
      select: () => ({ data: [], error: null }),
      insert: () => ({ data: [], error: null }),
    }),
  }),
}));

jest.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({ user: { id: "dummy-user-id" } }),
}));

describe("ChildDataForm", () => {
  it("user bisa input data anak dan submit", async () => {
    render(<ChildDataForm />);
    userEvent.type(screen.getByLabelText(/nama anak/i), "Budi");
    userEvent.type(screen.getByLabelText(/nama ibu/i), "Siti");
    userEvent.type(screen.getByLabelText(/tanggal lahir|lahir/i), "2020-01-01");
    userEvent.type(screen.getByLabelText(/berat/i), "12");
    userEvent.type(screen.getByLabelText(/tinggi/i), "90");
    // Tambah field lain jika ada
    userEvent.click(
      screen.getByRole("button", { name: /simpan|submit|tambah/i })
    );

    // Tunggu notifikasi sukses muncul
    await waitFor(() => {
      expect(
        screen.getByText(/berhasil|sukses|data anak/i)
      ).toBeInTheDocument();
    });
  });
});
