class Despesa{
    constructor(ano, mes, dia, tipo, descricao, valor){
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    validarDados(){
        for (const i in this) {
            if(this[i] == undefined || this[i] == "" || this[i] == null){
                return false
            }
        }
        return true
    }
}

class Bd {

    constructor(){
        const id = localStorage.getItem("id")

        if(id === null){
            localStorage.setItem("id", 0)
        }
    }

    getProximoId(){
        const proximoId = localStorage.getItem("id")
       return parseInt(proximoId) + 1
    }

    gravar(d){
        const id = this.getProximoId()
        localStorage.setItem(id, JSON.stringify(d))
        
        localStorage.setItem("id", id)
    }

    recuperarTodosRegistros(){

        const despesas = Array()



         const id = localStorage.getItem("id")

         //recuperar todas as despesas cadastradas em localStorage
         for( let i = 1; i <= id; i++){
            
            let despesa = JSON.parse(localStorage.getItem(i))

            if(despesa === null){
                continue
            }

            despesa.id = i

            despesas.push(despesa)
         }

         return despesas
    }
    
    pesquisar(despesa){

        let despesasFiltradas = Array()

        despesasFiltradas = this.recuperarTodosRegistros()

        //ano
        if(despesa.ano != ''){
           despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
        }
        
        //mes
        if(despesa.mes != ""){
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
         }

        //dia
        if(despesa.dia != ""){
            despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
         }

        //tipo
        if(despesa.tipo != ""){
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
         }
        //descricao
        if(despesa.descricao != ""){
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
         }

        //valor
        if(despesa.valor != ""){
            despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
         }
        
        return despesasFiltradas
    }

    remover(id){
        localStorage.removeItem(id)
    }
}

const bd = new Bd()


function cadastrarDespesa(){
    let ano = document.getElementById("ano")
    let mes = document.getElementById("mes")
    let dia = document.getElementById("dia")
    let tipo = document.getElementById("tipo")
    let descricao = document.getElementById("descricao")
    let valor = document.getElementById("valor")


const despesa = new Despesa(
    ano.value, 
    mes.value, 
    dia.value, 
    tipo.value, 
    descricao.value, 
    valor.value 
    )

    if(despesa.validarDados()){
        bd.gravar(despesa)

        document.getElementById("modal_titulo").innerHTML = "Registro inserido com sucesso!"
        document.getElementById("corTexto").className = "modal-header text-success"
        document.getElementById("modal_conteudo").innerHTML = "Despesa foi cadastrada com sucesso"
        document.getElementById("modal_btn").innerHTML = "Voltar"
        document.getElementById("modal_btn").className = "btn btn-success"
        
        
        $("#registraDespesa").modal("show")

        ano.value=""
        mes.value=""
        dia.value=""
        tipo.value=""
        descricao.value=""
        valor.value=""
    }else{
        document.getElementById("modal_titulo").innerHTML = "Erro na inclusão do registro!"
        document.getElementById("corTexto").className = "modal-header text-danger"
        document.getElementById("modal_conteudo").innerHTML = "Erro na gravação, verifique se todos os campos foram preenchidos corretamente"
        document.getElementById("modal_btn").innerHTML = "Voltar e corrigir"
        document.getElementById("modal_btn").className = "btn btn-danger"

        $("#registraDespesa").modal("show")
    }
}


function carregaListaDespesas(despesas = Array(), filtro = false){

    if(despesas.length == 0 && filtro == false){
        despesas = bd.recuperarTodosRegistros()
    }


    let listaDespesas = document.getElementById("listaDespesas")
    listaDespesas.innerHTML = ""

    despesas.forEach(function(a){
        //criando a linha/tr
        let linha = listaDespesas.insertRow()

        //inserindo valores/colunas/td
        linha.insertCell(0).innerHTML = `${a.dia}/${ a.mes}/${a.ano}` 
        //ajustar o tipo
        switch(a.tipo){
            case "1": a.tipo = "Alimentação"
            break
            case "2": a.tipo = "Educação"
            break
            case "3": a.tipo = "Lazer"
            break
            case "4": a.tipo = "Saúde"
            break
            case "5": a.tipo = "Transporte"
            break
        }

        linha.insertCell(1).innerHTML = a.tipo  
        linha.insertCell(2).innerHTML = a.descricao
        linha.insertCell(3).innerHTML = a.valor

        //crirar botao excluir
        let btn = document.createElement("button")
        btn.className = "btn btn-danger"
        btn.innerHTML = "<i class='fas fa-times'></i>"
        btn.id = `id_despesa_${a.id}`
        btn.onclick = function(){

        let id = this.id.replace('id_despesa_', '')

        
        bd.remover(id)

        

        window.location.reload()
        }
        linha.insertCell(4).append(btn)


    })
}

function pesquisarDespesa(){
    let ano = document.getElementById("ano").value
    let mes = document.getElementById("mes").value
    let dia = document.getElementById("dia").value
    let tipo = document.getElementById("tipo").value
    let descricao = document.getElementById("descricao").value
    let valor = document.getElementById("valor").value

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)


    let despesas = bd.pesquisar(despesa)
   
    carregaListaDespesas(despesas, true)
}

