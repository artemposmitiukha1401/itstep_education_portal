import './HeaderLogin.css';
import {Component} from "react";
import {Link} from "react-router-dom";

export default function HeaderLogin(){
    return (
      <div className="HeaderLogin">
          <Link className="login" to="/login">Увійти</Link>
          <Link className="register" to="/register">Зареєструватися</Link>
      </div>
    );
}
