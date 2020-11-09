import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Observable } from 'rxjs/';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatSelect } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';

import { 
  LancamentoService, 
  Lancamento,
  Funcionario,
  Tipo,
  HttpUtilService/*,
  FuncionarioService*/
} from '../../../shared';

@Component({
  selector: 'app-listagem',
  templateUrl: './listagem.component.html',
  styleUrls: ['./listagem.component.css']
})
export class ListagemComponent implements OnInit {

  dataSource: MatTableDataSource<Lancamento>;
  colunas: string[] = ['data', 'tipo', 'localizacao', 'acao'];
  funcionarioId: string;
  totalLancamentos: number;

  /*funcionarios: Funcionario[];
  @ViewChild(MatSelect, { static: true }) matSelect: MatSelect;
  form: FormGroup;*/

  private pagina: number;
  private ordem: string;
  private direcao: string;

  constructor(
  	private lancamentoService: LancamentoService,
    private httpUtil: HttpUtilService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder/*,
    private funcionarioService: FuncionarioService,
    private dialog: MatDialog*/) { }

  ngOnInit() {
    this.pagina = 0;
    this.ordemPadrao();
    this.exibirLancamentos();
    //this.gerarForm();
  }

 ordemPadrao() {
    this.ordem = 'data';
    this.direcao = 'DESC';
  }

exibirLancamentos() {
    /*if (this.matSelect.selected) {
      this.funcionarioId = this.matSelect.selected['value'];
    } else if (this.funcId) {
      this.funcionarioId = this.funcId;
    } else {
      return;
    }
    sessionStorage['funcionarioId'] = this.funcionarioId;*/

    this.funcionarioId = '2';
    
    this.lancamentoService.listarLancamentosPorFuncionario(
        this.funcionarioId, this.pagina, this.ordem, this.direcao)
      .subscribe(
        data => {
          this.totalLancamentos = data['data'].totalElements;
          const lancamentos = data['data'].content as Lancamento[];
          this.dataSource = new MatTableDataSource<Lancamento>(lancamentos);
        },
        err => {
          const msg: string = "Erro obtendo lançamentos.";
          this.snackBar.open(msg, "Erro", { duration: 5000 });
        }
      );
  }

  remover(lancamentoId: string){
  	alert(lancamentoId);
  }

  paginar(pageEvent: PageEvent) {
    this.pagina = pageEvent.pageIndex;
    this.exibirLancamentos();
  }

  ordenar(sort: Sort) {
    if (sort.direction == '') {
      this.ordemPadrao();
    } else {
      this.ordem = sort.active;
      this.direcao = sort.direction.toUpperCase();
    }
    this.exibirLancamentos();
  }
  
}
