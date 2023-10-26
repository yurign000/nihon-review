import './configuration.css'
import return_img from '../assets/return.png';
import salvar from '../assets/salvar.png';
import cancelar from '../assets/cancelar.png';
import { useEffect, useState } from 'react';
import { defaultConfiguration } from '../routes/Root/defaultConfiguration';
import playSound from '../manageSounds';

export default function Configuration({setShowConfiguration, setIsFullScreen}: any): any{
    const [kanjis, setKanjis]:               [string[], any] = useState([]);
    const [configuration, setConfiguration]: [any, any] = useState({});
    const [addingNewKaji, setAddingNewKaji]: [boolean, any] = useState(false);
    const [editingKanji, setEditingKanji]:   [boolean, any] = useState(false);
    const [kanjiSymbol, setKanjiSymbol]:     [string, any] = useState('');
    const [kanjiMeaning, setKanjiMeaning]:   [string, any] = useState('');
    const [kunyomi, setKunyomi]:             [string, any] = useState('');
    const [onyomi, setOnyomi]:               [string, any] = useState('');
    const [kanjiToEdit, setKanjiToEdit]:     [string, any] = useState('');
    const [hoverKTitle, setHoverKTitle]:     [string, any] = useState('');
    const [alertMessage, setAlertMessage]:   [string, any] = useState('');
    const [hSelected, setHselected]:         [string[], any] = useState([]);
    const [kSelected, setKselected]:         [string[], any] = useState([]);
    const [soundEnabled, setSoundEnabled]:   [boolean,any] = useState(false);
    const [timeToAnswer, setTimeToAnswer]:   [string, any] = useState('');
    const [showMoreInfo, setShowMoreInfo]:   [boolean, any] = useState(false);
    const [questionsAtTime, setQuestionsAtTime]:   [string, any] = useState('');
    const [h_k_alertMsg, setH_k_setAlertMsg]:      [string, any] = useState('');
    const [answerRestDelay, setAnswerRestDelay]:   [string, any] = useState('');
    const [changedSound, setChangedSound]:         [boolean, any] = useState(false);

    var removeCounting = 0;

    //HABILITAR SOM
    const switchSound = (target: any): void => {
        let configurationSound: any = JSON.parse(localStorage.configuration);

        if(target.src?.endsWith('sound-disabled.png')){
            setSoundEnabled(true);
            target.src = '/sound-enabled.png';
            configurationSound.sound_enabled = true
            setChangedSound(true)
        }
        else{
            setSoundEnabled(false);
            target.src = '/sound-disabled.png';
            configurationSound.sound_enabled = false
            setChangedSound(false)
        }
        
        localStorage.setItem('configuration', JSON.stringify(configurationSound));
    }
    useEffect(() => {
        if(!changedSound) return
        
        playSound('click2')
    }, [changedSound])
    // NAVEGAR ENTRE AS PÁGINAS
    const alternateIntoOptions = (direction: number): void => {
        const screenOptions: any = document.querySelector('.configuration section');
        const screenWidth: number = screenOptions.scrollWidth / screenOptions.children.length
        
        screenOptions.scrollLeft += screenWidth * direction;
        
        if(screenOptions.scrollLeft + 5 > screenOptions.scrollWidth - screenWidth){
            screenOptions.scrollLeft = screenOptions.scrollWidth;
        }

        playSound('click');
    }
    //CARREGAR KANJIS, VERIFICAR TEMA, HABILITAR CHECKBOXS
    useEffect(() => {
        if(localStorage.configuration){
            setConfiguration(JSON.parse(localStorage.configuration));
        }
    },[])
    useEffect(() => {
        if(JSON.stringify(configuration) == '{}') return;

        setKanjis(configuration.kanji.kanji_list)

        if(configuration.theme == 'dark'){
            let configElem: any = document.querySelector('.configuration');
            configElem.classList.add('dark');
        }
        else{
            let configElem: any = document.querySelector('.configuration');
            configElem.classList.remove('dark');
        }

        let hiragana_checkBox_list: NodeListOf<Element> = document.querySelectorAll('.hiragana-screen article div input');
        let katakana_checkBox_list: NodeListOf<Element> = document.querySelectorAll('.katakana-screen article div input');
        let hiragana_sets_selected: string[] = configuration.hiragana.sets_to_show;
        let katakana_sets_selected: string[] = configuration.katakana.sets_to_show;

        hiragana_checkBox_list.forEach((checkbox: any) => {
            checkbox.addEventListener('click', () => playSound('check'))
            
            if(hiragana_sets_selected.includes(checkbox.value)) 
                checkbox.checked = true
            else checkbox.checked = false
        })
        
        katakana_checkBox_list.forEach((checkbox: any) => {
            checkbox.addEventListener('click', () => playSound('check'))

            if(katakana_sets_selected.includes(checkbox.value)) 
                checkbox.checked = true
            else checkbox.checked = false
        })

        setHselected(hiragana_sets_selected)
        setKselected(katakana_sets_selected)

        if(configuration.sound_enabled){
            let soundElem: any = document.querySelector('.configuration .sound-button img');

            setSoundEnabled(true);
            soundElem.src = '/sound-enabled.png';
        }

        setTimeToAnswer(configuration.time_to_answer);
        setShowMoreInfo(configuration.show_info_on_game);
        setQuestionsAtTime(configuration.questions_at_a_time)
        setAnswerRestDelay(configuration.answer_rest_delay)

    }, [configuration])
    const resetInputs = (): void => {
        setKanjiSymbol('');
        setKanjiMeaning('');
        setKunyomi('');
        setOnyomi('');
    }
    //ADICIONAR NOVO KANJI
    function addKanji(): void {
        let kanjis_copy: any = [...kanjis];

        let kanjiRepeated = kanjis.find((kanji: any) => kanji[0] == kanjiSymbol);



        if (kanjiSymbol.length > 1) {
            setAlertMessage('Digite apenas um caractere no campo "Simbolo do Kanji');
            playSound('error');
            return;
        }
        if (!kanjiSymbol || !kanjiMeaning) {
            setAlertMessage('Os campos "Simbolo do kanji" e "Significado(s) do kanji" não podem estar vazios"');
            playSound('error');
            return;
        }
        if (!kunyomi && !onyomi) {
            setAlertMessage('Preencha pelo menos um dos campos: "Leitura Kunyomi" ou "Leitura Onyomi"');
            playSound('error');
            return;
        }
        if (kanjiRepeated) {
            setAlertMessage('O kanji digitado já existe');
            playSound('error');
            return;
        }

        setAddingNewKaji(false);
        resetInputs();

        kanjis_copy.push([kanjiSymbol, kanjiMeaning, { kunyomi: kunyomi, onyomi: onyomi }]);
        setKanjis(kanjis_copy);
        playSound('confirm');
    }
    const openEditKanjiMenu = ({innerHTML}: any): void => {
        setEditingKanji(true);

        let kanji: any = kanjis.find((k): any => k[0] == innerHTML);
        
        setKanjiSymbol(kanji[0]);
        setKanjiMeaning(kanji[1]);
        setKunyomi(kanji[2].kunyomi);
        setOnyomi(kanji[2].onyomi);
        setKanjiToEdit(kanji[0])
    }
    //ABRIR MENU DE EDIÇÃO DE KANJI
    const editKanji = (): void => {
        let kanji: any = kanjis.find((k): any => k[0] == kanjiToEdit);
        let kanjiPosition: number = kanjis.indexOf(kanji);
        
        let kanjis_copy: any = [...kanjis];

        let kanjiRepeated = kanjis.find((kanji: any) => kanji[0] == kanjiSymbol);

        if(kanjiRepeated && kanjiSymbol != kanji[0]){
            setAlertMessage('O kanji digitado já existe');
            playSound('error');
            return
        }
        if(kanjiSymbol.length > 1){
            setAlertMessage('Digite apenas um caractere no campo "Simbolo do Kanji')
            playSound('error');
            return
        }
        if(!kanjiSymbol || !kanjiMeaning){
            setAlertMessage('Os campos "Simbolo do kanji" e "Significado(s) do kanji" não podem estar vazios"')
            playSound('error');
            return
        }
        if(!kunyomi && !onyomi){
            setAlertMessage('Preencha pelo menos um dos campos: "Leitura Kunyomi" ou "Leitura Onyomi"')
            playSound('error');
            return
        }

        kanjis_copy[kanjiPosition] = [kanjiSymbol, kanjiMeaning, {kunyomi:kunyomi, onyomi:onyomi}];
        setKanjis(kanjis_copy);
        resetInputs();
        setEditingKanji(false);
        playSound('confirm')
    }
    //REMOVER KANJI AO MANTER PRESSIONADO O BOTÃO ESQUERDO DO MOUSE NO BOTÃO "REMOVER" POR 1.5s
    const removeKanji = (): void => {
        
        let kanji: any = kanjis.find((k): any => k[0] == kanjiToEdit);
        let kanjis_copy: any = kanjis.filter((k: any) => k[0] != kanji[0]);

        if(kanjis.length == 1){
            setAlertMessage('É necessário haver pelo menos um kanji armazenado');
            playSound('error');
            return;
        }

        let button: any = document.querySelector('.configuration .add-kanji-menu .remove-button');
        button.classList.add('removing-button')

        removeCounting = setTimeout(() => {
            setKanjis(kanjis_copy);
            resetInputs();
            setEditingKanji(false);
            playSound('remove')
        }, 1500);
    }
    //PARAR REMOÇÃO DE KANJI AO DESPRESSIONAR O BOTÃO ESQUERDO DO MOUSE SOBRE O BOTÃO "REMOVER"
    const stopRemovingKanji = (): void => {
        let button: any = document.querySelector('.configuration .add-kanji-menu .remove-button');
        button.classList.remove('removing-button')

        clearInterval(removeCounting);
    }
    //PERCORRER TODOS OS KANJIS E RETORNAR ELES COMO HTML
    const getKanjiElements = (): JSX.Element[] => {
        var elements_formated: JSX.Element[] = [];
        const elements_parts: JSX.Element[] = [];

        //CRIAR UMA PAGINA COM ATÉ 32 KANJIS
        const updateElements_formated = (): void => {
            elements_formated.push(
                <div key={elements_formated.length} className='kanji-screen pages'>
                    <h3>Kanji <span>({kanjis.length})</span></h3>
                    <article>
                        {...elements_parts}
                    </article>
                </div>
            );
        }

        //RETORNAR INFORMAÇÕES AO PASSAR O MOUSE POR CIMA DE UM KANJI
        const getInfoToTitle = ({innerHTML}: any): void => {
            let kanji: any = kanjis.find((k): any => k[0] == innerHTML);

            setHoverKTitle(`${kanji[1]}\n${kanji[2].kunyomi}\n${kanji[2].onyomi}`)
        }

        //PERCORRER KANJIS
        kanjis.forEach((kanji: any, key: number) => {
            elements_parts.push( 
                <label 
                    onMouseOver={({target}) => getInfoToTitle(target)} 
                    title={hoverKTitle}
                    key={key} 
                    onClick={({target}: any) => {openEditKanjiMenu(target); playSound('click2')}}>
                        {kanji[0]}
                </label> 
            )
            
            if(elements_parts.length == 32){
                updateElements_formated();
                elements_parts.splice(0, elements_parts.length);
                return
            }

            if(key+1 == kanjis.length)
            {
                updateElements_formated();
            } 
        });

        //ADICIONAR UM BOTÃO DE + DEPOIS DO ULTIMO KANJI
        if(elements_formated[elements_formated.length-1]){
            let labels = elements_formated[elements_formated.length-1].props.children[1].props.children;

            if(labels.length < 32){   
                elements_formated[elements_formated.length-1] = (
                    <div className='kanji-screen pages' key={elements_formated.length-1}>
                        <h3>Kanji <span>({kanjis.length})</span></h3>
                        <article>
                            {...labels}
                            <label className='add-kanji'><span onClick={() => { setAddingNewKaji(true); playSound('click2') }}>+</span></label>
                        </article>
                    </div>
                );
            }
            else{
                elements_formated.push(
                    <div className='kanji-screen pages' key={elements_formated.length}>
                        <h3>Kanji <span>({kanjis.length})</span></h3>
                        <article>
                            <label className='add-kanji'><span onClick={() => { addKanji(); playSound('click2')}}>+</span></label>
                        </article>
                    </div>
                );
            }
        }

        return elements_formated;
    }
    const updateHCheckbox = (target: any): void => {
        let hSelectedCopy: string[] = [...hSelected];
        let selected = target.value;
        
        if(target.checked){
            hSelectedCopy.push(selected);
            setHselected(hSelectedCopy);
        }
        else if(target.checked === false){
            hSelectedCopy = hSelectedCopy.filter(h => h != selected);
            setHselected(hSelectedCopy);
        }

    }
    const updateKCheckbox = (target: any): void => {
        let kSelectedCopy: string[] = [...kSelected];
        let selected = target.value;
        
        if(target.checked){
            kSelectedCopy.push(selected);
            setKselected(kSelectedCopy);
        }
        else if(target.checked === false){
            kSelectedCopy = kSelectedCopy.filter(h => h != selected);
            setKselected(kSelectedCopy);
        }
    }
    const saveConfiguration = () => {
        let configurationCopy: any = {...configuration};

        console.log(soundEnabled)

        configurationCopy.sound_enabled = soundEnabled;
        configurationCopy.kanji.kanji_list = kanjis;
        configurationCopy.hiragana.sets_to_show = hSelected;
        configurationCopy.katakana.sets_to_show = kSelected;
        configurationCopy.show_info_on_game = showMoreInfo;
        configurationCopy.time_to_answer = Number(timeToAnswer);
        configurationCopy.answer_rest_delay = Number(answerRestDelay);
        configurationCopy.questions_at_a_time = Number(questionsAtTime);

        if(hSelected.length == 0 || kSelected.length == 0){
            setH_k_setAlertMsg('Selecione pelo menos um grupo de hiragana e katakana')
            playSound('error');
            return;
        };
        if(timeToAnswer == '0'){
            setH_k_setAlertMsg('O tempo para responder precisa ser maior que 0')
            playSound('error');
            return;
        }
        if(answerRestDelay == '0'){
            setH_k_setAlertMsg('A duração da resposta precisa ser maior que 0')
            playSound('error');
            return;
        }
        if(questionsAtTime == '0'){
            setH_k_setAlertMsg('O maximo questões por review precisa ser maior que 0')
            playSound('error');
            return;
        }

        localStorage.setItem('configuration', JSON.stringify(configurationCopy))
        setShowConfiguration(false);
        playSound('confirm')
    }
    const disableTabKey = (event: any) => {
        if(event.key == 'Tab') event.preventDefault();
    }
    const resetConfiguration = (target: any): void => {
        if(target.innerHTML = 'Resetar tudo')
            target.innerHTML = 5;
            
        removeCounting = setInterval(() => {
            if(target.innerHTML > 1)
                playSound('check')
            if(target.innerHTML == 'Resetar tudo'){
                clearInterval(removeCounting)
                removeCounting = 0;
                return
            };
            target.innerHTML--;

            if(target.innerHTML == 0){
                localStorage.setItem('configuration', JSON.stringify(defaultConfiguration));
                setConfiguration(JSON.parse(localStorage.configuration));
                stopResetConfiguration(target);
                playSound('remove')
            }
        },1000)

    }
    function stopResetConfiguration(target: any): any{
        clearInterval(removeCounting);
        target.innerHTML = 'Resetar Tudo'
    }
    const exportKanjis = (): void => {
        var kanjis: any = JSON.parse(localStorage.configuration).kanji.kanji_list
        var content = new Blob(
            [JSON.stringify(kanjis)],
            {type:'text/plain'}
        );

        var url = window.URL.createObjectURL(content);

        var a: HTMLAnchorElement = document.createElement('a');
        a.href = url;
        a.download = 'kanjis.txt';

        a.click();
        setIsFullScreen(false);

        setTimeout(() => {
            let portraitAlert: any = document.querySelector('.portrait-screen-alert');
            portraitAlert?.addEventListener('click', awaitExportingImportingKanjis);
        }, 1000);

    }
    const importKanjisClick = (target: any): void => {
        target.children[0]?.click()
        setIsFullScreen(false);
        
        setTimeout(() => {
            let portraitAlert: any = document.querySelector('.portrait-screen-alert');
            portraitAlert?.addEventListener('click', awaitExportingImportingKanjis);
        }, 1000);
    }
    const awaitExportingImportingKanjis = (): void => {
        setTimeout(() => {
            alternateIntoOptions(1);
        }, 100);
    }

    const importKanjis = (target: any): void => {
        if (target.files.length > 0) {
            const file: any = target.files[0];
            const reader: FileReader = new FileReader();
            
            reader.onload = ({target}: any): void =>{
                const content: any = target.result;
                
                setKanjis(JSON.parse(content));
                playSound('confirm');
            };

            reader.readAsText(file);
        }
        target.value = '';   
    }
    const formateInputs = (value: any):string => {
        let formatedValue = Math.abs(value)

        if(formatedValue > 999) formatedValue = 999

        return  String(formatedValue);
    }
    
    return (
        <div className='configuration' onKeyDown={(event: any) => disableTabKey(event)}>
            <div className='black_grid'></div>
            
            <main onMouseDown={() => setH_k_setAlertMsg('')} className='body'>
                {h_k_alertMsg && <label className='h-k-alert-message'>{h_k_alertMsg}</label>}
                
                <div className='sound-button' onClick={({target}) => switchSound(target)}>
                    <img src='/sound-disabled.png' alt="sound button" />
                </div>

                <section>
                        <div className='geral-screen pages'>
                            <h3>Geral</h3>
                            <main className='basic-screen pages'>
                                <div>
                                    <label 
                                        className='have-info' 
                                        title='Tempo para responder cada questão(em segundos)'>
                                            Tempo para responder:
                                    </label>
                                    <input 
                                        type="number" 
                                        value={timeToAnswer} 
                                        onChange={({target}): any => setTimeToAnswer(formateInputs(target.value))}
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
                                        value={answerRestDelay} 
                                        onChange={({target}): any => setAnswerRestDelay(formateInputs(target.value))}
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
                                        value={questionsAtTime} 
                                        onChange={({target}): any => setQuestionsAtTime(formateInputs(target.value))}
                                    />
                                </div>
                                <div>
                                    <label 
                                        className='have-info' 
                                        title='Mostrar dakuten e handakuten'>
                                            Mostrar mais informações na resposta?
                                        </label>
                                    <i onClick={() => {setShowMoreInfo(!showMoreInfo); playSound('check')}}>{showMoreInfo ? 'SIM' : 'NÃO'}</i>
                                </div>
                            </main>
                        </div>
                        <div className='hiragana-screen pages'>
                            <h3>Hiragana</h3>
                            <article onClick={({target}: any) => updateHCheckbox(target)}>
                                <div>
                                    <input type="checkbox" value='group a'/> 
                                    <label>あ</label>
                                </div>
                                <div>
                                    <input type="checkbox" value='group h'/> 
                                    <label>は</label>
                                </div>
                                <div>
                                    <input type="checkbox" value='group t'/> 
                                    <label>た</label>
                                </div>
                                <div>
                                    <input type="checkbox" value='group k'/> 
                                    <label>か</label>
                                </div>
                                <div>
                                    <input type="checkbox" value='group n'/> 
                                    <label>な</label>
                                </div>
                                <div>
                                    <input type="checkbox" value='group m'/> 
                                    <label>ま</label>
                                </div>
                                <div>
                                    <input type="checkbox" value='group r'/> 
                                    <label>ら</label>
                                </div>
                                <div>
                                    <input type="checkbox" value='group s'/> 
                                    <label>さ</label>
                                </div>
                                <div>
                                    <input type="checkbox" value='group y'/> 
                                    <label>や</label>
                                </div>
                                <div>
                                    <input type="checkbox" value='group w'/> 
                                    <label>わ</label>
                                </div>
                                <div>
                                    <input type="checkbox" value='group g'/> 
                                    <label>が</label>
                                </div>
                                <div>
                                    <input type="checkbox" value='group b'/> 
                                    <label>ば</label>
                                </div>
                                <div>
                                    <input type="checkbox" value='group d'/> 
                                    <label>だ</label>
                                </div>
                                <div>
                                    <input type="checkbox" value='group z'/> 
                                    <label>ざ</label>
                                </div>
                                <div>
                                    <input type="checkbox" value='group p'/> 
                                    <label>ぱ</label>
                                </div>
                                <div>
                                    <input type="checkbox" value='only n'/> 
                                    <label>ん</label>
                                </div>
                            </article>
                        </div>
                        <div className='katakana-screen pages'>
                            <h3>Katakana</h3>
                            <article onClick={({target}: any) => updateKCheckbox(target)}>
                                <div>
                                    <input type="checkbox" value='group a'/> 
                                    <label>ア</label>
                                </div>
                                <div>
                                    <input type="checkbox" value='group h'/> 
                                    <label>ハ</label>
                                </div>
                                <div>
                                    <input type="checkbox" value='group t'/> 
                                    <label>タ</label>
                                </div>
                                <div>
                                    <input type="checkbox" value='group k'/> 
                                    <label>カ</label>
                                </div>
                                <div>
                                    <input type="checkbox" value='group n'/> 
                                    <label>ナ</label>
                                </div>
                                <div>
                                    <input type="checkbox" value='group m'/> 
                                    <label>マ</label>
                                </div>
                                <div>
                                    <input type="checkbox" value='group r'/> 
                                    <label>ラ</label>
                                </div>
                                <div>
                                    <input type="checkbox" value='group s'/> 
                                    <label>サ</label>
                                </div>
                                <div>
                                    <input type="checkbox" value='group y'/> 
                                    <label>ヤ</label>
                                </div>
                                <div>
                                    <input type="checkbox" value='group w'/> 
                                    <label>ワ</label>
                                </div>
                                <div>
                                    <input type="checkbox" value='group g'/> 
                                    <label>ガ</label>
                                </div>
                                <div>
                                    <input type="checkbox" value='group b'/> 
                                    <label>バ</label>
                                </div>
                                <div>
                                    <input type="checkbox" value='group d'/> 
                                    <label>ダ</label>
                                </div>
                                <div>
                                    <input type="checkbox" value='group z'/> 
                                    <label>ザ</label>
                                </div>
                                <div>
                                    <input type="checkbox" value='group p'/> 
                                    <label>パ</label>
                                </div>
                                <div>
                                    <input type="checkbox" value='only n'/> 
                                    <label>ン</label>
                                </div>
                            </article>
                        </div>
                        {getKanjiElements()}
                        <div className='export-screen pages'>
                            <button 
                                onMouseOver={() => playSound('click')}
                                onClick={() => exportKanjis()}>
                                    Exportar Kanjis
                            </button>
                            <button 
                                onClick={({target}: any) => importKanjisClick(target)}
                                onMouseOver={() => playSound('click')}
                            >
                                <input 
                                    type="file" 
                                    onChange={({target}: any) => importKanjis(target)} 
                                    accept='text/plain'
                                />
                                Importar Kanjis
                            </button>
                            <button 
                                onMouseOver={() => playSound('click')}
                                onMouseUp={({target}: any) => stopResetConfiguration(target)} 
                                onTouchEnd={({target}: any) => stopResetConfiguration(target)} 
                                onMouseLeave={({target}: any) => stopResetConfiguration(target)} 
                                onTouchMove={({target}: any) => stopResetConfiguration(target)} 
                                onMouseDown={({target}: any) => resetConfiguration(target)}
                                onTouchStart={({target}: any) => resetConfiguration(target)}
                                onContextMenu={(e: any) => e.preventDefault()}
                            >Resetar Tudo</button>
                        </div>
                </section>

                <img 
                    src={salvar} 
                    alt="salvar" 
                    className='salvar' 
                    onClick={() => saveConfiguration()}
                />
                <img 
                    src={cancelar} 
                    alt="cancelar" 
                    className='cancelar' 
                    onClick={() => {setShowConfiguration(false); playSound('cancel')}}
                />

                <img 
                    src={return_img} 
                    alt="backward" 
                    className='backward' 
                    onClick={ () => alternateIntoOptions(-1)}
                />
                <img 
                    src={return_img} 
                    alt="forward" 
                    className='forward' 
                    onClick={() => alternateIntoOptions(1)}
                />

                {addingNewKaji && (
                    <div className='add-kanji-menu' onFocus={() => setAlertMessage('')} onContextMenu={(e: any) => e.preventDefault()}>
                        <p>Simbolo do kanji:</p>
                        <input type="text" placeholder='学' onChange={({target}) => setKanjiSymbol(target.value)}/>

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
                            <button onClick={() => addKanji()}>ADICIONAR</button>
                            <button onClick={() => {setAddingNewKaji(false); playSound('cancel'); resetInputs()}}>CANCELAR</button>
                        </div>                   
                    </div>
                )}
                {editingKanji && (
                    <div className='add-kanji-menu' onFocus={() => setAlertMessage('')} onContextMenu={(e: any) => e.preventDefault()}>
                        <p>Simbolo do kanji:</p>
                        <input 
                            type="text" 
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
                            <button onClick={() => editKanji()}>EDITAR</button>
                            <button onClick={() => {setEditingKanji(false); playSound('cancel');resetInputs()}}>CANCELAR</button>
                            <button 
                                className='remove-button'
                                onMouseUp={() => stopRemovingKanji()} 
                                onTouchEnd={() => stopRemovingKanji()} 
                                onMouseLeave={() => stopRemovingKanji()} 
                                onTouchMove={() => stopRemovingKanji()} 
                                onMouseDown={() => removeKanji()}
                                onTouchStart={() => removeKanji()}
                            >REMOVER</button>
                            
                        </div>                   
                    </div>
                )}
            </main>
        </div>
    )
}