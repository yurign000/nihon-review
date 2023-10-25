import './main-page.css';
import ninja from '../../assets/ninja.png'
import logo from  '../../assets/logo.png'
import { useOutletContext } from "react-router-dom";
import { Link } from 'react-router-dom';
import playSound from '../../manageSounds';

export default function MainPage(){
    var themeCounter: number = 5 //CONTADOR ATÉ MUDAR O TEMA
    const [changeTheme,setChangeTheme, setChangedURL]: [boolean, any, any] = useOutletContext()  //ESTADO OBTIDO DO root.jsx
    var configuration: any = JSON.parse(localStorage.configuration || '{}'); //OBTER OU NÃO configuration DO localStorage

    //ANIMAÇÃO AO CLICAR NO NINJA
    const ninjaAnimation = (ninja: any): void => {
        if(ninja.style.animationName != 'ninja'){
            themeCounter--;
                
            ninja.style.animationName = "ninja";
            playSound('ninja-click')
            setTimeout(() => ninja.style.animationName = "none", 200);
        }
        
        //MUDAR TEMA AO CLICAR themeCounter VEZES NO NINJA
        if(themeCounter == 0){
            themeCounter = 5;
            setChangedURL(true);
            //MUDAR TEMA E ATUALIZAR localStorage
            configuration = JSON.parse(localStorage.configuration);
            configuration.theme = (configuration.theme == 'white') ? 'dark' : 'white'; 
            localStorage.configuration = JSON.stringify(configuration);

            setChangeTheme(!changeTheme)
            playSound('change-page')
        }
    }

    //ESTILOS PARA CADA TEMA DO SITE
    const dark_ninja:  object = { filter: 'brightness(0%)' };
    const dark_logo:   object = { filter: 'brightness(100%) invert()' };
    const white_ninja: object = { filter: '' };
    const white_logo:  object = { filter: '', animationName: 'logo', }

    //OBTER TEMA ATUAL
    const handleLogoTheme = (): React.CSSProperties => {
        return configuration?.theme == 'dark' ? dark_logo : white_logo;
    }
    const handleNinjaTheme = (): React.CSSProperties => {
        return configuration?.theme == 'dark' ? dark_ninja : white_ninja;
    }
    const getNinjaTheme = handleNinjaTheme()
    const getLogoTheme = handleLogoTheme()

    const nextPage = (): void => {
        setChangedURL(true);
        playSound('change-page');
    }

    return(
        <div className='main-page'>

            <section className='title flex'>
                <img className='logo' src={logo} alt="logo" style={getLogoTheme}/>
                <img className='ninja' src={ninja} alt="ninja" onClick={({target}) => ninjaAnimation(target)} style={getNinjaTheme}/>
            </section>

            <section className='options flex'>

                <div className='flex text-'>
                    <Link className='text-hover' to='/review/hiragana' onClick={() => nextPage()}>
                        <span className='text-shadow'>HIRAGANA</span>
                        <i className='box-shadow'></i>
                    </Link>
                </div>

                <div className='flex'>
                    <Link className='text-hover' to='/review/katakana' onClick={() => nextPage()}>
                        <span className='text-shadow'>KATAKANA</span>
                        <i className='box-shadow'></i>
                    </Link>
                </div>

                <div className='flex'>
                    <Link className='text-hover' to='/review/kanji' onClick={() => nextPage()}>
                        <span className='text-shadow'>KANJI</span>
                        <i className='box-shadow'></i>
                    </Link>
                </div>
                
            </section>
        </div>
    )
}