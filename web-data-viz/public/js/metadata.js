const remoteUrlPath = "https://raw.githubusercontent.com/Arthurr-Rosante/jp-web-genesis/main/web-data-viz/public/assets/images";

const speciesDataMap = {
    "anquilossauro": {
        description: "Um gênero de dinossauro blindado do período Cretáceo Superior, conhecido por sua cauda pesada em forma de clava.",
        spriteUrl: remoteUrlPath + "/dinosaurs/anquilossauro.png",
        iconUrl: remoteUrlPath + "/dinosaurs/anquilossauro_icon.png",
    },
    "braquiossauro": {
        description: "Um gênero de dinossauro saurópode que viveu na América do Norte durante o Jurássico Superior.",
        spriteUrl: remoteUrlPath + "/dinosaurs/braquiossauro.png",
        iconUrl: remoteUrlPath + "/dinosaurs/braquiossauro_icon.png",
    },
    "ceratossauro": {
        description: "Um dinossauro terópode predador do período Jurássico Superior, possuindo um chifre proeminente.",
        spriteUrl: remoteUrlPath + "/dinosaurs/ceratossauro.png",
        iconUrl: remoteUrlPath + "/dinosaurs/ceratossauro_icon.png",
    },
    "compsognathus": {
        description: "Um gênero de pequenos dinossauros terópodes carnívoros bípedes do Jurássico Superior.",
        spriteUrl: remoteUrlPath + "/dinosaurs/compsognathus.png",
        iconUrl: remoteUrlPath + "/dinosaurs/compsognathus_icon.png",
    },
    "coritossauro": {
        description: "Um gênero de dinossauro hadrossaurídeo do período Cretáceo Superior, conhecido por sua crista distinta.",
        spriteUrl: remoteUrlPath + "/dinosaurs/coritossauro.png",
        iconUrl: remoteUrlPath + "/dinosaurs/coritossauro_icon.png",
    },
    "dilofossauro": {
        description: "Um gênero de dinossauros terópodes que viveu na América do Norte durante o Jurássico Inferior.",
        spriteUrl: remoteUrlPath + "/dinosaurs/dilofossauro.png",
        iconUrl: remoteUrlPath + "/dinosaurs/dilofossauro_icon.png",
    },
    "espinossauro": {
        description: "Um gênero de dinossauro espinossaurídeo que viveu no que hoje é o Norte da África durante o Cretáceo Superior.",
        spriteUrl: remoteUrlPath + "/dinosaurs/espinossauro.png",
        iconUrl: remoteUrlPath + "/dinosaurs/espinossauro_icon.png",
    },
    "estegossauro": {
        description: "Um gênero de dinossauro herbívoro quadrúpede e blindado do período Jurássico Superior.",
        spriteUrl: remoteUrlPath + "/dinosaurs/estegossauro.png",
        iconUrl: remoteUrlPath + "/dinosaurs/estegossauro_icon.png",
    },
    "parassaurolofo": {
        description: "Um dinossauro ornitópode herbívoro que viveu na América do Norte durante o Cretáceo Superior.",
        spriteUrl: remoteUrlPath + "/dinosaurs/parassaurolofo.png",
        iconUrl: remoteUrlPath + "/dinosaurs/parassaurolofo_icon.png",
    },
    "tiranossauro": {
        description: "Um gênero de grandes dinossauros terópodes do Cretáceo Superior, amplamente conhecido como T. rex.",
        spriteUrl: remoteUrlPath + "/dinosaurs/tiranossauro.png",
        iconUrl: remoteUrlPath + "/dinosaurs/tiranossauro_icon.png",
    },
    "triceratops": {
        description: "Um gênero de dinossauro ceratopsídeo herbívoro que surgiu durante o Cretáceo Superior.",
        spriteUrl: remoteUrlPath + "/dinosaurs/triceratops.png",
        iconUrl: remoteUrlPath + "/dinosaurs/triceratops_icon.png",
    },
    "velociraptor": {
        description: "Um gênero de dinossauro terópode dromeossaurídeo que viveu durante a última parte do Cretáceo.",
        spriteUrl: remoteUrlPath + "/dinosaurs/velociraptor.png",
        iconUrl: remoteUrlPath + "/dinosaurs/velociraptor_icon.png",
    }
};

