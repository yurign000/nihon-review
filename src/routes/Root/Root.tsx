import "./root.css";
import { Outlet } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import ConfigurationMenu from "../../Components/ConfigurationMenu";
import { defaultConfiguration, Configuration } from "../../scripts/defaultConfiguration";

// ASSETS
import cloud from '../../assets/cloud.png'
import cloud_inverted from '../../assets/cloud-inverted.png'
import config_icon from '../../assets/config.png'
import playSound from "../../scripts/manageSounds";

export default function Root(){
    // VERIFICAR SE JA EXISTE CONFIGURAÇÕES SALVAS NO localStorage
    function localConfiguration(): Configuration | null{
        if(localStorage.configuration) 
            return JSON.parse(localStorage.configuration);

        return null
    }

    const [changedURL, setChangedURL] =               useState<boolean>(false);
    const [showConfiguration, setShowConfiguration] = useState<boolean>(false);
    const [isOnMobile, setIsOnMobile] =               useState<boolean>(false);
    const [isFullScreen, setIsFullScreen] =           useState<boolean>(false);
    const [configuration, setConfiguration] =         useState<Configuration>(localConfiguration() || defaultConfiguration);

    const cloud1 = useRef<HTMLImageElement>(null);
    const cloud2 = useRef<HTMLImageElement>(null);
    const config = useRef<HTMLAnchorElement>(null);
    const portraitAlert = useRef<HTMLDivElement>(null);

    // ATUALIZAR localStorage SEMPRE QUE AS CONFIGURAÇÕES FOREM MODIFICADAS
    useEffect(() => {
        localStorage.configuration = JSON.stringify(configuration);
    }, [configuration])

    //GERENCIAR LAYOUT PARA CELULAR
    useEffect(() => {
        // VERIFICAR SE O DISPOSITIVO É UM CELULAR
        if(navigator.maxTouchPoints > 0){
            setIsOnMobile(true);

            document.body.classList.add("mobile");
            document.addEventListener('fullscreenchange', onExitFullScreen, false)
        }
    }, [])

    //MOVER AS NUVENS AO TROCAR DE PÁGINA
    useEffect(() => {
        if(changedURL){            
            cloud1.current?.classList.add('cloud1-translate');
            cloud2.current?.classList.add('cloud2-translate');
            
            setTimeout(() => {
                cloud1.current?.classList.remove('cloud1-translate');
                cloud2.current?.classList.remove('cloud2-translate');
                
                setChangedURL(false);
            }, 500);
        }
    },[changedURL])

    //DESATIVAR BOTÃO DE CONFIGURAÇÕES NA TELA DE REVISÃO
    useEffect(() => {
        let url = window.location.pathname;

        if(url.includes('pronuncia') || url.includes('escrita') || url.includes('significado')){
            config.current?.classList.add('disabled');
        }
        else config.current?.classList.remove('disabled');
    },[changedURL])
    
    function onExitFullScreen() {
        if(document.fullscreenElement == null){
            setIsFullScreen(false);
        } 
    }

    // ABRIR TELA CHEIA E GIRAR TELA PARA O MODO PAISAGEM
    const enterFullScreen = async () => {
        let body: any = document.body;
        let orientation: any = screen.orientation;

        body.requestFullscreen();
        await orientation.lock('landscape');
        setIsFullScreen(true);
    }
    
    //ESTILOS PARA CADA TEMA DO SITE
    const dark: object = { 
        filter: 'invert() hue-rotate(90deg) sepia(60%) brightness(80%)'
    }
    const white: object = { 
        filter: '' 
    }
    
    //OBTER TEMA ATUAL
    const handleTheme = (): React.CSSProperties => {
        return configuration.theme == 'dark' ? dark : white
    }
    const getTheme = handleTheme();

    // BLOQUEIO DE TELA QUANDO CELULAR NÃO ESTIVER FULLSCREEN
    const notFullscreenBlock = (): JSX.Element | undefined => {
        if(!isOnMobile || isFullScreen) return <></>

        else return (
            <div className="portrait-screen-alert flex-center" ref={portraitAlert}>
                <button onClick={() => enterFullScreen()}>
                    Abrir em Tela Cheia
                </button>
            </div>
        )
    }

    const openConfiguration = (): void => {
        setShowConfiguration(true); 
        playSound('pause');
    }

    return(
        <div className="router" style={getTheme}>
            
            {notFullscreenBlock()}

            <a className="config" ref={config} onClick={() => openConfiguration()}>
                <img src={config_icon} alt="configuration" style={getTheme}/>
            </a>

            { 
                showConfiguration &&
                <ConfigurationMenu 
                    setShowConfiguration={setShowConfiguration} 
                    setIsFullScreen={setIsFullScreen} 
                    configuration={configuration} 
                    setConfiguration={setConfiguration}
                    portraitAlert={portraitAlert}
                />
            }

            <img 
                src={cloud} 
                className='cloud c1' 
                ref={cloud1} 
                style={getTheme}
            />
            <img 
                src={cloud_inverted} 
                className='cloud c2' 
                ref={cloud2} 
                style={getTheme}
            />

            <Outlet context={{
                setChangedURL, 
                setIsFullScreen,
                setConfiguration,
                isFullScreen, 
                configuration,
            }}/>
        </div>
    )
}
