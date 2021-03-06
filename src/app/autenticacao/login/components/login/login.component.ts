import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Login } from '../../models';
import { LoginService } from '../../services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  form: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private snackBar: MatSnackBar,
    private router: Router,
    private loginService: LoginService) { }

  ngOnInit() {
    this.gerarForm();
  }

  gerarForm() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

 logar() {
    if (this.form.invalid) {
      return;
    }

    const login: Login = this.form.value;
    this.loginService.logar(login)
      .subscribe(
        data => {
          console.log("Teste Data.");
          localStorage['token'] = data['data']['token'];
          //localStorage['token'] = data['token'];

          const usuarioData = JSON.parse(
            atob(data['data']['token'].split('.')[1]));
          /*const usuarioData = JSON.parse(
            atob(data['token'].split('.')[1]));*/
          if (usuarioData['role'] == 'ROLE_ADMIN') {
            //alert('Deve redirecionar para a página de admin');
            this.router.navigate(['/admin']);
          } else {
            //alert('Deve redirecionar para a página de funcion')
            this.router.navigate(['/funcionario']);
          }
        },
        err => {
          console.log(JSON.stringify(err));
          let msg: string = "Tente novamente em instantes.";
          if (err['status'] == 401) {
            msg = "Email/senha inválido(s)."
          }
          this.snackBar.open(msg, "Erro", { duration: 5000 });
        }
      );
  }
}