// export class LoginController {

//     private static verificarDados(email: string, senha: string) {
//         return email !== "" && senha !== "";
//     }

//     static handleClickLogin(email: string, senha: string) {
//         try {

//         } catch (error) {
//             console.log(error)
//         }
//         /*
//         if (this.verificarDados(email, senha)) {
//             const myHeaders = new Headers();
//             myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
            
//             const urlencoded = new URLSearchParams();
//             urlencoded.append("email", email);
//             urlencoded.append("senha", senha);
            
//             const requestOptions = {
//               method: "POST",
//               headers: myHeaders,
//               body: urlencoded,
//               //redirect: "follow"
//             };
            
//             fetch("/api/autenticar", requestOptions)
//               .then((response) => {
//                 if(response.status == 200) {
//                     alert("Pode logar");
//                 } else if(response.status == 401) {
//                     alert("email ou senha incorreta");
//                 } else if(response.status == 404) {
//                     alert("usuario não encontrado")
//                 }
//                 return response;
//               })
//               .then((result) => console.log(result))
//               .catch((error) => console.error(error));
//         } else {
//             alert("dados incompletos")
//         }
//             */
//     }

//     static exibirAlerta() {
//         alert('Este é um alerta de teste!');
//       }

// }