// E2E test: Login page

describe("Login Page", () => {
  it("should allow user to login with valid credentials", () => {
    // Ganti URL di bawah jika halaman login bukan di /login
    cy.visit("/login");

    // Ganti selector sesuai dengan form login kamu
    cy.get('input[type="email"], input[name="email"]').type(
      "fajrikunmakalalag@gmail.com"
    );
    cy.get('input[type="password"], input[name="password"]').type(
      "fajrikun011"
    );
    cy.get('button[type="submit"], button')
      .contains(/login|masuk/i)
      .click();

    // Verifikasi redirect ke dashboard atau halaman utama
    cy.url().should("not.include", "/login");
    // Atau cek elemen yang hanya muncul setelah login
    // cy.contains('Dashboard');
  });
});
