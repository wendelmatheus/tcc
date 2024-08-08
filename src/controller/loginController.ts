export class LoginController {

    private static verificarDados(email: string, senha: string) {
        return email !== "" && senha !== "";
    }

    static handleClickLogin(email: string, senha: string) {
        if (this.verificarDados(email, senha)) {
            alert("ok. pronto para verificar")
        } else {
            alert("dados incompletos")
        }
    }

    static exibirAlerta() {
        alert('Este é um alerta de teste!');
      }

}