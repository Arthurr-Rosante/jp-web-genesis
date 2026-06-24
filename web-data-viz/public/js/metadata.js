const imagesPath = "../assets/images";

const speciesDataMap = {
    "anquilossauro": {
        spriteUrl: imagesPath + "/dinosaurs/anquilossauro.png",
        iconUrl: imagesPath + "/dinosaurs/anquilossauro_icon.png",
    },
    "braquiossauro": {
        spriteUrl: imagesPath + "/dinosaurs/braquiossauro.png",
        iconUrl: imagesPath + "/dinosaurs/braquiossauro_icon.png",
    },
    "ceratossauro": {
        spriteUrl: imagesPath + "/dinosaurs/ceratossauro.png",
        iconUrl: imagesPath + "/dinosaurs/ceratossauro_icon.png",
    },
    "compsognathus": {
        spriteUrl: imagesPath + "/dinosaurs/compsognathus.png",
        iconUrl: imagesPath + "/dinosaurs/compsognathus_icon.png",
    },
    "coritossauro": {
        spriteUrl: imagesPath + "/dinosaurs/coritossauro.png",
        iconUrl: imagesPath + "/dinosaurs/coritossauro_icon.png",
    },
    "dilofossauro": {
        spriteUrl: imagesPath + "/dinosaurs/dilofossauro.png",
        iconUrl: imagesPath + "/dinosaurs/dilofossauro_icon.png",
    },
    "espinossauro": {
        spriteUrl: imagesPath + "/dinosaurs/espinossauro.png",
        iconUrl: imagesPath + "/dinosaurs/espinossauro_icon.png",
    },
    "estegossauro": {
        spriteUrl: imagesPath + "/dinosaurs/estegossauro.png",
        iconUrl: imagesPath + "/dinosaurs/estegossauro_icon.png",
    },
    "parassaurolofo": {
        spriteUrl: imagesPath + "/dinosaurs/parassaurolofo.png",
        iconUrl: imagesPath + "/dinosaurs/parassaurolofo_icon.png",
    },
    "tiranossauro": {
        spriteUrl: imagesPath + "/dinosaurs/tiranossauro.png",
        iconUrl: imagesPath + "/dinosaurs/tiranossauro_icon.png",
    },
    "triceratops": {
        spriteUrl: imagesPath + "/dinosaurs/triceratops.png",
        iconUrl: imagesPath + "/dinosaurs/triceratops_icon.png",
    },
    "velociraptor": {
        spriteUrl: imagesPath + "/dinosaurs/velociraptor.png",
        iconUrl: imagesPath + "/dinosaurs/velociraptor_icon.png",
    },
    "carnotauro": {
        spriteUrl: imagesPath + "/dinosaurs/carnotauro.png",
        iconUrl: imagesPath + "/dinosaurs/carnotauro_icon.png",
    },
    "gallimimus": {
        spriteUrl: imagesPath + "/dinosaurs/gallimimus.png",
        iconUrl: imagesPath + "/dinosaurs/gallimimus_icon.png",
    },
    "gallimimus": {
        spriteUrl: imagesPath + "/dinosaurs/gallimimus.png",
        iconUrl: imagesPath + "/dinosaurs/gallimimus_icon.png",
    },
    "paquicefalossauro": {
        spriteUrl: imagesPath + "/dinosaurs/paquicefalossauro.png",
        iconUrl: imagesPath + "/dinosaurs/paquicefalossauro_icon.png",
    },
    "paquicefalossauro": {
        spriteUrl: imagesPath + "/dinosaurs/paquicefalossauro.png",
        iconUrl: imagesPath + "/dinosaurs/paquicefalossauro_icon.png",
    },
    "oviraptor": {
        spriteUrl: imagesPath + "/dinosaurs/oviraptor.png",
        iconUrl: imagesPath + "/dinosaurs/oviraptor_icon.png",
    },
};

