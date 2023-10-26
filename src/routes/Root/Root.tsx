import "./root.css";
import { Outlet } from "react-router-dom";
import config from '../../assets/config.png'
import { useEffect, useState } from "react";
import cloud from '../../assets/cloud.png'
import cloud_inverted from '../../assets/cloud-inverted.png'
import { defaultConfiguration } from "./defaultConfiguration";
import Configuration from "../../Components/Configuration";
import playSound from "../../manageSounds";

export default function Root(){
    const [changeTheme, setChangeTheme]: [boolean, any] = useState(false);
    const [changedURL, setChangedURL]: [boolean, any] = useState(false);
    const [showConfiguration, setShowConfiguration]: [boolean, any] = useState(false);
    const [isOnMobile, setIsOnMobile]: [boolean, any] = useState(false);
    const [isFullScreen, setIsFullScreen]: [boolean, any] = useState(false);

    
    var changedUrlTrue: boolean = false;
    var configuration: any = JSON.parse(localStorage.configuration || JSON.stringify(defaultConfiguration));

    //VERIFICAR SE O TEMA FOI MODIFICADO | CRIAR configuration NO localStorage CASO NÃO EXISTA AINDA
    useEffect(() => {
        if(localStorage.configuration){
            configuration = JSON.parse(localStorage.configuration);
        }
        else localStorage.configuration = JSON.stringify(configuration);

        
    },[changeTheme])

    //GERENCIAR LAYOUT PARA CELULAR
    useEffect(() => {
        // VERIFICAR SE O DISPOSITIVO É UM CELULAR
        if(navigator.maxTouchPoints > 0){
            setIsOnMobile(true);

            document.body.classList.add("mobile");
            document.addEventListener('fullscreenchange', onExitFullScreenByReturnButton, false)
        }

    }, [])
    function onExitFullScreenByReturnButton() {
        if(document.fullscreenElement == null){
            setIsFullScreen(false);
        } 

    }
    const enterFullScreen = async () => {
        let body: any = document.body;
        let orientation: any = screen.orientation;

        body.requestFullscreen();
        await orientation.lock('landscape');
        setIsFullScreen(true);
    }
     
    //VERIFICAR SE A URL FOI ALTERADA
    useEffect(() => {
        if(!changedUrlTrue) cloudMove();
        
        changedUrlTrue = false;
    },[changedURL])

    //MOVER AS NUVENS AO TROCAR DE PÁGINA
    const cloudMove = () => {
        if(changedURL){
            const cloud1: any = document.getElementsByClassName('c1')[0];
            const cloud2: any = document.getElementsByClassName('c2')[0];

            cloud1.style.animationName = 'clouds_move1';
            cloud1.style.animationDuration = '0.5s';
            cloud2.style.animationTimingFunction = 'linear';
            cloud2.style.animationName = 'clouds_move2';
            cloud2.style.animationDuration = '0.5s';
            cloud2.style.animationDirection = 'normal';
            cloud2.style.animationTimingFunction = 'linear';
            setTimeout(() => {
                cloud1.style.animationName = 'clouds';
                cloud1.style.animationDuration = '4s';
                cloud1.style.animationTimingFunction = 'cubic-bezier(0.455, 0.03, 0.515, 0.955)';
                cloud2.style.animationName = 'clouds';
                cloud2.style.animationDuration = '4s';
                cloud2.style.animationDirection = 'reverse';
                cloud2.style.animationTimingFunction = 'ease';
                setChangedURL(false);
            }, 500);
            changedUrlTrue = true;
            
        }
    }

    //DESATIVAR BOTÃO DE CONFIGURAÇÕES NA TELA DE REVISÃO
    useEffect(() => {
        let url = window.location.pathname;
        let config: any = document.querySelector('.config');

        if(url.includes('pronuncia') || url.includes('escrita') || url.includes('significado')){
            config.style.opacity = '20%'
            config.style.pointerEvents = 'none';
        }
        else{
            config.style.opacity = '100%'
            config.style.pointerEvents = 'initial';
        }
    })
    
    //ESTILOS PARA CADA TEMA DO SITE
    const dark: object = { filter: 'invert() hue-rotate(90deg) sepia(60%) brightness(80%)'}
    const white: object = { filter: '' }
    
    //OBTER TEMA ATUAL
    const handleTheme = (): React.CSSProperties => {
        return configuration.theme == 'dark' ? dark : white
    }
    const getTheme = handleTheme();

    const mobileAndNotFullscreenBlock = (): JSX.Element | undefined => {
        if(!isOnMobile) return <></>

        if(!isFullScreen) return (
            <div className="portrait-screen-alert">
                <button onClick={() => enterFullScreen()}>
                    Abrir em Tela Cheia
                </button>
            </div>
        )

        else return <></>
    }

    return(
        <div className="router" style={getTheme}>
            {mobileAndNotFullscreenBlock()}

            <a className="config" onClick={() => { setShowConfiguration(true); playSound('pause') }}>
                <img src={config} alt="configuration" style={getTheme}/>
            </a>

            {showConfiguration && <Configuration setShowConfiguration={setShowConfiguration} setIsFullScreen={setIsFullScreen}/>}

            <img src={cloud} className='cloud c1' alt="" style={getTheme}/>
            <img src={cloud_inverted} className='cloud c2' alt="" style={getTheme}/>

            <Outlet context={[changeTheme,setChangeTheme, setChangedURL, isFullScreen, setIsFullScreen]}/>
        </div>
    )
}
