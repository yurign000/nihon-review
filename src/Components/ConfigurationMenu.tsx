import './configuration.css'
import return_img from '../assets/return.png';
import salvar from '../assets/salvar.png';
import cancelar from '../assets/cancelar.png';
import React, { RefObject, useEffect, useRef, useState } from 'react';
import { Configuration, defaultConfiguration } from '../scripts/defaultConfiguration';
import playSound from '../scripts/manageSounds';
import { KanjiList } from '../scripts/data';
import Hiragana from './Hiragana';
import Katakana from './Katakana';

interface ConfigurationMenuProps {
    setShowConfiguration: React.Dispatch<React.SetStateAction<boolean>>;
    setIsFullScreen:      React.Dispatch<React.SetStateAction<boolean>>;
    setConfiguration:     React.Dispatch<React.SetStateAction<Configuration>>;
    configuration:        Configuration;
    portraitAlert:        RefObject<HTMLDivElement>;
}

export default function ConfigurationMenu(props: ConfigurationMenuProps){    

    const [config_t, setConfig_t] = useState<Configuration>(props.configuration);

    const [addingNewKaji, setAddingNewKaji] =         useState<boolean>(false);
    const [editingKanji, setEditingKanji] =           useState<boolean>(false);
    const [scrollPosition, setScrollPosition] =       useState<number>(0);
    const [kanjiSymbol, setKanjiSymbol] =             useState<string>('');
    const [kanjiMeaning, setKanjiMeaning] =           useState<string>('');
    const [kunyomi, setKunyomi] =                     useState<string>('');
    const [onyomi, setOnyomi] =                       useState<string>('');
    const [kanjiToEdit, setKanjiToEdit] =             useState<string>('');
    const [alertMessage, setAlertMessage] =           useState<string>('');
    const [h_k_alertMsg, setH_k_setAlertMsg] =        useState<string>('');
    
    var removeCounting = 0;

    const pagesContainer =      useRef<HTMLElement>(null);
    const hiragana_ref =        useRef<HTMLElement>(null);
    const katakana_ref =        useRef<HTMLElement>(null);
    const kanjiMenuFirstInput = useRef<HTMLInputElement>(null);
    const removeKanjiButton =   useRef<HTMLButtonElement>(null);

    //HABILITAR SOM
    const switchSound = (): void => {
        props.setConfiguration({...props.configuration, sound_enabled: !config_t.sound_enabled});
        setConfig_t({...config_t, sound_enabled: !config_t.sound_enabled});
        if(!config_t.sound_enabled) playSound('click2', true);
    }

    // NAVEGAR ENTRE AS PAGINAS DAS CONFIGURAÇÕES
    const passPages = (direction: number, position?: number): boolean => {
        const slideWidth: number = (pagesContainer.current?.childNodes[0] as HTMLDivElement)?.scrollWidth;
        const pages = pagesContainer.current?.childNodes as NodeListOf<HTMLDivElement>

        // NÃO DAR SCROLL CASO ESTEJA NO INICIO OU FIM DAS PAGINAS
        if((direction == -1 && scrollPosition <= 0) ||
           (direction == 1 && scrollPosition >= slideWidth * (pages.length-1))
        ){
            return false;
        } 

        var tempScrollPosition: number = 0;

        switch(position){
            //PASSAR UMA PAGINA PARA FRENTE OU TRAS
            case undefined: 
                tempScrollPosition = slideWidth * direction + scrollPosition;
                break
            //IR PARA A ULTIMA PAGINA DE KANJIS
            case -2:
                tempScrollPosition = slideWidth * (pages.length - 2);
                break
            //IR PARA A PRIMEIRA PAGINA DE KANJIS
            case 3:
                tempScrollPosition = slideWidth * 3;
                break
            //IR PARA A ULIMA PAGINA
            case -1://
                tempScrollPosition = slideWidth * (pages.length - 1);
                break
        }
        setScrollPosition(tempScrollPosition);

        pagesContainer.current?.childNodes.forEach((page: ChildNode) => {
            (page as HTMLDivElement).style.transform = `translate(-${tempScrollPosition}px)`; 
        })
        return true;
    }

    //BLOQUEAR A TECLA TAB NA ULTIMA PAGINA DAS CONFIGURAÇÕES
    useEffect(() => {
        document.querySelector('.configuration .body > section')?.setAttribute('tabindex', '-1')
    },[])

    const resetInputs = (): void => {
        setKanjiSymbol('');
        setKanjiMeaning('');
        setKunyomi('');
        setOnyomi('');
        setKanjiToEdit('');
    }

    const focusOnFirstInputOnKanjiMenu = (): void => {
        playSound('click2');
        setTimeout(() => {
            kanjiMenuFirstInput.current?.focus();
        }, 200);
    }

    //ESPERAR O MENU DE ADIÇÃO DE KANJI ABRIR E ENTÃO FOCAR NO PRIMEIRO INPUT
    const openAddKanjiMenu = (): void => {
        setAddingNewKaji(true);
        focusOnFirstInputOnKanjiMenu()
    }

    //ABRIR MENU DE EDIÇÃO DE KANJI
    const openEditKanjiMenu = (t: {innerHTML: string}): void => {
        setEditingKanji(true);
        focusOnFirstInputOnKanjiMenu();

        let kanjis: KanjiList[] = config_t.kanji.kanji_list;
        let kanji: KanjiList  | undefined = kanjis.find((k: KanjiList): boolean => k[0] == t.innerHTML);
        
        setKanjiSymbol(kanji![0]);
        setKanjiMeaning(kanji![1]);
        setKunyomi(kanji![2].kunyomi);
        setOnyomi(kanji![2].onyomi);
        setKanjiToEdit(kanji![0]);
    }

    //ADICIONAR NOVO KANJI
    function addKanji(): void {
        let kanjis: KanjiList[] = [...config_t.kanji.kanji_list];
        
        if(!kanjiAlerts(kanjis)){
            kanjis.push([kanjiSymbol, kanjiMeaning, { kunyomi: kunyomi, onyomi: onyomi }]);
            setConfig_t({...config_t, kanji: {kanji_list: kanjis}})
            setAddingNewKaji(false); 
            resetInputs();
            playSound('confirm');
            resetInputs();
        }
    }

    // EDITAR KANJI SELECIONADO
    const editKanji = (): void => {
        let kanjis: KanjiList[] = [...config_t.kanji.kanji_list];

        if(!kanjiAlerts(kanjis)){
            let kanji: KanjiList = kanjis.find((k: KanjiList) => k[0] == kanjiToEdit) as KanjiList
            
            kanjis[kanjis.indexOf(kanji)] = [kanjiSymbol, kanjiMeaning, {kunyomi:kunyomi, onyomi:onyomi}];
            setConfig_t({...config_t, kanji: {kanji_list: kanjis}})
            resetInputs();
            setEditingKanji(false);
            playSound('confirm')
        }
    }
    //REMOVER KANJI AO MANTER PRESSIONADO O BOTÃO ESQUERDO DO MOUSE NO BOTÃO "REMOVER" POR 1.5s
    const removeKanji = (): void => {
        if(config_t.kanji.kanji_list.length == 1){
            setAlertMessage('É necessário haver pelo menos um kanji armazenado');
            playSound('error');
            return;
        }

        removeKanjiButton.current?.classList.add('removing-button')

        removeCounting = setTimeout(() => {
            setConfig_t({...config_t, kanji: {kanji_list: config_t.kanji.kanji_list.filter((k: KanjiList) => 
                k[0] != kanjiToEdit
            )}})
            resetInputs();
            setEditingKanji(false);
            playSound('remove')
        }, 1500);
    }
    //PARAR REMOÇÃO DE KANJI AO DESPRESSIONAR O BOTÃO ESQUERDO DO MOUSE SOBRE O BOTÃO "REMOVER"
    const stopRemovingKanji = (): void => {
        removeKanjiButton.current?.classList.remove('removing-button')
        clearInterval(removeCounting);
    }

    //VERIFICAR INPUTS INVALIDOS NA HORA DE ADICIONAR OU EDITAR KANJIS
    const kanjiAlerts = (kanjis: KanjiList[]): boolean => {
        let kanjiRepeated: KanjiList | undefined = kanjis.find((kanji: KanjiList) => kanji[0] == kanjiSymbol);

        if (kanjiSymbol.length > 1) {
            setAlertMessage('Digite apenas um caractere no campo "Simbolo do Kanji');
            playSound('error');
            return true;
        }
        if (!kanjiSymbol || !kanjiMeaning) {
            setAlertMessage('Os campos "Simbolo do kanji" e "Significado(s) do kanji" não podem estar vazios"');
            playSound('error');
            return true;
        }
        if (!kunyomi && !onyomi) {
            setAlertMessage('Preencha pelo menos um dos campos: "Leitura Kunyomi" ou "Leitura Onyomi"');
            playSound('error');
            return true;
        }
        if (kanjiRepeated && kanjiToEdit != kanjiSymbol) {
            setAlertMessage('O kanji digitado já existe');
            playSound('error');
            return true;
        }
        
        return false;
    }

    //OBTER AS PAGINAS DOS KANJIS
    const getKanjiElements = (): JSX.Element[] => {

        //OBTER UM CONJUNTO CONTENDO 32 KANJIS POR VEZ
        const getKanjiLabels = (key: number): JSX.Element[] => {
            const labels: JSX.Element[] = [];
            
            for(var l: number = key*32; l < key*32+32; l++){
                if(!config_t.kanji.kanji_list[l]) break;
                let kanji: KanjiList = config_t.kanji.kanji_list[l];

                labels.push(
                    <label 
                        title={`${kanji[1]}\n${kanji[2]?.kunyomi}\n${kanji[2]?.onyomi}`}
                        key={l} 
                        onClick={({target}): void => openEditKanjiMenu(target as HTMLLabelElement)}
                    >
                        {config_t.kanji.kanji_list[l][0]}
                    </label> 
                )
            }

            //ADICIONAR UM BOTÃO DE + APÓS O ÚLTIMO KANI
            if(labels.length < 32){
                labels.push(
                    <label className='add-kanji' key={labels.length}>
                        <span onClick={() => openAddKanjiMenu()}>+</span>
                    </label>
                )
            }
            return labels;
        }

        //OBTER PÁGINAS DE KANJIS, CADA PAGINA DEVERÁ CONTER 32 KANJIS
        const getKanjiPages = (): JSX.Element[] => {
            const articles: JSX.Element[] = [];
            let k_length: number = config_t.kanji.kanji_list.length;

            for(var i: number = 0; i <= config_t.kanji.kanji_list.length/32; i++){
                let a_length: number = articles.length;

                articles.push(
                    <div
                        key={i}
                        className='kanji-screen pages'
                    >
                        <h3>Kanji <span>({config_t.kanji.kanji_list.length})</span> </h3>
                        <article>
                            {/*32 KANJIS*/} 
                            {getKanjiLabels(i)} 
                        </article>
                        {/* BOTÃO DE PULAR PARA O ULTIMO KANJI */}
                        {
                            (k_length > 32 && a_length != parseInt(String(k_length/32))) && 
                            <ins onClick={() => passPages(-1, -2)}></ins>
                        }
                    </div>
                )
            }

            return articles
        }

        return getKanjiPages();
    }

    //SALVAR CONFIGURAÇÕES E FECHAR MENU
    const saveConfiguration = (): void => {
        
        if(!saveConfigurationAlert()){
            props.setConfiguration(config_t);
            props.setShowConfiguration(false);
            playSound('confirm')
        }
    }

    //ALERTAS DE CONFIGURAÇÕES INCORRETAS NA HORA DE SALVAR
    const saveConfigurationAlert = (): boolean => {

        if(config_t.hiragana.sets_to_show.length == 0 || config_t.katakana.sets_to_show.length == 0){
            setH_k_setAlertMsg('Selecione pelo menos um grupo de hiragana e katakana')
            playSound('error');
            return true;
        };
        if(config_t.time_to_answer == 0){
            setH_k_setAlertMsg('O tempo para responder precisa ser maior que 0')
            playSound('error');
            return true;
        }
        if(config_t.answer_rest_delay == 0){
            setH_k_setAlertMsg('A duração da resposta precisa ser maior que 0')
            playSound('error');
            return true;
        }
        if(config_t.questions_at_a_time == 0){
            setH_k_setAlertMsg('O maximo questões por review precisa ser maior que 0')
            playSound('error');
            return true;
        }

        return false;
    }

    //BLOQUEAR A TECLA TAB EM CERTOS ELEMENTOS
    const disableTabKey = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if(event.key == 'Tab') event.preventDefault();
    }

    //RETORNAR AS CONFIGURAÇÕES PARA A VERSÃO INICIAL
    const resetConfiguration = (target: HTMLButtonElement, count?: number): void => {
        if(count == undefined) target.innerHTML = '5'

        if(target.innerHTML == '0'){
            playSound('remove');
            setConfig_t(defaultConfiguration);
            passPages(-1,0);
            target.innerHTML = 'Resetar Tudo'
            return;
        }

        setTimeout(() => {
            if(target.innerHTML != 'Resetar Tudo'){
                let count_: number = count || 5;

                target.innerHTML = String(count_ - 1);
                resetConfiguration(target, count_ - 1);
                playSound('check')
            }
        }, 1000);
    }

    //MUDAR TEXTO DE BOTÃO DE RESET PARA SEU PADRÃO AO CANCELAR O RESET 
    function stopResetConfiguration(target: HTMLButtonElement): void{
        target.innerHTML = 'Resetar Tudo'
    }

    //EXPORTAR KANJIS COMO TXT
    const exportKanjis = (): void => {
        var content: Blob = new Blob(
            [JSON.stringify(config_t.kanji.kanji_list)],
            {type:'text/plain'}
        );

        var url: string = window.URL.createObjectURL(content);

        var a: HTMLAnchorElement = document.createElement('a');
        a.href = url;
        a.download = 'kanjis.txt';

        a.click();
        props.setIsFullScreen(false);

        awaitExportingImportingKanjis();
    }

    //OBTER TXT CONTENDO OS KANJIS E ADICIONA-LOS AO LOCALSTORAGE
    const importKanjisClick = (target: HTMLButtonElement): void => {
        (target.children[0] as HTMLInputElement)?.click()
        props.setIsFullScreen(false);
        
        awaitExportingImportingKanjis();
    }

    /*
    FAZER COM QUE O MENU DE CONFIGURAÇÕES SEJA JOGADO PARA A ULTIMA TELA APOS RETORNAR DO MODO
    RETRATIL AO MODO PAISAGEM NO CELULAR
    */
    const awaitExportingImportingKanjis = (): void => {
        setTimeout(() => {
            props.portraitAlert.current?.addEventListener('click', () => setTimeout(() => {
                passPages(-1,-1)
            }, 500));
        }, 1000);
    }

    //IMPORTAR KANJIS COMO TXT
    const importKanjis = (target: HTMLInputElement): void => {
        document.createElement('input').files
        if ((target as {files: FileList}).files.length > 0) {
            const file: File = (target as {files: FileList}).files[0];
            const reader: FileReader = new FileReader();
            
            reader.onload = ({target}): void =>{
                const content: string | ArrayBuffer | null = (target as FileReader).result;

                if(content){
                    try{
                        if(typeof(content) == 'string'){
                            let kanjisList: KanjiList[] = JSON.parse(content);

                            if(kanjisList[0][2].kunyomi){
                                setConfig_t({...config_t, kanji: {kanji_list: kanjisList}});
                                playSound('confirm');
                                passPages(-1,3)
                            }
                        }
                        else throw new Error('Formato de document inválido');
                    }
                    catch(error: unknown){
                        alert('Formato de documento inválido')
                    }
                }  
            };

            reader.readAsText(file);
        }
        target.value = '';   
    }

    //TRATAMENTO DE INPUTS NA PAGINA "GERAL"
    const formateInputs = (value: number):number => {
        let formatedValue: number = Math.abs(value)

        if(formatedValue > 999) formatedValue = 999
        return formatedValue;
    }

    return (
        <div className={'configuration ' + props.configuration.theme}>
            <div className='black_grid'></div>
            
            <main onMouseDown={() => setH_k_setAlertMsg('')} className='body'>
                {h_k_alertMsg && <label className='h-k-alert-message'>{h_k_alertMsg}</label>}
                
                <div className='sound-button' onClick={() => switchSound()}>
                    <img 
                        src={props.configuration.sound_enabled ? '/sound-enabled.png' : '/sound-disabled.png'} 
                        alt="sound button" 
                    />
                </div>

                <section ref={pagesContainer}>
                        <div className='pages' >
                            <h3>Geral</h3>
                            <main className='basic-screen'>
                                <div>
                                    <label 
                                        className='have-info' 
                                        title='Tempo para responder cada questão(em segundos)'>
                                            Tempo para responder:
                                    </label>
                                    <input 
                                        type="number"
                                        value={config_t.time_to_answer} 
                                        onChange={({target}) => {
                                            setConfig_t({...config_t, time_to_answer: formateInputs(Number((target as HTMLInputElement)?.value))})
                                        }}
                                    />
                                </div>
                                <div>
                                    <label 
                                        className='have-info' 
                                        title='Após revelar a resposta, manter ela visível por alguns segundos'>
                                            Duração da resposta: 
                                    </label>
                                    <input 
                                        type="number" 
                                        value={config_t.answer_rest_delay} 
                                        onChange={({target}) =>  {
                                            setConfig_t({...config_t, answer_rest_delay: formateInputs(Number((target as HTMLInputElement)?.value))})
                                        }}
                                    />
                                </div>
                                <div>
                                    <label 
                                        className='have-info' 
                                        title='Quantidade máxima de questões que aparecerão por review'>
                                            Maximo de questões por review: 
                                    </label>
                                    <input 
                                        type="number" 
                                        value={config_t.questions_at_a_time} 
                                        onChange={({target}) =>  {                                                                                                    
                                            setConfig_t({...config_t, questions_at_a_time: formateInputs(Number((target as HTMLInputElement)?.value)) })
                                        }}
                                        onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => disableTabKey(event)}
                                    />
                                </div>
                                <div>
                                    <label 
                                        className='have-info' 
                                        title='Mostrar se é kunten, dakuten ou handakuten'>
                                            Mostrar tipo de hiragana/katakana?
                                        </label>
                                    <i 
                                        onClick={() => {
                                            setConfig_t({...config_t, show_info_on_game: !config_t.show_info_on_game});
                                            playSound('check')}
                                        }>
                                            {config_t.show_info_on_game ? 'SIM' : 'NÃO'}
                                    </i>
                                </div>
                            </main>
                        </div>
                        <div 
                            className='hiragana-screen pages' 
                            onKeyDown={(event) => disableTabKey(event)}
                        >
                            <h3>Hiragana</h3>
                            <article ref={hiragana_ref}>
                                <Hiragana config_t={config_t} setConfig_t={setConfig_t}/>
                            </article>
                        </div>
                        <div 
                            className='katakana-screen pages' 
                            onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => disableTabKey(event)}
                        >
                            <h3>Katakana</h3>
                            <article ref={katakana_ref}>
                                <Katakana config_t={config_t} setConfig_t={setConfig_t}/>
                            </article>
                        </div>
                        {getKanjiElements()}
                        <div 
                            className='export-screen pages'
                        >
                            <button 
                                onMouseOver={() => playSound('click')}
                                onClick={() => exportKanjis()}
                                >
                                    Exportar Kanjis
                            </button>
                            <button 
                                onClick={({target}) => importKanjisClick(target as HTMLButtonElement)}
                                onMouseOver={() => playSound('click')}
                            >
                                <input 
                                    type="file" 
                                    onChange={({target}) => importKanjis(target as HTMLInputElement)} 
                                    accept='text/plain'
                                />
                                Importar Kanjis
                            </button>
                            <button 
                                onMouseOver={() =>          playSound('click')}
                                onMouseUp={({target}) =>    stopResetConfiguration(target as HTMLButtonElement)} 
                                onTouchEnd={({target}) =>   stopResetConfiguration(target as HTMLButtonElement)} 
                                onMouseLeave={({target}) => stopResetConfiguration(target as HTMLButtonElement)} 
                                onTouchMove={({target}) =>  stopResetConfiguration(target as HTMLButtonElement)} 
                                onMouseDown={({target}) =>  resetConfiguration(target as HTMLButtonElement)}
                                onTouchStart={({target}) => resetConfiguration(target as HTMLButtonElement)}
                                onContextMenu={(e: React.MouseEvent) => e.preventDefault()}
                            >Resetar Tudo</button>
                        </div>
                </section>

                <img 
                    src={salvar} 
                    alt="salvar" 
                    className='salvar' 
                    onClick={() => saveConfiguration()}
                    onContextMenu={(e: React.MouseEvent) => e.preventDefault()}
                />
                <img 
                    src={cancelar} 
                    alt="cancelar" 
                    className='cancelar' 
                    onClick={() => {props.setShowConfiguration(false); playSound('cancel')}}
                    onContextMenu={(e: React.MouseEvent) => e.preventDefault()}
                />

                <img 
                    src={return_img} 
                    alt="backward" 
                    className='backward' 
                    onClick={ () => passPages(-1) && playSound('click')}
                    onContextMenu={(e: React.MouseEvent) => e.preventDefault()}
                />
                <img 
                    src={return_img} 
                    alt="forward" 
                    className='forward' 
                    onClick={() => passPages(1) && playSound('click')}
                    onContextMenu={(e: React.MouseEvent) => e.preventDefault()}
                />

                {addingNewKaji && (
                    <form 
                        autoComplete='off'
                        onSubmit={(event: React.FormEvent) => {addKanji(); event.preventDefault()}}
                        className='add-kanji-menu' 
                        onFocus={() => setAlertMessage('')} 
                        onContextMenu={(e: React.FormEvent) => e.preventDefault()}>
                        <p>Simbolo do kanji:</p>
                        <input 
                            ref={kanjiMenuFirstInput}
                            id='add-first-input'
                            type="text" 
                            placeholder='学' 
                            onChange={({target}) => setKanjiSymbol(target.value)}
                        />

                        <p>Significado(s) do kanji:</p>
                        <input 
                            type="text" 
                            placeholder='study, learning...' 
                            onChange={({target}) => setKanjiMeaning(target.value)}
                        />

                        <p title='Leituras nativas japonesas'>Leitura Kunyomi:</p>
                        <input type="text" placeholder='まなぶ' onChange={({target}) => setKunyomi(target.value)}/>

                        <p title='Leituras mais próximas as chinesas(mais usadas em kanjis compostos)'>Leitura Onyomi:</p>
                        <input type="text" placeholder='ガク' onChange={({target}) => setOnyomi(target.value)}/>

                        {alertMessage && <label className='alert-message'>{alertMessage}</label>}

                        <div>
                            <button type='submit'>ADICIONAR</button>
                            <button onClick={() => {setAddingNewKaji(false); playSound('cancel'); resetInputs()}} type='button'>CANCELAR</button>
                        </div>                   
                    </form>
                )}
                {editingKanji && (
                    <form 
                        autoComplete='off'
                        onSubmit={(event: React.FormEvent) => {editKanji(); event.preventDefault()}}
                        className='add-kanji-menu' 
                        onFocus={() => setAlertMessage('')} 
                        onContextMenu={(e: React.MouseEvent) => e.preventDefault()}>
                        <p>Simbolo do kanji:</p>
                        <input 
                            ref={kanjiMenuFirstInput}
                            type="text" 
                            id='edit-first-input'
                            placeholder='学' 
                            value={kanjiSymbol} 
                            onChange={({target}) => setKanjiSymbol(target.value)}
                        />

                        <p>Significado(s) do kanji:</p>
                        <input 
                            type="text" 
                            placeholder='study, learning...' 
                            value={kanjiMeaning} 
                            onChange={({target}) => setKanjiMeaning(target.value)}
                        />

                        <p title='Leituras nativas japonesas'>Leitura Kunyomi:</p>
                        <input 
                            type="text" 
                            placeholder='まなぶ' 
                            value={kunyomi} 
                            onChange={({target}) => setKunyomi(target.value)}
                        />

                        <p title='Leituras mais próximas as chinesas(mais usadas em kanjis compostos)'>Leitura Onyomi:</p>
                        <input 
                            type="text" 
                            placeholder='ガク' 
                            value={onyomi} 
                            onChange={({target}) => setOnyomi(target.value)}
                        />

                        {alertMessage && <label className='alert-message'>{alertMessage}</label>}

                        <div>
                            <button type='submit'>EDITAR</button>
                            <button onClick={() => {setEditingKanji(false); playSound('cancel');resetInputs()}} type='button'>CANCELAR</button>
                            <button 
                                ref={removeKanjiButton}
                                className='remove-button'
                                onMouseUp={() => stopRemovingKanji()} 
                                onTouchEnd={() => stopRemovingKanji()} 
                                onMouseLeave={() => stopRemovingKanji()} 
                                onTouchMove={() => stopRemovingKanji()} 
                                onMouseDown={() => removeKanji()}
                                onTouchStart={() => removeKanji()}
                                type='button'
                            >REMOVER</button>
                            
                        </div>                   
                    </form>
                )}
            </main>
        </div>
    )
}