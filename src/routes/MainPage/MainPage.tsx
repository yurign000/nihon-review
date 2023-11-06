import './main-page.css';
import ninjaIcon from '../../assets/ninja.png'
import logo from  '../../assets/logo.png'
import { useOutletContext } from "react-router-dom";
import { Link } from 'react-router-dom';
import playSound from '../../scripts/manageSounds';
import { useEffect, useRef, useState } from 'react';
import RootContext from '../../scripts/RootContext';

export default function MainPage(){
    //ESTADOS OBTIDO DO root.tsx
    const {
        configuration, 
        setConfiguration, 
        setChangedURL
    }: RootContext = useOutletContext() 
    
    //QUANTIDADE DE VEZES QUE SE DEVE CLICAR NO NINJA PARA MUDAR DE TEMA
    const [themeCounter, setThemeCounter] = useState<number>(5) 
    const ninja = useRef<HTMLImageElement>(null);

    //ANIMAÇÃO AO CLICAR NO NINJA
    const ninjaAnimation = (): void => {
        if(!ninja.current?.classList.contains('ninjaAnimation')){
            setThemeCounter(themeCounter - 1);
            playSound('ninja-click')

            ninja.current?.classList.add("ninjaAnimation");
            setTimeout((): void => 
                ninja.current?.classList.remove('ninjaAnimation')
            ,200);
        }
    }

    //MUDAR DE TEMA AO CLICAR 5 VEZES NO NINJA
    useEffect(() => {
        if(themeCounter == 0){
            setThemeCounter(5);
            setChangedURL(true);

            setConfiguration({
                ...configuration, 
                theme: (configuration.theme == 'white') ? 'dark' : 'white'
            })

            playSound('change-page')
        }
    }, [themeCounter])

    //ESTILOS PARA CADA TEMA DO SITE
    const dark_ninja:  object = { filter: 'brightness(0%)' };
    const white_ninja: object = { filter: '' };
    const dark_logo:   object = { filter: 'brightness(100%) invert()' };
    const white_logo:  object = { filter: '', animationName: 'logo', }

    //OBTER TEMA ATUAL
    const handleNinjaTheme = (): React.CSSProperties => {
        return configuration?.theme == 'dark' ? dark_ninja : white_ninja;
    }
    const handleLogoTheme = (): React.CSSProperties => {
        return configuration?.theme == 'dark' ? dark_logo : white_logo;
    }
    const getNinjaTheme = handleNinjaTheme()
    const getLogoTheme = handleLogoTheme()

    const nextPage = (): void => {
        setChangedURL(true);
        playSound('change-page');
    }

    return(
        <div className='main-page'>

            <section className='title flex-center'>
                <img 
                    className='logo' 
                    src={logo} 
                    alt="logo" 
                    style={getLogoTheme}
                />
                <img 
                    className='ninja' 
                    src={ninjaIcon} 
                    alt="ninja" 
                    ref={ninja}
                    onClick={() => ninjaAnimation()} 
                    style={getNinjaTheme}
                />
            </section>

            <section className='options flex-center'>

                <div className='flex-center'>
                    <Link className='text-hover' to='/review/hiragana' onClick={() => nextPage()}>
                        HIRAGANA
                    </Link>
                </div>

                <div className='flex-center'>
                    <Link className='text-hover' to='/review/katakana' onClick={() => nextPage()}>
                        KATAKANA
                    </Link>
                </div>

                <div className='flex-center'>
                    <Link className='text-hover' to='/review/kanji' onClick={() => nextPage()}>
                        KANJI
                    </Link>
                </div>
                
            </section>
        </div>
    )
}