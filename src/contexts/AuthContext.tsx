import { createContext, ReactNode, useEffect, useState } from "react";
import { setCookie, parseCookies, destroyCookie } from "nookies";
import Router from "next/router";
import { api } from "../pages/api/api";
import * as jwt from "jsonwebtoken";
import router from "next/router";

type User = {
  nome: string;
  email: string;
  imagem: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  signIn: (email: string, senha: string, onUnauthorized: () => void, onNotFound: () => void) => Promise<void>;
  signOut: () => Promise<void>;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  const [showAlert, setShowAlert] = useState(false);

  const isAuthenticated = !!user;

  useEffect(() => {
    const { "sitededenuncias.token": token } = parseCookies();

    if (token) {
      const decodedToken = jwt.decode(token) as { nome: string; email: string; imagem?: string };
      const nome = decodedToken.nome;
      const email = decodedToken.email;
      const imagem = decodedToken.imagem; // Certifique-se de que a imagem é opcional

      setUser({ nome, email, imagem: imagem ?? "https://voxnews.com.br/wp-content/uploads/2017/04/unnamed.png" });
    }
  }, []);

  async function signIn(email: string, senha: string, onUnauthorized: () => void, onNotFound: () => void) {
    // chamada para a api, enviar email e senha do usuário, trazer o token e salvar (cookies)
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded = new URLSearchParams();
    urlencoded.append("email", email);
    urlencoded.append("senha", senha);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
    };

    fetch("/api/autenticar", requestOptions)
      .then((response) => {
        if (response.status == 200) {
          response.json().then((data) => {

            const token = data.token;
            const nome: string = data.nome;
            const email: string = data.email;
            const imagem: string = data.imagem;

            const user = { nome, email, imagem };

            setCookie(undefined, "sitededenuncias.token", token, {
              maxAge: 60 * 60 * 1, // 1 hour
            });

            api.defaults.headers["Authorization"] = `Bearer ${token}`;

            setUser(user);

            Router.push("/dashboard");
          });
        } else if (response.status == 401) {
          onUnauthorized();
        } else if (response.status == 404) {
          onNotFound();
        }
        return response;
      })
      .then((result) => console.log(result))
      .catch((error) => {
        throw error;
      });
  }

  async function signOut() {
    destroyCookie(null, "sitededenuncias.token", { path: "/" });

    if(router.pathname === "/") {
      router.reload();
    } else {
      router.push("/");
    }
  }

  function handleAlertClose() {
    setShowAlert(false);
  }

  return <AuthContext.Provider value={{ user, isAuthenticated, signIn, signOut }}>{children}</AuthContext.Provider>;
}