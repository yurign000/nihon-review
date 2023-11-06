import { Outlet } from 'react-router-dom';
import './review.css';
import review from '../../assets/return.png'
import { Link } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';
import playSound from '../../scripts/manageSounds';
import RootContext from '../../scripts/RootContext';

export default function Review(){
    //ESTADOS OBTIDO DO root.tsx
    const {
        configuration, 
        setConfiguration, 
        setChangedURL
    }: RootContext = useOutletContext() 

    // NÃO PERMITIR ACESSO EXCLUSIVAMENTE A URL /REVIEW, APENAS A SEUS FILHOS
    if(window.location.pathname == "/review" || window.location.pathname == "/review/"){
        window.location.href = "/";

        return;
    }

    // OBTER QUAL PÁGINA O USUÁRIO DEVE SER REDIRECIONADO AO CLICAR NO BOTÃO VOLTAR
    const returnPage = (): string => {
        let url: string = window.location.pathname;
        url = url.replace(url.slice(url.lastIndexOf('/')),'');

        if(url == "/review")
            return '/'

        return url;
    }

    const getSelectedAlphabet = (): string => {
        let url = window.location.pathname;

        if(url.includes('hiragana')) return 'ひらがな'
        if(url.includes('katakana')) return 'カタカナ'
        else                         return 'かんじ'
    } 

    return (
        <div className="review">
            <Link 
                className="return" 
                to={returnPage()} 
                onClick={() => {setChangedURL(true); playSound('change-page')}}
            >
                <img src={review} alt="return" />
            </Link>

            <label className='info'>{getSelectedAlphabet()}</label>

            <Outlet context={{
                configuration, 
                setConfiguration, 
                setChangedURL
            }}/>
        </div>
    )
}