const buildingsDataMap = {
    "entrance":{
        translatedName: "Portão de Entrada",
        spriteUrl: imagesPath + "/buildings/entrance.png"
    },
    "visitor-center":{
        translatedName: "Centro de Visitantes",
        spriteUrl: imagesPath + "/buildings/visitor-center.png"
    },
    "enclosure-1":{
        translatedName: "Cercado",
        spriteUrl: imagesPath + "/enclosures/enclosure-1.png"
    },
    "enclosure-2":{
        translatedName: "Cercado Melhorado",
        spriteUrl: imagesPath + "/enclosures/enclosure-2.png"
    },
    "enclosure-3":{
        translatedName: "Cercado Superior",
        spriteUrl: imagesPath + "/enclosures/enclosure-3.png"
    },
    "hatchery":{   
        translatedName: "Laboratório de Incubação",
        spriteUrl: imagesPath + "/buildings/hatchery.png"
    },
    "terrain-grass":{
        translatedName: "Terreno Mata",
        spriteUrl: imagesPath + "/terrains/terrain-grass.png"
    },
    "terrain-dirt":{
        translatedName: "Terreno Baldio",
        spriteUrl: imagesPath + "/terrains/terrain-dirt.png"
    },
    "terrain-pond":{
        translatedName: "Terreno Lagoa",
        spriteUrl: imagesPath + "/terrains/terrain-pond.png"
    },
    "terrain-trees":{
        translatedName: "Terreno Floresta",
        spriteUrl: imagesPath + "/terrains/terrain-trees.png"
    },
    "path":{
        translatedName: "Caminho",
        spriteUrl: imagesPath + "/paths/path.png"
    },
    "path-l":{
        translatedName: "Caminho L",
        spriteUrl: imagesPath + "/paths/path-L.png"
    },
    "path-t":{
        translatedName: "Caminho T",
        spriteUrl: imagesPath + "/paths/path-T.png"
    },
    "path-cross":{
        translatedName: "Caminho +",
        spriteUrl: imagesPath + "/paths/path-cross.png"
    }
};

const shortenedBuildingsDataMap = {
    "entrance":{
        translatedName: "Portão de Entrada",
        description: "Este portão de proporções colossais é como um bastião que guarda a entrada do seu Parque. Não há nada dentro da ilha (humano ou dinossauro) que não tenha passado por ele.",
        "purpose": "Permite trocar o nome do Parque.",
        spriteUrl: imagesPath + "/buildings/entrance.png"
    },
    "visitor-center":{
        translatedName: "Centro de Visitantes",
        description: "O coração de todo parque. O Centro de Visitantes não é apenas um grande hall pelo qual seus visitantes passam ao chegar no Parque, é um verdadeiro QG onde a Staff do Parque monitora tudo o que acontece na ilha.",
        "purpose": "Permite visualizar a Avaliação do seu Parque e todas as Espécies nele.",
        spriteUrl: imagesPath + "/buildings/visitor-center.png"
    },
    "enclosure":{
        translatedName: "Cercado",
        description: "Os cercados são imprescindíveis para a existência do seu Parque. Em última instância, eles são a última barreira entre nós e essas criaturas incríveis. Pelo menos, até que uma tempestade atinja a ilha...",
        "purpose": "Permite comportar até 1 espécie de dinossauro por vez. Pode receber upgrades.",
        spriteUrl: imagesPath + "/buildings/enclosure.png"
    },
    "hatchery":{   
        translatedName: "Laboratório de Incubação",
        description: "Trazer um dinossauro de volta à vida não é uma tarefa fácil. Para realizar tal façanha diariamente, seus cientistas precisarão de um lugar adequado para trabalhar.",
        "purpose": "Permite incubar até 1 espécie de dinossauro por vez.",
        spriteUrl: imagesPath + "/buildings/hatchery.png"
    },
    "path":{
        translatedName: "Caminhos",
        description: "Por mais que caminhar pela mata ajudaria no aspecto da imersão, seus visitantes certamente ficariam mais confortáveis se tivessem caminhos pavimentados para andar pelo Parque.",
        "purpose": "Apenas para a estética.",
        spriteUrl: imagesPath + "/buildings/path.png"
    },
    "terrain":{
        translatedName: "Terreno",
        description: "Toda a natureza intocada da Isla Nublar faz com que seus visitantes sintam como se tivessem retornado a 65 milhões de anos atrás.",
        "purpose": "Apenas para a estética.",
        spriteUrl: imagesPath + "/buildings/terrain.png"
    }
};

const eventsDataMap = {
    "sabotage": {
        translatedName: "Sabotagem",
        description: "Todo cuidado é pouco. Um funcionário do seu Parque foi mandado embora e decidiu se vingar - ele desativou todos os sistemas de segurança do Parque!",
        consequences: "A vida de todos os Cercados do seu Parque caem em 25%",
        spawnChance: 0.25,
        spriteUrl: imagesPath + "/events/sabotage.png"
    },
    "pouringRain": {
        translatedName: "Chuva Torrencial",
        description: "O Clima tropical da Costa Rica é extremamente instável. Sob uma tempestade dessas proporções, as coisas no Parque vão ter de esperar.",
        consequences: "Enquanto a chuva durar o atributo de avaliação do seu Parque cai em 1 estrela. Além disso, o tempo de incubação de todas as espécies aumenta em 33%",
        spawnChance: 0.33,
        spriteUrl: imagesPath + "/events/pouring-rain.png"
    }
};