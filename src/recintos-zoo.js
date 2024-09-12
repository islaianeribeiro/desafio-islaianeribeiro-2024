class RecintosZoo {
    recintos = [
        { numero: 1, bioma: 'savana', tamanhoTotal: 10, animais: { 'MACACO': 3 } },
        { numero: 2, bioma: 'floresta', tamanhoTotal: 5, animais: {} },
        { numero: 3, bioma: 'savana e rio', tamanhoTotal: 7, animais: { 'GAZELA': 1 } },
        { numero: 4, bioma: 'rio', tamanhoTotal: 8, animais: {} },
        { numero: 5, bioma: 'savana', tamanhoTotal: 9, animais: { 'LEAO': 1 } }
    ];

    animaisInfo = new Map([
        ['LEAO', { tamanho: 3, bioma: 'savana', carnivoro: true }],
        ['LEOPARDO', { tamanho: 2, bioma: 'savana', carnivoro: true }],
        ['CROCODILO', { tamanho: 3, bioma: 'rio', carnivoro: true }],
        ['MACACO', { tamanho: 1, bioma: 'savana ou floresta', carnivoro: false }],
        ['GAZELA', { tamanho: 2, bioma: 'savana', carnivoro: false }],
        ['HIPOPOTAMO', { tamanho: 4, bioma: 'savana ou rio', carnivoro: false }]
    ]);

    podeAdaptar(animal, bioma) {
        const info = this.animaisInfo.get(animal.toUpperCase());
        if (!info) return false;
        const biomasAdaptaveis = new Set(info.bioma.split(' ou '));
        return biomasAdaptaveis.has(bioma);
    }


    calcularEspacoOcupado(animais) {
        return Object.entries(animais).reduce((acc, [animal, quantidade]) => {
            const animalMaiusculo = animal.toUpperCase();
            const info = this.animaisInfo.get(animalMaiusculo);
            return acc + (info ? quantidade * info.tamanho : 0);
        }, 0);
    }

    analisaRecintos(animal, quantidade) {
        const tipoAnimalMaiusculo = animal.toUpperCase();

        // Validação de entradas
        if (!this.animaisInfo.has(tipoAnimalMaiusculo)) {
            return { erro: "Animal inválido" };
        }
        if (quantidade <= 0 || !Number.isInteger(quantidade)) {
            return { erro: "Quantidade inválida" };
        }

        const infoAnimal = this.animaisInfo.get(tipoAnimalMaiusculo);
        const tamanhoAnimal = infoAnimal.tamanho;
        const biomaAnimal = infoAnimal.bioma;

        let recintosViaveis = [];

        this.recintos.forEach(recinto => {
            const { numero, bioma, tamanhoTotal, animais } = recinto;
            const espacoOcupado = this.calcularEspacoOcupado(animais);
            const numeroDeEspecies = Object.keys(animais).length;
            const espacoExtra = (numeroDeEspecies > 0 && !Object.keys(animais).includes(tipoAnimalMaiusculo)) ? 1 : 0; // Adiciona espaço extra se houver outras espécies diferentes

            const espacoLivre = tamanhoTotal - espacoOcupado - espacoExtra;

            // Verifica se o bioma é adequado e há espaço suficiente
            if (!this.podeAdaptar(tipoAnimalMaiusculo, bioma)) return;
            if (espacoLivre < quantidade * tamanhoAnimal) return;

            // Verifica a compatibilidade do bioma do animal com o bioma do recinto
            if (!biomaAnimal.split(' ou ').includes(bioma)) return;

            // Regras adicionais
            if (tipoAnimalMaiusculo === 'MACACO') {
                // Macacos não podem estar sozinhos
                if (quantidade === 1 && Object.keys(animais).length === 0) return;
                // Herbívoros não podem estar com carnívoros
                if (Object.keys(animais).some(esp => {
                    const infoExistente = this.animaisInfo.get(esp.toUpperCase());
                    return infoExistente && infoExistente.carnivoro === true;
                })) return;

            }

            if (['LEAO', 'LEOPARDO', 'CROCODILO'].includes(tipoAnimalMaiusculo)) {
                // Carnívoros não podem estar com herbívoros
                if (Object.keys(animais).some(animal => {
                    const infoExistente = this.animaisInfo.get(animal.toUpperCase());
                    return infoExistente && infoExistente.carnivoro === false && animal.toUpperCase() !== tipoAnimalMaiusculo;
                })) return;
            }
            if (tipoAnimalMaiusculo === 'HIPOPOTAMO' && !bioma.includes('savana') && !bioma.includes('rio')) return; // Hipopótamos

            // Adiciona recinto viável à lista
            recintosViaveis.push({
                numero: numero,
                espacoLivre: espacoLivre - (quantidade * tamanhoAnimal),
                tamanhoTotal: tamanhoTotal
            });
        });

        // Ordena recintos viáveis pelo número do recinto
        recintosViaveis.sort((a, b) => a.numero - b.numero);

        // Resultado
        if (recintosViaveis.length === 0) {
            return { erro: "Não há recinto viável" };
        }

        return {
            recintosViaveis: recintosViaveis.map(recinto => `Recinto ${recinto.numero} (espaço livre: ${recinto.espacoLivre} total: ${recinto.tamanhoTotal})`)
        };
    }
}


export { RecintosZoo as RecintosZoo };
