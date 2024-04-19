
window.onload=function(){
	listar();
	document.getElementById('frmCadastro').addEventListener('submit', adicionarOuAlterar);
	document.getElementById('frmCadastro').addEventListener('submit', listar);
}

var idAlterar = null;

function adicionarOuAlterar(e){
	var nom = document.getElementById('txtNome').value;
	var p = {
		nome : !nom ? "sem nome": nom, //mesmo que if(nom = ""){ nom = "sem nome";}
		nasc : new Date(document.getElementById('dtpDataNascimento').value.replace("-","/")),
		sexo : document.getElementById('rdoMasculino').checked ? 'M' : 'F',
		data : new Date()
	}

	if(idAlterar == null)	
		adicionar(p);
	else if(idAlterar > 0)
		alterar(p);
	else
		alert("Ação desconhecida");	
	
	e.preventDefault();
}

function adicionar(p){	
	var pessoas = [];	
	var idValido = 1;		
	if(localStorage.getItem('value') !== null ){
		pessoas = JSON.parse(localStorage.getItem('value'));
		if(pessoas.length > 0)
			idValido = 	(function obterIdValido() {	
							
							for(var i = 0; i < pessoas.length; i++)
								if(pessoas[i].Id != i+1)
									return i + 1;							
							
							return pessoas[pessoas.length - 1].Id + 1;
						})();
	}	
	
	var pessoa = {
		Id: idValido,
		Nome: p.nome,
		DataNascimento: p.nasc.toLocaleString("pt-BR").substring(0, 10),
		Sexo: p.sexo,
		DataCadastro : p.data.toLocaleString("pt-BR")
	};
	

	pessoas.push(pessoa);	

	pessoas.sort(function(a,b) {
		return a.Id - b.Id;
	});			

	localStorage.setItem('value', JSON.stringify(pessoas));	

	document.getElementById('frmCadastro').reset();	
}

function alterar(p){
	var btn = document.getElementById('btnCadastrarSalvar');	

	pessoas = JSON.parse(localStorage.getItem('value'));

	for(var i = 0; i < pessoas.length; i++){
		if(pessoas[i].Id == idAlterar){
			pessoas[i].Nome = p.nome;
			pessoas[i].DataNascimento = p.nasc.toLocaleString("pt-BR").substring(0, 10);
			pessoas[i].Sexo = p.sexo;
			pessoas[i].DataCadastro = p.data.toLocaleString("pt-BR");
			
			btn.value = "Cadastrar";
			idAlterar = null;

			localStorage.setItem('value', JSON.stringify(pessoas));	
			document.getElementById('frmCadastro').reset();			
			break;
		}
	}
}


function prepararAlterar(idRow){	
	document.getElementById('btnCadastrarSalvar').value = "Salvar";
	
	var txtNome = document.getElementById('txtNome'),
	    dtpDataNascimento = document.getElementById('dtpDataNascimento'),
	    rdoMasculino = document.getElementById('rdoMasculino'),
	    rdoFeminino = document.getElementById('rdoFeminino');

	var pessoas = JSON.parse(localStorage.getItem('value'));
	for(var i = 0; i < pessoas.length; i++){
		if(pessoas[i].Id == idRow){			

			txtNome.value = pessoas[i].Nome;
			dtpDataNascimento.value = pessoas[i].DataNascimento.replace(/(\d{2})\/(\d{2})\/(\d{4})/,'$3-$2-$1'); //caso fosse tipo date toISOString().substring(0, 10);
			rdoMasculino.checked = !(rdoFeminino.checked = (pessoas[i].Sexo == 'F'));
			
	
			listar();
			
			idAlterar = null;
			if(idAlterar === null){

				var th = document.getElementById("rowTable"+i);				
				th.className = "estadoAlteracao";				
			}


			idAlterar = pessoas[i].Id;
			break;
		}
	}
}

function excluir(cod){
	var pessoas = JSON.parse(localStorage.getItem('value'));

	for(var i = 0; i < pessoas.length; i++)
		if(pessoas[i].Id == cod)
			pessoas.splice(i, 1);
				
	
	localStorage.setItem('value', JSON.stringify(pessoas));
	listar();
	
	
	if(pessoas.length == 0)
		window.localStorage.removeItem("value");
}

function listar(){
	
	if(localStorage.getItem('value') === null)
		return;
	

	var pessoas = JSON.parse(localStorage.getItem('value'));
	var tbody = document.getElementById("tbodyResultados");

	
	tbody.innerHTML = '';
	
	for(var i = 0; i < pessoas.length; i++){
		var	id = pessoas[i].Id,
		    nome = pessoas[i].Nome,
		    nasc = pessoas[i].DataNascimento,
		    sexo = pessoas[i].Sexo,
			data = pessoas[i].DataCadastro
			       
		tbody.innerHTML += '<tr id="rowTable'+i+'">'+
								'<td>'+id+'</td>'+
								'<td>'+nome+'</td>'+
								'<td>'+nasc+'</td>'+
								'<td>'+sexo+'</td>'+
								'<td>'+data+'</td>'+
								'<td><button onclick="excluir(\'' + id + '\')">Excluir</button></td>'+
								'<td><button onclick="prepararAlterar(\'' + id + '\')">Alterar</button></td>'+
						   '</tr>';		
	}
}
						
