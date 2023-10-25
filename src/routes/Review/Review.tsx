import { Outlet } from 'react-router-dom';
import './review.css';
import review from '../../assets/return.png'
import { Link } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';
import playSound from '../../manageSounds';

export default function Review(){

    if(window.location.pathname == "/review" || window.location.pathname == "/review/"){
        window.location.href = "/";

        return;
    }

    const [changeTheme,setChangeTheme, setChangedURL]: [boolean, any, any] = useOutletContext() //ESTADO OBTIDO DO root.jsx

    const returnPage = (): string => {
        
        let url: string = window.location.pathname;
        url = url.replace(url.slice(url.lastIndexOf('/')),'');
        
        if(url == "/review"){
            return '/'
        }

        return url;
    }

    return (
        <div className="review">
            <Link className="return" to={returnPage()} onClick={() => {setChangedURL(true); playSound('change-page')}}>
                <img src={review} alt="return" />
            </Link>

            <label className='info'>{
                    window.location.pathname.includes('hiragana') ? 'ひらがな' :
                    (
                        window.location.pathname.includes('katakana') ? 'かたかな' : 'かんじ'
                    )
            }</label>

            <Outlet context={[changeTheme,setChangeTheme, setChangedURL]}/>
        </div>
    )
}