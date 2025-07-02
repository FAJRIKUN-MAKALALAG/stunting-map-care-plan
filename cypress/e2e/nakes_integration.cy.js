describe("E2E - Tenaga Kesehatan", () => {
  it("bisa login dan input data anak", () => {
    // 1. Kunjungi halaman login
    cy.visit("https://stuntingcaresulut.domcloud.dev");

    // 2. Isi form login
    cy.get("#login-email").type("fajrikunmakalalag@gmail.com");
    cy.get("#login-password").type("fajrikun011");
    cy.get("button[type='submit']").contains(/login/i).click();

    // 3. Pastikan redirect ke dashboard
    cy.url().should("eq", Cypress.config().baseUrl + "/");
    cy.contains(/dashboard|beranda|data anak/i);

    // 4. Navigasi ke form data anak (ganti selector/menu sesuai aplikasi Anda)
    cy.contains(/data anak|input data anak|tambah anak/i).click();

    // 5. Isi form data anak
    cy.get('input[name="nama"], input#nama').type("Budi");
    cy.get('input[name="namaIbu"], input#namaIbu').type("Siti");
    cy.get('input[name="tanggalLahir"], input#tanggalLahir').type("2020-01-01");
    cy.get('input[name="beratBadan"], input#beratBadan').type("12");
    cy.get('input[name="tinggiBadan"], input#tinggiBadan').type("90");
    // Tambah field lain jika ada

    // 6. Submit form
    cy.get('button[type="submit"], button')
      .contains(/simpan|submit|tambah/i)
      .click();

    // 7. Cek notifikasi sukses
    cy.contains(/berhasil|sukses|data anak/i);
  });
});
