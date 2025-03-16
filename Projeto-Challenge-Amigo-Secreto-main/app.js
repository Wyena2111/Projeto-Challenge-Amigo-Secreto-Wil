function inicializarApp() {
    const listaNomes = [];
    const quantidadeLimite = 50;
    let tipoSorteioAtivo = '';
    let currentIndex = 0; 
    let qrCodes = []; 

    console.log(`Limite da lista: ${quantidadeLimite}`);

    function selecionaAmigoSecreto() {
        tipoSorteioAtivo = 'amigoSecreto';
        atualizarEstadoBotoes();
       
        document.querySelector("#amigo").placeholder = "Nombre del líder";
        verificarBotaoSortear();
    }

    function selecionaSorteador() {
        tipoSorteioAtivo = 'sorteador';
        atualizarEstadoBotoes();
        
        document.querySelector("#amigo").placeholder = "Digite un nombre";
        document.querySelector(".button-sortear-amigo").disabled = false;
    }

    function atualizarEstadoBotoes() {
        const amigoInput = document.querySelector("#amigo");
        const [amigoSecretoButton, sorteadorButton] = document.querySelectorAll(".button-ativarAmigoSecretoEsorteador");

      
        amigoInput.disabled = tipoSorteioAtivo === '';

       
        amigoSecretoButton.classList.toggle('active', tipoSorteioAtivo === 'amigoSecreto');
        sorteadorButton.classList.toggle('active', tipoSorteioAtivo === 'sorteador');
    }

    function verificarTipoSorteio() {
        if (tipoSorteioAtivo === '') {
            alert("Selecciona su tipo de sorteo para continuar.");
            return false; 
        }
        return true; 
    }

    function capitalizarNomes(nome) {
        return nome.replace(/\b\w/g, char => char.toUpperCase());
    }

    function adicionarAmigo() {
        if (!verificarTipoSorteio()) return;
        const amigoInput = document.querySelector("#amigo");
        let nomeAmigo = amigoInput.value.trim();

        if (nomeAmigo === "") {
            alert("Introduzca un nombre para agregar.");
            return;
        }

       
        const nomeNormalizado = nomeAmigo.toLowerCase();

     
        if (listaNomes.some(nome => nome.toLowerCase() === nomeNormalizado)) {
            alert("Este nombre ya ha sido añadido.");
            return;
        } else if (listaNomes.length >= quantidadeLimite) {
            alert(`Limite de ${quantidadeLimite} Los amigos golpearon. No se puede añadir más.`);
            return;
        }

        nombreAmigo = capitalizarNomes(nombreAmigo);
        listaNomes.push(nombreAmigo);
        atualizarLista();
        amigoInput.value = "";

        
        if (listaNomes.length === 1) {
            amigoInput.placeholder = "Digita un nombre";
        }

        verificarBotaoSortear();

        console.log(`Nomes na lista: ${listaNomes}`);
    }

    function atualizarLista() {
        const lista = document.getElementById("listaAmigos");
        lista.innerHTML = "";

        listaNomes.forEach((nome, index) => {
            const li = document.createElement("li");
            li.textContent = capitalizarNomes(nome);

        
            if (tipoSorteioAtivo === 'amigoSecreto' && index === 0) {
                li.textContent += " (Líder)";
            }

            const removeIcon = document.createElement("span");
            removeIcon.textContent = "✖";
            removeIcon.style.cursor = "pointer";
            removeIcon.style.marginLeft = "10px";
            removeIcon.onclick = () => removerAmigo(index);

            li.appendChild(removeIcon);
            lista.appendChild(li);
        });
    }

    function removerAmigo(index) {
        listaNomes.splice(index, 1);
        atualizarLista();
        verificarBotaoSortear();
        console.log(`Nombre eliminado. Lista actualizada:${listaNomes}`);
    }

    function sortearAmigo() {
        if (!verificarTipoSorteio()) return;

        if (tipoSorteioAtivo === 'sorteador') {
            if (listaNomes.length === 0) {
                alert("Añade nombres antes de dibujar.");
                return;
            }

            const indiceSorteado = Math.floor(Math.random() * listaNomes.length);
            const resultadoSorteio = listaNomes.splice(indiceSorteado, 1)[0];

            atualizarLista();
            document.getElementById("resultado").textContent = `${capitalizarNomes(resultadoSorteio)}!`;
            console.log(`Nombre sorteado: ${resultadoSorteio}!`);

            ocultarElementos();
            return resultadoSorteio;
        } else if (tipoSorteioAtivo === 'amigoSecreto') {
            if (listaNomes.length < 2) {
                alert("Agrega al menos 2 nombres para dibujar");
                return;
            }
            gerarQRCodes();
            document.querySelector(".button-sortear-amigo").disabled = true; 
            ocultarElementos();
        }
    }

    function gerarQRCodes() {
        qrCodes = [];
        document.getElementById("qrCode").innerHTML = '';
    
        const baseUrl = "https://github.com/Wyena2111/Projeto-Challenge-Amigo-Secreto/";
    
        
        const listaNomesAjustada = listaNomes.slice(1).concat(listaNomes[0]);
    
        console.log("Lista ajustada (líder no final):", listaNomesAjustada);
    
        let sorteios = gerarDesarranjo(listaNomesAjustada);
    
        console.log("Sorteios finais:", sorteios);
    
        
        for (let i = 0; i < listaNomesAjustada.length; i++) {
            const amigo = sorteios[i];
            const encodedName = btoa(amigo); 
            const link = `${baseUrl}?amigo=${encodedName}`;
    
            qrCodes.push(link);
        }
    
        currentIndex = 0;
        showQR(currentIndex);
    
        document.getElementById("resultado").style.display = "none";
        document.getElementById("prevButton").style.display = "inline";
        document.getElementById("nextButton").style.display = "inline";
        document.getElementById("listaAmigos").style.display = "none";
        document.getElementById("amigo").value = "";
    }
    
    
    function gerarDesarranjo(arr) {
        let n = arr.length;
        let result = arr.slice();
    
        do {
            
            for (let i = result.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [result[i], result[j]] = [result[j], result[i]];
            }
        } while (result.some((sorteado, index) => sorteado === arr[index]));
    
        return result;
    }

    function showQR(index) {
        const qrCodeDisplay = document.getElementById("qrCode");
        const qrNameDisplay = document.getElementById("qrName");
        const qrLinkDisplay = document.getElementById("qrLink");
        document.querySelector(".button-reiniciar").style.display = "inline";
        qrCodeDisplay.innerHTML = '';

        
        const listaExibicao = listaNomes.slice(1).concat(listaNomes[0]);

        let nomeExibido = capitalizarNomes(listaExibicao[index]);

                if (tipoSorteioAtivo === 'amigoSecreto' && index === listaExibicao.length - 1) {
            nomeExibido += " (Líder)";
        } else {
            document.querySelector(".button-reiniciar").style.display = "none";
        }

        qrNameDisplay.innerHTML = `<strong style="color: purple;">${nomeExibido}</strong>, escanea y descubre a tu amigo invisible:`;

        
        $(qrCodeDisplay).qrcode(qrCodes[index]);

        
        if (index === listaExibicao.length - 1) {
            qrLinkDisplay.innerHTML = `<a href="${qrCodes[index]}" target="_blank">Clique aqui e descubra seu Amigo Secreto</a>`;
        } else {
            qrLinkDisplay.innerHTML = '';
        }

        document.getElementById("prevButton").disabled = index === 0;
        document.getElementById("nextButton").disabled = index === qrCodes.length - 1;
    }

    function showPreviousQR() {
        if (currentIndex > 0) {
            currentIndex--;
            showQR(currentIndex);
        }
    }

    function showNextQR() {
        if (currentIndex < qrCodes.length - 1) {
            currentIndex++;
            showQR(currentIndex);
        }
    }

    function reiniciarLista() {
        window.location.href = "https://github.com/Wyena2111Projeto-Challenge-Amigo-Secreto";
    }

    function verificarTipoSorteioAoClicar() {
        if (tipoSorteioAtivo === '') {
            alert("Selecione um tipo de sorteo antes de continuar.");
            return false; 
        }
        return true; 
    }

    function verificarBotaoSortear() {
        const botaoSortear = document.querySelector(".button-sortear-amigo");
        if (tipoSorteioAtivo === 'amigoSecreto' && listaNomes.length < 2) {
            botaoSortear.disabled = true;
        } else {
            botaoSortear.disabled = false;
        }
    }

    function ocultarElementos() {
        document.querySelector(".section-title").style.display = "none";
        document.querySelectorAll(".button-ativarAmigoSecretoEsorteador").forEach(button => button.style.display = "none");
        document.querySelector(".button-add").style.display = "none";
        document.querySelector("#amigo").style.display = "none";
        if (tipoSorteioAtivo === 'amigoSecreto') {
            document.querySelector(".button-sortear-amigo").style.display = "none";
        }
    }

    function ocultarElementosAposQRCode() {
        document.querySelector("#amigo").style.display = "none";
        document.querySelectorAll(".button-ativarAmigoSecretoEsorteador").forEach(button => button.style.display = "none");
        document.querySelector(".button-add").style.display = "none";
        document.querySelector(".button-sortear-amigo").style.display = "none";
        document.querySelector(".button-reiniciar").style.display = "none";
        document.querySelector(".section-title").style.display = "none";
    }

    window.selecionaAmigoSecreto = selecionaAmigoSecreto;
    window.selecionaSorteador = selecionaSorteador;
    window.adicionarAmigo = adicionarAmigo;
    window.sortearAmigo = sortearAmigo;
    window.showPreviousQR = showPreviousQR;
    window.showNextQR = showNextQR;
    window.reiniciarLista = reiniciarLista;
    window.verificarTipoSorteioAoClicar = verificarTipoSorteioAoClicar;

    window.onload = function() {
        const urlParams = new URLSearchParams(window.location.search);
        const amigo = urlParams.get('amigo');

        if (amigo) {
            const decodedName = atob(amigo); 
            document.getElementById("resultado").innerHTML = `Seu Amigo Secreto é: <span style="color: purple;">${capitalizarNomes(decodedName)}</span>`;
            ocultarElementosAposQRCode();         }

        document.querySelector("#amigo").addEventListener("click", function(event) {
            if (!verificarTipoSorteioAoClicar()) {
                event.preventDefault(); 
            }
        });

        
        document.querySelector("#amigo").addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
                adicionarAmigo();
                event.preventDefault();
            }
        });

        document.querySelector("#amigo").placeholder = "Selecione o tipo do sorteio";

        
        document.querySelector(".button-sortear-amigo").disabled = false;
    };
}


inicializarApp();