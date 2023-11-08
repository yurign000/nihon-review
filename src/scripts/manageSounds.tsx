import cancel from '../sounds/cancel.wav';
import check from '../sounds/check.wav';
import remove from '../sounds/remove.wav';
import click from '../sounds/click.wav';
import click2 from '../sounds/click2.wav';
import confirm from '../sounds/confirm.wav';
import pause from '../sounds/pause.wav';
import error from '../sounds/error.wav';
import enableInfo from '../sounds/enable-info.wav';
import changePage from '../sounds/change-page.wav';
import ninjaClick from '../sounds/ninja-click.wav';
import { Configuration } from './defaultConfiguration';

const sounds: any = {
    'click': click,              //ALTERNAR ENTRE AS TELAS DA CONFIG, PASSAR MOUSE POR CIMA DE ALGUNS BOTÕES 
    'click2': click2,            //HABILITAR SOM, CLICAR NO BOTÃO "+" DE KANJI E CLICAR EM UM KANJI 
    'cancel': cancel,            //SAIR DE QUALQUER MENU
    'check': check,              //HABILITAR CHECKBOX
    'confirm': confirm,          //SALVAR CONFIGURAÇÕES, EDITAR KANJI E ADICIONAR NOVO KANJI
    'pause': pause,              //ABRIR CONFIGURAÇÕES
    'error': error,              //QUALQUER ERRO NO SITE
    'enable-info': enableInfo,   //HABILITAR DAKUTEN E HANDAKUTEN
    'remove': remove,            //REMOVER KANJIS OU RESETAR CONFIGURAÇÕES
    'change-page': changePage,   //ALTERAR URL
    'ninja-click': ninjaClick,   //CLICAR NO NINJA
}

//INICIAR O SOM PASSADO PARA A FUNÇÃO
const playSound = (soundName: string, soundEnabled?: boolean): void => {
    let configuration: Configuration = JSON.parse(localStorage.configuration);

    if(configuration.sound_enabled || soundEnabled){
        let audio: HTMLAudioElement = new Audio();
        audio.src = sounds[soundName];
    
        audio.play();
    }

};

export default playSound;