const buildingsDataMap = {
    "entrance":{
        translatedName: "Portão de Entrada",
        description: "Este portão de proporções colossais é como um bastião que guarda a entrada do seu Parque. Não há nada dentro da ilha (humano ou dinossauro) que não tenha passado por ele.",
        "purpose": "Permite trocar o nome do Parque.",
        spriteUrl: remoteUrlPath + "/buildings/entrance.png"
    },
    "visitor-center":{
        translatedName: "Centro de Visitantes",
        description: "O coração de todo parque. O Centro de Visitantes não é apenas um grande hall pelo qual seus visitantes passam ao chegar no Parque, é um verdadeiro QG onde a Staff do Parque monitora tudo o que acontece na ilha.",
        "purpose": "Permite visualizar a Avaliação do seu Parque e todas as Espécies nele.",
        spriteUrl: remoteUrlPath + "/buildings/visitor-center.png"
    },
    "enclosure":{
        translatedName: "Cercado",
        description: "Os cercados são imprescindíveis para a existência do seu Parque. Em última instância, eles são a última barreira entre nós e essas criaturas incríveis. Pelo menos, até que uma tempestade atinja a ilha...",
        "purpose": "Permite comportar até 1 espécie de dinossauro por vez. Pode receber upgrades.",
        spriteUrl: remoteUrlPath + "/buildings/enclosure.png"
    },
    "hatchery":{   
        translatedName: "Laboratório de Incubação",
        description: "Trazer um dinossauro de volta à vida não é uma tarefa fácil. Para realizar tal façanha diariamente, seus cientistas precisarão de um lugar adequado para trabalhar.",
        "purpose": "Permite incubar até 1 espécie de dinossauro por vez.",
        spriteUrl: remoteUrlPath + "/buildings/hatchery.png"
    },
    "path":{
        translatedName: "Caminhos",
        description: "Por mais que caminhar pela mata ajudaria no aspecto da imersão, seus visitantes certamente ficariam mais confortáveis se tivessem caminhos pavimentados para andar pelo Parque.",
        "purpose": "Apenas para a estética.",
        spriteUrl: remoteUrlPath + "/buildings/path.png"
    },
    "terrain":{
        translatedName: "Terreno",
        description: "Toda a natureza intocada da Isla Nublar faz com que seus visitantes sintam como se tivessem retornado a 65 milhões de anos atrás.",
        "purpose": "Apenas para a estética.",
        spriteUrl: remoteUrlPath + "/buildings/terrain.png"
    }
};

const eventsDataMap = {
    "sabotage": {
        translatedName: "Sabotagem",
        description: "Todo cuidado é pouco. Um funcionário do seu Parque foi mandado embora e decidiu se vingar - ele desativou todos os sistemas de segurança do Parque!",
        consequences: "A durabilidade de todos os Cercados do seu Parque caem em 50%",
        spawnChance: 0.2,
        spriteUrl: remoteUrlPath + "/events/sabotage.png"
    },
    "pouring-rain": {
        translatedName: "Chuva Torrencial",
        description: "O Clima tropical da Costa Rica é extremamente instável. Sob uma tempestade dessas proporções, as coisas no Parque vão ter de esperar.",
        consequences: "Enquanto a chuva durar o atributo de Avaliação do seu Parque cai em 1 Estrela. Além disso, o tempo de incubação de todas as espécies aumenta em 33%",
        spawnChance: 0.5,
        spriteUrl: remoteUrlPath + "/events/pouring-rain.png"
    }
};