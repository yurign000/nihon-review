export const defaultConfiguration: object = {
    theme: 'white',           //TEMA DO SITE
    time_to_answer: 3,        //TEMPO PARA RESPONDER CADA PERGUNTA
    answer_rest_delay: 3,     //TEMPO EM QUE A RESPOSTA IRÁ APARECER ATÉ A PROXIMA PERGUNTA
    show_info_on_game: true,  //MOSTRAR DETALHES DE CADA PERGUNTA NA RESPOSTA. ex: mostrar se é handakuten
    sound_enabled: true,
    questions_at_a_time: 3,   //QUESTÕES POR TESTE

    hiragana: {
        sets_to_show: ['group a', 'group ha', 'group ta', 'group ka'] //QUAIS TIPOS DE GRUPOS MOSTRAR
    },
    
    katakana: {
        sets_to_show: ['group a', 'group ha', 'group ta', 'group ka']
    },
    
    kanji: {
        show_meaning: true,
        show_onyomi: true,
        show_kunyomi: true,
        kanji_list: [
            //KANJI, SIGNIFICADO, LEITURAS NATIVAS JAPONESAS, LEITURAS PROXIMAS ÀS CHINESAS
            ['学','study, learning, science', {kunyomi: 'まなぶ', onyomi:'ガク'}],
            ['大','large, big', {kunyomi: 'おお', onyomi:'ダイ,タイ'}],
            ['円','yen, circle, round', {kunyomi: 'まる', onyomi:'エン'}],
            ['前','in front, before', {kunyomi: 'まえ', onyomi:'ゼン'}],
        ]
    }
}